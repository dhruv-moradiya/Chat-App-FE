import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/store";
import { useSearchParams } from "react-router-dom";
import { setActiveChat } from "@/store/activeChat/ActiveChatSlice";
import { createConnection, disconnected } from "@/store/socket/SocketSlice";
import { fetchActiveChatMessages } from "@/store/activeChat/ActiveChatThunk";
import Sidebar from "@/components/homepage/Sidebar";
import ChattingSection from "@/components/homepage/chattingsection/ChattingSection";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("chatId");
  const prevParamValue = useRef<string | null>(null);

  useEffect(() => {
    dispatch(createConnection());
    return () => {
      dispatch(disconnected());
    };
  }, []);

  useEffect(() => {
    if (prevParamValue.current && prevParamValue.current !== paramValue) {
    }

    if (paramValue) {
      dispatch(
        fetchActiveChatMessages({ chatId: paramValue, page: 1, limit: 20 })
      );
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
    <div className="w-full h-full flex gap-2">
      <Sidebar />
      <ChattingSection />
    </div>
  );
};
export default HomePage;
