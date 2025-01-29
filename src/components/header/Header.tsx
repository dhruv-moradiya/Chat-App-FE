import { memo } from "react";
import FriendRequestDialog from "./friendRequest/FriendRequestDialog";
import Notifications from "./Notifications";
import SearchedUsersList from "./searchedUsersList/SearchedUsersList";
import UserIcon from "./UserIcon";
import GroupChatDialog from "./groupChat/GroupChatDialog";
import { LucideMenu, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  closeChatListSideBar,
  openChatListSideBar,
} from "@/store/chatDetailSidebar/ChatDetailSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const isChatListSideBarOpen = useAppSelector(
    (state) => state.chatDetail.isChatListSideBarOpen
  );

  return (
    <div className="flex items-center justify-end gap-6">
      {isChatListSideBarOpen ? (
        <X onClick={() => dispatch(closeChatListSideBar())} />
      ) : (
        <LucideMenu onClick={() => dispatch(openChatListSideBar())} />
      )}

      <GroupChatDialog />
      <SearchedUsersList />
      <FriendRequestDialog />
      <Notifications />
      <UserIcon />
    </div>
  );
};

export default memo(Header);
