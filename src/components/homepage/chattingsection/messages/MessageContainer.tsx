import { cn } from "@/lib/utils";
import { MessageContainerProps } from "@/types/Component.type";
import moment from "moment";
import CheckBox from "@/components/common/CheckBox";
import Message from "./Message";

function MessageContainer({
  message,
  showNewDate,
  isSender,
  isPrevMessageFromSameUser,
  isCurrentMessageSelectedForDelete,
  isCheckBoxForDelete,
  selectedMessage,
  toggleCheckBox,
  setSelectedMessage,
  isCurrentChatIsGroupChat,
}: MessageContainerProps) {
  return (
    <div className={cn("w-full px-10 transition-all duration-300")}>
      {showNewDate && <MessageDate date={message.createdAt} />}
      <div
        className={cn(
          "w-full flex items-center gap-2 transition-all duration-300",
          isCurrentMessageSelectedForDelete && "bg-primary/5 rounded-lg",
          isCheckBoxForDelete ? "translate-x-0" : "-translate-x-2rem"
        )}
        // onClick={() => toggleCheckBox(message._id, message.content)}
      >
        {isCheckBoxForDelete && (
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              isCheckBoxForDelete
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75"
            )}
          >
            <CheckBox
              checked={
                selectedMessage?.messages.some(
                  (msg) => msg._id === message._id
                ) ?? false
              }
              setChecked={() => toggleCheckBox(message._id, message.content)}
            />
          </div>
        )}
        <div
          className={cn(
            "w-full transition-all duration-300 ease-in-out",
            isCheckBoxForDelete && "ml-8"
          )}
        >
          <Message
            {...message}
            isSender={isSender}
            isSeen={true}
            isPrevMessageFromSameUser={isPrevMessageFromSameUser}
            selectedMessage={selectedMessage}
            setSelectedMessage={setSelectedMessage}
            isCurrentChatIsGroupChat={isCurrentChatIsGroupChat}
            isCheckBoxForDelete={isCheckBoxForDelete}
          />
        </div>
      </div>
    </div>
  );
}

const MessageDate = ({ date }: { date: string }) => (
  <div className="w-full flex justify-center text-gray-400 text-sm">
    <p className="border-[1px] border-primary/20 p-1 px-3 rounded-lg shadow-sm shadow-primary-foreground">
      {moment(date).format("DD MMM YYYY")}
    </p>
  </div>
);

export default MessageContainer;
