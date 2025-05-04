import { fetchNotifications } from "@/api";
import { Notification, NotificationResponse } from "@/types/ApiResponse.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const fetchAllNotifications = createAsyncThunk(
  "notifications/fetchAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response: NotificationResponse = await fetchNotifications();
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error during fetching friend requests:", error.response?.data.message);
        return rejectWithValue(error.response?.data.message);
      } else {
        console.error("Unexpected error:", error);
        return rejectWithValue("An unknown error occurred.");
      }
    }
  }
);

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  isError: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  isError: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllNotifications.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(fetchAllNotifications.fulfilled, (state, action) => {
      state.isLoading = false;
      state.notifications = action.payload;
    });
    builder.addCase(fetchAllNotifications.rejected, (state, action) => {
      state.isLoading = false;
      state.isError =
        typeof action.payload === "string" ? action.payload : "An unknown error occurred.";
    });
  },
});

export const { reducer: notificationReducer } = notificationSlice;
