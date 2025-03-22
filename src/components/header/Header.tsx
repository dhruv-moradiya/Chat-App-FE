import { memo } from "react";
import { ModalType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { LucideMenu, Search, User, UserPlus, X } from "lucide-react";
import {
  closeChatListSideBar,
  openChatListSideBar,
  openModal,
} from "@/store/chatDetailSidebar/ChatDetailSlice";
import Tooltip from "@/components/ui/tooltip";
import UserIcon from "@/components/header/UserIcon";
import Notifications from "@/components/header/Notifications";

const Header = () => {
  const dispatch = useAppDispatch();
  const isChatListSideBarOpen = useAppSelector((state) => state.chatDetail.isChatListSideBarOpen);

  return (
    <div className="flex items-center justify-between md:justify-end md:gap-6">
      {isChatListSideBarOpen ? (
        <X onClick={() => dispatch(closeChatListSideBar())} />
      ) : (
        <LucideMenu
          size={18}
          onClick={() => dispatch(openChatListSideBar())}
          className="md:hidden"
        />
      )}

      <Tooltip text="Create Group Chat" position="bottom" className="hidden md:block">
        <Button
          className="hidden rounded-xl border-[1px] bg-transparent transition-all duration-150 hover:bg-primary/10 active:scale-95 md:block"
          onClick={() => dispatch(openModal({ type: ModalType.CREATE_GROUP_CHAT_MODEL }))}
        >
          <User className="text-white" />
        </Button>
      </Tooltip>

      <Tooltip text="Search Users" position="bottom" className="hidden md:block">
        <Button
          className="rounded-xl border-[1px] bg-transparent transition-all duration-150 hover:bg-primary/10 active:scale-95"
          onClick={() => dispatch(openModal({ type: ModalType.SEARCH_USERS_MODEL }))}
        >
          <Search className="text-white" />
        </Button>
      </Tooltip>

      <Tooltip text="Check Friend Requests" position="bottom" className="hidden md:block">
        <Button
          className="rounded-xl border-[1px] bg-transparent transition-all duration-150 hover:bg-primary/10 active:scale-95"
          onClick={() => dispatch(openModal({ type: ModalType.CHECK_FRIEND_REQUEST_MODEL }))}
        >
          <UserPlus className="text-white" />
        </Button>
      </Tooltip>

      <Notifications />
      <UserIcon />
    </div>
  );
};

export default memo(Header);
