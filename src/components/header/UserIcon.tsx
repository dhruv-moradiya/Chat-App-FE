import { memo } from "react";
import { useAppSelector } from "@/store/store";
import Tooltip from "@/components/ui/tooltip";

const UserIcon = () => {
  const currentUser = useAppSelector((state) => state.auth.user)!;

  return (
    <Tooltip text={currentUser.username} position="bottom">
      <div className="ml-auto h-10 w-10 overflow-hidden rounded-full">
        <img
          src={currentUser.profilePicture}
          alt={currentUser.username}
          className="h-full w-full object-cover"
        />
      </div>
    </Tooltip>
  );
};

export default memo(UserIcon);
