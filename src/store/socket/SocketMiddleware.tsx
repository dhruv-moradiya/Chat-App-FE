import { ChatEventEnum, ActionType } from "@/lib/constants";
import { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { newFriendRequestReceive } from "../friendRequest/FriendRequestSlice";
import { FriendRequestData } from "@/types/ApiResponse.types";
import { addNewChat } from "../myChats/ChatSlice";
import { showNotificationToast } from "@/components/common/ToastProvider";

interface SocketEmitAction {
  type: `socket/${string}`;
  payload: {
    event: string;
    data: any;
  };
}

interface NewFriendRequestReceiveType {
  data: FriendRequestData;
  message: string;
}

const removeSocketListeners = () => {
  if (socket) {
    console.log("🧹 Removing socket event listeners...");
    socket.off(ChatEventEnum.CONNECTED_EVENT);
    socket.off(ChatEventEnum.FRIEND_REQUEST_RECEIVE_EVENT);
    socket.off(ChatEventEnum.FRIEND_REQUEST_ACCEPT_EVENT);
    socket.off(ChatEventEnum.DISCONNECT_EVENT);
    socket.off(ChatEventEnum.SOCKET_ERROR_EVENT);
  }
};

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
      case ActionType.CREATE_CONNECTION:
        if (!socket && token) {
          console.log("😖 Connecting socket...");
          socket = io(import.meta.env.VITE_SOCKET_SERVER_URI, {
            withCredentials: true,
            autoConnect: true,
            auth: { token },
          });

          socket.on(ChatEventEnum.CONNECTED_EVENT, (data) => {
            console.log("😍 Connected to server:", data);
            storeAPI.dispatch({
              type: ActionType.CREATE_CONNECTION,
              payload: data,
            });
          });

          // socket.on("TEST_EVENT", (data) => {
          //   console.log("TEST EVENT DATA :>> ", data);
          // });

          socket.on(
            ChatEventEnum.FRIEND_REQUEST_RECEIVE_EVENT,
            (data: NewFriendRequestReceiveType) => {
              console.log("🌹 Friend request received:", data);
              storeAPI.dispatch(newFriendRequestReceive(data.data));
            }
          );

          socket.on(ChatEventEnum.FRIEND_REQUEST_ACCEPT_EVENT, (data) => {
            console.log("😍 Friend request accepted:", data);
            showNotificationToast(
              `${data.acceptorDetails.username} accepted your friend request!`
            );
            storeAPI.dispatch(addNewChat(data.chatDetails));
          });

          socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
            console.log("💔 Socket disconnected");
            removeSocketListeners();
            storeAPI.dispatch({ type: ActionType.DISCONNECTED });
            socket = null;
          });

          socket.on(ChatEventEnum.SOCKET_ERROR_EVENT, (data) => {
            console.log(
              "😱 Error occur while connecting to the socket :",
              data
            );
          });
        } else {
          console.log("🙏 Socket is already connected or token is missing.");
        }
        break;

      case ActionType.DISCONNECTED:
        if (socket) {
          console.log("💔 Disconnecting socket...");
          removeSocketListeners();
          socket.disconnect();
          socket = null;
          storeAPI.dispatch({ type: ActionType.DISCONNECTED });
        } else {
          console.log("🤷‍♀️ Socket is not connected.");
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
