import { useEffect } from "react";
import { fetchMyChats } from "@/store/myChats/ChatSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatEntry from "./ChatEntry";
import { cn } from "@/lib/utils";
import LoaderForChatEntry from "../common/LoaderForChatEntry";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { myChats, isLoading, isError } = useAppSelector((state) => state.myChats);
  const isChatListSideBarOpen = useAppSelector((state) => state.chatDetail.isChatListSideBarOpen);

  const renderLoading = () => (
    <>
      {[...Array(4)].map((_, index) => (
        <LoaderForChatEntry key={index} />
      ))}
    </>
  );

  const renderChats = (filterFn?: (chat: any) => boolean) => {
    const filteredChats = filterFn ? myChats.filter(filterFn) : myChats;
    return filteredChats.map((chat, index) => <ChatEntry key={index} chat={chat} />);
  };

  useEffect(() => {
    dispatch(fetchMyChats());
  }, [dispatch]);

  return (
    <Tabs
      defaultValue="all"
      className={cn(
        "fixed left-14 top-12 z-10 h-full flex-col gap-1 transition-all duration-150 md:static md:flex md:w-96",
        isChatListSideBarOpen
          ? "w-full translate-x-0 bg-primary-foreground"
          : "translate-x-[-150%]",
        "md:translate-x-0"
      )}
    >
      <TabsList className="grid grid-cols-3 place-items-center">
        <TabsTrigger value="all" className="w-full">
          All
        </TabsTrigger>
        <TabsTrigger value="direct" className="w-full">
          Direct
        </TabsTrigger>
        <TabsTrigger value="groups" className="w-full">
          Groups
        </TabsTrigger>
      </TabsList>

      <div className="scrollbar flex flex-col gap-1 overflow-y-scroll rounded-lg p-4 pl-0">
        {isLoading ? (
          renderLoading()
        ) : isError ? (
          <p className="text-muted-foreground">Failed to load chats.</p>
        ) : (
          <>
            <TabsContent value="all">{renderChats()}</TabsContent>
            <TabsContent value="direct">{renderChats((chat) => !chat.isGroup)}</TabsContent>
            <TabsContent value="groups">{renderChats((chat) => chat.isGroup)}</TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default Sidebar;
