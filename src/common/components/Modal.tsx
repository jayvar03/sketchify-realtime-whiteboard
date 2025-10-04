import { motion } from "framer-motion";
import { useModal } from "../recoil/modal";

const Modal = () => {
  const { modal, closeModal } = useModal();

  if (!modal) return null;

  return (
    <div
      className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/80"
      onClick={closeModal}
    >
      <motion.div
        className="relative rounded-lg bg-white p-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {modal}
      </motion.div>
    </div>
  );
};

export default Modal;
