import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { MdLineWeight } from "react-icons/md";
import { useClickAway } from "react-use";

import { useOptions } from "@/common/recoil/options";

import { EntryAnimation } from "../../animations/Entry.animations";

const LineWidthPicker = () => {
  const [options, setOptions] = useOptions();

  const ref = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        className="btn-icon text-2xl"
        disabled={options.mode === "select"}
        onClick={() => setOpened((prev) => !prev)}
      >
        <MdLineWeight />
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
            <input
              type="range"
              min={1}
              max={20}
              value={options.lineWidth}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  lineWidth: parseInt(e.target.value),
                }))
              }
            />
            <p className="text-center text-white">{options.lineWidth}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LineWidthPicker;
