import { useEffect, useRef, useState } from "react";
import { emojiData } from "@/lib/emoji-data";
import { cn } from "@/lib/utils";
import { addReaction } from "@/store/activeChat/ActiveChatSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { SelectedMessagesForInteraction } from "@/types/Common.types";
import { useSearchParams } from "react-router-dom";
import { closeModel } from "@/store/chatDetailSidebar/ChatDetailSlice";

const ReactMessageModal = ({
  selectedMessage,
}: {
  selectedMessage: SelectedMessagesForInteraction;
}) => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("chatId");
  const elementContainerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentSelectedElement, setCurrentSelectedElement] = useState(0);

  const open = useAppSelector((state) => state.chatDetail.isModelOpen);

  useEffect(() => {
    const imageClickHandler = (e: MouseEvent) => {
      const targetDiv = (e.target as HTMLElement).closest(
        "div"
      ) as HTMLDivElement | null;

      if (!targetDiv) return;

      const index = elementsRef.current.indexOf(targetDiv);
      if (index === -1) return;

      setCurrentSelectedElement(index);

      const path = emojiData[index].path;

      const messageId =
        selectedMessage.type === "React" ? selectedMessage.messages[0]._id : "";

      dispatch(
        addReaction({ messageId, emoji: path, chatId: paramValue as string })
      );

      setTimeout(() => {
        dispatch(closeModel());
      }, 100);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) {
        return;
      }
      setCurrentSelectedElement((prev) => {
        let next = prev;

        switch (e.key) {
          case "ArrowLeft":
            next = (prev + 39) % 40;
            break;
          case "ArrowRight":
            next = (prev + 1) % 40;
            break;
          case "ArrowUp":
            next = (prev + 30) % 40;
            break;
          case "ArrowDown":
            next = (prev + 10) % 40;
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
  }, [open]);

  return (
    <div className="flex flex-col gap-4 min-w-96">
      <p className="text-md mb-4">React Message?</p>

      <div
        className="grid grid-cols-10 gap-2 outline-none"
        ref={elementContainerRef}
        tabIndex={0}
      >
        {emojiData.map((_, index) => (
          <div
            key={index}
            ref={(el) => (elementsRef.current[index] = el)}
            className={cn(
              "cursor-pointer flex justify-center rounded-lg transition-all duration-200 ring-2 ring-transparent hover:ring-primary hover:scale-100 text-sm p-1 w-[40px] h-[40px] overflow-hidden mix-blend-lighten border border-primary",
              index === currentSelectedElement && "scale-110 ring-primary"
            )}
          >
            <img
              src={_.path.replace("/src/assets", "")}
              alt="Emoji"
              className="w-full h-full object-cover mix-blend-lighten"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="w-[40px] h-[40px]">
          <img
            src={emojiData[currentSelectedElement].path.replace(
              "/src/assets",
              ""
            )}
            alt={emojiData[currentSelectedElement].slug}
            className="w-full h-full object-cover mix-blend-lighten"
          />
        </div>
        <div>
          <p>{emojiData[currentSelectedElement].display_name}</p>
          <p className="text-sm text-gray-400">
            :{emojiData[currentSelectedElement].slug}
          </p>
        </div>
      </div>
    </div>
  );
};

export { ReactMessageModal };
