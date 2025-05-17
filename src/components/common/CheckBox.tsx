import React from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CheckBoxProps = {
  label?: string;
  checked: boolean;
  setChecked: (value: boolean) => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({ label, checked, setChecked }) => {
  return (
    <div
      className="flex cursor-pointer items-center space-x-2"
      onClick={() => setChecked(!checked)}
    >
      <motion.div
        animate={{
          backgroundColor: checked ? "#3c73fb" : "#ffffff",
          borderColor: checked ? "#3c73fb" : "#9ca3af",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex h-5 w-5 items-center justify-center rounded border-2"
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check size={14} color="#fff" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {label && <span className="text-sm text-gray-800">{label}</span>}
    </div>
  );
};

export default CheckBox;
