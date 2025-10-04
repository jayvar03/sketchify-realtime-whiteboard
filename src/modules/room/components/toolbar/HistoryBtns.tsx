import { FaRedo, FaUndo } from "react-icons/fa";
import { useRefs } from "../../hooks/useRefs";

const HistoryBtns = () => {
  const { undoRef, redoRef } = useRefs();

  return (
    <>
      <button 
        className="btn-icon text-xl w-full" 
        ref={undoRef}
        title="Undo (Ctrl+Z)"
      >
        <FaUndo />
      </button>
      <button 
        className="btn-icon text-xl w-full" 
        ref={redoRef}
        title="Redo (Ctrl+Y)"
      >
        <FaRedo />
      </button>
    </>
  );
};

export default HistoryBtns;
