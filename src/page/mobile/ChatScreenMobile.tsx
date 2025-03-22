import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { isNewDate } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ChatMessagesSummary } from "@/types/ApiResponse.types";
import { setActiveChat } from "@/store/activeChat/ActiveChatSlice";
import { SelectedMessagesForInteraction } from "@/types/Common.types";
import { fetchActiveChatMessages } from "@/store/activeChat/ActiveChatThunk";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import MessageContainer from "@/components/homepage/chattingsection/messages/MessageContainer";

const ChatScreenMobile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { chatId } = useParams();
  const dispatch = useAppDispatch();
  const chatList = useAppSelector((state) => state.myChats.myChats);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<SelectedMessagesForInteraction | null>(
    null
  );
  const { activeChatId, activeChatDetails, isLoading, isLoadingOldMessages } = useAppSelector(
    (state) => state.activeChat
  );
  const isCurrentChatIsGroupChat =
    chatList.find((chat) => chat._id === activeChatId)?.isGroup ?? false;

  useInfiniteScroll(
    activeChatId as string,
    activeChatDetails as ChatMessagesSummary,
    chatContainerRef
  );

  useEffect(() => {
    if (chatId) {
      dispatch(fetchActiveChatMessages({ chatId: chatId, page: 1, limit: 20 }));
      dispatch(
        setActiveChat({
          activeChatId: chatId,
          prevChatId: chatId,
        })
      );
    }
  }, [chatId]);

  useEffect(() => {
    if (!isLoadingOldMessages && chatContainerRef.current && activeChatDetails?.currentPage === 1) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeChatDetails, isLoadingOldMessages]);

  const messages = activeChatDetails?.messages || [];

  return (
    <>
      <div
        ref={chatContainerRef}
        className="scrollbar flex h-full w-full flex-col gap-1 overflow-y-auto px-2"
      >
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const showNewDate = isNewDate(messages, index);
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
              isCurrentMessageSelectedForDelete={isCurrentMessageSelectedForDelete ?? false}
              isCheckBoxForDelete={false}
              selectedMessage={selectedMessage}
              toggleCheckBox={() => {}}
              setSelectedMessage={setSelectedMessage}
              isCurrentChatIsGroupChat={false}
            />
          );
        })}
      </div>
      {/* <CustomInput /> */}
    </>
  );
};

export default ChatScreenMobile;
