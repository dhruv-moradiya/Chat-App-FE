import { isNewDate } from "@/lib/utils";
import data from "../../../messages.json";
import { useAppSelector } from "@/store/store";
import { SelectedMessagesForInteraction } from "@/types/Common.types";
import MessageContainer from "@/components/homepage/chattingsection/messages/MessageContainer";
import { useState } from "react";

const ChatScreenMobile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedMessage, setSelectedMessage] =
    useState<SelectedMessagesForInteraction | null>(null);
  return (
    <div className="w-full h-full overflow-y-auto scrollbar flex flex-col gap-1 px-2">
      {data.map((message, index) => {
        const prevMessage = data[index - 1];
        const showNewDate = isNewDate(data, index);
        const isSender = message.sender._id === user?._id;
        const isPrevMessageFromSameUser =
          prevMessage?.sender._id === message.sender._id && !showNewDate;
        const isCurrentMessageSelectedForDelete = selectedMessage
          ? selectedMessage.messages.find((msg) => msg._id === message._id) &&
            selectedMessage.type === "Delete"
          : false;

        return (
          <MessageContainer
            key={message._id}
            message={message}
            showNewDate={showNewDate}
            isSender={isSender}
            isPrevMessageFromSameUser={isPrevMessageFromSameUser}
            isCurrentMessageSelectedForDelete={
              isCurrentMessageSelectedForDelete ?? false
            }
            isCheckBoxForDelete={false}
            selectedMessage={selectedMessage}
            toggleCheckBox={() => {}}
            setSelectedMessage={setSelectedMessage}
            isCurrentChatIsGroupChat={false}
          />
        );
      })}
    </div>
  );
};

export default ChatScreenMobile;
