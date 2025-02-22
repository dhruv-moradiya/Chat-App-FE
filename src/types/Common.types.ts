import { ModalType } from "@/lib/constants";

type MessageUserInteractionType = "Reply" | "React" | "Star" | "Pin" | "Delete";

type InteractedMessage = {
  _id: string;
  content: string;
};

type SelectedMessagesForInteraction = {
  messages: InteractedMessage[];
  type: MessageUserInteractionType;
};

type ModalTypeValue = (typeof ModalType)[keyof typeof ModalType];

export type {
  MessageUserInteractionType,
  InteractedMessage,
  SelectedMessagesForInteraction,
  ModalTypeValue,
};
