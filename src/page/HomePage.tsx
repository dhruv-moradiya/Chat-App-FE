import ChattingSection from "@/components/homepage/chattingsection/ChattingSection";
import Sidebar from "@/components/homepage/Sidebar";
import { Button } from "@/components/ui/button";
import { connected } from "@/store/socket/SocketSlice";
import { useAppDispatch } from "@/store/store";
import { useEffect } from "react";
import { io } from "socket.io-client";

const HomePage = () => {
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   console.log("USE EFFECT");
  //   dispatch(connected());
  // }, []);

  return (
    <div className="w-full h-full flex gap-2">
      <Button
        onClick={() => {
          console.log("CLICKED");

          const socket = io("http://localhost:3000", {
            auth: {
              token: localStorage.getItem("token"),
            },
          });

          socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
          });

          socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
          });
        }}
      >
        CLICK
      </Button>

      <Sidebar />
      <ChattingSection />
    </div>
  );
};

export default HomePage;
