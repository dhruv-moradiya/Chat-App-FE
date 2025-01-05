import { getAllChats } from "@/api";
import { ChatDetails } from "@/types/ApiResponse.types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface Participant {
  _id: string;
  username: string;
  profilePicture: string;
  email: string;
}

interface MyChatsStatus {
  myChats: ChatDetails[];
  currentActiveChat: {
    chatId: string;
    participants: Participant[] | [];
  } | null;
  isLoading: boolean;
  isError: string | null;
}

const fetchMyChats = createAsyncThunk(
  "myChats/fetchMyChats",
  async (_args: void, { rejectWithValue }) => {
    try {
      const response = await getAllChats();

      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(
          "Error during fetching my chats:",
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

const initialState: MyChatsStatus = {
  myChats: [],
  currentActiveChat: null,
  isLoading: false,
  isError: null,
};

const myChatsSlice = createSlice({
  name: "myChats",
  initialState,
  reducers: {
    addNewChat: (state, action) => {
      state.myChats.push(action.payload);
    },

    setCurrentActiveChat: (
      state,
      action: PayloadAction<{
        chatId: string;
        participants: Participant[];
      }>
    ) => {
      state.currentActiveChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyChats.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(fetchMyChats.fulfilled, (state, action) => {
      state.isLoading = false;
      state.myChats = action.payload;
    });
    builder.addCase(fetchMyChats.rejected, (state, action) => {
      state.isLoading = false;
      state.isError =
        typeof action.payload === "string"
          ? action.payload
          : "An unknown error occurred.";
    });
  },
});

export const myChatsReducer = myChatsSlice.reducer;
export const { addNewChat, setCurrentActiveChat } = myChatsSlice.actions;
export { fetchMyChats };
