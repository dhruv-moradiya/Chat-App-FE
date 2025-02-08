import { ChatMessage } from "./ApiResponse.types";
import { SelectedMessagesForInteraction } from "./Common.types";

// Interface for MessageContainer
interface MessageContainerProps {
  message: ChatMessage;
  showNewDate: boolean;
  isSender: boolean;
  isPrevMessageFromSameUser: boolean;
  isCurrentMessageSelectedForDelete: boolean;
  isCheckBoxForDelete: boolean;
  toggleCheckBox: (id: string, content: string) => void;
  selectedMessage: SelectedMessagesForInteraction | null;
  setSelectedMessage: React.Dispatch<
    React.SetStateAction<SelectedMessagesForInteraction | null>
  >;
  isCurrentChatIsGroupChat: boolean;
}

export type { MessageContainerProps };
