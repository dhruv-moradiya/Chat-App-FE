import { ApiResponseSuccess, FriendRequestResponse } from "@/type";
import axios, { AxiosError, AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  // withCredentials: true,
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

interface ApiResponseBase {
  message: string;
  success: boolean;
  statusCode: number;
}

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  accessToken?: string;
}

interface LoginUserResponse extends ApiResponseBase {
  data: {
    user: User;
  };
}

const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<User> => {
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

interface RegisterUserResponse extends ApiResponseBase {
  data: {
    user: User;
  };
}

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
