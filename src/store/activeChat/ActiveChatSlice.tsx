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
  hasMoreMessages: boolean;
  isLoadingOldMessages: boolean;
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
        const isMessageExists = state.activeChatDetails.messages.find(
          (message) => message._id === action.payload._id
        );

        console.log("isMessageExists", isMessageExists);

        if (!isMessageExists) {
          console.log("Condition is true");

          state.activeChatDetails = {
            ...state.activeChatDetails,
            messages: [...state.activeChatDetails.messages, action.payload],
          };
        } else {
          console.log("Condition is false");
          const updatedMessages = state.activeChatDetails.messages.map(
            (message) => {
              if (message._id === action.payload._id) {
                return action.payload;
              } else {
                return message;
              }
            }
          );

          state.activeChatDetails = {
            ...state.activeChatDetails,
            messages: updatedMessages,
          };
        }
      }

      // if (state.activeChatDetails) {
      //   state.activeChatDetails = {
      //     ...state.activeChatDetails,
      //     messages: [...state.activeChatDetails.messages, action.payload],
      //   };
      // }
    },

    newMessageUpdateWithAttachment: (state, action) => {
      if (state.activeChatDetails) {
        state.activeChatDetails = {
          ...state.activeChatDetails,
          messages: state.activeChatDetails.messages.map((message) => {
            if (message._id === action.payload._id) {
              return action.payload;
            }
            return message;
          }),
        };
      }
    },

    deleteMessage: (state, action) => {
      const { chatId, deletedBy, isDeletedForAll, messageIds } = action.payload;
      if (state.activeChatDetails && chatId === state.activeChatId) {
        state.activeChatDetails = {
          ...state.activeChatDetails,
          messages: state.activeChatDetails.messages.map((message) => {
            if (messageIds.includes(message._id)) {
              return {
                ...message,
                isDeleteForAll: isDeletedForAll,
                deletedBy: [...message.deletedBy, deletedBy],
              };
            } else {
              return message;
            }
          }),
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
export const {
  setActiveChat,
  newMessageReceived,
  newMessageUpdateWithAttachment,
  deleteMessage,
} = activeChatSlice.actions;
export default activeChatSlice;
