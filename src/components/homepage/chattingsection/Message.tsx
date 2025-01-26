import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/store";
import { ChatMessage } from "@/types/ApiResponse.types";
import RenderAttachments from "./RenderAttachments";
import { AttachmentLoader, MessageBox, SenderAvatar } from "./MessageLayout";
import {
  MessageUserInteractionType,
  SelectedMessageType,
} from "@/types/Common.types";

interface MessageProps extends ChatMessage {
  isSeen: boolean;
  isSender: boolean;
  isPrevMessageFromSameUser: boolean;
  selectedMessage: SelectedMessageType[] | null;
  setSelectedMessage: React.Dispatch<
    React.SetStateAction<SelectedMessageType[] | null>
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
        setSelectedMessage([
          {
            _id,
            content,
            type: "Reply",
          },
        ]);
        break;
      case "React":
        break;
      case "Star":
        break;
      case "Pin":
        break;
      case "Delete":
        setSelectedMessage((prev) =>
          prev
            ? [
                ...prev,
                {
                  _id,
                  content,
                  type: "Delete",
                },
              ]
            : [
                {
                  _id,
                  content,
                  type: "Delete",
                },
              ]
        );
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
