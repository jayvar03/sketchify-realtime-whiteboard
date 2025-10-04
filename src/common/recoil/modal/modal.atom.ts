import { atom } from "recoil";
import { ReactNode } from "react";

export const modalAtom = atom<ReactNode | null>({
  key: "modal",
  default: null,
});
