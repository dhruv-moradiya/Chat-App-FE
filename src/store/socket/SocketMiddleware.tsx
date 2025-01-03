import { ChatEventEnum, SocketActionType } from "@/lib/constants";
import { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

interface SocketEmitAction {
  type: `socket/${string}`;
  payload: {
    event: string;
    data: any;
  };
}

const isSocketEmitAction = (action: unknown): action is SocketEmitAction =>
  typeof action === "object" &&
  action !== null &&
  typeof (action as SocketEmitAction).type === "string" &&
  (action as SocketEmitAction).type.startsWith("socket/emit") &&
  typeof (action as SocketEmitAction).payload === "object";

let socket: Socket | null = null;

const socketMiddleware: Middleware = (storeAPI) => {
  return (next) => (action: any) => {
    const state = storeAPI.getState();
    const token = state.auth?.token || localStorage.getItem("token");

    switch (action.type) {
      case SocketActionType.CREATE_CONNECTION:
        if (!socket && token) {
          console.log("Connecting socket...");
          socket = io("http://localhost:3000", {
            withCredentials: true,
            autoConnect: true,
            auth: { token },
          });

          socket.on(ChatEventEnum.CONNECTED_EVENT, (data) => {
            console.log("Connected to server:", data);
            storeAPI.dispatch({
              type: SocketActionType.CREATE_CONNECTION,
              payload: data,
            });
          });

          socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
            console.log("Socket disconnected");
            storeAPI.dispatch({ type: SocketActionType.DISCONNECTED });
            socket = null;
          });
        } else {
          console.log("Socket is already connected or token is missing.");
        }
        break;

      case SocketActionType.DISCONNECTED:
        if (socket) {
          console.log("Disconnecting socket...");
          socket.disconnect();
          socket = null;
          storeAPI.dispatch({ type: SocketActionType.DISCONNECTED });
        } else {
          console.log("Socket is not connected.");
        }
        break;

      default:
        // Handle socket emission actions
        if (isSocketEmitAction(action) && socket) {
          const { event, data } = action.payload;
          socket.emit(event, data);
          console.log("Emitting socket event:", { event, data });
        }
        break;
    }

    return next(action);
  };
};

export default socketMiddleware;
