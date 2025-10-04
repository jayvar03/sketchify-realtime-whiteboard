import { atom } from "recoil";

export const backgroundAtom = atom<{ mode: "light" | "dark"; lines: boolean }>({
  key: "background",
  default: {
    mode: "light",
    lines: true,
  },
});
