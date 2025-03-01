import { cn } from "@/lib/utils";

interface Props {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
}

const Tooltip = ({ text, position = "top", children, className }: Props) => {
  return (
    <div className={cn("relative inline-block group", className)}>
      {children}
      <div
        className={`absolute whitespace-nowrap bg-black text-white text-[12px] p-1 px-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-transform duration-200 ease-out pointer-events-auto ${
          position === "top"
            ? "bottom-full mb-2 left-1/2 transform -translate-x-1/2 translate-y-2 group-hover:translate-y-0"
            : position === "bottom"
            ? "top-full mt-2 left-1/2 transform -translate-x-1/2 -translate-y-2 group-hover:translate-y-0"
            : position === "left"
            ? "right-full mr-2 top-1/2 transform -translate-y-1/2 translate-x-2 group-hover:translate-x-0"
            : "left-full ml-2 top-1/2 transform -translate-y-1/2 -translate-x-2 group-hover:translate-x-0"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
