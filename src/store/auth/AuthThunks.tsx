import { loginUser, registerUser } from "@/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  accessToken: string;
}

export const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response: User = await loginUser(data);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error during login:", error.response?.data.message);
        return rejectWithValue(error.response?.data.message);
      } else {
        console.error("Unexpected error:", error);
        return rejectWithValue("An unknown error occurred.");
      }
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  "auth/registerUser",
  async (
    data: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response: Omit<User, "accessToken"> = await registerUser(data);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error during login:", error.response?.data.message);
        return rejectWithValue(error.response?.data.message);
      } else {
        console.error("Unexpected error:", error);
        return rejectWithValue("An unknown error occurred.");
      }
    }
  }
);
