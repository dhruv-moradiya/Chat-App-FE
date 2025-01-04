import ChattingSection from "@/components/homepage/chattingsection/ChattingSection";
import Sidebar from "@/components/homepage/Sidebar";
import { createConnection, disconnected } from "@/store/socket/SocketSlice";
import { useAppDispatch } from "@/store/store";
import { useEffect } from "react";

const HomePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(createConnection());

    return () => {
      dispatch(disconnected());
    };
  }, []);

  return (
    <div className="w-full h-full flex gap-2">
      <Sidebar />
      <ChattingSection />
    </div>
  );
};

export default HomePage;
