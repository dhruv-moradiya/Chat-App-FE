import { ApiResponseSuccess, FriendRequestResponse } from "@/type";
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 12000,
});

apiClient.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

interface LoginUserResponse extends ApiResponseSuccess {
  user: {
    _id: string;
    username: string;
    email: string;
    profilePicture: string;
    accessToken: string;
  };
  statusCode: number;
}

const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<LoginUserResponse> => {
  const response = await apiClient.post("/user/login-user", data);
  return response.data;
};

const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await apiClient.post("/user/create-user", data);
  return response;
};

const getUsersExcludingFriendsBasedOnQuery = (query: string) => {
  return apiClient.get(`/user/excluding-friends-search?search=${query}`);
};

const sendFriendRequest = async (
  _id: string
): Promise<FriendRequestResponse> => {
  const response = await apiClient.post(`/friendrequest/send-friend-request`, {
    receiverId: _id,
  });
  return response.data;
};

const getAllFriendRequests = async () => {
  const response = await apiClient.get("/friendrequest/get-friend-requests");

  return response.data;
};

const acceptFriendRequest = async (_id: string) => {
  const response = await apiClient.post(
    "/friendrequest/accept-friend-request",
    { friendRequestId: _id }
  );

  return response.data;
};

export {
  loginUser,
  registerUser,
  getUsersExcludingFriendsBasedOnQuery,
  sendFriendRequest,
  acceptFriendRequest,
  getAllFriendRequests,
};
