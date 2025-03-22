import { cn } from "@/lib/utils";

interface Props {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
}

const Tooltip = ({ text, position = "top", children, className }: Props) => {
  return (
    <div className={cn("group relative inline-block", className)}>
      {children}
      <div
        className={`pointer-events-auto absolute whitespace-nowrap rounded-xl bg-black p-1 px-3 text-[12px] text-white opacity-0 shadow-lg transition-transform duration-200 ease-out group-hover:opacity-100 ${
          position === "top"
            ? "bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-2 transform group-hover:translate-y-0"
            : position === "bottom"
              ? "left-1/2 top-full mt-2 -translate-x-1/2 -translate-y-2 transform group-hover:translate-y-0"
              : position === "left"
                ? "right-full top-1/2 mr-2 -translate-y-1/2 translate-x-2 transform group-hover:translate-x-0"
                : "left-full top-1/2 ml-2 -translate-x-2 -translate-y-1/2 transform group-hover:translate-x-0"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
