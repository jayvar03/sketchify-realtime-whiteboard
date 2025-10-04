import { useRecoilValue, useSetRecoilState } from "recoil";
import { roomAtom } from "./room.atom";
import { getNextColor } from "../../lib/getNextColor";

export const useRoom = () => useRecoilValue(roomAtom);

export const useSetRoom = () => useSetRecoilState(roomAtom);

export const useSetRoomId = () => {
  const setRoom = useSetRecoilState(roomAtom);

  return (id: string) => {
    setRoom((prev) => ({ ...prev, id }));
  };
};

export const useClearRoom = () => {
  const setRoom = useSetRecoilState(roomAtom);

  return () => {
    setRoom({
      id: "",
      usersMoves: new Map(),
      movesWithoutUser: [],
      myMoves: [],
      users: new Map(),
    });
  };
};

export const useMyMoves = () => {
  const setRoom = useSetRecoilState(roomAtom);

  const handleAddMyMove = (move: Move) => {
    setRoom((prev) => ({
      ...prev,
      myMoves: [...prev.myMoves, move],
    }));
  };

  const handleRemoveMyMove = () => {
    let move: Move | undefined;

    setRoom((prev) => {
      const newMoves = [...prev.myMoves];
      move = newMoves.pop();

      return {
        ...prev,
        myMoves: newMoves,
      };
    });

    return move;
  };

  return { handleAddMyMove, handleRemoveMyMove };
};

export const useSetUsers = () => {
  const setRoom = useSetRecoilState(roomAtom);

  const handleAddUser = (userId: string, username: string) => {
    setRoom((prev) => {
      const newUsers = new Map(prev.users);
      const newUsersMoves = new Map(prev.usersMoves);

      newUsers.set(userId, {
        name: username,
        color: getNextColor(),
      });

      newUsersMoves.set(userId, []);

      return {
        ...prev,
        users: newUsers,
        usersMoves: newUsersMoves,
      };
    });
  };

  const handleRemoveUser = (userId: string) => {
    setRoom((prev) => {
      const newUsers = new Map(prev.users);
      const newUsersMoves = new Map(prev.usersMoves);

      const userMoves = newUsersMoves.get(userId);

      newUsers.delete(userId);
      newUsersMoves.delete(userId);

      return {
        ...prev,
        users: newUsers,
        usersMoves: newUsersMoves,
        movesWithoutUser: userMoves
          ? [...prev.movesWithoutUser, ...userMoves]
          : prev.movesWithoutUser,
      };
    });
  };

  return { handleAddUser, handleRemoveUser };
};
