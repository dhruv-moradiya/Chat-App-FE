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
        <div className="relative hidden md:block border-[1px] border-slate-800 hover:bg-primary/10 active:scale-95 transition-all duration-150 rounded-xl p-2 px-4 outline-none">
          <Bell className="text-white" size={16} />
          <Badge className="rounded-full p-0 w-5 h-5 flex items-center justify-center absolute -top-3 -right-2">
            {notifications.length}
          </Badge>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-4 bg-primary-foreground border-none rounded-xl px-4 py-2">
        <h2 className="text-xl border-b-[1px] border-b-primary/20 pb-2 mb-5">
          Notification
        </h2>

        <div className="w-full flex flex-col gap-6 max-w-96 items-start">
          <p className="w-full text-xs text-center">
            <span className="border-[1px] border-primary/20 p-2 rounded-lg">
              12-02-2025
            </span>
          </p>
          <div className="w-full flex items-center gap-4">
            <div className="w-10 h-10 ml-auto rounded-lg overflow-hidden">
              <img
                src={
                  "https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096"
                }
                alt={""}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="truncate text-[14px]">
                Sungchan has send you a new message
              </p>
              <p className="text-xs text-zinc-400">1 hour ago</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-primary/70 ml-auto justify-self-end" />
          </div>
          <div className="w-full flex items-start gap-4">
            <div className="w-10 h-10 ml-auto rounded-lg overflow-hidden">
              <img
                src={
                  "https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096"
                }
                alt={""}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-[14px]">
                Woonbin has mentioned you in a Senapi squad
              </p>
              <p className="text-xs text-zinc-400">1 hour ago</p>
              <div className="border-[1px] border-primary/30 rounded-xl p-2 mt-2 flex items-center gap-2">
                <div className="text-[14px] ">
                  <p className="line-clamp-2">
                    Hey Woonbin Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Vel, nam!
                  </p>
                </div>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-primary/70 ml-auto justify-self-end" />
          </div>
          <div className="w-full flex items-start gap-4">
            <div className="w-10 h-10 ml-auto rounded-lg overflow-hidden">
              <img
                src={
                  "https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096"
                }
                alt={""}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-[14px]">
                Woonbin has mentioned you in a Senapi squad
              </p>
              <p className="text-xs text-zinc-400">1 hour ago</p>

              <div className="border-[1px] border-primary/30 rounded-xl p-2 mt-2 flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden">
                  <img
                    src="https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096"
                    alt=""
                  />
                </div>
                <div className="text-[14px]">
                  <p>Prototype recording 01.mp4</p>
                  <p className="text-zinc-400 text-[12px]">14MB</p>
                </div>
                <Button variant={"ghost"}>
                  <CloudDownload size={15} />
                </Button>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-primary/70 ml-auto justify-self-end" />
          </div>
          <div className="flex items-center justify-between w-full">
            <Button variant={"secondary"} size={"sm"}>
              View all
            </Button>
            <Button variant={"outline"} size={"sm"} className="rounded-xl">
              Make as read
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(Notifications);
