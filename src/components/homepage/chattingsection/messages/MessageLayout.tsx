import { Check, CheckCheck } from "lucide-react";
import { UserPreview } from "@/types/ApiResponse.types";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { MessageUserInteractionType } from "@/types/Common.types";
import moment from "moment";
import MessageDropdown from "./MessageDropdown";
import { useAppSelector } from "@/store/store";

interface MessageContentProps {
  inputValue: string;
  createdAt: string;
  sender: UserPreview;
  isSender: boolean;
  deletedBy: string[];
  isDeletedForAll?: boolean;
  messageDropdownOnClickFunction: (value: MessageUserInteractionType) => void;
}

interface MessageBoxProps {
  deletedBy: string[];
  isDeletedForAll?: boolean;
  inputValue: string;
  replyTo?: string;
  sender: UserPreview;
  isSender: boolean;
  createdAt: string;
  isPrevMessageFromSameUser: boolean;
  messageDropdownOnClickFunction: (value: MessageUserInteractionType) => void;
  isCurrentChatIsGroupChat: boolean;
}

const DecorativeShape = ({ isSender }: { isSender: boolean }) => {
  return (
    <div className={cn("absolute h-4 w-4", isSender ? "-right-2 top-0" : "-left-2 top-0")}>
      <svg width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d={isSender ? "M0,0 L24,0 L0,24 Z" : "M24,0 L24,24 L0,0 Z"}
          fill={isSender ? "#381D67" : "#222329"}
        />
      </svg>
    </div>
  );
};

// Sub-Components
const SenderAvatar = ({ sender }: { sender: { profilePicture: string; username: string } }) => (
  <div className="h-6 w-6 translate-y-3 overflow-hidden rounded-lg">
    <img src={sender.profilePicture} alt={sender.username} className="h-full w-full object-cover" />
  </div>
);

const ReplyMessage = ({ replyTo, senderName }: { replyTo: string; senderName: string }) => (
  <div className="rounded-lg border-l-4 border-primary bg-neutral-700/25 p-2 text-sm">
    <p className="font-bold text-primary">{senderName}</p>
    <p dangerouslySetInnerHTML={{ __html: replyTo }} />
  </div>
);

const MessageContent = ({
  inputValue,
  createdAt,
  sender,
  isSender,
  messageDropdownOnClickFunction,
  deletedBy,
  isDeletedForAll,
}: MessageContentProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const userId = user ? user._id : "";
  const isDeleted = deletedBy.includes(userId) || isDeletedForAll;
  const deletedMessageText =
    userId === sender._id
      ? "You deleted this message"
      : `${capitalizeFirstLetter(sender.username)} deleted this message`;

  return (
    <div className="flex min-w-20 items-start gap-3 px-2 pr-10">
      <p
        className="flex flex-wrap items-center gap-1 whitespace-normal break-words text-sm"
        style={{ wordBreak: "break-word" }}
        dangerouslySetInnerHTML={{
          __html: isDeleted ? deletedMessageText : inputValue,
        }}
      />

      <div className="absolute bottom-0 right-2 flex w-[60px] items-center justify-between hyphens-auto text-justify">
        <span
          className={cn("w-full text-[10px] text-muted-foreground", isSender ? "text-white" : "")}
        >
          {moment(createdAt).format("hh:mm A")}
        </span>
        <Check size={14} />
      </div>
      <MessageDropdown isSender={isSender} onClick={messageDropdownOnClickFunction} />
    </div>
  );
};

const AttachmentLoader = ({ isSender }: { isSender: boolean }) => (
  <div
    className={cn(
      "animate-pulse rounded-lg bg-primary/10 p-10",
      isSender ? "ml-auto self-end" : "mr-auto self-start"
    )}
  ></div>
);

const MessageBox = ({
  inputValue,
  replyTo,
  sender,
  isSender,
  createdAt,
  isPrevMessageFromSameUser,
  messageDropdownOnClickFunction,
  isCurrentChatIsGroupChat,
  isDeletedForAll,
  deletedBy,
}: MessageBoxProps) => {
  const { _id: userId, username } = useAppSelector((state) => state.auth.user)!;
  return (
    <div
      className={cn(
        "group relative w-fit max-w-sm space-y-1 rounded-[10px] px-1 py-2 pb-4 shadow-md",
        isSender
          ? "rounded-tr-none bg-primary/40 text-white"
          : "rounded-tl-none bg-muted-foreground/10",
        deletedBy.length > 0 && deletedBy.includes(userId) && "bg-slate-600/90"
      )}
    >
      {!isPrevMessageFromSameUser && <DecorativeShape isSender={isSender} />}
      {replyTo && <ReplyMessage replyTo={replyTo} senderName={sender.username!} />}

      {isCurrentChatIsGroupChat && (
        <p className="px-2 text-[12px] font-bold">
          {capitalizeFirstLetter(sender.username === username ? "you" : sender.username)}
        </p>
      )}

      <MessageContent
        isDeletedForAll={isDeletedForAll}
        deletedBy={deletedBy}
        inputValue={inputValue}
        createdAt={createdAt}
        sender={sender}
        isSender={isSender}
        messageDropdownOnClickFunction={messageDropdownOnClickFunction}
      />
    </div>
  );
};

export {
  SenderAvatar,
  AttachmentLoader,
  MessageBox,
  MessageContent,
  ReplyMessage,
  DecorativeShape,
};
