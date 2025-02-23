import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/store";
import { emojiCategories } from "@/lib/constants";
import { useSearchParams } from "react-router-dom";
import { fetchEmojisByCategory } from "@/store/emoji/EmojiThunk";
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

    // emojiCategories.forEach((category) => {
    //   dispatch(fetchEmojisByCategory(category));
    // });

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
      {/* <button onClick={() => dispatch(openModal({ type: "OTHER" }))}>
        Open Model
      </button> */}
      <Sidebar />
      <ChattingSection />
      {/* <Modal
        isOpen={open}
        onClose={() => dispatch(closeModal({ type: "OTHER" }))}
        closeOnOutsideClick={true}
        backgroundStyle="blur"
      >
        <EmojiPicker />
      </Modal> */}
    </div>
  );
};
export default HomePage;
