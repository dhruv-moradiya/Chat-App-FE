import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import MessageDropdown from "./MessageDropdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/types/ApiResponse.types";
import moment from "moment";

interface MessageProps extends ChatMessage {
  isSeen: boolean;
  isSender: boolean;
  isPrevMessageFromSameUser: boolean;
  setReplyedMessage: React.Dispatch<React.SetStateAction<string | null>>;
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
  isSeen,
  attachments,
  isPrevMessageFromSameUser,
  setReplyedMessage,
}: MessageProps) => {
  const [inputValue, setInputValue] = useState(content);

  const messageDropdownOnClickFunction = (
    value: "Reply" | "React" | "Star" | "Pin" | "Delete"
  ) => {
    switch (value) {
      case "Reply":
        setReplyedMessage(_id);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div
        className={cn(
          "grid gap-2",
          isSender ? "ml-auto" : "mr-auto",
          attachments.length >= 2 ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        {/* {renderAttachments()} */}
      </div>
      {/* <RenderAttachments attachments={attachments} isSender={isSender} /> */}
      <div
        className={cn(
          "relative w-fit max-w-sm px-4 py-2 pr-[70px] rounded-xl shadow-md group",
          isSender
            ? "bg-primary/40 text-white self-end rounded-tr-none"
            : "bg-muted-foreground/10 self-start rounded-tl-none"
        )}
      >
        {/* Decorative Shape */}
        {!isPrevMessageFromSameUser && <DecorativeShape isSender={isSender} />}

        <div className="flex items-start gap-3">
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
            setReplyedMessage={setReplyedMessage}
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

const RenderAttachments = ({
  attachments,
  isSender,
}: {
  attachments: string[];
  isSender: boolean;
}) => {
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
              src={attachment}
              alt={`attachment-${index + 1}`}
              className="w-full h-full object-contain rounded-3xl"
            />
          </div>
        ))}
      </ScrollArea>
    </DialogContent>
  );

  const attachmentElements = visibleAttachments.map((attachmentUrl, index) => (
    <Dialog key={index}>
      <DialogTrigger>
        <div className="w-20 h-20 overflow-hidden rounded-lg flex items-center gap-2 cursor-pointer">
          <img
            src={attachmentUrl}
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
