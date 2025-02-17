import { ChatEventEnum, ActionType } from "@/lib/constants";
import { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { newFriendRequestReceive } from "../friendRequest/FriendRequestSlice";
import { FriendRequestData } from "@/types/ApiResponse.types";
import { addNewChat, updateUnreadMessageCount } from "../myChats/ChatSlice";
import { showNotificationToast } from "@/components/common/ToastProvider";
import { playNotificationSound } from "@/lib/utils";
import {
  addReaction,
  deleteMessage,
  newMessageReceived,
  newMessageUpdateWithAttachment,
  updateMessageWithReaction,
} from "../activeChat/ActiveChatSlice";

// const playNotificationSound = useNotificationSound("/to_the_point.mp3");

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
    socket.off(ChatEventEnum.ROOM_CREATED_EVENT);
    socket.off(ChatEventEnum.FRIEND_REQUEST_RECEIVE_EVENT);
    socket.off(ChatEventEnum.FRIEND_REQUEST_ACCEPT_EVENT);
    socket.off(ChatEventEnum.MESSAGE_RECEIVED_EVENT);
    socket.off(ChatEventEnum.UPDATED_MESSAGE_WITH_ATTACHMENT_EVENT);
    socket.off(ChatEventEnum.UNREAD_MESSAGE_EVENT);
    socket.off(ChatEventEnum.DELETE_MESSAGE_FOR_EVERYONE_OR_SELF_EVENT);
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
      // Create socket connection and listen for events
      case ActionType.CREATE_CONNECTION:
        if (!socket && token) {
          console.log("😖 Connecting socket...");

          const socketServerUri = import.meta.env.VITE_APP_SOCKET_SERVER_URL;
          if (!socketServerUri) {
            throw new Error(
              "VITE_APP_SOCKET_SERVER_URL is not defined in the environment variables."
            );
          }

          socket = io(socketServerUri, {
            withCredentials: true,
            autoConnect: true,
            auth: { token },
          });

          // Listen socket connected successfully event
          socket.on(ChatEventEnum.CONNECTED_EVENT, (data) => {
            console.log("😍 Connected to server:", data);
            storeAPI.dispatch({
              type: ActionType.CREATE_CONNECTION,
              payload: data,
            });
          });

          // Listen for friend request received event
          socket.on(
            ChatEventEnum.FRIEND_REQUEST_RECEIVE_EVENT,
            (data: NewFriendRequestReceiveType) => {
              console.log("🌹 Friend request received:", data);
              playNotificationSound();
              storeAPI.dispatch(newFriendRequestReceive(data.data));
            }
          );

          // Listen for friend request accepted event
          socket.on(ChatEventEnum.FRIEND_REQUEST_ACCEPT_EVENT, (data) => {
            showNotificationToast(
              `${data.acceptorDetails.username} accepted your friend request!`
            );
            playNotificationSound();
            storeAPI.dispatch(addNewChat(data.chatDetails));
          });

          // Listen for message received event
          socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, (data) => {
            // console.log("📨 Message received:", data);
            // If message is not sent by current user means it is for receiver
            // if (state.auth.user._id !== data.sender._id) {
            storeAPI.dispatch(newMessageReceived(data.message));
            // }
          });

          // Listen for updated message with attachment
          socket.on(
            ChatEventEnum.UPDATED_MESSAGE_WITH_ATTACHMENT_EVENT,
            (data) => {
              storeAPI.dispatch(newMessageUpdateWithAttachment(data.message));
            }
          );

          // Listen for unread message
          socket.on(ChatEventEnum.UNREAD_MESSAGE_EVENT, (data) => {
            const { chatId } = data;
            const userId = state.auth.user._id;
            storeAPI.dispatch(updateUnreadMessageCount({ chatId, userId }));
          });

          // Listen for delete message
          socket.on(
            ChatEventEnum.DELETE_MESSAGE_FOR_EVERYONE_OR_SELF_EVENT,
            (data) => {
              storeAPI.dispatch(deleteMessage(data));
            }
          );

          socket.on(
            ChatEventEnum.MESSAGE_REACT_EVENT,
            ({ chatId, messageId, emoji }) => {
              storeAPI.dispatch(
                updateMessageWithReaction({ chatId, messageId, emoji })
              );
            }
          );

          // Listen for socket disconnection
          socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
            console.log("💔 Socket disconnected");
            removeSocketListeners();
            storeAPI.dispatch({ type: ActionType.DISCONNECTED });
            socket = null;
          });

          // Listen for socket error
          socket.on(ChatEventEnum.SOCKET_ERROR_EVENT, (data) => {
            console.log(
              "😱 Error occur while connecting to the socket :",
              data
            );
          });

          socket.on(ChatEventEnum.ROOM_CREATED_EVENT, (data) => {
            showNotificationToast(
              "Room created successfully!" + " " + data.chatId
            );
          });
        } else {
          console.log("🙏 Socket is already connected or token is missing.");
        }
        break;

      // Disconnect socket
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

      case ActionType.CURRENT_ACTIVE_CHAT:
        if (socket) {
          const { activeChatId: chatId, prevChatId } = action.payload;

          socket.emit(ChatEventEnum.LEAVE_CHAT_EVENT, prevChatId);

          socket.emit(ChatEventEnum.CURRENT_ACTIVE_CHAT_EVENT, {
            chatId,
            userData: state.auth.user,
          });
        }
        break;

      case ActionType.SEND_MESSAGE:
        if (socket) {
          socket.emit(ChatEventEnum.MESSAGE_SEND_EVENT, {
            messageData: action.payload,
          });
        }
        break;

      case ActionType.ADD_REACTION:
        if (socket) {
          socket.emit(ChatEventEnum.MESSAGE_REACT_EVENT, action.payload);
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
