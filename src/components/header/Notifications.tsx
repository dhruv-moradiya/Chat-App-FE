import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, CloudDownload } from "lucide-react";
import { memo } from "react";
import { Button } from "../ui/button";
import { useAppSelector } from "@/store/store";
import moment from "moment";

const Notifications = () => {
  const notificationsState = useAppSelector((state) => state.notifications.notifications);

  const notifications = [
    {
      imgSrc: "https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096",
      altText: "Shotaro",
      message: "Sungchan sent you a message",
    },
    {
      imgSrc: "https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096",
      altText: "Shotaro",
      message: "Sungchan sent you a message",
    },
    {
      imgSrc: "https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096",
      altText: "Shotaro",
      message: "Sungchan sent you a message",
    },
  ];

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
      <DropdownMenuContent className="space-y-4 rounded-xl border-none bg-primary-foreground px-4 py-2">
        <h2 className="mb-5 border-b-[1px] border-b-primary/20 pb-2 text-xl">Notification</h2>

        <div className="scrollbar flex max-h-96 w-full max-w-96 flex-col items-start gap-6 overflow-y-auto scroll-smooth pr-2">
          <p className="w-full text-center text-xs">
            <span className="rounded-lg border-[1px] border-primary/20 p-2">12-02-2025</span>
          </p>
          <div className="flex w-full items-center gap-4">
            <div className="ml-auto h-10 w-10 overflow-hidden rounded-lg">
              <img
                src={"https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096"}
                alt={""}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="truncate text-[14px]">Sungchan has send you a new message</p>
              <p className="text-xs text-zinc-400">1 hour ago</p>
            </div>
            <span className="ml-auto h-2.5 w-2.5 justify-self-end rounded-full bg-primary/70" />
          </div>
          <div className="flex w-full items-start gap-4">
            <div className="ml-auto h-10 w-10 overflow-hidden rounded-lg">
              <img
                src={"https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096"}
                alt={""}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-[14px]">Woonbin has mentioned you in a Senapi squad</p>
              <p className="text-xs text-zinc-400">1 hour ago</p>
              <div className="mt-2 flex items-center gap-2 rounded-xl border-[1px] border-primary/30 p-2">
                <div className="text-[14px]">
                  <p className="line-clamp-2">
                    Hey Woonbin Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, nam!
                  </p>
                </div>
              </div>
            </div>
            <span className="ml-auto h-2.5 w-2.5 justify-self-end rounded-full bg-primary/70" />
          </div>
          <div className="flex w-full items-start gap-4">
            <div className="ml-auto h-10 w-10 overflow-hidden rounded-lg">
              <img
                src={"https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096"}
                alt={""}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-[14px]">Woonbin has mentioned you in a Senapi squad</p>
              <p className="text-xs text-zinc-400">1 hour ago</p>

              <div className="mt-2 flex items-center gap-2 rounded-xl border-[1px] border-primary/30 p-2">
                <div className="h-10 w-10 overflow-hidden rounded-lg">
                  <img
                    src="https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096"
                    alt=""
                  />
                </div>
                <div className="text-[14px]">
                  <p>Prototype recording 01.mp4</p>
                  <p className="text-[12px] text-zinc-400">14MB</p>
                </div>
                <Button variant={"ghost"}>
                  <CloudDownload size={15} />
                </Button>
              </div>
            </div>
            <span className="ml-auto h-2.5 w-2.5 justify-self-end rounded-full bg-primary/70" />
          </div>

          {notificationsState.map((notification, index) => (
            <NotificationItem
              key={index}
              avatar={notification.sender.profilePicture}
              content={notification.content}
              message={notification.message.content}
              time={moment(notification.createdAt).fromNow()}
              isRead={notification.isRead}
              media={false}
            />
          ))}
        </div>
        <div className="flex w-full items-center justify-between">
          <Button variant={"secondary"} size={"sm"}>
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
  media: boolean;
}

const NotificationItem = ({
  avatar,
  message,
  time,
  isRead,
  content,
  media,
}: NotificationItemProps) => {
  return (
    <div className="flex w-full items-start gap-4">
      <div className="ml-auto h-10 w-10 overflow-hidden rounded-lg">
        <img src={avatar} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex-1">
        <p className="text-[14px]">{content}</p>
        <p className="text-xs text-zinc-400">{time}</p>

        {content && (
          <div className="mt-2 flex items-center gap-2 rounded-xl border-[1px] border-primary/30 p-2">
            <div className="text-[13.5px]">
              <p className="line-clamp-2" dangerouslySetInnerHTML={{ __html: message }} />
            </div>
          </div>
        )}

        {/* {media && (
          <div className="mt-2 flex items-center gap-2 rounded-xl border-[1px] border-primary/30 p-2">
            <div className="h-10 w-10 overflow-hidden rounded-lg">
              <img src={media.thumbnail} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="text-[14px]">
              <p>{media.filename}</p>
              <p className="text-[12px] text-zinc-400">{media.size}</p>
            </div>
            <Button variant="ghost">
              <CloudDownload size={15} />
            </Button>
          </div>
        )} */}
      </div>
      {!isRead && (
        <span className="ml-auto h-2.5 w-2.5 justify-self-end rounded-full bg-primary/70" />
      )}
    </div>
  );
};
