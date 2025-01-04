import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { getAllFriendRequests } from "@/api";
import { FriendRequestData } from "@/types/ApiResponse.types";

const useFetchFriendRequest = () => {
  const [data, setData] = useState<FriendRequestData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFriendRequest = async () => {
    setIsLoading(true);
    try {
      const response = await getAllFriendRequests();
      setData(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      } else {
        setError("An unknown error occurred while fetching friend requests.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendRequest();
  }, []);

  return { data, isLoading, error };
};

export default useFetchFriendRequest;
