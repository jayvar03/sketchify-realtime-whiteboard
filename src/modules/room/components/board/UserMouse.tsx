import { useEffect } from "react";

import { motion, useMotionValue } from "framer-motion";

import { socket } from "@/common/lib/socket";

import { useBoardPosition } from "../../hooks/useBoardPosition";

const UserMouse = ({
  userId,
  username,
  color,
}: {
  userId: string;
  username: string;
  color: string;
}) => {
  const boardPos = useBoardPosition();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (newX: number, newY: number, socketIdMoved: string) => {
      if (socketIdMoved === userId) {
        x.set(newX + boardPos.x.get());
        y.set(newY + boardPos.y.get());
      }
    };

    socket.on("mouse_moved", handleMouseMove);

    return () => {
      socket.off("mouse_moved", handleMouseMove);
    };
  }, [boardPos.x, boardPos.y, userId, x, y]);

  useEffect(() => {
    const unsubX = boardPos.x.on("change", (newX) => {
      x.set(x.get() + (newX - boardPos.x.getPrevious()));
    });

    const unsubY = boardPos.y.on("change", (newY) => {
      y.set(y.get() + (newY - boardPos.y.getPrevious()));
    });

    return () => {
      unsubX();
      unsubY();
    };
  }, [boardPos.x, boardPos.y, x, y]);

  return (
    <motion.div
      className="pointer-events-none absolute top-0 left-0 z-50 flex items-center gap-2"
      style={{ x, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
          stroke="white"
          strokeWidth="0.5"
        />
      </svg>
      <p
        className="rounded-md px-3 py-1 text-sm font-bold text-white shadow-lg"
        style={{ backgroundColor: color }}
      >
        {username}
      </p>
    </motion.div>
  );
};

export default UserMouse;
