import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
import { cn, isNewDate } from "@/lib/utils";
import { ModalType } from "@/lib/constants";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchOldActiveChatMessages } from "@/store/activeChat/ActiveChatThunk";
import { openModal } from "@/store/chatDetailSidebar/ChatDetailSlice";
import {
  InteractedMessage,
  SelectedMessagesForInteraction,
} from "@/types/Common.types";
import Header from "./Header";
import NoChatSelected from "./NoChatSelected";
import SkeletonLoader from "./ChatSkeletonLoader ";
import MessageContainer from "./messages/MessageContainer";
import CustomInput from "@/components/common/customInput/CustomInput";

const ChattingSection = () => {
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const paramValue = params[0].get("chatId");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatList = useAppSelector((state) => state.myChats.myChats);
  const { user } = useAppSelector((state) => state.auth);
  const { activeChatId, activeChatDetails, isLoading, isLoadingOldMessages } =
    useAppSelector((state) => state.activeChat);
  const isCurrentChatIsGroupChat =
    chatList.find((chat) => chat._id === activeChatId)?.isGroup ?? false;

  // Message selection for delete, reply etc
  const [selectedMessage, setSelectedMessage] =
    useState<SelectedMessagesForInteraction | null>(null);
  // For deleting multiple message selection
  const [isCheckBoxForDelete, setIsCheckBoxForDelete] = useState(false);
  // For selected message is current user's message
  const [
    isSelectedAllMessageFromCurrentUserSide,
    setIsSelectedAllMessageFromCurrentUserSide,
  ] = useState(false);

  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;

    if (!isLoadingOldMessages && container && container.scrollTop === 0) {
      if (
        activeChatDetails &&
        activeChatDetails.currentPage + 1 <= activeChatDetails.totalPages
      ) {
        dispatch(
          fetchOldActiveChatMessages({
            chatId: activeChatId as string,
            page: activeChatDetails.currentPage + 1,
            limit: 20,
          })
        );
      }
    }
  }, [activeChatDetails, activeChatId, dispatch, isLoadingOldMessages]);

  useEffect(() => {
    const container = chatContainerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (
      !isLoadingOldMessages &&
      chatContainerRef.current &&
      activeChatDetails?.currentPage === 1
    ) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [activeChatDetails, isLoadingOldMessages]);

  useEffect(() => {
    const hasDeleteType = selectedMessage?.type === "Delete";

    const selectedMessageSenders =
      selectedMessage &&
      selectedMessage.messages.map((message) => {
        const findMessage = activeChatDetails?.messages.find(
          (m) => m._id === message._id
        );
        return {
          ...findMessage?.sender,
        };
      });

    const allSenderIsCurrentUser = selectedMessageSenders
      ? selectedMessageSenders.every((sender) => sender?._id === user._id)
      : false;

    setIsSelectedAllMessageFromCurrentUserSide(
      allSenderIsCurrentUser && !!hasDeleteType
    );
    setIsCheckBoxForDelete(!!hasDeleteType);
  }, [selectedMessage, user._id]);

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
        {isLoadingOldMessages && (
          <p className="w-full text-start text-sm">Loading....</p>
        )}
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
              isCurrentMessageSelectedForDelete={
                isCurrentMessageSelectedForDelete ?? false
              }
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
    <div className="flex flex-col w-full md:w-[calc(100%-384px)] relative mb-5">
      <Header />
      <div
        className="scrollbar flex-grow w-full px-2 overflow-y-scroll flex flex-col items-center gap-2 mb-2"
        ref={chatContainerRef}
      >
        {renderMessages()}
      </div>
      <CustomInput
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
      />

      <div
        className={cn(
          "h-0 overflow-hidden w-full absolute bottom-0 bg-primary-foreground flex items-center justify-between gap-4 transition-all duration-200",
          isCheckBoxForDelete ? "opacity-100 h-auto px-4 py-5" : "opacity-0"
        )}
      >
        <X
          onClick={() => {
            setIsCheckBoxForDelete(false);
            setSelectedMessage(null);
          }}
        />
        <p className="flex-grow">
          {selectedMessage ? selectedMessage.messages.length : 0} Message
          Selected
        </p>
        <Trash2
          size={18}
          onClick={() =>
            dispatch(
              openModal({
                type: ModalType.DELETE_MODEL,
                props: {
                  selectedMessage: selectedMessage?.messages.map(
                    (msg) => msg._id
                  ),
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
