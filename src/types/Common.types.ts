type MessageUserInteractionType = "Reply" | "React" | "Star" | "Pin" | "Delete";

type SelectedMessageType = {
  _id: string;
  content: string;
  type: MessageUserInteractionType;
};

export type { MessageUserInteractionType, SelectedMessageType };
