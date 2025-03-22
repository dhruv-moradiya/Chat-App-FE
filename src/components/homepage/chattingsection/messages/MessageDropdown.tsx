import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MessageUserInteractionType } from "@/types/Common.types";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MessageDropdown = ({
  isSender,
  onClick,
}: {
  isSender: boolean;
  onClick: (value: MessageUserInteractionType) => void;
}) => {
  const options: MessageUserInteractionType[] = ["Reply", "React", "Star", "Pin", "Delete"];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "absolute right-3 top-1 h-fit cursor-pointer rounded-xl p-0 shadow-lg group-hover:block",
            "opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100",
            isSender
              ? "bg-[#34406B] bg-transparent shadow-[0_8px_15px_rgba(52,64,107,0.5)]"
              : "bg-[#21232A] bg-transparent shadow-[0_8px_15px_rgba(33,35,42,0.5)]"
          )}
        >
          <ChevronDown size={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-lg border-none bg-[#21232A] shadow-lg">
        <DropdownMenuGroup>
          {options.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="cursor-pointer hover:bg-black"
              onClick={() => onClick(item)}
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Popover = ({
  trigger,
  children,
  position = "bottom",
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "right" | "bottom" | "left";
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const togglePopover = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      default:
        return "top-full left-1/2 -translate-x-1/2 mt-2";
    }
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={togglePopover} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute z-50 ${getPositionClasses()} animate-fadeIn w-64 rounded-lg border bg-white p-3 opacity-0 shadow-lg transition-opacity duration-300`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default MessageDropdown;
