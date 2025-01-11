import { createSlice } from "@reduxjs/toolkit";

interface ChatDetailState {
  isOpen: boolean;
}

const initialState: ChatDetailState = {
  isOpen: false,
};

const counterSlice = createSlice({
  name: "chatDetail",
  initialState,
  reducers: {
    openChatDetail: (state) => {
      state.isOpen = true;
    },
    closeChatDetail: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openChatDetail, closeChatDetail } = counterSlice.actions;
export const chatDetailSelector = (state: any) => state.chatDetail;
export const chatDetailReducer = counterSlice.reducer;
