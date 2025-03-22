import { createAsyncThunk } from "@reduxjs/toolkit";

interface Emoji {
  name: string;
  category: string;
  group: string;
  htmlCode: string[];
  unicode: string[];
}

export const fetchEmojisByCategory = createAsyncThunk(
  "emoji/fetchEmojisByCategory",
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://emojihub.yurace.pro/api/all/category/${category}`);
      if (!response.ok) {
        throw new Error("Failed to fetch emojis");
      }
      const data: Emoji[] = await response.json();
      return { category, emojis: data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
