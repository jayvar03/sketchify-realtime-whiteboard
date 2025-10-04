import { useRecoilState } from "recoil";
import { modalAtom } from "./modal.atom";
import { ReactNode } from "react";

export const useModal = () => {
  const [modal, setModal] = useRecoilState(modalAtom);

  const openModal = (content: ReactNode) => {
    setModal(content);
  };

  const closeModal = () => {
    setModal(null);
  };

  return { modal, openModal, closeModal };
};
