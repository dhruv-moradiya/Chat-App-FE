import { fetchEmojis } from "@/api";
import { IEmojiResponse } from "@/types/ApiResponse.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEmojisByCategory = createAsyncThunk(
  "emoji/fetchEmojisByCategory",
  async (query: string, { rejectWithValue }) => {
    try {
      const response: IEmojiResponse = await fetchEmojis(query);

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
