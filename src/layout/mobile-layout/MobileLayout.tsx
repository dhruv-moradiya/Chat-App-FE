import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, EllipsisVertical, Phone, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomInput from "@/components/common/customInput/CustomInput";
import { useAppDispatch } from "@/store/store";
import { ModalType } from "@/lib/constants";
import { openModal } from "@/store/chatDetailSidebar/ChatDetailSlice";

const MobileLayout = () => {
  const location = useLocation();

  const getHeaderComponent = () => {
    switch (true) {
      case location.pathname === "/":
        return <MobileHomeRouteHeader />;
      case location.pathname.startsWith("/chat"):
        return <MobileChatSectionRouteHeader />;
      default:
        return <h2 className="text-xl">DM Chat</h2>;
    }
  };

  const headerContent = getHeaderComponent();

  return (
    <div className="relative flex h-screen w-screen flex-col gap-2 overflow-hidden bg-[#14151b] p-2">
      {headerContent || <h2 className="text-xl">DM Chat</h2>}
      <div
        className={cn(
          "scrollbar overflow-y-auto",
          location.pathname === "/" ? "h-[calc(100%-141.6px)]" : ""
        )} // 81.6px || 29.6px
      >
        <Outlet />
      </div>
      {location.pathname.startsWith("/chat") && (
        <CustomInput selectedMessage={null} setSelectedMessage={() => {}} />
      )}
    </div>
  );
};

export default MobileLayout;

const MobileHomeRouteHeader = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col items-center justify-between gap-2">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl">DM Chat</h2>
        {/* <div className="w-9 h-9 rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://i.pinimg.com/736x/57/ff/d2/57ffd2de1067686f07d41a56b2eb76df.jpg"
            alt=""
          />
        </div> */}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-xl border-[1px] border-primary/5 bg-transparent px-2.5 py-1 transition-all duration-150 hover:bg-primary/10 active:scale-95">
            <EllipsisVertical size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-none bg-[#1e1e1e]">
            <DropdownMenuItem
              className="rounded-lg active:bg-primary/10"
              onClick={() => dispatch(openModal({ type: ModalType.CREATE_GROUP_CHAT_MODEL }))}
            >
              Create Group Chat
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-lg active:bg-primary/10"
              onClick={() => dispatch(openModal({ type: ModalType.SEARCH_USERS_MODEL }))}
            >
              Search Users
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-lg active:bg-primary/10"
              onClick={() => dispatch(openModal({ type: ModalType.CHECK_FRIEND_REQUEST_MODEL }))}
            >
              Check Friend Request
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Input icon={Search} className="rounded-full bg-zinc-900 py-3" />
    </div>
  );
};

const MobileChatSectionRouteHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="my-1 flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <ChatSectionIconButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft className="text-white" />
        </ChatSectionIconButton>
        <div className="h-8 w-8 overflow-hidden rounded-full">
          <img
            className="h-full w-full object-cover"
            src="https://i.pinimg.com/736x/57/ff/d2/57ffd2de1067686f07d41a56b2eb76df.jpg"
            alt=""
          />
        </div>
        <h3 className="text-[14px]">Chat Name</h3>
      </div>
      <div className="flex items-center gap-2">
        <ChatSectionIconButton onClick={() => {}}>
          <Search className="text-white" />
        </ChatSectionIconButton>
        <ChatSectionIconButton onClick={() => {}}>
          <Phone className="text-white" />
        </ChatSectionIconButton>
        <DropdownMenu>
          <DropdownMenuTrigger className="border-none! rounded-xl border-[1px] border-primary/5 bg-[#1e1e1e] bg-transparent px-2.5 py-1.5 outline-none transition-all duration-150 hover:bg-primary/10 active:scale-95">
            <EllipsisVertical className="text-white" size={22} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Chat Detail</DropdownMenuItem>
            <DropdownMenuItem>Pin</DropdownMenuItem>
            <DropdownMenuItem>Mute</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const ChatSectionIconButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Button
      onClick={onClick}
      className="rounded-xl border-[1px] border-primary/5 bg-transparent px-2.5 py-1 transition-all duration-150 hover:bg-primary/10 active:scale-95"
    >
      {children}
    </Button>
  );
};
