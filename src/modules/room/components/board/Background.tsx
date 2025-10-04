import { RefObject, useEffect } from "react";

import { motion } from "framer-motion";

import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { useBackground } from "@/common/recoil/background";

import { useBoardPosition } from "../../hooks/useBoardPosition";

const Background = ({ bgRef }: { bgRef: RefObject<HTMLCanvasElement> }) => {
  const bg = useBackground();
  const { x, y } = useBoardPosition();

  useEffect(() => {
    const ctx = bgRef.current?.getContext("2d");

    if (ctx) {
      const bgColors = {
        light: "#fff",
        dark: "#222",
      };

      const lineColors = {
        light: "#ddd",
        dark: "#444",
      };

      ctx.fillStyle = bgColors[bg.mode];
      ctx.fillRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);

      document.body.style.backgroundColor = bgColors[bg.mode];

      if (bg.lines) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = lineColors[bg.mode];
        for (let i = 0; i < CANVAS_SIZE.height; i += 25) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(ctx.canvas.width, i);
          ctx.stroke();
        }

        for (let i = 0; i < CANVAS_SIZE.width; i += 25) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, ctx.canvas.height);
          ctx.stroke();
        }
      }
    }
  }, [bgRef, bg]);

  return (
    <motion.canvas
      ref={bgRef}
      width={CANVAS_SIZE.width}
      height={CANVAS_SIZE.height}
      className="absolute top-0"
      style={{ x, y }}
    />
  );
};

export default Background;
