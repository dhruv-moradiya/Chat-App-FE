import { ChatMessage } from "./ApiResponse.types";
import { SelectedMessageType } from "./Common.types";

// Interface for MessageContainer
interface MessageContainerProps {
  message: ChatMessage;
  showNewDate: boolean;
  isSender: boolean;
  isPrevMessageFromSameUser: boolean;
  isCurrentMessageSelectedForDelete: boolean;
  isCheckBoxForDelete: boolean;
  selectedMessage: SelectedMessageType[] | null;
  toggleCheckBox: (id: string, content: string) => void;
  setSelectedMessage: React.Dispatch<
    React.SetStateAction<SelectedMessageType[] | null>
  >;
  isCurrentChatIsGroupChat: boolean;
}

export type { MessageContainerProps };
