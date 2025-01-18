import { fetchMyChats } from "@/store/myChats/ChatSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import ChatEntry from "./ChatEntry";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Sidebar = () => {
  const { myChats, isLoading, isError } = useAppSelector(
    (state) => state.myChats
  );
  const dispatch = useAppDispatch();

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
    <Tabs defaultValue="all" className="flex flex-col gap-1">
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

      <div className="scrollbar w-96 h-full overflow-y-scroll flex flex-col gap-1 p-4 pl-0 rounded-lg">
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
      <div className="w-[100px]">
        <Skeleton className="flex-1 w-[100px] rounded-lg" />
      </div>
    </div>
  );
};
