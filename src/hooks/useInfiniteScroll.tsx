import { useState, useEffect, useCallback } from "react";
import { useAppDispatch } from "@/store/store";
import { fetchOldActiveChatMessages } from "@/store/activeChat/ActiveChatThunk";
import { ChatMessagesSummary } from "@/types/ApiResponse.types";

const useInfiniteScroll = (
  activeChatId: string,
  activeChatDetails: ChatMessagesSummary,
  elementRef: React.RefObject<HTMLDivElement>
) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Reset hasMore when activeChatId changes
  useEffect(() => {
    setHasMore(true);
  }, [activeChatId]);

  const fetchData = useCallback(() => {
    if (loading || !hasMore || !elementRef.current) return;

    const container = elementRef.current;
    const previousScrollHeight = container.scrollHeight;

    setLoading(true);
    dispatch(
      fetchOldActiveChatMessages({
        chatId: activeChatId,
        page: activeChatDetails.currentPage + 1,
        limit: 20,
      })
    )
      .unwrap()
      .then((newMessages) => {
        setHasMore(newMessages.messages.length === 20);

        // Maintain the scroll position after loading new messages
        setTimeout(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - previousScrollHeight;
        }, 0);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeChatId, activeChatDetails, dispatch, loading, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const container = elementRef.current;
      if (container.scrollTop === 0) {
        fetchData();
      }
    };

    if (elementRef.current) {
      elementRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [fetchData, elementRef]);

  return { loading, hasMore };
};

export default useInfiniteScroll;
