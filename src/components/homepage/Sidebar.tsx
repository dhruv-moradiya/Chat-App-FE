import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMyChats } from "@/store/myChats/ChatSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatEntry from "./ChatEntry";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { myChats, isLoading, isError } = useAppSelector(
    (state) => state.myChats
  );
  const isChatListSideBarOpen = useAppSelector(
    (state) => state.chatDetail.isChatListSideBarOpen
  );

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

  useEffect(() => {
    dispatch(fetchMyChats());
  }, [dispatch]);

  return (
    <Tabs
      defaultValue="all"
      className={cn(
        "fixed h-full top-12 left-14 z-10 md:static md:w-96 md:flex flex-col gap-1 transition-all duration-150",
        isChatListSideBarOpen ? "translate-x-0" : "translate-x-[-150%]",
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

      <div className="scrollbar overflow-y-scroll flex flex-col gap-1 p-4 pl-0 rounded-lg">
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
      </div>
    </Tabs>
  );
};

export default Sidebar;

const LoaderForChatEntry = () => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 ">
      <div>
        <Skeleton className="w-12 h-12 rounded-lg" />
      </div>
      <div className="w-full h-12 rounded-lg flex flex-col items-center gap-2">
        <Skeleton className="flex-1 h-4 w-full rounded-lg" />
        <Skeleton className="flex-1 h-4 w-full rounded-lg" />
      </div>
    </div>
  );
};
