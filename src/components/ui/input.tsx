import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  icon?: React.ElementType;
  label?: string;
  error?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon: Icon, label = "Enter Text", error, ...props }, ref) => {
    const uniqueId = React.useId();

    return (
      <div className="relative w-full">
        <div
          className={cn(
            "relative flex w-full items-center gap-4 rounded-xl border-[1px] border-transparent bg-secondary p-4 transition-all duration-150 focus-within:border-[1px] focus-within:border-primary hover:border-primary",
            className,
            error && "border-red-500 focus-within:border-red-500 hover:border-red-500"
          )}
        >
          {Icon && <Icon className="text-gray-400" size={20} />}
          <input
            {...props}
            ref={ref}
            type={type}
            id={uniqueId}
            autoComplete="off"
            className="peer flex-1 rounded-lg bg-transparent px-1 text-sm text-white outline-none"
          />
          <label
            htmlFor={uniqueId}
            className={cn(
              "absolute rounded-lg px-2 transition-all",
              "peer-focus:-top-2 peer-focus:bg-secondary peer-focus:text-sm peer-focus:text-white",
              props.value
                ? "-top-2.5 bg-secondary text-sm text-white"
                : "top-3.5 text-sm text-gray-400",
              Icon ? "left-11" : "left-5"
            )}
          >
            {label}
          </label>
        </div>
        {error && <p className="ml-2 text-[12px] font-bold text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
