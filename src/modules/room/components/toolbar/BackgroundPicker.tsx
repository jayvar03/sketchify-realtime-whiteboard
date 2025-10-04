import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { MdColorLens } from "react-icons/md";
import { useClickAway } from "react-use";

import { useBackground, useSetBackground } from "@/common/recoil/background";
import { EntryAnimation } from "../../animations/Entry.animations";

const BackgroundPicker = () => {
  const bg = useBackground();
  const setBg = useSetBackground();
  const ref = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  const backgrounds = [
    { mode: "light" as const, color: "#fff", label: "Light Mode", hasGrid: true },
    { mode: "dark" as const, color: "#222", label: "Dark Mode", hasGrid: true },
  ];

  return (
    <>
      <div className="relative flex items-center w-full" ref={ref}>
        <button
          className="btn-icon text-xl w-full"
          onClick={() => setOpened((prev) => !prev)}
        >
          <MdColorLens />
        </button>

        <AnimatePresence>
          {opened && (
            <motion.div
              className="absolute left-14 z-10 flex flex-col gap-2 rounded-lg border bg-zinc-900 p-3 md:border-0"
              variants={EntryAnimation}
              initial="from"
              animate="to"
              exit="from"
            >
              {backgrounds.map((item) => (
                <button
                  key={item.mode}
                  className={`flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-zinc-700 ${
                    bg.mode === item.mode && "bg-green-400 text-black"
                  }`}
                  onClick={() => {
                    setBg((prev) => ({ ...prev, mode: item.mode }));
                    setOpened(false);
                  }}
                >
                  <div
                    className="relative h-5 w-5 rounded border-2 border-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.hasGrid && (
                      <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <line x1="0" y1="5" x2="20" y2="5" stroke={item.color === "#fff" ? "#ddd" : "#666"} strokeWidth="0.5" />
                        <line x1="0" y1="10" x2="20" y2="10" stroke={item.color === "#fff" ? "#ddd" : "#666"} strokeWidth="0.5" />
                        <line x1="0" y1="15" x2="20" y2="15" stroke={item.color === "#fff" ? "#ddd" : "#666"} strokeWidth="0.5" />
                        <line x1="5" y1="0" x2="5" y2="20" stroke={item.color === "#fff" ? "#ddd" : "#666"} strokeWidth="0.5" />
                        <line x1="10" y1="0" x2="10" y2="20" stroke={item.color === "#fff" ? "#ddd" : "#666"} strokeWidth="0.5" />
                        <line x1="15" y1="0" x2="15" y2="20" stroke={item.color === "#fff" ? "#ddd" : "#666"} strokeWidth="0.5" />
                      </svg>
                    )}
                  </div>
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        className={`btn-icon text-xl w-full ${bg.lines && "bg-green-400"}`}
        onClick={() =>
          setBg((prev) => ({
            ...prev,
            lines: !prev.lines,
          }))
        }
      >
        <BsFillGrid3X3GapFill />
      </button>
    </>
  );
};

export default BackgroundPicker;
