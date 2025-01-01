import { Middleware } from "@reduxjs/toolkit";
// import { connected, disconnected } from "./socketSlice";
import socketio from "socket.io-client";

const socketMiddleware = (): Middleware => {
  const socket = socketio("http://localhost:3000", {
    withCredentials: true,
    autoConnect: true, // Automatically attempt to connect
    auth: () => ({ token: localStorage.getItem("token") }), // Dynamically retrieve the token
  });

  console.log("Socket middleware initialized");

  // Attach event listeners once
  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("connected", () => {
    console.log("Connected event received from server");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return (storeAPI) => (next) => (action: any) => {
    if (action.type.startsWith("socket/emit")) {
      console.log("Emitting socket event:", action.type);

      const { event, data } = action.payload;

      // Emit events from the middleware
      socket.emit(event, data);
    }

    next(action);
  };
};

export default socketMiddleware;
