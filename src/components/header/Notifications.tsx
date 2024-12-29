import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { memo } from "react";

const NotificationItem = ({
  imgSrc,
  altText,
  message,
}: {
  imgSrc: string;
  altText: string;
  message: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 ml-auto rounded-full overflow-hidden">
      <img src={imgSrc} alt={altText} className="w-full h-full object-cover" />
    </div>
    <p>{message}</p>
  </div>
);

const Notifications = () => {
  const notifications = [
    {
      imgSrc:
        "https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096",
      altText: "Shotaro",
      message: "Sungchan sent you a message",
    },
    {
      imgSrc:
        "https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096",
      altText: "Shotaro",
      message: "Sungchan sent you a message",
    },
    {
      imgSrc:
        "https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096",
      altText: "Shotaro",
      message: "Sungchan sent you a message",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative">
          <Bell />
          <Badge className="rounded-full p-0 w-5 h-5 flex items-center justify-center absolute -top-3 -right-2">
            {notifications.length}
          </Badge>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-4 bg-[#1e1e1e] border-none rounded-xl px-4 py-2">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={index}
            imgSrc={notification.imgSrc}
            altText={notification.altText}
            message={notification.message}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(Notifications);
