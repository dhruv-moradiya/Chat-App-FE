import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

interface SocketState {
  isConnected: boolean;
  lastAttempt: string | null;
  error: string | null;
  connectionHistory: {
    timestamp: string;
    status: "connected" | "disconnected" | "error";
    error?: string;
  }[];
}

const initialState: SocketState = {
  isConnected: false,
  lastAttempt: null,
  error: null,
  connectionHistory: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    createConnection(state) {
      state.isConnected = true;
      state.error = null;
      const timestamp = moment().format("DD/MM/YYYY HH:mm:ss A");
      state.lastAttempt = timestamp;
      state.connectionHistory.push({ timestamp, status: "connected" });
    },
    disconnected(state) {
      state.isConnected = false;
      const timestamp = moment().format("DD/MM/YYYY HH:mm:ss A");
      state.lastAttempt = timestamp;
      state.connectionHistory.push({ timestamp, status: "disconnected" });
    },
    connectionError(state, action: PayloadAction<string>) {
      const timestamp = moment().format("DD/MM/YYYY HH:mm:ss A");
      state.error = action.payload;
      state.isConnected = false;
      state.lastAttempt = timestamp;
      state.connectionHistory.push({
        timestamp,
        status: "error",
        error: action.payload,
      });
    },
    clearConnectionHistory(state) {
      state.connectionHistory = [];
    },
  },
});

export const { createConnection, disconnected, connectionError, clearConnectionHistory } =
  socketSlice.actions;

export const socketReducer = socketSlice.reducer;
