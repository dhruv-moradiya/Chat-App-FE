import { ApiResponseBase } from "./ApiResponse.types";

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

export type { UserAuth, RegisterUserResponse, LoginUserResponse };
