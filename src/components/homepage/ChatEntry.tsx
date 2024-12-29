import React from "react";
import { Badge } from "../ui/badge";
import { Pin } from "lucide-react";

const ChatEntry = () => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-accent-foreground/5 rounded-lg transition-colors duration-200 cursor-pointer">
      {/* Profile Picture */}
      <div className="w-12 h-12 rounded-lg overflow-hidden">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWGHQiByv8_VMiPuPmrYP1OWf0r_saNhsZv9fqATM8wmyXO00Id69j&usqp=CAE&s"
          alt="User Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Chat Text */}
      <div className="flex-1 overflow-hidden">
        <h3 className="mb-1">Office Work</h3>
        <p className="whitespace-nowrap text-ellipsis overflow-hidden text-[12px] text-muted-foreground">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Reprehenderit, voluptatum!
        </p>
      </div>

      {/* Time and Pin Icon */}
      <div className="min-w-[40px] flex gap-2 text-white">
        <Badge variant={"custom"} className="self-end border-none">
          12
        </Badge>
        <div className="flex flex-col items-center gap-2">
          <h4 className="text-[12px]">4 min</h4>
          <Pin fill="white" size={16} className="rotate-45" />
        </div>
      </div>
    </div>
  );
};

export default ChatEntry;
