import { memo } from "react";
import FriendRequestDialog from "./friendRequest/FriendRequestDialog";
import Notifications from "./Notifications";
import SearchedUsersList from "./searchedUsersList/SearchedUsersList";
import UserIcon from "./UserIcon";
import GroupChatDialog from "./groupChat/GroupChatDialog";

const Header = () => {
  return (
    <div className="flex items-center justify-end gap-6">
      <GroupChatDialog />
      <SearchedUsersList />
      <FriendRequestDialog />
      <Notifications />
      <UserIcon />
    </div>
  );
};

export default memo(Header);
