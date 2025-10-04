import { useWindowSize } from "react-use";

export const useViewportSize = () => {
  const { width, height } = useWindowSize();

  return { width, height };
};
