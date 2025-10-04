import { socket } from "@/common/lib/socket";

const Message = ({
  userId,
  username,
  color,
  msg,
}: {
  userId: string;
  username: string;
  color: string;
  msg: string;
}) => {
  const isOwnMessage = userId === socket.id;

  return (
    <div className={`mb-3 flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
      <p className="text-sm font-semibold" style={{ color }}>
        {username}
      </p>
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
          isOwnMessage
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {msg}
      </div>
    </div>
  );
};

export default Message;
