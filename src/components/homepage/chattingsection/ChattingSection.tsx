import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
import { cn, isNewDate } from "@/lib/utils";
import { ModalType } from "@/lib/constants";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { openModal } from "@/store/chatDetailSidebar/ChatDetailSlice";
import { InteractedMessage, SelectedMessagesForInteraction } from "@/types/Common.types";
import Header from "./Header";
import NoChatSelected from "./NoChatSelected";
import SkeletonLoader from "./ChatSkeletonLoader ";
import MessageContainer from "./messages/MessageContainer";
import CustomInput from "@/components/common/customInput/CustomInput";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { ChatMessagesSummary } from "@/types/ApiResponse.types";

const ChattingSection = () => {
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const paramValue = params[0].get("chatId");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatList = useAppSelector((state) => state.myChats.myChats);
  const { user } = useAppSelector((state) => state.auth);
  const { activeChatId, activeChatDetails, isLoading, isLoadingOldMessages } = useAppSelector(
    (state) => state.activeChat
  );
  const isCurrentChatIsGroupChat =
    chatList.find((chat) => chat._id === activeChatId)?.isGroup ?? false;

  // Message selection for delete, reply etc
  const [selectedMessage, setSelectedMessage] = useState<SelectedMessagesForInteraction | null>(
    null
  );
  // For deleting multiple message selection
  const [isCheckBoxForDelete, setIsCheckBoxForDelete] = useState(false);
  // For selected message is current user's message
  const [isSelectedAllMessageFromCurrentUserSide, setIsSelectedAllMessageFromCurrentUserSide] =
    useState(false);

  useInfiniteScroll(
    activeChatId as string,
    activeChatDetails as ChatMessagesSummary,
    chatContainerRef
  );

  useEffect(() => {
    if (!isLoadingOldMessages && chatContainerRef.current && activeChatDetails?.currentPage === 1) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeChatDetails, isLoadingOldMessages]);

  useEffect(() => {
    const hasDeleteType = selectedMessage?.type === "Delete";

    const selectedMessageSenders =
      selectedMessage &&
      selectedMessage.messages.map((message) => {
        const findMessage = activeChatDetails?.messages.find((m) => m._id === message._id);
        return {
          ...findMessage?.sender,
        };
      });

    const allSenderIsCurrentUser =
      selectedMessageSenders && user
        ? selectedMessageSenders.every((sender) => sender?._id === user._id)
        : false;

    setIsSelectedAllMessageFromCurrentUserSide(allSenderIsCurrentUser && !!hasDeleteType);
    setIsCheckBoxForDelete(!!hasDeleteType);
  }, [selectedMessage, user?._id]);

  const toggleCheckBox = (id: string, content: string) => {
    // If message is already selected for delete than remove it
    const index = selectedMessage
      ? selectedMessage.messages.findIndex((message) => message._id === id)
      : -1;
    if (index > -1) {
      const copy = [...selectedMessage!.messages];
      copy.splice(index, 1);
      setSelectedMessage({ ...selectedMessage!, messages: copy });
    } else {
      // If message is not selected for delete than add it
      const newSelectedMessage: InteractedMessage = {
        _id: id,
        content,
      };

      setSelectedMessage((prev) => {
        if (!prev) return { messages: [newSelectedMessage], type: "Delete" };
        return {
          messages: [...prev.messages, newSelectedMessage],
          type: "Delete",
        };
      });
    }
  };

  const renderMessages = useCallback(() => {
    if (isLoading) return <SkeletonLoader numberOfSkeletons={20} />;

    const messages = activeChatDetails?.messages || [];

    return (
      <>
        {isLoadingOldMessages && <p className="w-full text-start text-sm">Loading....</p>}
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
              isCheckBoxForDelete={isCheckBoxForDelete}
              selectedMessage={selectedMessage}
              toggleCheckBox={toggleCheckBox}
              setSelectedMessage={setSelectedMessage}
              isCurrentChatIsGroupChat={isCurrentChatIsGroupChat}
            />
          );
        })}
      </>
    );
  }, [
    isLoading,
    isLoadingOldMessages,
    activeChatDetails?.messages,
    user?._id,
    selectedMessage,
    isCheckBoxForDelete,
    toggleCheckBox,
    setSelectedMessage,
    isCurrentChatIsGroupChat,
  ]);

  if (!paramValue) return <NoChatSelected />;

  return (
    <div className="relative mb-5 flex w-full flex-col md:w-[calc(100%-384px)]">
      <Header />
      <div
        className="scrollbar mb-2 flex w-full flex-grow flex-col items-center gap-2 overflow-y-scroll px-2"
        ref={chatContainerRef}
      >
        {renderMessages()}
      </div>
      <CustomInput selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} />

      <div
        className={cn(
          "absolute bottom-0 flex h-0 w-full items-center justify-between gap-4 overflow-hidden bg-primary-foreground transition-all duration-200",
          isCheckBoxForDelete ? "h-auto px-4 py-5 opacity-100" : "opacity-0"
        )}
      >
        <X
          onClick={() => {
            setIsCheckBoxForDelete(false);
            setSelectedMessage(null);
          }}
        />
        <p className="flex-grow">
          {selectedMessage ? selectedMessage.messages.length : 0} Message Selected
        </p>
        <Trash2
          size={18}
          onClick={() =>
            dispatch(
              openModal({
                type: ModalType.DELETE_MODEL,
                props: {
                  selectedMessage: selectedMessage?.messages.map((msg) => msg._id),
                  isSelectedAllMessageFromCurrentUserSide,
                  setSelectedMessage,
                },
              })
            )
          }
        />
      </div>
    </div>
  );
};

export default ChattingSection;
