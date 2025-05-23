import useDebounce from "@/hooks/useDebounce";
import { EmojiGroupEnum } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { addReaction } from "@/store/activeChat/ActiveChatSlice";
import { closeModal } from "@/store/chatDetailSidebar/ChatDetailSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const emojiGroups: EmojiGroupEnum[] = Object.values(EmojiGroupEnum);

const EmojiPicker = ({
  selectedMessage,
}: {
  selectedMessage?: [{ _id: string; chat: string }];
}) => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("chatId");
  const elementContainerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const emojis = useAppSelector((state) => state.emoji.categories);

  const [searchValue, setSearchValue] = useState("");
  const [activeEmojiSet, setActiveEmojiSet] = useState<EmojiGroupEnum>(emojiGroups[0]);
  const [currentSelectedElement, setCurrentSelectedElement] = useState(-1);
  // const debouncedValue = useDebounce({ query: searchValue, debounceTime: 500 });

  useEffect(() => {
    const imageClickHandler = (e: MouseEvent) => {
      console.log("clicked");
      const targetPera = (e.target as HTMLElement).closest("p") as HTMLParagraphElement | null;

      if (!targetPera) return;

      const index = elementsRef.current.indexOf(targetPera);
      if (index === -1) return;

      setCurrentSelectedElement(index);

      const path = emojis[activeEmojiSet].emojis[index].emoji;
      const messageId = (selectedMessage && selectedMessage[0]._id) || "";

      dispatch(addReaction({ messageId, emoji: path, chatId: paramValue as string }));

      setTimeout(() => {
        dispatch(closeModal());
      }, 100);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      setCurrentSelectedElement((prev) => {
        let next = prev;
        const totalEmoji = emojis[activeEmojiSet].emojis.length;

        switch (e.key) {
          case "ArrowLeft":
            next = (prev + (totalEmoji - 1)) % totalEmoji;
            break;
          case "ArrowRight":
            next = (prev + 1) % totalEmoji;
            break;
          case "ArrowUp":
            next = (prev + (totalEmoji - 8)) % totalEmoji;
            break;
          case "ArrowDown":
            next = (prev + 8) % totalEmoji;
            break;
          default:
            return prev;
        }

        return next;
      });
    };

    const elementContainer = elementContainerRef.current;

    if (elementContainer) {
      setTimeout(() => elementContainer.focus(), 100);

      elementContainer.addEventListener("keydown", handleKeyDown);
      elementContainer.addEventListener("click", imageClickHandler);
    }

    return () => {
      if (elementContainer) {
        elementContainer.removeEventListener("keydown", handleKeyDown);
        elementContainer.removeEventListener("click", imageClickHandler);
      }
    };
  }, [currentSelectedElement, selectedMessage, paramValue]);

  return (
    <div className="flex h-[500px] w-[450px] flex-col gap-4 rounded-xl">
      {/* Search Input */}
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full rounded-xl border border-primary/20 bg-secondary px-4 py-2 focus:outline-none"
        placeholder="Search emoji..."
      />

      {/* Emoji Categories */}
      <div className="flex gap-4">
        {emojiGroups.map((category) => (
          <p
            key={category}
            onClick={() => setActiveEmojiSet(category)}
            className={cn("cursor-pointer", activeEmojiSet === category ? "text-primary" : "")}
          >
            {category}
          </p>
        ))}
      </div>

      {/* Emoji Grid */}
      <div
        className="scrollbar-hidden custom-scrollbar grid max-h-[80vh] grid-cols-8 gap-4 overflow-y-auto scroll-smooth rounded-xl border border-primary/20 p-4"
        ref={elementContainerRef}
        tabIndex={0}
      >
        {emojis[activeEmojiSet].emojis.map((emoji, index) => (
          <p
            key={index}
            ref={(el) => {
              elementsRef.current[index] = el;
            }}
            className={cn(
              "flex cursor-pointer items-center justify-center rounded-xl border-2 border-transparent bg-primary/20 text-2xl shadow-xl transition-all duration-200 hover:scale-110 hover:border-primary",
              currentSelectedElement === index ? "border-2 border-primary" : ""
            )}
          >
            {/* {String.fromCodePoint(parseInt(emoji.unicode[0].replace("U+", ""), 16))} */}
            {emoji.emoji}
          </p>
        ))}
      </div>
    </div>
  );
};

export { EmojiPicker };
