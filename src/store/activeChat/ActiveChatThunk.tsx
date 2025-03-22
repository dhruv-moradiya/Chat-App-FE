import { getChatMessagesBasedOnChatId } from "@/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

const fetchActiveChatMessages = createAsyncThunk(
  "activeChat/fetchActiveChatMessages",
  async (
    { chatId, page, limit }: { chatId: string; page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await getChatMessagesBasedOnChatId(chatId, page, limit);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error during fetching my chats:", error.response?.data.message);
        return rejectWithValue(error.response?.data.message);
      } else {
        console.error("Unexpected error:", error);
        return rejectWithValue("An unknown error occurred.");
      }
    }
  }
);

const fetchOldActiveChatMessages = createAsyncThunk(
  "activeChat/fetchOldActiveChatMessages",
  async (
    { chatId, page, limit }: { chatId: string; page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await getChatMessagesBasedOnChatId(chatId, page, limit);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error during fetching my chats:", error.response?.data.message);
        return rejectWithValue(error.response?.data.message);
      } else {
        console.error("Unexpected error:", error);
        return rejectWithValue("An unknown error occurred.");
      }
    }
  }
);

export { fetchActiveChatMessages, fetchOldActiveChatMessages };
