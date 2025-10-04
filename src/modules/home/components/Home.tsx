import { FormEvent, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal";
import { useSetRoomId, useClearRoom } from "@/common/recoil/room";

import NotFoundModal from "../modals/NotFound";

const Home = () => {
  const { openModal } = useModal();
  const setAtomRoomId = useSetRoomId();
  const clearRoom = useClearRoom();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState(""); // Always start empty on home screen
  const [nameError, setNameError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = "linear-gradient(135deg, #1f2937 0%, #374151 50%, #1f2937 100%)";
  }, []);

  useEffect(() => {
    socket.on("created", (roomIdFromServer) => {
      setAtomRoomId(roomIdFromServer);
      navigate(`/room/${roomIdFromServer}`);
    });

    const handleJoinedRoom = (roomIdFromServer: string, failed?: boolean) => {
      if (!failed) {
        setAtomRoomId(roomIdFromServer);
        navigate(`/room/${roomIdFromServer}`);
      } else {
        openModal(<NotFoundModal id={roomId} />);
      }
    };

    const handleError = (message: string) => {
      console.error("Socket error:", message);
      setNameError(message || "Connection error occurred");
    };

    socket.on("joined", handleJoinedRoom);
    socket.on("error", handleError);

    // Add connection status listeners
    socket.on("connect", () => {
      setNameError("");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setNameError("Unable to connect to server. Please try again.");
    });

    return () => {
      socket.off("created");
      socket.off("joined", handleJoinedRoom);
      socket.off("error", handleError);
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [openModal, roomId, navigate, setAtomRoomId]);

  useEffect(() => {
    socket.emit("leave_room");
    clearRoom(); // Clear all room state including drawings
    // Don't clear username - let users keep it for easy rejoining
  }, [clearRoom]);

  const handleCreateRoom = () => {
    if (!username.trim()) {
      setNameError("Please enter your name");
      return;
    }
    
    if (!socket.connected) {
      setNameError("Not connected to server. Please refresh and try again.");
      return;
    }
    
    setNameError("");
    // Save username to localStorage
    localStorage.setItem("sketchify-username", username.trim());
    socket.emit("create_room", username.trim());
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim()) {
      setNameError("Please enter your name");
      return;
    }

    if (!socket.connected) {
      setNameError("Not connected to server. Please refresh and try again.");
      return;
    }

    setNameError("");
    if (roomId) {
      // Save username to localStorage
      localStorage.setItem("sketchify-username", username.trim());
      socket.emit("join_room", roomId, username.trim());
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center">
          {/* Title */}
          <h1 className="text-6xl font-bold text-black" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Sketchify
          </h1>
          <p className="mt-2 text-sm text-gray-500">Real-time collaborative whiteboard</p>

          {/* Name Input */}
          <div className="mt-8 w-full">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Your Name *
            </label>
            <input
              className={`w-full rounded-lg border-2 px-4 py-2.5 transition-colors focus:outline-none ${
                nameError 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-gray-300 focus:border-black"
              }`}
              placeholder="Enter your name..."
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.slice(0, 15));
                if (nameError) setNameError("");
              }}
              autoFocus
            />
            {nameError && (
              <p className="mt-1.5 text-sm text-red-500 font-medium">{nameError}</p>
            )}
          </div>

          <div className="my-6 h-px w-full bg-gray-200" />

          {/* Join Room */}
          <form className="w-full" onSubmit={handleJoinRoom}>
            <label htmlFor="room-id" className="mb-2 block text-sm font-semibold text-gray-700">
              Join Existing Room
            </label>
            <input
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 transition-colors focus:border-black focus:outline-none"
              id="room-id"
              placeholder="Paste room ID..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button 
              className="mt-3 w-full rounded-lg bg-black px-6 py-2.5 font-semibold text-white transition-all hover:bg-gray-800 active:scale-95" 
              type="submit"
            >
              Join Room
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex w-full items-center gap-3">
            <div className="h-px w-full bg-gray-200" />
            <p className="text-xs font-medium text-gray-400">OR</p>
            <div className="h-px w-full bg-gray-200" />
          </div>

          {/* Create Room */}
          <button 
            className="w-full rounded-lg bg-black px-6 py-2.5 font-semibold text-white transition-all hover:bg-gray-800 active:scale-95" 
            onClick={handleCreateRoom}
          >
            Create New Room
          </button>

          {/* Footer Info */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Free • No sign-up required • Up to 12 users
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
