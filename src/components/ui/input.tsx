import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  icon?: React.ElementType;
  label?: string;
  error?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, icon: Icon, label = "Enter Text", error, ...props },
    ref
  ) => {
    const uniqueId = React.useId();

    return (
      <div className="relative w-full">
        <div
          className={cn(
            "relative w-full flex items-center gap-4 bg-[#2b2b2b] p-4 rounded-xl border-[1px] border-transparent focus-within:border-[1px] focus-within:border-primary hover:border-primary transition-all duration-150",
            className,
            error &&
              "border-red-500 focus-within:border-red-500 hover:border-red-500"
          )}
        >
          {Icon && <Icon className="text-gray-400" size={20} />}
          <input
            {...props}
            ref={ref}
            type={type}
            id={uniqueId}
            autoComplete="off"
            className="flex-1 peer text-white rounded-lg bg-transparent outline-none text-sm"
          />
          <label
            htmlFor={uniqueId}
            className={`absolute left-10 transition-all px-2 rounded-lg text-sm
  ${
    props.value
      ? "-top-2.5 text-sm text-white bg-[#2b2b2b]"
      : "top-3.5 text-lg text-gray-400"
  } 
  peer-focus:-top-2 peer-focus:text-sm peer-focus:text-white peer-focus:bg-[#2b2b2b]`}
          >
            {label}
          </label>
        </div>
        {error && (
          <p className="text-red-500 text-[12px] font-bold ml-2">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
