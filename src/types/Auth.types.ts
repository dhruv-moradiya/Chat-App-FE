import { ApiResponseBase } from "./ApiResponse.types";

type User = {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  refreshToken?: string;
  accessTokenIat: number;
  accessTokenExp: number;
  refreshTokenIat: number;
  refreshTokenExp: number;
};

type UserAuth = {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  accessToken: string;
};

interface RegisterUserResponse extends ApiResponseBase {
  data: {
    user: Omit<UserAuth, "accessToken">;
  };
}

interface LoginUserResponse extends ApiResponseBase {
  data: {
    user: UserAuth;
  };
}

export type { UserAuth, User, RegisterUserResponse, LoginUserResponse };
