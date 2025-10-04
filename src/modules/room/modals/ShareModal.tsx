import { useRoom } from "@/common/recoil/room";
import { toast } from "react-toastify";

const ShareModal = () => {
  const { id } = useRoom();

  const handleCopy = () => {
    const url = `${window.location.origin}/room/${id}`;
    navigator.clipboard.writeText(url);
    toast("Link copied to clipboard!", {
      position: "top-center",
      theme: "colored",
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Share Room</h2>
      <p className="text-center text-gray-600">
        Share this room ID with others to collaborate
      </p>
      <div className="flex items-center gap-2">
        <input
          className="rounded-lg border border-gray-300 px-4 py-2 text-center text-xl font-mono"
          value={id}
          readOnly
        />
        <button className="btn" onClick={handleCopy}>
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
