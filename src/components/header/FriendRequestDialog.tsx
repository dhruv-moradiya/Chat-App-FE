import { Check, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/store/store";

const FriendRequestDialog = () => {
  const {
    requests: friendRequests,
    isError: friendRequestError,
    isLoading: friendRequestLoading,
  } = useAppSelector((state) => state.friendRequest);

  console.log("friendRequests :>> ", friendRequests);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <UserPlus size={24} />
      </DialogTrigger>
      <DialogContent className="scrollbar sm:max-w-[600px] max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Fried Request</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {friendRequestLoading && !friendRequestError ? (
            <div>Loading...</div>
          ) : !friendRequestLoading && !friendRequestError ? (
            friendRequests.map((request, index) => (
              <div key={index} className="py-2 flex items-center gap-2">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 ml-auto rounded-full overflow-hidden">
                    <img
                      src={request.from.profilePicture}
                      alt={request.from.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p>
                    {request.from.username.charAt(0).toUpperCase() +
                      request.from.username.slice(1)}{" "}
                    Send You a Friend Request
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="p-0 px-4 text-green-500 transition-colors duration-150 hover:bg-green-500"
                  >
                    <Check />
                  </Button>
                  <Button
                    variant="outline"
                    className="p-0 px-4 text-red-500  transition-colors duration-150 hover:bg-red-500"
                  >
                    <X />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div>{friendRequestError}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequestDialog;
