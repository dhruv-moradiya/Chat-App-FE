import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/store";
import { ChatMessage } from "@/types/ApiResponse.types";
import {
  MessageUserInteractionType,
  SelectedMessagesForInteraction,
} from "@/types/Common.types";
import { AttachmentLoader, MessageBox, SenderAvatar } from "./MessageLayout";
import RenderAttachments from "./RenderAttachments";

interface MessageProps extends ChatMessage {
  isSeen: boolean;
  isSender: boolean;
  isPrevMessageFromSameUser: boolean;
  selectedMessage: SelectedMessagesForInteraction | null;
  setSelectedMessage: React.Dispatch<
    React.SetStateAction<SelectedMessagesForInteraction | null>
  >;
  isCurrentChatIsGroupChat: boolean;
  isCheckBoxForDelete: boolean;
}

const Message = ({
  _id,
  sender,
  content,
  replyTo,
  deletedBy,
  isDeletedForAll,
  chat,
  reactions,
  createdAt,
  updatedAt,
  isSender,
  isAttachment,
  isSeen,
  attachments,
  isPrevMessageFromSameUser,
  selectedMessage,
  setSelectedMessage,
  isCurrentChatIsGroupChat,
  isCheckBoxForDelete,
}: MessageProps) => {
  const [inputValue, setInputValue] = useState(content);

  const { activeChatDetails } = useAppSelector((state) => state.activeChat);

  const messageDetails = activeChatDetails?.messages.find(
    (message) => message._id === replyTo
  );

  const messageDropdownOnClickFunction = (
    value: MessageUserInteractionType
  ) => {
    switch (value) {
      case "Reply":
        setSelectedMessage({
          type: "Reply",
          messages: [{ _id, content }],
        });
        break;
      case "React":
        break;
      case "Star":
        break;
      case "Pin":
        break;
      case "Delete":
        setSelectedMessage({ type: "Delete", messages: [{ _id, content }] });
        break;

      default:
        break;
    }
  };

  return (
    <div
      className={cn(
        "w-fit space-y-1.5 flex gap-2",
        isSender
          ? "self-end ml-auto flex-row-reverse"
          : "self-start flex-row mr-auto"
      )}
    >
      {isCurrentChatIsGroupChat && !isSender && (
        <SenderAvatar sender={sender} />
      )}

      <div className="space-y-1.5">
        {isAttachment && <AttachmentLoader isSender={isSender} />}
        {attachments.length > 0 && (
          <RenderAttachments attachments={attachments} isSender={isSender} />
        )}
        <MessageBox
          isDeletedForAll={isDeletedForAll}
          deletedBy={deletedBy}
          inputValue={inputValue}
          replyTo={messageDetails?.content}
          sender={sender}
          isSender={isSender}
          createdAt={createdAt}
          isPrevMessageFromSameUser={isPrevMessageFromSameUser}
          messageDropdownOnClickFunction={messageDropdownOnClickFunction}
          isCurrentChatIsGroupChat={isCurrentChatIsGroupChat}
        />
      </div>
    </div>
  );
};

export default Message;
