import { useContext } from "react";
import { roomContext } from "../context/Room.context";

export const useRefs = () => {
  const { canvasRef, bgRef, undoRef, redoRef, minimapRef } =
    useContext(roomContext);

  return { canvasRef, bgRef, undoRef, redoRef, minimapRef };
};
