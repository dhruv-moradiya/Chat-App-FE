import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchEmojisByCategory } from "./EmojiThunk";

interface Emoji {
  name: string;
  category: string;
  group: string;
  htmlCode: string[];
  unicode: string[];
}

interface EmojiCategory {
  emojis: Emoji[];
  loading: boolean;
}

interface EmojiState {
  categories: Record<string, EmojiCategory>;
}

const initialState: EmojiState = {
  categories: {
    "smileys-and-people": {
      emojis: [],
      loading: false,
    },
    "animals-and-nature": {
      emojis: [],
      loading: false,
    },
    "food-and-drink": {
      emojis: [],
      loading: false,
    },
    "travel-and-places": {
      emojis: [],
      loading: false,
    },
    activities: {
      emojis: [],
      loading: false,
    },
    objects: {
      emojis: [],
      loading: false,
    },
    symbols: {
      emojis: [],
      loading: false,
    },
    flags: {
      emojis: [],
      loading: false,
    },
  },
};

const emojiSlice = createSlice({
  name: "emoji",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmojisByCategory.pending, (state, action) => {
        const category = action.meta.arg;
        if (state.categories[category]) {
          state.categories[category].loading = true;
        }
      })
      .addCase(
        fetchEmojisByCategory.fulfilled,
        (
          state,
          action: PayloadAction<{ category: string; emojis: Emoji[] }>
        ) => {
          const { category, emojis } = action.payload;
          if (state.categories[category]) {
            state.categories[category].emojis = emojis;
            state.categories[category].loading = false;
          }
        }
      )
      .addCase(fetchEmojisByCategory.rejected, (state, action) => {
        const category = action.meta.arg;
        if (state.categories[category]) {
          state.categories[category].loading = false;
        }
      });
  },
});

export const emojiReducer = emojiSlice.reducer;
