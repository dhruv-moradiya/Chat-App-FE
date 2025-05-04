import { configureStore, Middleware } from "@reduxjs/toolkit";
import { chatDetailReducer } from "./chatDetailSidebar/ChatDetailSlice";
import { authReducer } from "./auth/AuthSlice";
import { friendRequestReducer } from "./friendRequest/FriendRequestSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { socketReducer } from "./socket/SocketSlice";
import socketMiddleware from "./socket/SocketMiddleware";
import { myChatsReducer } from "./myChats/ChatSlice";
import { activeChatReducer } from "./activeChat/ActiveChatSlice";
import { emojiReducer } from "./emoji/EmojiSlice";
import { notificationReducer } from "./notifications/NotificationSlice";

const customMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  // console.log("Dispatching action:", action);
  const result = next(action);
  // console.log("State after action:", storeAPI.getState());
  return result;
};

const store = configureStore({
  reducer: {
    chatDetail: chatDetailReducer,
    auth: authReducer,
    socket: socketReducer,
    friendRequest: friendRequestReducer,
    myChats: myChatsReducer,
    activeChat: activeChatReducer,
    emoji: emojiReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(customMiddleware).concat(socketMiddleware),
});

export type AppDispatch = typeof store.dispatch; // Typed dispatch
export type RootState = ReturnType<typeof store.getState>; // Typed state
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
