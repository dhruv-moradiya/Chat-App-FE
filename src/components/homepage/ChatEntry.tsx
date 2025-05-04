import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ChatDetails } from "@/types/ApiResponse.types";
import { Pin } from "lucide-react";
import { memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "../ui/badge";
import { clearUnreadMessageCount } from "@/store/myChats/ChatSlice";
import { useMediaQuery } from "react-responsive";

interface ChatEntryProps {
  chat: ChatDetails;
}

const ChatEntry = ({ chat }: ChatEntryProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const userId = user ? user._id : "";
  const isMobileScreen = useMediaQuery({ maxWidth: 767 });

  const [searchParams] = useSearchParams();

  const friend = chat.participants.find((participant) => user && participant._id !== user._id);
  const handleCurrentChat = () => {
    if (isMobileScreen) {
      navigate(`/chat/${chat._id}`);
    } else {
      navigate(`/?chatId=${chat._id}`);
    }
    if (user) {
      dispatch(clearUnreadMessageCount({ chatId: chat._id, userId: user._id }));
    }
  };

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-3 transition-colors duration-200 hover:bg-accent-foreground/5 md:px-4",
        { "bg-accent-foreground/5": searchParams.get("chatId") === chat._id }
      )}
      onClick={handleCurrentChat}
    >
      {/* Profile Picture */}
      <div className="h-12 w-12 overflow-hidden rounded-lg">
        <img
          src={chat.isGroup ? chat.coverImage.url : friend?.profilePicture}
          alt={chat.isGroup ? chat.coverImage.fileName : friend?.username}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Chat Text */}
      <div className="flex-1 overflow-hidden">
        <h3 className="md:text-[14px mb-1 text-[14.5px]">
          {chat.isGroup ? chat.chatName : capitalizeFirstLetter(friend?.username as string)}
        </h3>
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] text-muted-foreground">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit, voluptatum!
        </p>
      </div>

      {/* Time and Pin Icon */}
      <div className="flex min-w-[40px] items-center gap-2 self-end text-white">
        <Badge className="flex h-5 w-5 items-center justify-center self-end rounded-full border-none bg-primary/60 text-white">
          {chat.unreadMessagesCounts[userId]}
        </Badge>
        <div className="flex flex-col items-center gap-2">
          <Pin fill="white" size={16} className="rotate-45" />
        </div>
      </div>
    </div>
  );
};

export default memo(ChatEntry);
