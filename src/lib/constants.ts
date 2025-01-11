const ChatEventEnum = Object.freeze({
  // User connection events
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",

  // Chat room management
  JOIN_CHAT_EVENT: "joinChat",
  LEAVE_CHAT_EVENT: "leaveChat",
  NEW_CHAT_EVENT: "newChat",

  // Group management
  UPDATE_GROUP_NAME_EVENT: "updateGroupName",
  GROUP_CHAT_DELETE_EVENT: "groupChatDeleted",
  USER_JOIN_GROUP_EVENT: "userJoinGroup",
  USER_LEAVE_GROUP_EVENT: "userLeaveGroup",

  // Messaging
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  MESSAGE_DELETE_EVENT: "messageDeleted",
  MESSAGE_EDIT_EVENT: "messageEdited",
  TYPING_EVENT: "typing",
  STOP_TYPING_EVENT: "stopTyping",

  // Reactions and interactions
  MESSAGE_LIKE_EVENT: "messageLiked",
  MESSAGE_REACT_EVENT: "messageReacted",
  MESSAGE_REPLY_EVENT: "messageReplied",
  MESSAGE_MENTION_EVENT: "messageMentioned",

  // Chat features
  CHAT_PIN_EVENT: "chatPinned",
  CHAT_UNPIN_EVENT: "chatUnpinned",
  CHAT_MUTE_EVENT: "chatMuted",
  CHAT_UNMUTE_EVENT: "chatUnmuted",
  CURRENT_ACTIVE_CHAT_EVENT: "currentActiveChat",

  // Room event
  ROOM_CREATED_EVENT: "roomCreated",

  // Media
  MEDIA_SEND_EVENT: "mediaSent",
  MEDIA_RECEIVED_EVENT: "mediaReceived",

  // Notifications
  SEND_NOTIFICATION_EVENT: "sendNotification",

  // Errors
  SOCKET_ERROR_EVENT: "socketError",

  // Friend requests
  FRIEND_REQUEST_SEND_EVENT: "friendRequestSent",
  FRIEND_REQUEST_RECEIVE_EVENT: "friendRequestReceived",
  FRIEND_REQUEST_ACCEPT_EVENT: "friendRequestAccepted",
  FRIEND_REQUEST_DECLINE_EVENT: "friendRequestDeclined",
});

const ActionType = Object.freeze({
  CREATE_CONNECTION: "socket/createConnection",
  DISCONNECTED: "socket/disconnected",

  NEW_FRIEND_REQUEST_RECEIVE: "friendRequest/newFriendRequestReceive",

  CURRENT_ACTIVE_CHAT: "activeChat/setActiveChat",
});

export { ChatEventEnum, ActionType };
