type MessageUserInteractionType = "Reply" | "React" | "Star" | "Pin" | "Delete";

type InteractedMessage = {
  _id: string;
  content: string;
};

type SelectedMessagesForInteraction = {
  messages: InteractedMessage[];
  type: MessageUserInteractionType;
};

export type {
  MessageUserInteractionType,
  InteractedMessage,
  SelectedMessagesForInteraction,
};
