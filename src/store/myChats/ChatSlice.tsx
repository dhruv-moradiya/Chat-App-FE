import { getAllChats, getChatMessagesBasedOnChatId } from "@/api";
import { ChatDetails } from "@/types/ApiResponse.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface MyChatsStatus {
  myChats: ChatDetails[];
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

const fetchMessages = createAsyncThunk(
  "myChats/fetchMessages",
  async ({ chatId }: { chatId: string }, { rejectWithValue }) => {
    try {
      const response = await getChatMessagesBasedOnChatId(chatId);
      console.log("response :>> ", response);
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

    // builder.addCase(fetchMessages.pending, (state) => {
    //   state.isLoading = true;
    //   state.isError = null;
    // });
    // builder.addCase(fetchMessages.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.currentActiveChatDetails = action.payload;
    // });
    // builder.addCase(fetchMessages.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isError =
    //     typeof action.payload === "string"
    //       ? action.payload
    //       : "An unknown error occurred.";
    // });
  },
});

export const myChatsReducer = myChatsSlice.reducer;
export const { addNewChat } = myChatsSlice.actions;
export { fetchMyChats };
