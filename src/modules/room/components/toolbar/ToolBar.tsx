import { useCallback, useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { HiOutlineDownload } from "react-icons/hi";
import { ImExit } from "react-icons/im";
import { IoIosShareAlt } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

import { CANVAS_SIZE } from "@/common/constants/canvasSize";
import { DEFAULT_EASE } from "@/common/constants/easings";
import { useViewportSize } from "@/common/hooks/useViewportSize";
import { useModal } from "@/common/recoil/modal";
import { socket } from "@/common/lib/socket";

import { useRefs } from "../../hooks/useRefs";
import ShareModal from "../../modals/ShareModal";
import ClearCanvasModal from "../../modals/ClearCanvasModal";
import BackgroundPicker from "./BackgroundPicker";
import ColorPicker from "./ColorPicker";
import HistoryBtns from "./HistoryBtns";
import ImagePicker from "./ImagePicker";
import LineWidthPicker from "./LineWidthPicker";
import ModePicker from "./ModePicker";
import ShapeSelector from "./ShapeSelector";

const ToolBar = () => {
  const { canvasRef, bgRef } = useRefs();
  const { openModal } = useModal();
  const { width } = useViewportSize();

  const [opened, setOpened] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (width >= 1024) setOpened(true);
    else setOpened(false);
  }, [width]);

  const handleExit = () => navigate("/");

  const handleDownload = useCallback(() => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_SIZE.width;
      canvas.height = CANVAS_SIZE.height;

      const tempCtx = canvas.getContext("2d");

      if (tempCtx && canvasRef.current && bgRef.current) {
        tempCtx.drawImage(bgRef.current, 0, 0);
        tempCtx.drawImage(canvasRef.current, 0, 0);

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png", 0.9);
        link.download = `sketchify-${Date.now()}.png`;
        link.click();
        
        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(link.href);
        }, 100);
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  }, [canvasRef, bgRef]);

  const handleShare = () => openModal(<ShareModal />);

  const clearCanvas = () => {
    // Emit socket event to clear canvas for all users in the room
    socket.emit("clear_canvas");
  };

  const handleClearCanvas = () => {
    openModal(<ClearCanvasModal onConfirm={clearCanvas} />);
  };
  return (
    <>
      <motion.button
        className="btn-icon absolute bottom-1/2 -left-2 z-50 h-10 w-10 rounded-full bg-black text-2xl transition-none lg:hidden"
        animate={{ rotate: opened ? 0 : 180 }}
        transition={{ duration: 0.2, ease: DEFAULT_EASE }}
        onClick={() => setOpened(!opened)}
      >
        <FiChevronRight />
      </motion.button>
      <motion.div
        className="absolute left-10 top-[50%] z-50 flex flex-col gap-1 rounded-lg bg-gray-800 p-2 text-white shadow-xl"
        animate={{
          x: opened ? 0 : -70,
          y: "-50%",
        }}
        transition={{
          duration: 0.2,
          ease: DEFAULT_EASE,
        }}
      >
        <HistoryBtns />
        <button 
          className="btn-icon text-xl hover:bg-red-600" 
          onClick={handleClearCanvas}
          title="Clear Canvas"
        >
          <RiDeleteBin6Line />
        </button>

        <div className="h-px w-full bg-white" />

        <ShapeSelector />
        <ColorPicker />
        <LineWidthPicker />
        <ModePicker />

        <div className="h-px w-full bg-white" />

        <ImagePicker />
        <BackgroundPicker />

        <div className="h-px w-full bg-white" />

        <button className="btn-icon text-2xl" onClick={handleShare}>
          <IoIosShareAlt />
        </button>
        <button className="btn-icon text-2xl" onClick={handleDownload}>
          <HiOutlineDownload />
        </button>
        <button className="btn-icon text-xl" onClick={handleExit}>
          <ImExit />
        </button>
      </motion.div>
    </>
  );
};

export default ToolBar;
