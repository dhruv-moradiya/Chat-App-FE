import { configureStore } from "@reduxjs/toolkit";
import { chatDetailReducer } from "./chatDetail/ChatDetailSlice";
import { authReducer } from "./auth/AuthSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    chatDetail: chatDetailReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch; // Typed dispatch
export type RootState = ReturnType<typeof store.getState>; // Typed state
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
