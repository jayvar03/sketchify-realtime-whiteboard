import { atom } from "recoil";

export const roomAtom = atom<ClientRoom>({
  key: "room",
  default: {
    id: "",
    usersMoves: new Map(),
    movesWithoutUser: [],
    myMoves: [],
    users: new Map(),
  },
});
