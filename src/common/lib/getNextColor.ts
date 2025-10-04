import { COLORS_ARRAY } from "../constants/colors";

let colorIndex = 0;

export const getNextColor = () => {
  const color = COLORS_ARRAY[colorIndex % COLORS_ARRAY.length];
  colorIndex++;
  return color;
};
