import ChattingSection from "@/components/homepage/chattingsection/ChattingSection";
import Sidebar from "@/components/homepage/Sidebar";
import { setCurrentActiveChat } from "@/store/myChats/ChatSlice";
import { createConnection, disconnected } from "@/store/socket/SocketSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { myChats } = useAppSelector((state) => state.myChats);
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("chatId");

  useEffect(() => {
    dispatch(createConnection());

    return () => {
      dispatch(disconnected());
    };
  }, []);

  useEffect(() => {
    if (paramValue) {
      const participants =
        myChats.find((chat) => chat._id === paramValue)?.participants || [];
      console.log("participants :>> ", participants);
      dispatch(
        setCurrentActiveChat({
          chatId: paramValue,
          participants: participants?.length < 0 ? [] : participants,
        })
      );
    }
  }, [paramValue]);

  return (
    <div className="w-full h-full flex gap-2">
      <Sidebar />
      <ChattingSection />
    </div>
  );
};

export default HomePage;
