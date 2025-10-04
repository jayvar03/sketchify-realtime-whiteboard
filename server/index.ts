/// <reference path="../src/common/types/global.d.ts" />

import { createServer } from "http";
import express from "express";
import type { Request, Response } from "express";
import { Server } from "socket.io";
import { v4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = parseInt(process.env.PORT || "3001", 10);
const dev = process.env.NODE_ENV !== "production";

const app = express();
const server = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: dev ? "http://localhost:3000" : undefined,
    methods: ["GET", "POST"],
  },
});

app.get("/health", async (_: Request, res: Response) => {
  res.send("Healthy");
});

if (!dev) {
  const distPath = path.join(__dirname, "../../dist");
  app.use(express.static(distPath));
  app.get("*", (_: Request, res: Response) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const rooms = new Map<string, Room>();

const addMove = (roomId: string, socketId: string, move: Move) => {
  const room = rooms.get(roomId.toUpperCase());
  if (!room) return;

  if (!room.usersMoves.has(socketId)) {
    room.usersMoves.set(socketId, []);
  }
  room.usersMoves.get(socketId)!.push(move);
};

const undoMove = (roomId: string, socketId: string) => {
  const room = rooms.get(roomId.toUpperCase());
  if (!room) return;

  const userMoves = room.usersMoves.get(socketId);
  if (userMoves && userMoves.length > 0) {
    userMoves.pop();
  }
};

io.on("connection", (socket) => {
  console.log(`✅ New socket connection: ${socket.id}`);

  const getRoomId = (): string => {
    const joinedRoom = [...socket.rooms].find((room) => room !== socket.id);
    if (!joinedRoom) return socket.id;
    return joinedRoom;
  };

  const leaveRoom = (roomId: string, socketId: string) => {
    const room = rooms.get(roomId.toUpperCase());
    if (!room) return;

    const userMoves = room.usersMoves.get(socketId);
    if (userMoves) room.drawed.push(...userMoves);
    room.users.delete(socketId);
    room.usersMoves.delete(socketId);

    socket.leave(roomId.toUpperCase());

    if (room.users.size === 0) {
      rooms.delete(roomId.toUpperCase());
    }
  };

  socket.on("create_room", (username: string) => {
    console.log(`🏗️ Creating room for user ${socket.id} with username: ${username}`);

    if (!username || typeof username !== "string" || username.trim().length === 0) {
      console.log("❌ Invalid username");
      socket.emit("error", "Invalid username");
      return;
    }

    if (username.length > 50) {
      console.log("❌ Username too long");
      socket.emit("error", "Username too long");
      return;
    }

    let roomId: string;
    let attempts = 0;
    do {
      roomId = Math.random().toString(36).substring(2, 6).toUpperCase();
      attempts++;
      if (attempts > 100) {
        console.log("❌ Failed to generate unique room ID");
        socket.emit("error", "Failed to create room");
        return;
      }
    } while (rooms.has(roomId));

    try {
      socket.join(roomId);

      rooms.set(roomId, {
        usersMoves: new Map([[socket.id, []]]),
        drawed: [],
        users: new Map([[socket.id, username.trim()]]),
      });

      console.log(`✅ Room ${roomId} created successfully for ${username.trim()}`);
      io.to(socket.id).emit("created", roomId);
    } catch (error) {
      console.error("Error creating room:", error);
      socket.emit("error", "Failed to create room");
    }
  });

  socket.on("check_room", (roomId: string) => {
    if (!roomId || typeof roomId !== "string" || roomId.trim().length === 0) {
      socket.emit("room_exists", false);
      return;
    }

    if (roomId.length > 10) {
      socket.emit("room_exists", false);
      return;
    }

    if (rooms.has(roomId.toUpperCase())) socket.emit("room_exists", true);
    else socket.emit("room_exists", false);
  });

  socket.on("join_room", (roomId: string, username: string) => {
    console.log(`🚪 User ${socket.id} trying to join room ${roomId} with username: ${username}`);

    if (!roomId || typeof roomId !== "string" || roomId.trim().length === 0) {
      console.log("❌ Invalid room ID");
      socket.emit("joined", "", true);
      return;
    }

    if (!username || typeof username !== "string" || username.trim().length === 0) {
      console.log("❌ Invalid username");
      socket.emit("joined", "", true);
      return;
    }

    if (username.length > 50 || roomId.length > 10) {
      console.log("❌ Username or room ID too long");
      socket.emit("joined", "", true);
      return;
    }

    const room = rooms.get(roomId.toUpperCase());
    console.log(`🔍 Room ${roomId.toUpperCase()} exists:`, !!room);

    if (room && room.users.size < 12) {
      const existingUsers = Array.from(room.users.values());
      const isDuplicateName = existingUsers.some(
        (existingUsername) => existingUsername.toLowerCase() === username.trim().toLowerCase()
      );

      if (isDuplicateName) {
        console.log("❌ Username already taken");
        socket.emit("joined", "", true, "Username already taken in this room");
        return;
      }

      try {
        socket.join(roomId.toUpperCase());

        room.users.set(socket.id, username.trim());
        room.usersMoves.set(socket.id, []);

        console.log(`✅ User ${username.trim()} joined room ${roomId.toUpperCase()} successfully`);
        io.to(socket.id).emit("joined", roomId.toUpperCase());
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("joined", "", true, "Failed to join room");
      }
    } else {
      console.log("❌ Room not found or full");
      socket.emit("joined", "", true);
    }
  });

  socket.on("joined_room", () => {
    const roomId = getRoomId();

    const room = rooms.get(roomId.toUpperCase());
    if (!room) return;

    io.to(socket.id).emit(
      "room",
      room,
      JSON.stringify([...room.usersMoves]),
      JSON.stringify([...room.users])
    );

    socket.broadcast.to(roomId).emit("new_user", socket.id, room.users.get(socket.id) || "Anonymous");
  });

  socket.on("leave_room", () => {
    const roomId = getRoomId();
    leaveRoom(roomId, socket.id);

    io.to(roomId).emit("user_disconnected", socket.id);
  });

  socket.on("draw", (move: Move) => {
    const roomId = getRoomId();
    if (!roomId) return;

    const timestamp = Date.now();

    move.id = v4();

    addMove(roomId, socket.id, { ...move, timestamp });

    io.to(socket.id).emit("your_move", { ...move, timestamp });

    socket.broadcast.to(roomId).emit("user_draw", { ...move, timestamp }, socket.id);
  });

  socket.on("undo", () => {
    const roomId = getRoomId();
    if (!roomId) return;

    undoMove(roomId, socket.id);

    socket.broadcast.to(roomId).emit("user_undo", socket.id);
  });

  socket.on("mouse_move", (x: number, y: number) => {
    socket.broadcast.to(getRoomId()).emit("mouse_moved", x, y, socket.id);
  });

  socket.on("clear_canvas", () => {
    const roomId = getRoomId();
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    const clearedByUsername = room.users.get(socket.id) || "Anonymous";

    room.drawed = [];
    room.usersMoves.forEach((_, userId) => {
      room.usersMoves.set(userId, []);
    });

    io.to(roomId).emit("canvas_cleared", clearedByUsername, socket.id);
  });

  socket.on("send_msg", (msg: string) => {
    console.log(`📨 Message received from ${socket.id}: "${msg}"`);

    if (!msg || typeof msg !== "string" || msg.trim().length === 0) {
      console.log("❌ Invalid message - empty or not string");
      return;
    }

    if (msg.length > 500) {
      console.log("❌ Message too long");
      socket.emit("error", "Message too long");
      return;
    }

    const roomId = getRoomId();
    console.log(`🏠 Room ID: ${roomId}`);
    if (!roomId) {
      console.log("❌ No room ID found");
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      console.log("❌ Room not found in rooms map");
      return;
    }
    console.log(`✅ Broadcasting message to room ${roomId}: "${msg.trim()}"`);
    io.to(roomId).emit("new_msg", socket.id, msg.trim());
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
    const roomId = getRoomId();
    const room = rooms.get(roomId);
    if (!room) return;

    const msg = `${room.users.get(socket.id) || "Anonymous"} has disconnected`;
    io.to(roomId).emit("new_msg", socket.id, msg);
  });

  socket.on("disconnecting", () => {
    const roomId = getRoomId();
    leaveRoom(roomId, socket.id);

    io.to(roomId).emit("user_disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`> Server ready on http://localhost:${port}`);
});
