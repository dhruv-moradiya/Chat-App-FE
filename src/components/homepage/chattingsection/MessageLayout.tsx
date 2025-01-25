import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { Check } from "lucide-react";
import moment from "moment";

const MessageHeader = ({
  senderName,
  isSender,
}: {
  senderName: string;
  isSender: boolean;
}) => (
  <div className="px-2">
    <p className="text-[12px] text-secondary">
      {isSender ? "You" : capitalizeFirstLetter(senderName)}
    </p>
  </div>
);

const ReplyPreview = ({
  senderName,
  content,
}: {
  senderName: string;
  content: string;
}) => (
  <div className="bg-primary-foreground/30 p-2 rounded-lg text-sm border-l-4 border-primary">
    <p className="text-primary font-bold">
      {capitalizeFirstLetter(senderName)}
    </p>
    <p>{content}</p>
  </div>
);

const MessageFooter = ({
  createdAt,
  isSender,
  isSeen,
}: {
  createdAt: string;
  isSender: boolean;
  isSeen: boolean;
}) => (
  <div className="absolute bottom-1 right-2 flex items-center justify-between w-[55px]">
    <span
      className={cn(
        "text-[10px] text-muted-foreground",
        isSender ? "text-white" : ""
      )}
    >
      {moment(createdAt).format("hh:mm A")}
    </span>
    <span>
      <Check size={12} className={cn(isSeen ? "text-white" : "text-primary")} />
    </span>
  </div>
);

const OneOnOneChatMessage = ({ isSender }: { isSender: boolean }) => {
  return <div></div>;
};

const OneOnOneChatMessageWithAttachment = () => {};

const GroupChatMessage = () => {};

const GroupChatMessageWithAttachment = () => {};

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

export {
  OneOnOneChatMessage,
  OneOnOneChatMessageWithAttachment,
  GroupChatMessage,
  GroupChatMessageWithAttachment,
};
