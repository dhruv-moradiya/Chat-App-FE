import { getAllChats, getChatMessagesBasedOnChatId } from "@/api";
import { ChatDetails } from "@/types/ApiResponse.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface UnReadMessageCount {
  chatId: string;
  count: number;
}

interface MyChatsStatus {
  myChats: ChatDetails[];
  isLoading: boolean;
  isError: string | null;
  unreadMessageCount: UnReadMessageCount[];
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
  isLoading: false,
  isError: null,
  unreadMessageCount: [],
};

const myChatsSlice = createSlice({
  name: "myChats",
  initialState,
  reducers: {
    addNewChat: (state, action) => {
      state.myChats.push(action.payload);
    },

    setUnreadMessageCount: (
      state,
      action: { payload: UnReadMessageCount[] }
    ) => {
      state.unreadMessageCount = action.payload;
    },

    updateUnreadMessageCount: (
      state,
      action: { payload: { chatId: string; userId: string } }
    ) => {
      console.log("action updateUnreadMessageCount :>> ", action.payload);
      const userId = action.payload.userId;
      state.myChats = state.myChats.map((item) => {
        if (item._id === action.payload.chatId) {
          return {
            ...item,
            unreadMessagesCounts: {
              ...item.unreadMessagesCounts,
              [userId]: item.unreadMessagesCounts[userId] + 1,
            },
          };
        } else {
          return item;
        }
      });
    },

    clearUnreadMessageCount: (
      state,
      action: { payload: { chatId: string; userId: string } }
    ) => {
      console.log("clearUnreadMessageCount: ", action.payload);
      state.myChats = state.myChats.map((item) => {
        if (item._id === action.payload.chatId) {
          return {
            ...item,
            unreadMessagesCounts: {
              ...item.unreadMessagesCounts,
              [action.payload.userId]: 0,
            },
          };
        } else {
          return item;
        }
      });
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
export const {
  addNewChat,
  setUnreadMessageCount,
  updateUnreadMessageCount,
  clearUnreadMessageCount,
} = myChatsSlice.actions;
export { fetchMyChats };
