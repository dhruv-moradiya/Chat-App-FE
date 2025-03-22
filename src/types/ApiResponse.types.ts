// Base Response structure
interface ApiResponseBase {
  message: string;
  success: boolean;
  statusCode: number;
}

// User Profile
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

interface UserPreview {
  _id: string;
  username: string;
  profilePicture: string;
  email: string;
}

interface ExcludedFriendsUsersResponse extends ApiResponseBase {
  data: {
    users: UserProfile[];
  };
}

// When user send a friend request
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

// When user receive a friend request
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

type GroupChatDetails = {
  chatName: string;
  isGroup: true;
  admin: string;
  coverImage: {
    url: string;
    publicId: string;
    fileName: string;
  };
};

type DirectChatDetails = {
  isGroup: false;
  admin?: never;
  coverImage?: never;
  chatName?: never;
};

type ChatDetails = (GroupChatDetails | DirectChatDetails) & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  participants: Omit<UserProfile, "friends" | "mutedChats" | "createdAt" | "updatedAt">[];
  unreadMessagesCounts: {
    [key: string]: number;
  };
};

interface ChatDetailResponse extends ApiResponseBase {
  data: ChatDetails[];
}

interface AcceptFriendRequest {
  acceptorDetails: Omit<UserProfile, "friends" | "mutedChats" | "createdAt" | "updatedAt">;
  chatDetails: ChatDetails;
}

interface AcceptFriendRequestResponse extends ApiResponseBase {
  data: {
    acceptorDetails: Omit<UserProfile, "friends" | "mutedChats" | "createdAt" | "updatedAt">;
    chatDetails: ChatDetails;
  };
}

interface SendMessageResponse extends ApiResponseBase {
  data: {
    _id: string;
  };
}

interface Attachment {
  url: string;
  fileName: string;
  publicId: string;
  _id: string;
}

interface ChatMessage {
  _id: string;
  sender: UserPreview;
  content: string;
  replyTo?: string;
  deletedBy: string[];
  isDeletedForAll?: boolean;
  chat: string;
  attachments: Attachment[];
  reactions: any[];
  createdAt: string;
  updatedAt: string;
  isAttachment?: boolean;
}

interface ChatMessagesSummary {
  messages: ChatMessage[];
  totalMessages: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface MessageResponse extends ApiResponseBase {
  data: ChatMessagesSummary;
}

interface MyFriendsList extends ApiResponseBase {
  data: {
    friends: Omit<UserProfile, "friends" | "mutedChats" | "createdAt" | "updatedAt">[];
  };
}

interface CreateGroupChatResponse extends ApiResponseBase {
  data: ChatDetails;
}

interface DeleteMessageForSelectedParticipantsResponse extends ApiResponseBase {
  data: {};
}

export type {
  ApiResponseBase,
  UserProfile,
  UserPreview,
  ExcludedFriendsUsersResponse,
  SentFriendRequestData,
  SentFriendRequestResponse,
  FriendRequestData,
  FriendRequestResponse,
  ChatDetails,
  ChatDetailResponse,
  AcceptFriendRequest,
  AcceptFriendRequestResponse,
  SendMessageResponse,
  Attachment,
  ChatMessage,
  ChatMessagesSummary,
  MessageResponse,
  MyFriendsList,
  CreateGroupChatResponse,
  DeleteMessageForSelectedParticipantsResponse,
};
