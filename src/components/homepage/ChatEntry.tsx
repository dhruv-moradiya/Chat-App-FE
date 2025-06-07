import { memo } from "react";
import { pinSelectedChat } from "@/api";
import { Badge } from "@/components/ui/badge";
import { EllipsisVertical, Pin } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { ChatDetails } from "@/types/ApiResponse.types";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearUnreadMessageCount } from "@/store/myChats/ChatSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatEntryProps {
  chat: ChatDetails;
}



const ChatEntry = ({ chat }: ChatEntryProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);
  const isMobileScreen = useMediaQuery({ maxWidth: 767 });

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
        "group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-3 transition-colors duration-200 hover:bg-accent-foreground/5 md:px-4",
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
        <h3 className="md:text-[14px mb-1 flex w-full items-center justify-between text-[14.5px] font-semibold">
          <span>
            {chat.isGroup ? chat.chatName : capitalizeFirstLetter(friend?.username as string)}
          </span>
        </h3>
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] text-muted-foreground">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit, voluptatum!
        </p>
      </div>

      {/* Time and Pin Icon */}
      <ChatActions chat={chat} />
    </div>
  );
};

export default memo(ChatEntry);

// ------------------------------------- Chat Dropdown Actions ------------------------------------------

interface ChatMenuProps {
  chat: ChatDetails;
}

const ChatActions = ({ chat }: ChatMenuProps) => {
  const { user } = useAppSelector((state) => state.auth);

  const handlePin = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    pinSelectedChat(chat._id);
  };

  const handleMute = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // muteChat(chat._id);
  };

  const handleMarkAsUnread = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // markAsUnread(chat._id);
  };

  const handleAddToFavorites = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // addToFavorites(chat._id);
  };

  const handleBlock = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // blockUser(chat._id);
  };

  const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // deleteChat(chat._id);
  };

  return (
    <div className="flex min-w-[40px] items-start justify-end gap-2 self-end text-white">
      {user?.pinnedChats.includes(chat._id) && <Pin size={12} className="rotate-45" />}
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical size={18} className="-translate-y-0.5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="border-none bg-[#1e1e1e]">
            <DropdownMenuItem className="cursor-pointer" onClick={handlePin}>
              Pin chat
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleMute}>
              Mute notifications
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleMarkAsUnread}>
              Mark as unread
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleAddToFavorites}>
              Add to favorites
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleBlock}>
              Block
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
              Delete chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <Badge className="flex h-5 w-5 items-center justify-center self-end rounded-full border-none bg-primary/60 text-white">
            {chat.unreadMessagesCounts[user?._id || 0]}
          </Badge>
        </div>
      </div>
    </div>
  );
};
