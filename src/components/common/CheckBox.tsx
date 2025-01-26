import React from "react";
import { Check } from "lucide-react";

type CheckBoxProps = {
  label?: string;
  checked: boolean;
  setChecked: (value: boolean) => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({ label, checked, setChecked }) => {
  return (
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={() => setChecked(!checked)}
    >
      <div
        className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
          checked ? "bg-primary border-primary" : "bg-white border-gray-400"
        }`}
      >
        {checked && <Check size={14} color="#fff" />}
      </div>
      {label && <span className="text-sm text-gray-800">{label}</span>}
    </div>
  );
};

export default CheckBox;
