import { memo, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchFriendRequests } from "@/store/friendRequest/FriendRequestSlice";
import FriendRequestsList from "./FriendRequestsList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FriendRequestDialog = () => {
  const dispatch = useAppDispatch();

  const {
    requests: friendRequests,
    isLoading: isFriendRequestLoading,
    isError: friendRequestError,
  } = useAppSelector((state) => state.friendRequest);

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
