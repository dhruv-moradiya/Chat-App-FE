import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchOldActiveChatMessages } from "@/store/activeChat/ActiveChatThunk";
import moment from "moment";
import Header from "./Header";
import Message from "./Message";
import NoChatSelected from "./NoChatSelected";
import CustomInput from "@/components/common/cutomInput/CustomInput";
import { SelectedMessageType } from "@/types/Common.types";
import Modal from "@/components/ui/Modal";
import SkeletonLoader from "./ChatSkeletonLoader ";

const ChattingSection = () => {
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const paramValue = params[0].get("chatId");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [selectedMessage, setSelectedMessage] =
    useState<SelectedMessageType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [activeChatDetails]);

  const renderMessages = useCallback(() => {
    if (isLoading) return <SkeletonLoader numberOfSkeletons={12} />;

    return (
      <>
        {activeChatDetails?.messages.map((message, index) => {
          const isNewDate =
            index === 0 ||
            moment(message.createdAt).format("DD-MM-YYYY") !==
              moment(activeChatDetails.messages[index - 1]?.createdAt).format(
                "DD-MM-YYYY"
              );
          const isSender = message.sender._id === user?._id;
          const isPrevMessageFromSameUser =
            index > 0 &&
            activeChatDetails.messages[index - 1].sender._id ===
              message.sender._id;

          return (
            <React.Fragment key={message._id}>
              {isNewDate && (
                <div className="w-full flex justify-center text-sm text-muted-foreground">
                  <p>{moment(message.createdAt).format("DD MMM YYYY")}</p>
                </div>
              )}
              <Message
                {...message}
                isSender={isSender}
                isSeen={true}
                isPrevMessageFromSameUser={isPrevMessageFromSameUser}
                setSelectedMessage={setSelectedMessage}
                isCurrentChatIsGroupChat={isCurrentChatIsGroupChat}
              />
            </React.Fragment>
          );
        })}
      </>
    );
  }, [activeChatDetails, isLoading, user?._id]);

  if (!paramValue) return <NoChatSelected />;

  return (
    <div className="flex flex-col w-[calc(100%-384px)] relative mb-5">
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
      {/* <button
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
        onClick={toggleModal}
      >
        Open Modal
      </button> */}
      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        closeOnOutsideClick={true}
        backgroundStyle="blur"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Custom Modal Content</h2>
          <p className="mb-4">
            This is dynamic content passed as children to the modal.
          </p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={toggleModal}
          >
            Close Modal
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ChattingSection;
