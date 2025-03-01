import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowLeft, EllipsisVertical, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/common/customInput/CustomInput";

const MobileLayout = () => {
  const location = useLocation();

  const getHeaderComponent = () => {
    switch (true) {
      case location.pathname === "/":
        return <MobileHomeRouteHeader />;
      case location.pathname.startsWith("/chat"):
        return <MobileChatSectionRouteHeader />;
      default:
        return <h2 className="text-xl">DM Chat</h2>;
    }
  };

  const headerContent = getHeaderComponent();

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col gap-2 p-2 bg-[#14151b]">
      {headerContent || <h2 className="text-xl">DM Chat</h2>}
      <div
        className={cn(
          "overflow-y-auto scrollbar",
          location.pathname === "/"
            ? "h-[calc(100%-141.6px)]"
            : "h-[calc(100%-29.6px)]"
        )} // 81.6px
      >
        <Outlet />
      </div>
      {location.pathname === "/" ? (
        <div className="absolute bottom-0 left-0 w-full p-2 bg-zinc-900">
          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-3 place-items-center">
              <TabsTrigger value="all" className="w-full rounded-xl">
                All
              </TabsTrigger>
              <TabsTrigger value="direct" className="w-full rounded-xl">
                Direct
              </TabsTrigger>
              <TabsTrigger value="groups" className="w-full rounded-xl">
                Groups
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      ) : (
        <CustomInput />
      )}
    </div>
  );
};

export default MobileLayout;

const MobileHomeRouteHeader = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-2">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-xl">DM Chat</h2>
        <div className="w-9 h-9 rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://i.pinimg.com/736x/57/ff/d2/57ffd2de1067686f07d41a56b2eb76df.jpg"
            alt=""
          />
        </div>
      </div>
      <Input icon={Search} className="rounded-full py-3 bg-zinc-900" />
    </div>
  );
};

const MobileChatSectionRouteHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex items-center justify-between my-1">
      <div className="flex items-center gap-2">
        <ChatSectionIconButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft className="text-white" />
        </ChatSectionIconButton>
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://i.pinimg.com/736x/57/ff/d2/57ffd2de1067686f07d41a56b2eb76df.jpg"
            alt=""
          />
        </div>
        <h3 className="text-[14px]">Chat Name</h3>
      </div>
      <div className="space-x-2">
        <ChatSectionIconButton onClick={() => {}}>
          <Search className="text-white" />
        </ChatSectionIconButton>
        <ChatSectionIconButton onClick={() => {}}>
          <Phone className="text-white" />
        </ChatSectionIconButton>
        <ChatSectionIconButton onClick={() => {}}>
          <EllipsisVertical className="text-white" />
        </ChatSectionIconButton>
      </div>
    </div>
  );
};

const ChatSectionIconButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Button
      onClick={onClick}
      className="bg-transparent hover:bg-primary/10 border-[1px] border-primary/5 active:scale-95 transition-all duration-150 rounded-xl px-2.5 py-1 "
    >
      {children}
    </Button>
  );
};
