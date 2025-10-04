import { io, Socket } from "socket.io-client";

const URL = import.meta.env.DEV ? "http://localhost:3001" : window.location.origin;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  timeout: 20000,
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
  transports: ['websocket', 'polling'],
  forceNew: true,
  upgrade: true,
});

// Add comprehensive error handling
socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
  console.error("Trying to connect to:", URL);
  console.error("Error details:", error.message);
});

socket.on("disconnect", (reason) => {
  console.warn("Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    // Server disconnected, try to reconnect
    console.log("Attempting to reconnect...");
    socket.connect();
  }
});

socket.on("connect", () => {
  console.log("✅ Socket connected successfully to:", URL);
  console.log("Socket ID:", socket.id);
});

// Use any for built-in socket.io events that aren't in our type definitions
(socket as any).on("reconnect", (attemptNumber: number) => {
  console.log("✅ Socket reconnected after", attemptNumber, "attempts");
});

(socket as any).on("reconnect_attempt", (attemptNumber: number) => {
  console.log("🔄 Reconnection attempt", attemptNumber);
});

(socket as any).on("reconnect_error", (error: any) => {
  console.error("❌ Reconnection failed:", error);
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});
