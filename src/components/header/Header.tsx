import { memo } from "react";
import FriendRequestDialog from "./FriendRequestDialog";
import Notifications from "./Notifications";
import UserIcon from "./UserIcon";
import SearchedUsersList from "./searchedUsersList/SearchedUsersList";

const Header = () => {
  const notifications = [
    {
      imgSrc:
        "https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096",
      altText: "Shotaro",
      message: "Sungchan sent you a message",
    },
    {
      imgSrc:
        "https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096",
      altText: "Shotaro",
      message: "Sungchan sent you a message",
    },
    {
      imgSrc:
        "https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096",
      altText: "Shotaro",
      message: "Sungchan sent you a message",
    },
  ];

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
