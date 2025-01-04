import {
  ExcludedFriendsUsersResponse,
  SentFriendRequestResponse,
  FriendRequestResponse,
  ChatDetailResponse,
} from "@/types/ApiResponse.types";
import { LoginUserResponse, RegisterUserResponse } from "@/types/Auth.types";
import axios, { AxiosResponse } from "axios";

// Create an instance of axios with a base URL, credentials, and timeout.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 12000,
});

// Add an interceptor to the request to add the Authorization header with the token.
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

// REGISTER USER API
const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response: AxiosResponse<RegisterUserResponse> = await apiClient.post(
      "/user/create-user",
      data
    );
    return response.data.data.user;
  } catch (error) {
    throw error;
  }
};

// LOGIN USER API
const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response: AxiosResponse<LoginUserResponse> = await apiClient.post(
      "/user/login-user",
      data
    );
    return response.data.data.user;
  } catch (error) {
    throw error;
  }
};

// GET USERS EXCLUDING FRIENDS API
const getUsersExcludingFriendsBasedOnQuery = async (query: string) => {
  try {
    const response: AxiosResponse<ExcludedFriendsUsersResponse> =
      await apiClient.get(`/user/excluding-friends-search?search=${query}`);

    return response.data.data.users;
  } catch (error) {
    throw error;
  }
};

// SEND FRIEND REQUEST API
const sendFriendRequest = async (_id: string) => {
  try {
    const response: AxiosResponse<SentFriendRequestResponse> =
      await apiClient.post(`/friendrequest/send-friend-request`, {
        receiverId: _id,
      });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// GET FRIEND REQUEST API
const getAllFriendRequests = async () => {
  try {
    const response: AxiosResponse<FriendRequestResponse> = await apiClient.get(
      "/friendrequest/get-friend-requests"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ACCEPT FRIEND REQUEST API
const acceptFriendRequest = async (_id: string) => {
  const response = await apiClient.post(
    "/friendrequest/accept-friend-request",
    { friendRequestId: _id }
  );

  return response.data;
};

const getAllChats = async () => {
  try {
    const response: AxiosResponse<ChatDetailResponse> = await apiClient.get(
      "/chat/my-chats"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  acceptFriendRequest,
  getAllFriendRequests,
  getUsersExcludingFriendsBasedOnQuery,
  loginUser,
  registerUser,
  sendFriendRequest,
  getAllChats,
};
