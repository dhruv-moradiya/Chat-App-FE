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
    <div className={cn("w-full px-1 md:px-10")}>
      {showNewDate && <MessageDate date={message.createdAt} />}
      <div
        className={cn(
          "flex items-center gap-2",
          isCurrentMessageSelectedForDelete && "rounded-lg bg-primary/5",
          isCheckBoxForDelete ? "translate-x-0" : "-translate-x-2rem"
        )}
        // onClick={() => toggleCheckBox(message._id, message.content)}
      >
        {isCheckBoxForDelete && (
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              isCheckBoxForDelete ? "scale-100 opacity-100" : "scale-75 opacity-0"
            )}
          >
            <CheckBox
              checked={selectedMessage?.messages.some((msg) => msg._id === message._id) ?? false}
              setChecked={() => toggleCheckBox(message._id, message.content)}
            />
          </div>
        )}
        <div
          className={cn(
            "w-full transition-all duration-300 ease-in-out",
            isCheckBoxForDelete && "ml-2 md:ml-8"
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
  <div className="my-2 flex w-full justify-center text-xs text-gray-400 md:text-sm">
    <p className="rounded-lg border-[1px] border-primary/20 p-1 px-3">
      {moment(date).format("DD MMM YYYY")}
    </p>
  </div>
);

export default MessageContainer;
