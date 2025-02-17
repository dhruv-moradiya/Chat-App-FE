import { createSlice } from "@reduxjs/toolkit";

interface ChatDetailState {
  isOpen: boolean;
  isChatListSideBarOpen: boolean;
  isModelOpen: boolean;
}

const initialState: ChatDetailState = {
  isOpen: false,
  isChatListSideBarOpen: false,
  isModelOpen: false,
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
    openModel: (state) => {
      state.isModelOpen = true;
    },
    closeModel: (state) => {
      state.isModelOpen = false;
    },
  },
});

export const {
  openChatDetail,
  closeChatDetail,
  openChatListSideBar,
  closeChatListSideBar,
  openModel,
  closeModel,
} = counterSlice.actions;
export const chatDetailSelector = (state: any) => state.chatDetail;
export const chatDetailReducer = counterSlice.reducer;
