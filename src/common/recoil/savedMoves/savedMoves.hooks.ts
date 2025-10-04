import { useSetRecoilState } from "recoil";
import { savedMovesAtom } from "./savedMoves.atom";

export const useSetSavedMoves = () => {
  const setSavedMoves = useSetRecoilState(savedMovesAtom);

  const addSavedMove = (move: Move) => {
    setSavedMoves((prev) => [...prev, move]);
  };

  const removeSavedMove = () => {
    let move: Move | undefined;

    setSavedMoves((prev) => {
      const newMoves = [...prev];
      move = newMoves.pop();
      return newMoves;
    });

    return move;
  };

  const clearSavedMoves = () => {
    setSavedMoves([]);
  };

  return { addSavedMove, removeSavedMove, clearSavedMoves };
};
