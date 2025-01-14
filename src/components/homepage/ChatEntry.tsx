import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ChatDetails } from "@/types/ApiResponse.types";
import { Pin } from "lucide-react";
import { memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "../ui/badge";
import { clearUnreadMessageCount } from "@/store/myChats/ChatSlice";

interface ChatEntryProps {
  chat: ChatDetails;
}

const ChatEntry = ({ chat }: ChatEntryProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { _id: userId } = useAppSelector((state) => state.auth.user);

  const [searchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);

  const friend = chat.participants.find(
    (participant) => participant._id !== user._id
  );
  // console.log("🚀 ~ file: ChatEntry.tsx:ChatEntry ~ chat", chat);
  const handleCurrentChat = () => {
    navigate(`/?chatId=${chat._id}`);
    dispatch(clearUnreadMessageCount({ chatId: chat._id, userId: user._id }));
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 hover:bg-accent-foreground/5 rounded-lg transition-colors duration-200 cursor-pointer",
        { "bg-accent-foreground/5": searchParams.get("chatId") === chat._id }
      )}
      onClick={handleCurrentChat}
    >
      {/* Profile Picture */}
      <div className="w-12 h-12 rounded-lg overflow-hidden">
        <img
          src={friend?.profilePicture}
          alt={friend?.username}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Chat Text */}
      <div className="flex-1 overflow-hidden">
        <h3 className="mb-1">
          {capitalizeFirstLetter(friend?.username as string)}
        </h3>
        <p className="whitespace-nowrap text-ellipsis overflow-hidden text-[12px] text-muted-foreground">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Reprehenderit, voluptatum!
        </p>
      </div>

      {/* Time and Pin Icon */}
      <div className="min-w-[40px] self-end flex items-center gap-2 text-white">
        <Badge className="self-end border-none w-5 h-5 flex items-center justify-center rounded-full bg-primary/60 text-white">
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
