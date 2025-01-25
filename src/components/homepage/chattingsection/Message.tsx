import { useState } from "react";
import { Check } from "lucide-react";
import { useAppSelector } from "@/store/store";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Attachment, ChatMessage } from "@/types/ApiResponse.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import moment from "moment";
import MessageDropdown from "./MessageDropdown";
import {
  MessageUserInteractionType,
  SelectedMessageType,
} from "@/types/Common.types";
import Model from "@/components/ui/Modal";

interface MessageProps extends ChatMessage {
  isSeen: boolean;
  isSender: boolean;
  isPrevMessageFromSameUser: boolean;
  setSelectedMessage: React.Dispatch<
    React.SetStateAction<SelectedMessageType | null>
  >;
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
  setSelectedMessage,
}: MessageProps) => {
  const [inputValue, setInputValue] = useState(content);

  const { activeChatDetails, activeChatId } = useAppSelector(
    (state) => state.activeChat
  );

  const messageDetails = activeChatDetails?.messages.find(
    (message) => message._id === replyTo
  );
  const { myChats } = useAppSelector((state) => state.myChats);

  const senderName =
    myChats
      .find((chat) => chat._id === activeChatId)
      ?.participants.find(
        (participant) => participant._id === messageDetails?.sender
      )?.username || "Anonymous";

  const messageDropdownOnClickFunction = (
    value: MessageUserInteractionType
  ) => {
    switch (value) {
      case "Reply":
        setSelectedMessage({
          _id,
          content,
          type: "Reply",
        });
        break;
      case "React":
        break;
      case "Star":
        break;
      case "Pin":
        break;
      case "Delete":
        setSelectedMessage({
          _id,
          content,
          type: "Delete",
        });
        break;

      default:
        break;
    }
  };

  return (
    <>
      {isAttachment && (
        <div
          className={cn(
            "animate-pulse rounded-lg bg-primary/10 p-10",
            isSender ? "self-end" : "self-start"
          )}
        ></div>
      )}
      <RenderAttachments attachments={attachments} isSender={isSender} />
      <div
        className={cn(
          "relative w-fit max-w-sm px-1 py-2 pr-[70px]1 rounded-[10px] shadow-md group space-y-1",
          isSender
            ? "bg-primary/40 text-white self-end rounded-tr-none"
            : "bg-muted-foreground/10 self-start rounded-tl-none"
        )}
      >
        {/* Decorative Shape */}
        {!isPrevMessageFromSameUser && <DecorativeShape isSender={isSender} />}

        {replyTo && (
          <div className="bg-primary-foreground/30 p-2 rounded-lg text-sm border-l-4 border-primary">
            <p className="text-primary font-bold">
              {capitalizeFirstLetter(senderName)}
            </p>
            <p>{messageDetails?.content}</p>
          </div>
        )}

        <div className="flex items-start gap-3 pr-[65px] px-2">
          <p
            className="text-sm break-words whitespace-normal"
            style={{ wordBreak: "break-word" }}
          >
            {inputValue}
          </p>
          <div className="absolute bottom-1 right-2 flex items-center justify-between w-[55px]">
            <span
              className={cn(
                "text-[10px] text-muted-foreground ",
                isSender ? "text-white" : "text-muted-foreground"
              )}
            >
              {moment(createdAt).format("hh:mm A")}
            </span>
            <span>
              <Check
                size={12}
                // className={cn(isSeen ? "text-white" : "text-primary")}
              />
            </span>
          </div>

          <MessageDropdown
            isSender={isSender}
            onClick={messageDropdownOnClickFunction}
          />
        </div>

        {/* {isSender && (
          <div className="absolute bottom-1 right-2">
            <Check
              size={14}
              className={cn(isSeen ? "text-white" : "text-primary")}
            />
          </div>
        )} */}
      </div>
    </>
  );
};

export default Message;

interface RenderAttachmentProps {
  attachments: Attachment[];
  isSender: boolean;
}

const RenderAttachments = ({
  attachments,
  isSender,
}: RenderAttachmentProps) => {
  const MAX_VISIBLE_ATTACHMENTS = 3;

  const visibleAttachments =
    attachments.length > MAX_VISIBLE_ATTACHMENTS
      ? attachments.slice(0, MAX_VISIBLE_ATTACHMENTS)
      : attachments;

  const renderDialogContent = () => (
    <DialogContent className="w-[70vw] h-[600px] flex flex-col gap-4">
      <DialogTitle>Preview</DialogTitle>
      <DialogDescription className="hidden">
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
      <ScrollArea className="h-full w-full rounded-md border-none">
        {attachments.map((attachment, index) => (
          <div
            key={`attachment-full-${index}`}
            className="w-full !h-[400px] rounded-3xl overflow-hidden cursor-pointer my-6"
          >
            <img
              src={attachment.url}
              alt={`attachment-${index + 1}`}
              className="w-full h-full object-contain rounded-3xl"
            />
          </div>
        ))}
      </ScrollArea>
    </DialogContent>
  );

  const attachmentElements = visibleAttachments.map((attachment, index) => (
    <Dialog key={index}>
      <DialogTrigger>
        <div className="w-20 h-20 overflow-hidden rounded-lg flex items-center gap-2 cursor-pointer">
          <img
            src={attachment.url}
            alt={`attachment-thumbnail-${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      </DialogTrigger>
      {renderDialogContent()}
    </Dialog>
  ));

  if (attachments.length > MAX_VISIBLE_ATTACHMENTS) {
    attachmentElements.push(
      <Dialog key="extra-attachments">
        <DialogTrigger>
          <div className="w-20 h-20 overflow-hidden rounded-lg flex items-center justify-center bg-primary text-white cursor-pointer">
            +{attachments.length - MAX_VISIBLE_ATTACHMENTS}
          </div>
        </DialogTrigger>
        {renderDialogContent()}
      </Dialog>
    );
  }

  return (
    <div
      className={cn(
        "grid  gap-2",
        attachments.length >= 2 ? "grid-cols-2" : "grid-cols-1",
        isSender ? "ml-auto" : "mr-auto"
      )}
    >
      {attachmentElements}
    </div>
  );
};

const DecorativeShape = ({ isSender }: { isSender: boolean }) => {
  return (
    <div
      className={cn(
        "absolute w-4 h-4",
        isSender ? "top-0 -right-2" : "top-0 -left-2"
      )}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={isSender ? "M0,0 L24,0 L0,24 Z" : "M24,0 L24,24 L0,0 Z"}
          fill={isSender ? "#34406B" : "#21232A"}
        />
      </svg>
    </div>
  );
};
