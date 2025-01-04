import { getAllFriendRequests } from "@/api";
import { FriendRequestData } from "@/types/ApiResponse.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface FriendRequestStatus {
  requests: FriendRequestData[];
  isLoading: boolean;
  isError: string | null;
}

const fetchFriendRequests = createAsyncThunk(
  "friendRequest/fetchFriendRequests",
  async (_args: void, { rejectWithValue }) => {
    try {
      const response = await getAllFriendRequests();
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          "Error during fetching friend requests:",
          error.response?.data.message
        );
        return rejectWithValue(error.response?.data.message);
      } else {
        console.error("Unexpected error:", error);
        return rejectWithValue("An unknown error occurred.");
      }
    }
  }
);

const initialState: FriendRequestStatus = {
  requests: [],
  isLoading: false,
  isError: null,
};

const friendRequestSlice = createSlice({
  name: "friendRequest",
  initialState,
  reducers: {
    newFriendRequestReceive: (state, action) => {
      state.requests.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFriendRequests.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(fetchFriendRequests.fulfilled, (state, action) => {
      state.isLoading = false;
      state.requests = action.payload.data;
    });
    builder.addCase(fetchFriendRequests.rejected, (state, action) => {
      state.isLoading = false;
      state.isError =
        typeof action.payload === "string"
          ? action.payload
          : "An unknown error occurred.";
    });
  },
});

export { fetchFriendRequests };
export const friendRequestSelector = (state: any) => state.friendRequest;
export const { newFriendRequestReceive } = friendRequestSlice.actions;
export const friendRequestReducer = friendRequestSlice.reducer;
