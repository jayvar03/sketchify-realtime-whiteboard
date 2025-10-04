import { useCallback, useEffect, useMemo } from "react";

import { getStringFromRgba } from "@/common/lib/rgba";
import { socket } from "@/common/lib/socket";
import { useBackground } from "@/common/recoil/background";
import { useMyMoves, useRoom } from "@/common/recoil/room";
import { useSetSavedMoves } from "@/common/recoil/savedMoves";

import { useCtx } from "./useCtx";
import { useRefs } from "./useRefs";

let prevMovesLength = 0;

export const useMovesHandlers = (clearOnYourMove: () => void) => {
  const { canvasRef, minimapRef, bgRef } = useRefs();
  const room = useRoom();
  const { handleAddMyMove, handleRemoveMyMove } = useMyMoves();
  const { addSavedMove, removeSavedMove } = useSetSavedMoves();
  const ctx = useCtx();
  const bg = useBackground();

  const sortedMoves = useMemo(() => {
    const { usersMoves, movesWithoutUser, myMoves } = room;

    const moves = [...movesWithoutUser, ...myMoves];

    usersMoves.forEach((userMoves) => moves.push(...userMoves));

    moves.sort((a, b) => a.timestamp - b.timestamp);

    return moves;
  }, [room]);

  const copyCanvasToSmall = useCallback(() => {
    if (canvasRef.current && minimapRef.current && bgRef.current) {
      const smallCtx = minimapRef.current.getContext("2d");
      if (smallCtx) {
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
          if (!canvasRef.current || !bgRef.current || !smallCtx) return;
          
          smallCtx.clearRect(0, 0, smallCtx.canvas.width, smallCtx.canvas.height);
          smallCtx.drawImage(
            bgRef.current,
            0,
            0,
            smallCtx.canvas.width,
            smallCtx.canvas.height
          );
          smallCtx.drawImage(
            canvasRef.current,
            0,
            0,
            smallCtx.canvas.width,
            smallCtx.canvas.height
          );
        });
      }
    }
  }, [canvasRef, minimapRef, bgRef]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => copyCanvasToSmall(), [bg]);

  const drawMove = (move: Move, image?: HTMLImageElement) => {
    const { path } = move;

    if (!ctx || !ctx.canvas || !path.length) return;

    const moveOptions = move.options;

    // Removed selection mode check

    try {
      ctx.lineWidth = moveOptions.lineWidth;
      ctx.strokeStyle = getStringFromRgba(moveOptions.lineColor);
      ctx.fillStyle = getStringFromRgba(moveOptions.fillColor);
      if (moveOptions.mode === "eraser")
        ctx.globalCompositeOperation = "destination-out";
      else ctx.globalCompositeOperation = "source-over";

      if (moveOptions.shape === "image" && image && path[0])
        ctx.drawImage(image, path[0][0], path[0][1]);

      switch (moveOptions.shape) {
        case "line": {
          ctx.beginPath();
          path.forEach(([x, y]) => {
            ctx.lineTo(x, y);
          });

          ctx.stroke();
          ctx.closePath();
          break;
        }

        case "circle": {
          const { cX, cY, radiusX, radiusY } = move.circle;

          ctx.beginPath();
          ctx.ellipse(cX, cY, radiusX, radiusY, 0, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
          ctx.closePath();
          break;
        }

        case "rect": {
          const { width, height } = move.rect;

          ctx.beginPath();

          ctx.rect(path[0][0], path[0][1], width, height);
          ctx.stroke();
          ctx.fill();

          ctx.closePath();
          break;
        }

        default:
          break;
      }

      copyCanvasToSmall();
    } catch (error) {
      console.error('Error drawing move:', error);
    }
  };

  const drawAllMoves = async () => {
    if (!ctx || !ctx.canvas) return;

    try {
      // Save the current canvas state before clearing
      ctx.save();
      
      // Clear the canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      // Reset to default drawing state
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Load all images first
      const images = await Promise.all(
        sortedMoves
          .filter((move) => move.options.shape === "image" && move.img?.base64)
          .map((move) => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.src = move.img.base64;
              img.id = move.id;
              img.addEventListener("load", () => resolve(img));
              img.addEventListener("error", () => {
                console.error(`Failed to load image for move ${move.id}`);
                reject(new Error(`Failed to load image for move ${move.id}`));
              });
              // Add timeout to prevent hanging
              setTimeout(() => reject(new Error('Image load timeout')), 5000);
            });
          })
      ).catch((error) => {
        console.error('Error loading images:', error);
        return [];
      });

      // Draw all moves
      sortedMoves.forEach((move) => {
        try {
          if (move.options.shape === "image") {
            const img = images.find((image) => image.id === move.id);
            if (img) drawMove(move, img);
          } else {
            drawMove(move);
          }
        } catch (error) {
          console.error('Error drawing move:', error);
        }
      });

      // Restore canvas state
      ctx.restore();
      
      // Update minimap
      copyCanvasToSmall();
    } catch (error) {
      console.error('Error in drawAllMoves:', error);
      // Restore context even if there's an error
      ctx.restore();
    }
  };

  // Redraw canvas when room data changes (important for refresh)
  useEffect(() => {
    if (sortedMoves.length > 0 && ctx) {
      drawAllMoves();
    }
  }, [sortedMoves, ctx, drawAllMoves]); // Trigger when moves are loaded or context is ready

  useEffect(() => {
    socket.on("your_move", (move) => {
      clearOnYourMove();
      handleAddMyMove(move);
    });

    return () => {
      socket.off("your_move");
    };
  }, [clearOnYourMove, handleAddMyMove]);

  useEffect(() => {
    if (prevMovesLength >= sortedMoves.length || !prevMovesLength) {
      drawAllMoves();
    } else {
      const lastMove = sortedMoves[sortedMoves.length - 1];

      if (lastMove.options.shape === "image" && lastMove.img?.base64) {
        const img = new Image();
        img.src = lastMove.img.base64;
        img.addEventListener("load", () => drawMove(lastMove, img));
        img.addEventListener("error", () => {
          console.error(`Failed to load image for move ${lastMove.id}`);
        });
      } else {
        drawMove(lastMove);
      }
    }

    return () => {
      prevMovesLength = sortedMoves.length;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedMoves]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUndo = () => {
    if (!ctx) return;
    
    const move = handleRemoveMyMove();

    if (!move) return;

    addSavedMove(move);
    socket.emit("undo");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRedo = () => {
    if (!ctx) return;
    
    const move = removeSavedMove();

    if (move) {
      socket.emit("draw", move);
    }
  };

  useEffect(() => {
    const handleUndoRedoKeyboard = (e: KeyboardEvent) => {
      // Prevent if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "z" && e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.key === "y" && e.ctrlKey) || (e.key === "z" && e.ctrlKey && e.shiftKey)) {
        e.preventDefault();
        handleRedo();
      }
    };

    document.addEventListener("keydown", handleUndoRedoKeyboard);

    return () => {
      document.removeEventListener("keydown", handleUndoRedoKeyboard);
    };
  }, [handleUndo, handleRedo]);

  return { handleUndo, handleRedo };
};
