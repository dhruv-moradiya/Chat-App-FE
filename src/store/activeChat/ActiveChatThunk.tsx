import { getChatMessagesBasedOnChatId } from "@/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

const fetchActiveChatMessages = createAsyncThunk(
  "activeChat/fetchMessages",
  async ({ chatId }: { chatId: string }, { rejectWithValue }) => {
    try {
      const response = await getChatMessagesBasedOnChatId(chatId);
      console.log("response :>> ", response);
      return response.data;
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

export default fetchActiveChatMessages;
