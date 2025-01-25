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

const MessageDropdown = ({
  isSender,
  onClick,
}: {
  isSender: boolean;
  onClick: (value: MessageUserInteractionType) => void;
}) => {
  const options: MessageUserInteractionType[] = [
    "Reply",
    "React",
    "Star",
    "Pin",
    "Delete",
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            " p-0 h-fit absolute top-1 right-3 shadow-2xl cursor-pointer group-hover:block",
            "transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100",
            isSender ? "bg-[#34406B]" : "bg-[#21232A]"
          )}
        >
          <ChevronDown size={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="shadow-lg bg-[#21232A] border-none rounded-lg">
        <DropdownMenuGroup>
          {options.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="hover:bg-black cursor-pointer"
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

export default MessageDropdown;
