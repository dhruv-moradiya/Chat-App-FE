import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { emojiCategories } from "@/lib/constants";
import { useSearchParams } from "react-router-dom";
import { fetchEmojisByCategory } from "@/store/emoji/EmojiThunk";
import { setActiveChat } from "@/store/activeChat/ActiveChatSlice";
import { createConnection, disconnected } from "@/store/socket/SocketSlice";
import { fetchActiveChatMessages } from "@/store/activeChat/ActiveChatThunk";
import Sidebar from "@/components/homepage/Sidebar";
import ChattingSection from "@/components/homepage/chattingsection/ChattingSection";
import { fetchAllNotifications } from "@/store/notifications/NotificationSlice";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("chatId");
  const prevParamValue = useRef<string | null>(null);

  useEffect(() => {
    dispatch(createConnection());

    dispatch(fetchAllNotifications());

    // emojiCategories.forEach((category) => {
    //   dispatch(fetchEmojisByCategory(category));
    // });

    return () => {
      dispatch(disconnected());
    };
  }, []);

  useEffect(() => {
    if (paramValue) {
      dispatch(fetchActiveChatMessages({ chatId: paramValue, page: 1, limit: 20 }));
      dispatch(
        setActiveChat({
          activeChatId: paramValue,
          prevChatId: prevParamValue.current,
        })
      );
    }
    prevParamValue.current = paramValue;
  }, [paramValue]);

  return (
    <div className="flex h-full w-full gap-2">
      <Sidebar />
      <ChattingSection />
    </div>
  );
};
export default HomePage;
