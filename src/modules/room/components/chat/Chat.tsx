import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import { BsFillChatFill } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import { useList } from "react-use";

import { DEFAULT_EASE } from "@/common/constants/easings";
import { socket } from "@/common/lib/socket";
import { useRoom } from "@/common/recoil/room";

import ChatInput from "./ChatInput";
import Message from "./Message";

const Chat = () => {
  const room = useRoom();

  const msgList = useRef<HTMLDivElement>(null);
  const msgIdCounter = useRef(0);

  const [newMsg, setNewMsg] = useState(false);
  const [opened, setOpened] = useState(false);
  const [msgs, handleMsgs] = useList<Message>([]);

  useEffect(() => {
    const handleNewMsg = (userId: string, msg: string) => {
      // Validate message data
      if (!userId || !msg || typeof msg !== 'string') {
        console.warn("Invalid message data received");
        return;
      }

      const user = room.users.get(userId);
      const isOwnMessage = userId === socket.id;

      msgIdCounter.current += 1;

      handleMsgs.push({
        userId,
        msg: msg.trim(),
        id: msgIdCounter.current,
        username: isOwnMessage ? "You" : (user?.name || "User"),
        color: user?.color || "#000",
      });

      // Scroll to bottom with smooth behavior
      setTimeout(() => {
        msgList.current?.scroll({ 
          top: msgList.current?.scrollHeight, 
          behavior: 'smooth' 
        });
      }, 100);

      if (!opened && !isOwnMessage) setNewMsg(true);
    };

    const handleError = (error: string) => {
      console.error("Chat error:", error);
      // You could show a toast notification here if needed
    };

    socket.on("new_msg", handleNewMsg);
    socket.on("error", handleError);

    return () => {
      socket.off("new_msg", handleNewMsg);
      socket.off("error", handleError);
    };
  }, [handleMsgs, opened, room.users]);

  return (
    <motion.div
      className="absolute bottom-0 z-50 flex h-[300px] w-full flex-col overflow-hidden rounded-t-md sm:left-36 sm:w-[30rem]"
      animate={{ y: opened ? 0 : 260 }}
      transition={{ ease: DEFAULT_EASE, duration: 0.2 }}
    >
      <button
        className="flex w-full cursor-pointer items-center justify-between bg-zinc-900 py-2 px-10 font-semibold text-white"
        onClick={() => {
          setOpened((prev) => !prev);
          setNewMsg(false);
        }}
      >
        <div className="flex items-center gap-2">
          <BsFillChatFill className="mt-[-2px]" />
          Chat
          {newMsg && (
            <p className="rounded-md bg-green-500 px-1 font-semibold text-green-900">
              New!
            </p>
          )}
        </div>

        <motion.div
          animate={{ rotate: opened ? 0 : 180 }}
          transition={{ ease: DEFAULT_EASE, duration: 0.2 }}
        >
          <FaChevronDown />
        </motion.div>
      </button>
      <div className="flex flex-1 flex-col justify-between bg-white p-3">
        <div className="h-[190px] overflow-y-scroll pr-2" ref={msgList}>
          {msgs.map((msg) => (
            <Message key={msg.id} {...msg} />
          ))}
        </div>
        <ChatInput />
      </div>
    </motion.div>
  );
};

export default Chat;
