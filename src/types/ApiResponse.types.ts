interface ApiResponseBase {
  message: string;
  success: boolean;
  statusCode: number;
}

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  friends: string[];
  mutedChats: string[];
  createdAt: string;
  updatedAt: string;
}

interface ExcludedFriendsUsersResponse extends ApiResponseBase {
  data: {
    users: UserProfile[];
  };
}

interface SentFriendRequestData {
  from: string;
  to: string;
  status: "pending" | "accepted" | "rejected";
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface SentFriendRequestResponse extends ApiResponseBase {
  data: SentFriendRequestData;
}

interface FriendRequestData {
  _id: string;
  from: Omit<UserProfile, "friends" | "mutedChats" | "createdAt" | "updatedAt">;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface FriendRequestResponse extends ApiResponseBase {
  data: FriendRequestData[];
}

export type {
  ApiResponseBase,
  UserProfile,
  ExcludedFriendsUsersResponse,
  SentFriendRequestData,
  SentFriendRequestResponse,
  FriendRequestData,
  FriendRequestResponse,
};
