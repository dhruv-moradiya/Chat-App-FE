import { ChatMessagesSummary } from "@/types/ApiResponse.types";
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchActiveChatMessages,
  fetchOldActiveChatMessages,
} from "./ActiveChatThunk";

interface ActiveChatState {
  isLoading: boolean;
  isError: string | null;
  activeChatId: string | null;
  activeChatDetails: ChatMessagesSummary | null;
  prevChatId: string | null;
  hasMoreMessages: boolean; // To indicate if more messages are available
  isLoadingOldMessages: boolean; // To track loading of old messages
}

const initialState: ActiveChatState = {
  isLoading: false,
  isError: null,
  activeChatId: null,
  activeChatDetails: null,
  prevChatId: null,
  hasMoreMessages: false,
  isLoadingOldMessages: false,
};

const activeChatSlice = createSlice({
  name: "activeChat",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChatId = action.payload.activeChatId;
      state.prevChatId = action.payload.prevChatId;
    },
    newMessageReceived: (state, action) => {
      if (state.activeChatDetails) {
        state.activeChatDetails = {
          ...state.activeChatDetails,
          messages: [...state.activeChatDetails.messages, action.payload],
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchActiveChatMessages.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(fetchActiveChatMessages.fulfilled, (state, action) => {
      const messages = [...action.payload.messages].reverse();
      const chatDetails = {
        messages,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalMessages: action.payload.totalMessages,
        limit: action.payload.limit,
      };
      state.activeChatDetails = chatDetails;
      state.hasMoreMessages =
        action.payload.currentPage < action.payload.totalPages;
      state.isLoading = false;
      state.isError = null;
    });
    builder.addCase(fetchActiveChatMessages.rejected, (state, action) => {
      state.isLoading = false;
      state.isError =
        typeof action.payload === "string"
          ? action.payload
          : "An unknown error occurred.";
    });

    builder.addCase(fetchOldActiveChatMessages.pending, (state) => {
      state.isLoadingOldMessages = true;
    });
    builder.addCase(fetchOldActiveChatMessages.fulfilled, (state, action) => {
      if (state.activeChatDetails) {
        const messages = [...action.payload.messages].reverse();
        console.log("messages :>> ", messages);
        state.activeChatDetails = {
          ...state.activeChatDetails,
          messages: [...messages, ...state.activeChatDetails.messages],
          currentPage: action.payload.currentPage,
        };
      }
      state.isLoadingOldMessages = false;
    });

    builder.addCase(fetchOldActiveChatMessages.rejected, (state, action) => {
      state.isLoadingOldMessages = false;
      state.isError =
        typeof action.payload === "string"
          ? action.payload
          : "An unknown error occurred.";
    });
  },
});

export const activeChatReducer = activeChatSlice.reducer;
export const { setActiveChat, newMessageReceived } = activeChatSlice.actions;
export default activeChatSlice;
