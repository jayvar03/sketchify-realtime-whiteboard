import { useRoom } from "@/common/recoil/room";

import UserMouse from "./UserMouse";

const MousesRenderer = () => {
  const { users } = useRoom();

  return (
    <>
      {[...users.keys()].map((userId) => {
        const user = users.get(userId);
        if (!user) return null;

        return (
          <UserMouse
            key={userId}
            userId={userId}
            username={user.name}
            color={user.color}
          />
        );
      })}
    </>
  );
};

export default MousesRenderer;
