import { Pin } from "lucide-react";
import { Badge } from "../ui/badge";
import { ChatDetails } from "@/types/ApiResponse.types";
import { useAppSelector } from "@/store/store";
import { capitalizeFirstLetter } from "@/lib/utils";

interface ChatEntryProps {
  chat: ChatDetails;
}

const ChatEntry = ({ chat }: ChatEntryProps) => {
  const { user } = useAppSelector((state) => state.auth);

  const friend = chat.participants.find(
    (participant) => participant._id !== user._id
  );

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-accent-foreground/5 rounded-lg transition-colors duration-200 cursor-pointer">
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
          12
        </Badge>
        <div className="flex flex-col items-center gap-2">
          <Pin fill="white" size={16} className="rotate-45" />
        </div>
      </div>
    </div>
  );
};

export default ChatEntry;
