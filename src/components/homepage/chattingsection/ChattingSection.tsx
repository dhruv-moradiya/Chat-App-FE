import CustomInput from "@/components/common/cutomInput/CustomInput";
import { useAppSelector } from "@/store/store";
import { Loader } from "lucide-react";
import React from "react";
import { useSearchParams } from "react-router-dom";
import SkeletonLoader from "./ChatSkeletonLoader ";
import Header from "./Header";
import Message from "./Message";
import NoChatSelected from "./NoChatSelected";
import moment from "moment";

const ChattingSection = () => {
  const params = useSearchParams();
  const paramValue = params[0].get("chatId");

  const { activeChatDetails, isLoading } = useAppSelector(
    (state) => state.activeChat
  );
  const { user } = useAppSelector((state) => state.auth);

  if (!paramValue) return <NoChatSelected />;

  if (isLoading) return <Loader />;

  return (
    <div className=" h-full flex flex-col w-[calc(100%-384px)] relative">
      <Header />
      <div className="scrollbar w-full h-[calc(100%-180px)] px-2 overflow-y-scroll flex flex-col items-center gap-2 mb-2">
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
                  key={index}
                  {...message}
                  isSender={isSender}
                  isSeen={true}
                  isPrevMessageFromSameUser={isPrevMessageFromSameUser}
                />
              </React.Fragment>
            );
          })}
        <SkeletonLoader numberOfSkeletons={12} />
      </div>
      <CustomInput />
    </div>
  );
};

export default ChattingSection;
