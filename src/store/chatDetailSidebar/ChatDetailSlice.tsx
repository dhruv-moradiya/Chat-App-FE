import { createSlice } from "@reduxjs/toolkit";

interface ChatDetailState {
  isOpen: boolean;
  isChatListSideBarOpen: boolean;
}

const initialState: ChatDetailState = {
  isOpen: false,
  isChatListSideBarOpen: false,
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
    openChatListSideBar: (state) => {
      state.isChatListSideBarOpen = true;
    },
    closeChatListSideBar: (state) => {
      state.isChatListSideBarOpen = false;
    },
  },
});

export const {
  openChatDetail,
  closeChatDetail,
  openChatListSideBar,
  closeChatListSideBar,
} = counterSlice.actions;
export const chatDetailSelector = (state: any) => state.chatDetail;
export const chatDetailReducer = counterSlice.reducer;
