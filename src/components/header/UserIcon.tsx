import { memo } from "react";
import { useAppSelector } from "@/store/store";
import Tooltip from "@/components/ui/tooltip";

const UserIcon = () => {
  const currentUser = useAppSelector((state) => state.auth.user)!;

  return (
    <Tooltip text={currentUser.username} position="bottom">
      <div className="w-10 h-10 ml-auto rounded-full overflow-hidden">
        <img
          src={currentUser.profilePicture}
          alt={currentUser.username}
          className="w-full h-full object-cover"
        />
      </div>
    </Tooltip>
  );
};

export default memo(UserIcon);
