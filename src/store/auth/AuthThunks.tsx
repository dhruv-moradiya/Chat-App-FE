import { loginUser, registerUser } from "@/api";
import { requestHandler } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async (data: { email: string; password: string }) => {
    const response = await loginUser(data);
    console.log("response :>> ", response);
    return response;
  }
);

export const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async (data: { username: string; email: string; password: string }) => {
    const response = await requestHandler(async () => await registerUser(data));

    return response;
  }
);
