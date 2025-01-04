import { useAppDispatch, useAppSelector } from "@/store/store";
import ChatEntry from "./ChatEntry";
import { useEffect } from "react";
import { fetchMyChats } from "@/store/myChats/ChatSlice";
import { Skeleton } from "../ui/skeleton";

const Sidebar = () => {
  const {
    myChats,
    isLoading: isLoadingFetchingMyChats,
    isError: isErrorFetchingMyChats,
  } = useAppSelector((state) => state.myChats);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMyChats());
  }, []);

  return (
    <div className="scrollbar w-96 h-full overflow-y-scroll flex flex-col gap-1 p-4 pl-0 rounded-lg">
      {isLoadingFetchingMyChats ? (
        <>
          <LoaderForChatEntry />
          <LoaderForChatEntry />
          <LoaderForChatEntry />
          <LoaderForChatEntry />
        </>
      ) : (
        <>
          {myChats.map((chat, i) => {
            return <ChatEntry key={i} chat={chat} />;
          })}
        </>
      )}
    </div>
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
