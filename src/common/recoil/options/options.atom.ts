import { atom } from "recoil";

export const optionsAtom = atom<CtxOptions>({
  key: "options",
  default: {
    shape: "line",
    mode: "draw",
    lineWidth: 5,
    lineColor: { r: 0, g: 0, b: 0, a: 1 },
    fillColor: { r: 0, g: 0, b: 0, a: 0 },
  },
});
