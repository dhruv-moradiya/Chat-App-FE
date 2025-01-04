import { memo } from "react";
import { AxiosError } from "axios";
import { Check, X } from "lucide-react";
import { acceptFriendRequest } from "@/api";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/store";
import { addNewChat } from "@/store/myChats/ChatSlice";
import { FriendRequestData } from "@/types/ApiResponse.types";

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
  const dispatch = useAppDispatch();

  if (isLoading && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!friendRequests || friendRequests.length === 0) {
    return <div>No friend requests</div>;
  }

  const handleAcceptFriendRequest = async (_id: string) => {
    try {
      const response = await acceptFriendRequest(_id);
      dispatch(addNewChat(response.chatDetails));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("error.response?.data :>> ", error.response?.data.message);
      } else {
        console.log(
          "An unknown error occurred while accepting friend request :>> ",
          error
        );
      }
    }
  };

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
          onClick={() => handleAcceptFriendRequest(request._id)}
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
