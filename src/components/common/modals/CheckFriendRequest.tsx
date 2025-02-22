import { acceptFriendRequest } from "@/api";
import { fetchFriendRequests } from "@/store/friendRequest/FriendRequestSlice";
import { addNewChat } from "@/store/myChats/ChatSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { FriendRequestData } from "@/types/ApiResponse.types";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { showErrorToast } from "../ToastProvider";
import { Button } from "@/components/ui/button";
import { Check, Loader, X } from "lucide-react";

const CheckFriendRequest = () => {
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
    <div className="scrollbar flex flex-col gap-2 min-w-[450px] max-h-[80vh] overflow-y-auto pr-2">
      <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
      <div className="flex flex-col gap-2">
        <FriendRequestsList
          friendRequests={friendRequests}
          isLoading={isFriendRequestLoading}
          error={friendRequestError}
        />
      </div>
    </div>
  );
};

export { CheckFriendRequest };

// ------------------------ Component to render the list of friend requests or loading states ------------------------

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
  const [acceptedRequests, setAcceptedRequests] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (isLoading && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!friendRequests || friendRequests.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        🚫 No friend requests yet! Send invites and start connecting. 🤝
      </p>
    );
  }

  const handleAcceptFriendRequest = async (_id: string) => {
    setLoadingId(_id);
    try {
      const response = await acceptFriendRequest(_id);
      dispatch(addNewChat(response.chatDetails));
      setAcceptedRequests((prev) => [...prev, _id]);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error:", error.response?.data.message);
        showErrorToast(error.response?.data.message);
      } else {
        console.log("Unknown error:", error);
        showErrorToast(
          "An unknown error occurred while accepting the request."
        );
      }
    } finally {
      setLoadingId(null);
    }
  };

  return friendRequests.map((request) => (
    <div key={request._id} className="py-2 flex items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 ml-auto rounded-lg overflow-hidden">
          <img
            src={request.from.profilePicture}
            alt={request.from.username}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-gray-200">
          {`${request.from.username
            .charAt(0)
            .toUpperCase()}${request.from.username.slice(1)}`}{" "}
          sent you a friend request
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {acceptedRequests.includes(request._id) ? (
          <Button
            disabled
            variant="outline"
            className="p-0 px-4 text-gray-500 border-gray-400 cursor-not-allowed rounded-xl"
          >
            <Check /> Accepted
          </Button>
        ) : (
          <Button
            variant="outline"
            className="p-0 px-4 text-green-500 transition-colors duration-150 hover:bg-green-500 hover:text-white rounded-xl"
            onClick={() => handleAcceptFriendRequest(request._id)}
            disabled={loadingId === request._id}
          >
            {loadingId === request._id ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Check />
            )}
            {loadingId === request._id ? "Accepting..." : "Accept"}
          </Button>
        )}
        <Button
          variant="outline"
          className="p-0 px-4 text-red-500 transition-colors duration-150 hover:bg-red-500 hover:text-white rounded-xl"
        >
          <X /> Decline
        </Button>
      </div>
    </div>
  ));
};
