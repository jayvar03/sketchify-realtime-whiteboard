import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { RgbaColorPicker } from "react-colorful";
import { BsFillPaletteFill } from "react-icons/bs";
import { useClickAway } from "react-use";

import { useOptions } from "@/common/recoil/options";

import { EntryAnimation } from "../../animations/Entry.animations";

const ColorPicker = () => {
  const [options, setOptions] = useOptions();

  const ref = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);
  const [colorType, setColorType] = useState<"line" | "fill">("line");

  useClickAway(ref, () => setOpened(false));

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className="btn-icon text-2xl"
        disabled={options.mode === "select"}
        onClick={() => setOpened((prev) => !prev)}
      >
        <BsFillPaletteFill />
      </button>

      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute left-14 z-10 flex flex-col gap-3 rounded-lg border bg-zinc-900 p-4 md:border-0"
            variants={EntryAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <div className="flex gap-2">
              <button
                className={`btn-icon text-sm ${
                  colorType === "line" && "bg-green-400"
                }`}
                onClick={() => setColorType("line")}
              >
                Line
              </button>
              <button
                className={`btn-icon text-sm ${
                  colorType === "fill" && "bg-green-400"
                }`}
                onClick={() => setColorType("fill")}
              >
                Fill
              </button>
            </div>

            <RgbaColorPicker
              color={
                colorType === "line" ? options.lineColor : options.fillColor
              }
              onChange={(color) => {
                setOptions((prev) => ({
                  ...prev,
                  [colorType === "line" ? "lineColor" : "fillColor"]: color,
                }));
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;
