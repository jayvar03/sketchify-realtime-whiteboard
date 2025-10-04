import { useEffect } from "react";

import { socket } from "@/common/lib/socket";
import { useSetRoom } from "@/common/recoil/room";

export const useSocketDraw = (drawing: boolean) => {
  const setRoom = useSetRoom();

  useEffect(() => {
    let moves = 0;
    let timestamp = 0;

    socket.on("user_draw", (move, userId) => {
      if (timestamp !== move.timestamp) {
        timestamp = move.timestamp;
        moves = 0;
      }

      moves += 1;

      setRoom((prev) => {
        const userMoves = prev.usersMoves.get(userId);

        if (!userMoves) {
          prev.usersMoves.set(userId, [move]);
          return {
            ...prev,
            usersMoves: new Map(prev.usersMoves),
          };
        }

        const newMoves = [...userMoves];

        const newMovesFiltered = newMoves.filter(
          (m) => m.timestamp !== move.timestamp
        );

        const movesToAddWithoutNew = newMoves.length - newMovesFiltered.length;

        if (movesToAddWithoutNew === moves) {
          newMovesFiltered.push(move);
        } else {
          newMovesFiltered.splice(newMoves.length - movesToAddWithoutNew, 0, move);
        }

        prev.usersMoves.set(userId, newMovesFiltered);

        return {
          ...prev,
          usersMoves: new Map(prev.usersMoves),
        };
      });
    });

    return () => {
      socket.off("user_draw");
    };
  }, [drawing, setRoom]);

  useEffect(() => {
    socket.on("user_undo", (userId) => {
      setRoom((prev) => {
        const userMoves = prev.usersMoves.get(userId);

        if (!userMoves) return prev;

        const newMoves = [...userMoves];
        newMoves.pop();

        prev.usersMoves.set(userId, newMoves);

        return {
          ...prev,
          usersMoves: new Map(prev.usersMoves),
        };
      });
    });

    return () => {
      socket.off("user_undo");
    };
  }, [setRoom]);
};
