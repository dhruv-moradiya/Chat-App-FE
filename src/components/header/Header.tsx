import { memo, useEffect } from "react";
import FriendRequestDialog from "./FriendRequestDialog";
import Notifications from "./Notifications";
import UserIcon from "./UserIcon";
import SearchedUsersList from "./searchedUsersList/SearchedUsersList";
import { fetchFriendRequests } from "@/store/friendRequest/FriendRequestSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

const Header = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log("FETCHING FRIEND REQUESTS");
    dispatch(fetchFriendRequests());
  }, []);

  return (
    <div className="flex items-center justify-end gap-6">
      <SearchedUsersList />
      <FriendRequestDialog />
      <Notifications />
      <UserIcon />
    </div>
  );
};

export default memo(Header);
