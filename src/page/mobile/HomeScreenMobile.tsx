import LoaderForChatEntry from "@/components/common/LoaderForChatEntry";
import ChatEntry from "@/components/homepage/ChatEntry";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setActiveChat } from "@/store/activeChat/ActiveChatSlice";
import { fetchActiveChatMessages } from "@/store/activeChat/ActiveChatThunk";
import { fetchMyChats } from "@/store/myChats/ChatSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const HomeScreenMobile = () => {
  const dispatch = useAppDispatch();
  const prevParamValue = useRef<string | null>(null);

  const { chatId } = useParams();
  const { myChats, isLoading, isError } = useAppSelector(
    (state) => state.myChats
  );

  useEffect(() => {
    if (prevParamValue.current && prevParamValue.current !== chatId) {
    }

    if (chatId) {
      dispatch(fetchActiveChatMessages({ chatId: chatId, page: 1, limit: 20 }));
      dispatch(
        setActiveChat({
          activeChatId: chatId,
          prevChatId: prevParamValue.current,
        })
      );
    }
    prevParamValue.current = chatId ?? null;
  }, [chatId]);

  useEffect(() => {
    dispatch(fetchMyChats());
  }, [dispatch]);

  const renderLoading = () => (
    <>
      {[...Array(4)].map((_, index) => (
        <LoaderForChatEntry key={index} />
      ))}
    </>
  );

  const renderChats = (filterFn?: (chat: any) => boolean) => {
    const filteredChats = filterFn ? myChats.filter(filterFn) : myChats;
    return filteredChats.map((chat, index) => (
      <ChatEntry key={index} chat={chat} />
    ));
  };

  return (
    <>
      <div className="w-full p-2 bg-zinc-900">
        <Tabs defaultValue="all">
          <TabsList className="w-full absolute bottom-2 left-0  grid grid-cols-3 place-items-center">
            <TabsTrigger value="all" className="w-full rounded-xl">
              All
            </TabsTrigger>
            <TabsTrigger value="direct" className="w-full rounded-xl">
              Direct
            </TabsTrigger>
            <TabsTrigger value="groups" className="w-full rounded-xl">
              Groups
            </TabsTrigger>
          </TabsList>
          {isLoading ? (
            renderLoading()
          ) : isError ? (
            <p className="text-muted-foreground">Failed to load chats.</p>
          ) : (
            <>
              <TabsContent value="all">{renderChats()}</TabsContent>
              <TabsContent value="direct">
                {renderChats((chat) => !chat.isGroup)}
              </TabsContent>
              <TabsContent value="groups">
                {renderChats((chat) => chat.isGroup)}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default HomeScreenMobile;
