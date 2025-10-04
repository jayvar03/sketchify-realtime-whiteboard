import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickAway } from "react-use";
import { useRoom } from "@/common/recoil/room";
import { socket } from "@/common/lib/socket";

const UserProfiles = () => {
  const { users } = useRoom();
  const [showAll, setShowAll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => setShowAll(false));

  const userArray = Array.from(users.entries());
  const visibleUsers = userArray.slice(0, 3);
  const remainingCount = userArray.length - 3;

  return (
    <div className="absolute left-10 top-10 z-50" ref={ref}>
      <div className="flex items-center gap-2">
        {/* Show first 3 users */}
        {visibleUsers.map(([userId, user], index) => (
          <div
            key={userId}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white shadow-lg"
            style={{
              backgroundColor: user.color,
              marginLeft: index !== 0 ? "-0.5rem" : 0,
              zIndex: visibleUsers.length - index,
            }}
            title={userId === socket.id ? "You" : user.name}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        ))}

        {/* Show +X button if more than 3 users */}
        {remainingCount > 0 && (
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-sm font-bold text-white shadow-lg hover:bg-gray-600"
            style={{ marginLeft: "-0.5rem" }}
            onClick={() => setShowAll(!showAll)}
          >
            +{remainingCount}
          </button>
        )}
      </div>

      {/* Dropdown showing all users */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            className="absolute left-0 top-12 w-64 rounded-lg border border-gray-700 bg-zinc-900 p-3 shadow-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="mb-2 text-sm font-bold text-white">
              Users in Room ({userArray.length})
            </h3>
            <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
              {userArray.map(([userId, user]) => (
                <div
                  key={userId}
                  className="flex items-center gap-2 rounded-md bg-zinc-800 p-2"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white">
                    {userId === socket.id ? "You" : user.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfiles;
