import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchFriendRequests } from "@/store/friendRequest/FriendRequestSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { UserPlus } from "lucide-react";
import { memo, useEffect } from "react";
import FriendRequestsList from "./FriendRequestsList";

const FriendRequestDialog = () => {
  const {
    requests: friendRequests,
    isLoading: isFriendRequestLoading,
    isError: friendRequestError,
  } = useAppSelector((state) => state.friendRequest);

  console.log("friendRequests :>> ", friendRequests);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFriendRequests());
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <UserPlus size={24} />
      </DialogTrigger>
      <DialogContent className="scrollbar sm:max-w-[600px] max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Friend Requests</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <FriendRequestsList
            friendRequests={friendRequests}
            isLoading={isFriendRequestLoading}
            error={friendRequestError}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(FriendRequestDialog);
