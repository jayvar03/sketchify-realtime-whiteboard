import { BsPencilFill } from "react-icons/bs";
import { FaEraser } from "react-icons/fa";

import { useOptions } from "@/common/recoil/options";

const ModePicker = () => {
  const [options, setOptions] = useOptions();

  const handleModeChange = (mode: "draw" | "eraser") => {
    setOptions((prev) => ({
      ...prev,
      mode,
    }));
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Draw Mode */}
      <button
        className={`btn-icon text-xl w-full transition-all ${
          options.mode === "draw" 
            ? "bg-green-500 hover:bg-green-600 ring-2 ring-green-300" 
            : "hover:bg-gray-700"
        }`}
        onClick={() => handleModeChange("draw")}
        title="Draw Mode (Pencil)"
      >
        <BsPencilFill />
      </button>

      {/* Eraser Mode */}
      <button
        className={`btn-icon text-xl w-full transition-all ${
          options.mode === "eraser" 
            ? "bg-red-500 hover:bg-red-600 ring-2 ring-red-300" 
            : "hover:bg-gray-700"
        }`}
        onClick={() => handleModeChange("eraser")}
        title="Eraser Mode"
      >
        <FaEraser />
      </button>
    </div>
  );
};

export default ModePicker;
