import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchEmojisByCategory } from "./EmojiThunk";
import { IEmoji, IEmojiCategory } from "@/types/ApiResponse.types";
import { EmojiGroupEnum } from "@/lib/constants";

interface IEmojiState {
  categories: Record<EmojiGroupEnum, IEmojiCategory>;
  loading: boolean;
  error: string | null;
}

const initialState: IEmojiState = {
  categories: {
    [EmojiGroupEnum.SMILEYS_EMOTION]: { emojis: [] },
    [EmojiGroupEnum.FOOD_DRINK]: { emojis: [] },
    [EmojiGroupEnum.ACTIVITIES]: { emojis: [] },
    [EmojiGroupEnum.PEOPLE_BODY]: { emojis: [] },
    [EmojiGroupEnum.OBJECTS]: { emojis: [] },
    [EmojiGroupEnum.SYMBOLS]: { emojis: [] },
    [EmojiGroupEnum.COMPONENT]: { emojis: [] },
  },
  loading: false,
  error: null,
};

const emojiSlice = createSlice({
  name: "emoji",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmojisByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmojisByCategory.fulfilled, (state, action: PayloadAction<IEmoji[]>) => {
        state.loading = false;
        const emojis = action.payload;
        emojis.forEach((emoji) => {
          const category = state.categories[emoji.group as EmojiGroupEnum];
          if (category) {
            category.emojis.push(emoji);
          }
        });
      })
      .addCase(fetchEmojisByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const emojiReducer = emojiSlice.reducer;
export const { actions: emojiActions } = emojiSlice;
