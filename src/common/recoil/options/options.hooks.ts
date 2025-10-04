import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { optionsAtom } from "./options.atom";

export const useOptions = () => useRecoilState(optionsAtom);

export const useOptionsValue = () => useRecoilValue(optionsAtom);

export const useSetOptions = () => useSetRecoilState(optionsAtom);
