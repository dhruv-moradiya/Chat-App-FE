import { deleteMessageForSelectedParticipantsApi } from "@/api";
import CheckBox from "@/components/common/CheckBox";
import CustomInput from "@/components/common/cutomInput/CustomInput";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { cn, isNewDate } from "@/lib/utils";
import { fetchOldActiveChatMessages } from "@/store/activeChat/ActiveChatThunk";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ChatMessage } from "@/types/ApiResponse.types";
import { SelectedMessageType } from "@/types/Common.types";
import { AxiosError } from "axios";
import { Trash2, X } from "lucide-react";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SkeletonLoader from "./ChatSkeletonLoader ";
import Header from "./Header";
import Message from "./Message";
import NoChatSelected from "./NoChatSelected";

const ChattingSection = () => {
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const paramValue = params[0].get("chatId");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [selectedMessage, setSelectedMessage] = useState<
    SelectedMessageType[] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckBoxForDelete, setIsCheckBoxForDelete] = useState(false);
  const [
    isSelectedAllMessageFromCurrentUserSide,
    setIsSelectedAllMessageFromCurrentUserSide,
  ] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const { activeChatId, activeChatDetails, isLoading, isLoadingOldMessages } =
    useAppSelector((state) => state.activeChat);
  const chatList = useAppSelector((state) => state.myChats.myChats);
  const isCurrentChatIsGroupChat =
    chatList.find((chat) => chat._id === activeChatId)?.isGroup ?? false;

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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

  console.log("Re-rendering Chatting Section");

  useEffect(() => {
    const hasDeleteType = selectedMessage?.some(
      (message) => message.type === "Delete"
    );

    const allSenders = selectedMessage?.map((message) => {
      const findMessage = activeChatDetails?.messages.find(
        (m) => m._id === message._id
      );
      return {
        ...findMessage?.sender,
      };
    });

    const allSenderIsCurrentUser = allSenders
      ? allSenders.every((sender) => sender?._id === user._id)
      : false;

    setIsSelectedAllMessageFromCurrentUserSide(
      allSenderIsCurrentUser && !!hasDeleteType
    );
    setIsCheckBoxForDelete(!!hasDeleteType);
  }, [selectedMessage, user._id]);

  const toggleCheckBox = (id: string, content: string) => {
    const index = selectedMessage?.findIndex((message) => message._id === id)!;
    if (index > -1) {
      setSelectedMessage((prev) => {
        if (!prev) return prev;
        const copy = [...prev];
        copy.splice(index, 1);
        return copy.length > 0 ? copy : null;
      });
    } else {
      setSelectedMessage((prev) => {
        if (!prev) return [{ _id: id, type: "Delete", content }];
        return [...prev, { _id: id, type: "Delete", content }];
      });
    }
  };

  const deleteMessageForSelectedParticipants = async (
    isDeletedForAll: boolean
  ) => {
    const messageId = selectedMessage?.map((message) => message._id);

    try {
      await deleteMessageForSelectedParticipantsApi(
        messageId!,
        isDeletedForAll
      );

      setSelectedMessage(null);
      setIsModalOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("error.response?.data :>> ", error.response?.data.message);
      } else {
        console.log(
          "An unknown error occurred while accepting friend request :>> ",
          error
        );
      }
    }
  };

  const renderMessages = useCallback(() => {
    if (isLoading) return <SkeletonLoader numberOfSkeletons={20} />;

    return (
      <>
        {isLoadingOldMessages && (
          <p className="w-full text-start text-sm">Loading....</p>
        )}
        {activeChatDetails?.messages.map((message, index) => {
          const showNewDate = isNewDate(activeChatDetails?.messages, index);
          const isSender = message.sender._id === user?._id;
          const isPrevMessageFromSameUser =
            index > 0 &&
            activeChatDetails?.messages[index - 1]?.sender._id ===
              message.sender._id;
          const isCurrentMessageSelectedForDelete =
            selectedMessage?.find((msg) => msg._id === message._id)?.type ===
            "Delete";

          return (
            <MessageContainer
              key={message._id}
              message={message}
              showNewDate={showNewDate}
              isSender={isSender}
              isPrevMessageFromSameUser={isPrevMessageFromSameUser}
              isCurrentMessageSelectedForDelete={
                isCurrentMessageSelectedForDelete
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
    activeChatDetails,
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
        <p className="flex-grow">{selectedMessage?.length} Message Selected</p>
        <Trash2 size={18} onClick={() => setIsModalOpen(true)} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        closeOnOutsideClick={true}
        backgroundStyle="transparent"
      >
        <div className="flex flex-col gap-4 min-w-96">
          <p className="text-md mb-4">Delete Message?</p>
          <div
            className={cn(
              "self-end flex flex-row items-end gap-4",
              isSelectedAllMessageFromCurrentUserSide ? "flex-col" : "flex-row"
            )}
          >
            {isSelectedAllMessageFromCurrentUserSide && (
              <Button
                variant="outline"
                onClick={() => deleteMessageForSelectedParticipants(true)}
              >
                Delete for everyone
              </Button>
            )}
            <Button
              variant="outline"
              className={cn(
                !isSelectedAllMessageFromCurrentUserSide &&
                  "bg-primary/80 text-black/80 hover:bg-primary/90"
              )}
              onClick={() => deleteMessageForSelectedParticipants(false)}
            >
              Delete for me
            </Button>

            <Button variant="outline" onClick={toggleModal}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChattingSection;

const MessageDate = ({ date }: { date: string }) => (
  <div className="w-full flex justify-center text-sm text-muted-foreground">
    <p>{moment(date).format("DD MMM YYYY")}</p>
  </div>
);

interface MessageContainerProps {
  message: ChatMessage;
  showNewDate: boolean;
  isSender: boolean;
  isPrevMessageFromSameUser: boolean;
  isCurrentMessageSelectedForDelete: boolean;
  isCheckBoxForDelete: boolean;
  selectedMessage: SelectedMessageType[] | null;
  toggleCheckBox: (id: string, content: string) => void;
  setSelectedMessage: React.Dispatch<
    React.SetStateAction<SelectedMessageType[] | null>
  >;
  isCurrentChatIsGroupChat: boolean;
}

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
                selectedMessage?.some((msg) => msg._id === message._id) ?? false
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
