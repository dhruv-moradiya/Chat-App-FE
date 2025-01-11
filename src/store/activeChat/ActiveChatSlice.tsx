import { ChatMessagesSummary } from "@/types/ApiResponse.types";
import { createSlice } from "@reduxjs/toolkit";
import fetchActiveChatMessages from "./ActiveChatThunk";

interface ActiveChatState {
  isLoading: boolean;
  isError: string | null;
  activeChatId: string | null;
  activeChatDetails: ChatMessagesSummary | null;
  prevChatId: string | null;
}

const initialState: ActiveChatState = {
  isLoading: false,
  isError: null,
  activeChatId: null,
  activeChatDetails: null,
  prevChatId: null,
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
      state.activeChatDetails = action.payload;
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
  },
});

export const activeChatReducer = activeChatSlice.reducer;
export const { setActiveChat, newMessageReceived } = activeChatSlice.actions;

export default activeChatSlice;
