// LOG IN USER

interface ApiResponseSuccess {
  message: string;
  success: boolean;
}

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  friends: string[];
  mutedChats: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface FriendRequestData {
  from: string;
  to: string;
  status: "pending" | "accepted" | "rejected";
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface FriendRequestResponse extends ApiResponseSuccess {
  statusCode: number;
  data: FriendRequestData;
}

export type {
  ApiResponseSuccess,
  User,
  FriendRequestData,
  FriendRequestResponse,
};
