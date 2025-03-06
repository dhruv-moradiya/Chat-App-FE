import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

const Text = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col gap-2 p-2 bg-[#14151b]">
      {/* Top Section */}
      <div className="flex items-center justify-between">
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
      <div className="h-[calc(100%-141.6px)] overflow-y-auto scrollbar">
        {new Array(10).fill(0).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-4 py-3 hover:bg-accent-foreground/5 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src="https://i.pinimg.com/736x/57/ff/d2/57ffd2de1067686f07d41a56b2eb76df.jpg"
                alt=""
              />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-base">Chat Name</h3>
                <span className="text-[11px] text-muted-foreground">
                  12-03-2025
                </span>
              </div>
              <p className="whitespace-nowrap text-ellipsis overflow-hidden text-[12px] text-muted-foreground">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Reprehenderit, voluptatum!
              </p>
            </div>
          </div>
        ))}
      </div>
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
    </div>
  );
};

export default Text;
