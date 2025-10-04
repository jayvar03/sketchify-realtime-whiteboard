import { useRecoilValue, useSetRecoilState } from "recoil";
import { backgroundAtom } from "./background.atom";

export const useBackground = () => useRecoilValue(backgroundAtom);

export const useSetBackground = () => useSetRecoilState(backgroundAtom);
