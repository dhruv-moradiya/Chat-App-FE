import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Props {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
}

const Tooltip = ({ text, position = "top", children, className }: Props) => {
  const [hovered, setHovered] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
    }
  };

  const getMotionVariant = () => {
    switch (position) {
      case "top":
        return {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 8 },
        };
      case "bottom":
        return {
          initial: { opacity: 0, y: -8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -8 },
        };
      case "left":
        return {
          initial: { opacity: 0, x: 8 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 8 },
        };
      case "right":
        return {
          initial: { opacity: 0, x: -8 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -8 },
        };
    }
  };

  return (
    <div
      className={cn("relative !flex flex-col items-center justify-center gap-1", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="tooltip"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={getMotionVariant()}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute z-50 max-w-[200px] whitespace-nowrap rounded-xl bg-black p-1 px-3 text-center text-xs text-white shadow-lg",
              getPositionClasses()
            )}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
