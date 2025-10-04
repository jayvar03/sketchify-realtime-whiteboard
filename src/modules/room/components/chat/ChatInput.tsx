import { FormEvent, useState } from "react";

import { socket } from "@/common/lib/socket";

const ChatInput = () => {
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedMsg = msg.trim();
    if (!trimmedMsg || isSubmitting) return;

    // Validate message length
    if (trimmedMsg.length > 500) {
      console.warn("Message too long");
      return;
    }

    setIsSubmitting(true);
    
    try {
      socket.emit("send_msg", trimmedMsg);
      setMsg("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      // Reset submitting state after a short delay
      setTimeout(() => setIsSubmitting(false), 100);
    }
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        placeholder="Type a message..."
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        maxLength={500}
        disabled={isSubmitting}
      />
      <button 
        className="btn" 
        type="submit"
        disabled={isSubmitting || !msg.trim()}
      >
        {isSubmitting ? "..." : "Send"}
      </button>
    </form>
  );
};

export default ChatInput;
