import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import { MotionValue, useMotionValue } from "framer-motion";
import { toast } from "react-toastify";

import { COLORS_ARRAY } from "@/common/constants/colors";
import { socket } from "@/common/lib/socket";
import { useSetUsers } from "@/common/recoil/room";
import { useSetRoom } from "@/common/recoil/room/room.hooks";
import { useSetSavedMoves } from "@/common/recoil/savedMoves";

export const roomContext = createContext<{
  x: MotionValue<number>;
  y: MotionValue<number>;
  undoRef: RefObject<HTMLButtonElement>;
  redoRef: RefObject<HTMLButtonElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  bgRef: RefObject<HTMLCanvasElement>;
  minimapRef: RefObject<HTMLCanvasElement>;
  moveImage: { base64: string; x?: number; y?: number };
  setMoveImage: Dispatch<
    SetStateAction<{
      base64: string;
      x?: number | undefined;
      y?: number | undefined;
    }>
  >;
}>(null!);

const RoomContextProvider = ({ children }: { children: ReactNode }) => {
  const setRoom = useSetRoom();
  const { handleAddUser, handleRemoveUser } = useSetUsers();
  const { clearSavedMoves } = useSetSavedMoves();

  const undoRef = useRef<HTMLButtonElement>(null);
  const redoRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);

  const [moveImage, setMoveImage] = useState<{
    base64: string;
    x?: number;
    y?: number;
  }>({ base64: "" });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    socket.on("room", (room, usersMovesToParse, usersToParse) => {
      try {
        const usersMoves = new Map<string, Move[]>(JSON.parse(usersMovesToParse));
        const usersParsed = new Map<string, string>(JSON.parse(usersToParse));

        const newUsers = new Map<string, User>();

        usersParsed.forEach((name, id) => {
          if (id === socket.id) return;

          const index = [...usersParsed.keys()].indexOf(id);

          const color = COLORS_ARRAY[index % COLORS_ARRAY.length];

          newUsers.set(id, {
            name,
            color,
          });
        });

        setRoom((prev) => ({
          ...prev,
          users: newUsers,
          usersMoves,
          movesWithoutUser: room.drawed,
        }));
      } catch (error) {
        console.error("Error parsing room data:", error);
      }
    });

    socket.on("new_user", (userId, username) => {
      toast(`${username} has joined the room.`, {
        position: "top-center",
        theme: "colored",
        toastId: `join-${userId}`, // Prevent duplicate toasts
      });

      handleAddUser(userId, username);
    });

    socket.on("user_disconnected", (userId) => {
      // Get current users from room state to avoid stale closure
      setRoom((prev) => {
        const userName = prev.users.get(userId)?.name || "Anonymous";
        toast(`${userName} has left the room.`, {
          position: "top-center",
          theme: "colored",
          toastId: `leave-${userId}`, // Prevent duplicate toasts
        });
        return prev; // Don't modify state here, let handleRemoveUser do it
      });

      handleRemoveUser(userId);
    });

    // Handle canvas clear event
    socket.on("canvas_cleared", (clearedByUsername: string, clearedByUserId: string) => {
      // Clear only drawing-related state, keep room membership
      setRoom((prev) => ({
        ...prev,
        usersMoves: new Map(),
        movesWithoutUser: [],
        myMoves: [],
        // Keep users and room id intact
      }));
      
      // Clear saved moves (undo/redo history)
      clearSavedMoves();
      
      // Clear canvas visually
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      
      // Clear minimap
      if (minimapRef.current) {
        const minimapCtx = minimapRef.current.getContext("2d");
        if (minimapCtx) {
          minimapCtx.clearRect(0, 0, minimapRef.current.width, minimapRef.current.height);
          // Redraw background on minimap
          if (bgRef.current) {
            minimapCtx.drawImage(
              bgRef.current,
              0,
              0,
              minimapRef.current.width,
              minimapRef.current.height
            );
          }
        }
      }
      
      // Show notification with username (only if it wasn't cleared by current user)
      if (clearedByUserId !== socket.id) {
        toast.success(`Canvas cleared by ${clearedByUsername}`, {
          position: "top-center",
          theme: "colored",
          toastId: `canvas-cleared-${clearedByUserId}`, // Prevent duplicate toasts
        });
      }
    });

    return () => {
      socket.off("room");
      socket.off("new_user");
      socket.off("user_disconnected");
      socket.off("canvas_cleared");
    };
  }, [handleAddUser, handleRemoveUser, setRoom, clearSavedMoves]);

  return (
    <roomContext.Provider
      value={{
        x,
        y,
        bgRef,
        undoRef,
        redoRef,
        canvasRef,
        setMoveImage,
        moveImage,
        minimapRef,
      }}
    >
      {children}
    </roomContext.Provider>
  );
};

export default RoomContextProvider;
