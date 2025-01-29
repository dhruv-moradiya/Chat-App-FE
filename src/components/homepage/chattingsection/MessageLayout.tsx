import { Check } from "lucide-react";
import { UserPreview } from "@/types/ApiResponse.types";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { MessageUserInteractionType } from "@/types/Common.types";
import moment from "moment";
import MessageDropdown from "./MessageDropdown";
import { useAppSelector } from "@/store/store";

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

// Sub-Components
const SenderAvatar = ({
  sender,
}: {
  sender: { profilePicture: string; username: string };
}) => (
  <div className="w-6 h-6 rounded-lg overflow-hidden translate-y-3">
    <img
      src={sender.profilePicture}
      alt={sender.username}
      className="w-full h-full object-cover"
    />
  </div>
);

const ReplyMessage = ({
  replyTo,
  senderName,
}: {
  replyTo: string;
  senderName: string;
}) => (
  <div className="bg-primary-foreground/30 p-2 rounded-lg text-sm border-l-4 border-primary">
    <p className="text-primary font-bold">{senderName}</p>
    <p>{replyTo}</p>
  </div>
);

const MessageContent = ({
  inputValue,
  createdAt,
  isSender,
  messageDropdownOnClickFunction,
  deletedBy,
  isDeletedForAll,
}: {
  inputValue: string;
  createdAt: string;
  isSender: boolean;
  deletedBy: string[];
  isDeletedForAll?: boolean;
  messageDropdownOnClickFunction: (value: MessageUserInteractionType) => void;
}) => {
  const userId = useAppSelector((state) => state.auth.user._id);
  return (
    <div className="flex items-start gap-3 pr-[65px] px-2">
      {(deletedBy.length > 0 && deletedBy.includes(userId)) ||
      isDeletedForAll ? (
        <p
          className="text-sm break-words whitespace-normal"
          style={{ wordBreak: "break-word" }}
        >
          You deleted this message
        </p>
      ) : (
        <p
          className="text-sm break-words whitespace-normal"
          style={{ wordBreak: "break-word" }}
        >
          {inputValue}
        </p>
      )}

      <div className="absolute bottom-1 right-2 flex items-center justify-between w-[55px]">
        <span
          className={cn(
            "text-[10px] text-muted-foreground",
            isSender ? "text-white" : ""
          )}
        >
          {moment(createdAt).format("hh:mm A")}
        </span>
        <Check size={12} />
      </div>
      <MessageDropdown
        isSender={isSender}
        onClick={messageDropdownOnClickFunction}
      />
    </div>
  );
};

const AttachmentLoader = ({ isSender }: { isSender: boolean }) => (
  <div
    className={cn(
      "animate-pulse rounded-lg bg-primary/10 p-10",
      isSender ? "self-end ml-auto" : "self-start mr-auto"
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
}: {
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
}) => {
  const userId = useAppSelector((state) => state.auth.user._id);
  return (
    <div
      className={cn(
        "relative w-fit max-w-sm px-1 py-2 pr-[70px]1 rounded-[10px] shadow-md group space-y-1",
        isSender
          ? "bg-primary/40 text-white rounded-tr-none"
          : "bg-muted-foreground/10 rounded-tl-none",
        deletedBy.length > 0 && deletedBy.includes(userId) && "bg-slate-600/90"
      )}
    >
      {!isPrevMessageFromSameUser && <DecorativeShape isSender={isSender} />}
      {replyTo && (
        <ReplyMessage replyTo={replyTo} senderName={sender.username!} />
      )}

      {isCurrentChatIsGroupChat && (
        <p className="text-[13px] px-2">
          {capitalizeFirstLetter(sender.username)}
        </p>
      )}

      <MessageContent
        isDeletedForAll={isDeletedForAll}
        deletedBy={deletedBy}
        inputValue={inputValue}
        createdAt={createdAt}
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
