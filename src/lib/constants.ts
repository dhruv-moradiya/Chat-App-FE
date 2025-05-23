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
  DELETE_MESSAGE_FOR_EVERYONE_OR_SELF_EVENT: "deleteMessageForEveryoneOrSelf",
  UPDATED_MESSAGE_WITH_ATTACHMENT_EVENT: "updatedMessageWithAttachment",
  MESSAGE_SEND_EVENT: "messageSent",
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  MESSAGE_DELETE_EVENT: "messageDeleted",
  MESSAGE_EDIT_EVENT: "messageEdited",
  TYPING_EVENT: "typing",
  STOP_TYPING_EVENT: "stopTyping",
  UNREAD_MESSAGE_EVENT: "unreadMessage",
  UNREAD_MESSAGE_COUNT_EVENT: "unreadMessageCount",

  // Reactions and interactions
  MESSAGE_LIKE_EVENT: "messageLiked",
  MESSAGE_REACT_EVENT: "messageReact",
  MESSAGE_REACTED_EVENT: "messageReacted",
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

  // Notifications
  NOTIFICATION_EVENT: "notification",
});

const ActionType = Object.freeze({
  CREATE_CONNECTION: "socket/createConnection",
  DISCONNECTED: "socket/disconnected",
  SEND_MESSAGE: "activeChat/sendMessage",
  NEW_FRIEND_REQUEST_RECEIVE: "friendRequest/newFriendRequestReceive",
  CURRENT_ACTIVE_CHAT: "activeChat/setActiveChat",
  ADD_REACTION: "activeChat/addReaction",
});

const emojiCategories = [
  "smileys-and-people",
  "animals-and-nature",
  "food-and-drink",
  "travel-and-places",
  "activities",
  "objects",
  "symbols",
];

const ModalType = Object.freeze({
  REACT_MODEL: "react",
  DELETE_MODEL: "delete",
  CREATE_GROUP_CHAT_MODEL: "createGroupChat",
  SEARCH_USERS_MODEL: "searchUsers",
  CHECK_FRIEND_REQUEST_MODEL: "checkFriendRequest",
  PROFILE_MODEL: "profile",
  SETTING_MODEL: "setting",
});

enum EmojiGroupEnum {
  SMILEYS_EMOTION = "smileys-emotion",
  PEOPLE_BODY = "people-body",
  COMPONENT = "component",
  FOOD_DRINK = "food-drink",
  ACTIVITIES = "activities",
  OBJECTS = "objects",
  SYMBOLS = "symbols",
}

export { ChatEventEnum, ActionType, emojiCategories, ModalType, EmojiGroupEnum };
