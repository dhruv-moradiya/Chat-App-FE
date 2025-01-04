import { Button } from "@/components/ui/button";
import { FriendRequestData } from "@/types/ApiResponse.types";
import { Check, X } from "lucide-react";
import { memo } from "react";

interface FriendRequestsListProps {
  friendRequests: FriendRequestData[];
  isLoading: boolean;
  error: string | null;
}

const FriendRequestsList = ({
  friendRequests,
  isLoading,
  error,
}: FriendRequestsListProps) => {
  if (isLoading && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!friendRequests || friendRequests.length === 0) {
    return <div>No friend requests</div>;
  }

  return friendRequests.map((request, index) => (
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
          {`${request.from.username
            .charAt(0)
            .toUpperCase()}${request.from.username.slice(1)}`}{" "}
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
          className="p-0 px-4 text-red-500 transition-colors duration-150 hover:bg-red-500"
        >
          <X />
        </Button>
      </div>
    </div>
  ));
};

export default memo(FriendRequestsList);
