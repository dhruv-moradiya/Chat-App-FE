import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, CloudDownload } from "lucide-react";
import { memo } from "react";
import { Button } from "../ui/button";
import { useAppSelector } from "@/store/store";
import moment from "moment";
import { Attachment } from "@/types/ApiResponse.types";

const Notifications = () => {
  const { notifications, isLoading, isError } = useAppSelector((state) => state.notifications);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative hidden rounded-xl border-[1px] border-slate-800 p-2 px-4 outline-none transition-all duration-150 hover:bg-primary/10 active:scale-95 md:block">
          <Bell className="text-white" size={16} />
          <Badge className="absolute -right-2 -top-3 flex h-5 w-5 items-center justify-center rounded-full p-0">
            {notifications.length}
          </Badge>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-96 max-w-[400px] space-y-4 rounded-xl border-none bg-secondary px-4 py-2">
        <h2 className="mb-5 border-b-[1px] border-b-primary/20 pb-2 text-xl">Notification</h2>
        <div className="scrollbar flex max-h-96 w-full max-w-96 flex-col items-start gap-6 overflow-y-auto scroll-smooth pr-2">
          {(() => {
            if (isLoading) return "Loading...";
            if (isError) return "Error loading notifications";
            if (notifications?.length === 0) return "No notifications";
            return (
              <>
                {notifications.map((notification, index) => (
                  <NotificationItem
                    key={index}
                    avatar={notification.sender.profilePicture}
                    content={notification.content}
                    message={notification.subContent.text}
                    time={moment(notification.createdAt).fromNow()}
                    isRead={notification.isRead}
                    media={notification.subContent.attachments}
                    type={notification.type}
                  />
                ))}
              </>
            );
          })()}
        </div>
        <div className="flex w-full items-center justify-between">
          <Button variant={"ghost"} size={"sm"}>
            View all
          </Button>
          <Button variant={"outline"} size={"sm"} className="rounded-xl">
            Make as read
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(Notifications);

const NotificationDate = ({ date }: { date: string }) => {
  return (
    <p className="w-full text-center text-xs">
      <span className="rounded-lg border-[1px] border-primary/20 p-2">{date}</span>
    </p>
  );
};

interface NotificationItemProps {
  avatar: string;
  message: string;
  time: string;
  isRead: boolean;
  content: string;
  media: Attachment[];
  type: string;
}

const NotificationItem = ({
  avatar,
  message,
  time,
  isRead,
  content,
  media,
  type,
}: NotificationItemProps) => {
  return (
    <div className="flex w-full items-start gap-4">
      <div className="ml-auto h-10 w-10 overflow-hidden rounded-lg">
        <img src={avatar} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex-1">
        <p className="text-[14px]">{content}</p>
        <p className="text-xs text-zinc-400">{time}</p>

        {type === "new_message" && (
          <div className="mt-2 flex items-center gap-2 rounded-xl border-[1px] border-primary/30 p-2">
            <div className="text-[13.5px]">
              <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: message }} />
            </div>
          </div>
        )}

        {/* {content && (
          <div className="mt-2 flex items-center gap-2 rounded-xl border-[1px] border-primary/30 p-2">
            <div className="text-[13.5px]">
              <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: message }} />
            </div>
          </div>
        )} */}

        {type === "attachment" &&
          media?.map((item, index) => (
            <div
              key={index}
              className="mt-2 flex items-center gap-2 rounded-xl border border-primary/30 p-2"
            >
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                <img
                  src={item.url}
                  alt="Attachment preview"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col text-sm">
                <p className="">{item.fileName}</p>
                <p className="text-xs text-zinc-400">14KB</p>
              </div>

              <Button variant="ghost" className="ml-auto p-2">
                <CloudDownload size={16} />
              </Button>
            </div>
          ))}
      </div>
      {!isRead && (
        <Button variant={"dot_for_notification"} size="icon">
          <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
        </Button>
      )}
    </div>
  );
};
