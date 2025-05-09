import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Search, Phone, Sidebar, EllipsisVertical } from "lucide-react";
import { openChatDetail } from "@/store/chatDetailSidebar/ChatDetailSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex w-full items-center justify-between p-4">
      <div>
        <h3 className="mb-1 text-base md:text-xl">Office Chat</h3>
        <p className="text-[12px] text-muted-foreground">45 members, 24 online</p>
      </div>
      <div className="hidden items-center gap-6 md:flex">
        <Button className="p-2 hover:bg-slate-800/80" variant="ghost">
          <Search size={18} />
        </Button>
        <Button className="p-2 hover:bg-slate-800/80" variant="ghost">
          <Phone fill="white" size={18} />
        </Button>
        <Button className="p-2 hover:bg-slate-800/80" variant="ghost">
          <Sidebar size={18} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-none bg-[#1e1e1e]">
            <DropdownMenuItem
              onClick={() => {
                dispatch(openChatDetail());
                console.log("Chat Detail Clicked");
              }}
            >
              Chat Detail
            </DropdownMenuItem>
            <DropdownMenuItem>Pin</DropdownMenuItem>
            <DropdownMenuItem>Mute</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
