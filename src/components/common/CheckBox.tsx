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
      className="flex cursor-pointer items-center space-x-2"
      onClick={() => setChecked(!checked)}
    >
      <div
        className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
          checked ? "border-primary bg-primary" : "border-gray-400 bg-white"
        }`}
      >
        {checked && <Check size={14} color="#fff" />}
      </div>
      {label && <span className="text-sm text-gray-800">{label}</span>}
    </div>
  );
};

export default CheckBox;
