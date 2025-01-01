import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    connected(state) {
      state.isConnected = true;
    },
    disconnected(state) {
      state.isConnected = false;
    },
  },
});

export const { connected, disconnected } = socketSlice.actions;

export const socketReducer = socketSlice.reducer;
