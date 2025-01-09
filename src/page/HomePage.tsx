import ChattingSection from "@/components/homepage/chattingsection/ChattingSection";
import Sidebar from "@/components/homepage/Sidebar";
import { setCurrentActiveChat } from "@/store/myChats/ChatSlice";
import { createConnection, disconnected } from "@/store/socket/SocketSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const HomePage = () => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { myChats } = useAppSelector((state) => state.myChats);
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
    console.log("Previous paramValue:", prevParamValue.current);

    if (prevParamValue.current && prevParamValue.current !== paramValue) {
    }

    if (paramValue) {
      dispatch(
        setCurrentActiveChat({
          chatId: paramValue,
          userData: {
            _id: user._id,
            username: user.username,
          },
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
