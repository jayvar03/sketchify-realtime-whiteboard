import { useModal } from "@/common/recoil/modal";

interface ClearCanvasModalProps {
  onConfirm: () => void;
}

const ClearCanvasModal = ({ onConfirm }: ClearCanvasModalProps) => {
  const { closeModal } = useModal();

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className="text-2xl font-bold text-gray-800">Clear Canvas?</h2>
      <p className="text-center text-gray-600 max-w-sm">
        Are you sure you want to clear the entire canvas? This action cannot be undone and all drawings will be permanently deleted.
      </p>
      <div className="flex gap-3 w-full">
        <button
          className="flex-1 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-300"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          className="flex-1 rounded-lg bg-red-500 px-6 py-3 font-semibold text-white transition-all hover:bg-red-600"
          onClick={handleConfirm}
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
};

export default ClearCanvasModal;
