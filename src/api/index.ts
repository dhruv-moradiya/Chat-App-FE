import {
  AcceptFriendRequestResponse,
  ChatDetailResponse,
  CreateGroupChatResponse,
  ExcludedFriendsUsersResponse,
  FriendRequestResponse,
  MessageResponse,
  MyFriendsList,
  SendMessageResponse,
  SentFriendRequestResponse,
} from "@/types/ApiResponse.types";
import axios, { AxiosResponse } from "axios";
import { LoginUserResponse, RegisterUserResponse } from "@/types/Auth.types";

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
  try {
    const response: AxiosResponse<AcceptFriendRequestResponse> =
      await apiClient.post("/friendrequest/accept-friend-request", {
        friendRequestId: _id,
      });
    console.log("response :>> ", response);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const getAllChats = async () => {
  try {
    const response: AxiosResponse<ChatDetailResponse> = await apiClient.get(
      "/chat/my-chats"
    );

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const sendMessage = async (data: {
  chatId: string;
  content: string;
  replyTo?: string;
  attachments?: File[];
}) => {
  const formData = new FormData();
  formData.append("chatId", data.chatId);
  formData.append("content", data.content);

  if (data.replyTo) {
    formData.append("replyTo", data.replyTo);
  }

  if (data.attachments && data.attachments.length > 0) {
    for (let i = 0; i < data.attachments.length; i++) {
      formData.append("attachments", data.attachments[i]);
    }
  }

  try {
    const response: AxiosResponse<SendMessageResponse> = await apiClient.post(
      "/message/send-message",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getChatMessagesBasedOnChatId = async (
  chatId: string,
  page: number,
  limit: number
) => {
  try {
    const response: AxiosResponse<MessageResponse> = await apiClient.get(
      `/message/get-messages-by-chat/${chatId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchMyFriendsList = async () => {
  try {
    const response: AxiosResponse<MyFriendsList> = await apiClient.get(
      "/friendrequest/get-my-friends"
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const createGroupChat = async (data: {
  chatName: string;
  participantIds: string[];
  coverImage: File;
}) => {
  const formData = new FormData();
  formData.append("chatName", data.chatName);
  formData.append("coverImage", data.coverImage);
  for (let i = 0; i < data.participantIds.length; i++) {
    formData.append("participantIds", data.participantIds[i]);
  }

  const response: AxiosResponse<CreateGroupChatResponse> = await apiClient.post(
    "/chat/create-group-chat",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export {
  acceptFriendRequest,
  getAllChats,
  getAllFriendRequests,
  getUsersExcludingFriendsBasedOnQuery,
  loginUser,
  registerUser,
  sendFriendRequest,
  sendMessage,
  getChatMessagesBasedOnChatId,
  fetchMyFriendsList,
  createGroupChat,
};
