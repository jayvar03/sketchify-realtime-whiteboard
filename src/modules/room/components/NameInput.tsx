import { FormEvent, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal";
import { useSetRoomId } from "@/common/recoil/room";
import NotFoundModal from "@/modules/home/modals/NotFound";

const NameInput = () => {
  const setRoomId = useSetRoomId();
  const { openModal } = useModal();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  // Set background gradient like home screen
  useEffect(() => {
    document.body.style.background = "linear-gradient(135deg, #1f2937 0%, #374151 50%, #1f2937 100%)";
    
    // Cleanup on unmount
    return () => {
      document.body.style.background = "";
    };
  }, []);

  useEffect(() => {
    if (!roomId) return;

    socket.emit("check_room", roomId);

    socket.on("room_exists", (exists) => {
      if (!exists) {
        navigate("/");
      }
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off("room_exists");
    };
  }, [roomId, navigate]);

  useEffect(() => {
    const handleJoined = (roomIdFromServer: string, failed?: boolean, errorMessage?: string) => {
      if (failed) {
        if (errorMessage === "Username already taken in this room") {
          // Show error message for duplicate name
          setNameError("This username is already taken in this room. Please choose a different name.");
        } else {
          // Handle other errors (room not found, etc.)
          navigate("/");
          openModal(<NotFoundModal id={roomIdFromServer} />);
        }
      } else {
        setRoomId(roomIdFromServer);
        // Clear any previous errors
        setNameError("");
        // Request room data immediately after joining
        setTimeout(() => {
          socket.emit("joined_room");
        }, 100);
      }
    };

    socket.on("joined", handleJoined);

    return () => {
      socket.off("joined", handleJoined);
    };
  }, [openModal, navigate, setRoomId]);

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError("Please enter your name");
      return;
    }

    if (name.trim() && roomId) {
      // Clear any previous errors
      setNameError("");
      // Save username to localStorage
      localStorage.setItem("sketchify-username", name.trim());
      socket.emit("join_room", roomId, name.trim());
    }
  };

  // Load saved username but don't auto-join (let user confirm their name)
  useEffect(() => {
    const savedUsername = localStorage.getItem("sketchify-username");
    if (roomId && savedUsername && !name) {
      setName(savedUsername);
      // Don't auto-join - let the user confirm or change their name
    }
  }, [roomId, name]);

  // Add function to clear localStorage when user wants fresh start
  const clearSavedUsername = () => {
    localStorage.removeItem("sketchify-username");
    setName("");
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

          {/* Room Info */}
          <div className="mt-6 rounded-lg bg-blue-50 px-4 py-3 w-full">
            <p className="text-sm text-blue-800 text-center">
              <span className="font-semibold">Joining Room:</span> {roomId}
            </p>
          </div>

          {/* Name Input Form */}
          <form className="mt-8 w-full" onSubmit={handleJoinRoom}>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Your Name *
            </label>
            <div className="relative">
              <input
                className={`w-full rounded-lg border-2 px-4 py-2.5 pr-10 transition-colors focus:outline-none ${
                  nameError 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-gray-300 focus:border-black"
                }`}
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value.slice(0, 15));
                  // Clear error when user starts typing
                  if (nameError) setNameError("");
                }}
                onKeyDown={(e) => {
                  // Only clear on Escape key
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    clearSavedUsername();
                  }
                  // Don't interfere with normal typing including backspace
                }}
                autoFocus
              />
              {name && (
                <button
                  type="button"
                  onClick={clearSavedUsername}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors text-lg font-bold"
                  title="Clear name and remove from saved names"
                >
                  ✕
                </button>
              )}
            </div>
            {nameError && (
              <p className="mt-1.5 text-sm text-red-500 font-medium">{nameError}</p>
            )}


            <button 
              className="mt-6 w-full rounded-lg bg-black px-6 py-2.5 font-semibold text-white transition-all hover:bg-gray-800 active:scale-95" 
              type="submit"
            >
              Join Room
            </button>
          </form>

          {/* Back to Home Link */}
          <div className="mt-6 w-full">
            <button
              onClick={() => navigate("/")}
              className="w-full rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-95"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameInput;
