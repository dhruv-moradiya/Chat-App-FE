import { configureStore, Middleware } from "@reduxjs/toolkit";
import { chatDetailReducer } from "./chatDetail/ChatDetailSlice";
import { authReducer } from "./auth/AuthSlice";
import { friendRequestReducer } from "./friendRequest/FriendRequestSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { socketReducer } from "./socket/SocketSlice";
import socketMiddleware from "./socket/SocketMiddleware";

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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(customMiddleware).concat(socketMiddleware),
});

export type AppDispatch = typeof store.dispatch; // Typed dispatch
export type RootState = ReturnType<typeof store.getState>; // Typed state
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
