import { useCallback, useState } from "react";

import { DEFAULT_MOVE } from "@/common/constants/defaultMove";
import { getPos } from "@/common/lib/getPos";
import { getStringFromRgba } from "@/common/lib/rgba";
import { socket } from "@/common/lib/socket";
import { useOptionsValue } from "@/common/recoil/options";
import { useSetSavedMoves } from "@/common/recoil/savedMoves";

import { drawRect, drawCircle, drawLine } from "../helpers/Canvas.helpers";
import { useBoardPosition } from "./useBoardPosition";
import { useCtx } from "./useCtx";

let tempMoves: [number, number][] = [];
let tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
let tempSize = { width: 0, height: 0 };
let tempImageData: ImageData | undefined;

export const useDraw = (blocked: boolean) => {
  const options = useOptionsValue();
  const boardPosition = useBoardPosition();
  const { clearSavedMoves } = useSetSavedMoves();

  const [drawing, setDrawing] = useState(false);
  const ctx = useCtx();

  const setupCtxOptions = useCallback(() => {
    if (ctx) {
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = getStringFromRgba(options.lineColor);
      ctx.fillStyle = getStringFromRgba(options.fillColor);
      ctx.lineCap = "round"; // Smooth line endings
      ctx.lineJoin = "round"; // Smooth line joins
      if (options.mode === "eraser")
        ctx.globalCompositeOperation = "destination-out";
      else ctx.globalCompositeOperation = "source-over";
    }
  }, [ctx, options]);

  const drawAndSet = () => {
    if (!tempImageData)
      tempImageData = ctx?.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );

    if (tempImageData) ctx?.putImageData(tempImageData, 0, 0);
  };

  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked) return;

    const movedXCurrent = boardPosition.x.get();
    const movedYCurrent = boardPosition.y.get();
    const [finalX, finalY] = [getPos(x, movedXCurrent), getPos(y, movedYCurrent)];

    setDrawing(true);
    setupCtxOptions();
    drawAndSet();

    if (options.shape === "line") {
      ctx.beginPath();
      ctx.moveTo(finalX, finalY); // Start the path at the initial point
    }

    tempMoves.push([finalX, finalY]);
  };

  const handleDraw = (x: number, y: number, shift?: boolean) => {
    if (!ctx || !drawing || blocked) return;

    const movedXCurrent = boardPosition.x.get();
    const movedYCurrent = boardPosition.y.get();
    const [finalX, finalY] = [getPos(x, movedXCurrent), getPos(y, movedYCurrent)];

    switch (options.shape) {
      case "line":
        if (shift) {
          // Straight line mode (shift held) - restore canvas and draw preview
          drawAndSet();
          drawLine(ctx, tempMoves[0], finalX, finalY, shift);
        } else {
          // Freehand drawing mode - continuous drawing without restoration
          if (tempMoves.length > 0) {
            const lastPoint = tempMoves[tempMoves.length - 1];
            ctx.beginPath();
            ctx.moveTo(lastPoint[0], lastPoint[1]);
            ctx.lineTo(finalX, finalY);
            ctx.stroke();
          }
          tempMoves.push([finalX, finalY]);
        }
        break;

      case "circle":
        drawAndSet();
        tempCircle = drawCircle(ctx, tempMoves[0], finalX, finalY, shift);
        break;

      case "rect":
        drawAndSet();
        tempSize = drawRect(ctx, tempMoves[0], finalX, finalY, shift);
        break;

      default:
        break;
    }
  };

  const clearOnYourMove = () => {
    drawAndSet();
    tempImageData = undefined;
  };

  const handleEndDrawing = () => {
    if (!ctx || blocked) return;

    setDrawing(false);

    ctx.closePath();

    const move: Move = {
      ...DEFAULT_MOVE,
      rect: {
        ...tempSize,
      },
      circle: {
        ...tempCircle,
      },
      path: tempMoves,
      options,
    };

    tempMoves = [];
    tempCircle = { cX: 0, cY: 0, radiusX: 0, radiusY: 0 };
    tempSize = { width: 0, height: 0 };

    socket.emit("draw", move);
    clearSavedMoves();
  };

  return {
    handleEndDrawing,
    handleDraw,
    handleStartDrawing,
    drawing,
    clearOnYourMove,
  };
};
