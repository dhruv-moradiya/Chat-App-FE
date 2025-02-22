import { ModalTypeValue } from "@/types/Common.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatDetailState {
  isOpen: boolean;
  isChatListSideBarOpen: boolean;
  isModelOpen: boolean;
  modalConfig: {
    isOpen: boolean;
    type: ModalTypeValue | null;
    props: any;
  };
}

const initialState: ChatDetailState = {
  isOpen: false,
  isChatListSideBarOpen: false,
  isModelOpen: false,
  modalConfig: {
    isOpen: false,
    type: null,
    props: null,
  },
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
    openModal: (
      state,
      action: PayloadAction<{ type: ModalTypeValue; props?: any }>
    ) => {
      state.modalConfig = {
        isOpen: true,
        type: action.payload.type,
        props: action.payload.props,
      };
    },
    closeModal: (state) => {
      state.modalConfig = {
        isOpen: false,
        type: null,
        props: null,
      };
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
  openModal,
  closeModal,
} = counterSlice.actions;
export const chatDetailSelector = (state: any) => state.chatDetail;
export const chatDetailReducer = counterSlice.reducer;
