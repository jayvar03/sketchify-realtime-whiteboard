import { useEffect } from "react";

import { getPos } from "@/common/lib/getPos";
import { socket } from "@/common/lib/socket";

import { useBoardPosition } from "../../hooks/useBoardPosition";

let timer: NodeJS.Timeout;

const MousePosition = () => {
  const boardPos = useBoardPosition();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        socket.emit(
          "mouse_move",
          getPos(e.clientX, boardPos.x.get()),
          getPos(e.clientY, boardPos.y.get())
        );
      }, 50);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [boardPos.x, boardPos.y]);

  return null;
};

export default MousePosition;
