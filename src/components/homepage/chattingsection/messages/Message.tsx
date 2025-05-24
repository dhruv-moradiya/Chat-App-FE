import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ChatMessage } from "@/types/ApiResponse.types";
import { MessageUserInteractionType, SelectedMessagesForInteraction } from "@/types/Common.types";
import { useState } from "react";
import { AttachmentLoader, MessageBox, SenderAvatar } from "./MessageLayout";

import { ModalType } from "@/lib/constants";
import { openModal } from "@/store/chatDetailSidebar/ChatDetailSlice";
import RenderAttachments from "./RenderAttachments";
import { AnimatePresence, motion } from "framer-motion";

interface MessageProps extends ChatMessage {
  isSeen: boolean;
  isSender: boolean;
  isPrevMessageFromSameUser: boolean;
  selectedMessage: SelectedMessagesForInteraction | null;
  setSelectedMessage: React.Dispatch<React.SetStateAction<SelectedMessagesForInteraction | null>>;
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
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState(content);

  const { activeChatDetails } = useAppSelector((state) => state.activeChat);
  const messageDetails = activeChatDetails?.messages.find((message) => message._id === replyTo);

  const messageDropdownOnClickFunction = (value: MessageUserInteractionType) => {
    switch (value) {
      case "Reply":
        setSelectedMessage({
          type: "Reply",
          messages: [{ _id, content }],
        });
        break;
      case "React":
        setSelectedMessage({
          type: "React",
          messages: [{ _id, content }],
        });
        dispatch(
          openModal({
            type: ModalType.REACT_MODEL,
            props: { selectedMessage: [{ _id, content }] },
          })
        );
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
        "flex w-fit gap-2 space-y-1.5",
        isSender ? "ml-auto flex-row-reverse self-end" : "mr-auto flex-row self-start",
        reactions.length ? "mb-3" : ""
      )}
    >
      {isCurrentChatIsGroupChat && !isSender && <SenderAvatar sender={sender} />}

      <div className="relative space-y-1.5">
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
        {reactions.length ? (
          <div className="absolute -bottom-[24px] right-4 flex w-fit cursor-pointer items-center gap-[1px] rounded-full bg-zinc-800 p-[1px]">
            <AnimatePresence initial={false}>
              {reactions.map((reaction, index) => (
                <motion.div
                  key={reaction.id || reaction.emoji + index}
                  initial={{ scale: 0, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center justify-center rounded-full bg-primary-foreground"
                >
                  <p className="text-[18px]">{reaction.emoji}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Message;
