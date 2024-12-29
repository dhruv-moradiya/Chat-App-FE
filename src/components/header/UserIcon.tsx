import { memo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useAppSelector } from "@/store/store";

const UserIcon = () => {
  const currentUser = useAppSelector((state) => state.auth.user);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="w-10 h-10 ml-auto rounded-full overflow-hidden">
            <img
              src={currentUser.profilePicture}
              alt={currentUser.username}
              className="w-full h-full object-cover"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white rounded-full">
          <p>{currentUser.username}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(UserIcon);
