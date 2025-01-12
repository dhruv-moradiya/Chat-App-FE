import CustomInput from "@/components/common/cutomInput/CustomInput";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Loader } from "lucide-react";
import React, { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";
import Message from "./Message";
import NoChatSelected from "./NoChatSelected";
import moment from "moment";
import { fetchOldActiveChatMessages } from "@/store/activeChat/ActiveChatThunk";

const ChattingSection = () => {
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const paramValue = params[0].get("chatId");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const { activeChatId, activeChatDetails, isLoading, isLoadingOldMessages } =
    useAppSelector((state) => state.activeChat);
  const { user } = useAppSelector((state) => state.auth);

  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;

    if (!isLoadingOldMessages && container && container.scrollTop === 0) {
      console.log("Reached the top of the chat. Fetching older messages...");
      if (
        activeChatDetails &&
        activeChatDetails.currentPage + 1 <= activeChatDetails.totalPages
      ) {
        dispatch(
          fetchOldActiveChatMessages({
            chatId: activeChatId as string,
            page: activeChatDetails?.currentPage + 1,
            limit: 20,
          })
        );
      }
    }
  }, [activeChatDetails]);

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
  }, [handleScroll, activeChatDetails]);

  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [activeChatDetails]);

  if (!paramValue) return <NoChatSelected />;

  if (isLoading) return <Loader />;

  console.log("activeChatDetails.messages :>> ", activeChatDetails?.messages);

  return (
    <div className=" h-full flex flex-col w-[calc(100%-384px)] relative">
      <Header />
      <div
        className="scrollbar w-full h-[calc(100%-180px)] px-2 overflow-y-scroll flex flex-col items-center gap-2 mb-2"
        ref={chatContainerRef}
      >
        {activeChatDetails &&
          activeChatDetails.messages.map((message, index) => {
            const isNewDate =
              index === 0 ||
              moment(message.createdAt).format("DD-MM-YYYY") !==
                moment(activeChatDetails.messages[index - 1]?.createdAt).format(
                  "DD-MM-YYYY"
                );

            const isSender = message.sender === user?._id;

            const isPrevMessageFromSameUser =
              index > 0 &&
              activeChatDetails.messages[index - 1].sender === message.sender;
            return (
              <React.Fragment key={index}>
                {isNewDate && (
                  <div className="w-full flex justify-center text-sm text-muted-foreground">
                    <p>{moment(message.createdAt).format("DD MMM YYYY")}</p>
                  </div>
                )}
                <Message
                  key={message._id}
                  {...message}
                  isSender={isSender}
                  isSeen={true}
                  isPrevMessageFromSameUser={isPrevMessageFromSameUser}
                />
              </React.Fragment>
            );
          })}
        {/* <SkeletonLoader numberOfSkeletons={12} /> */}
      </div>
      <CustomInput />
    </div>
  );
};

export default ChattingSection;
