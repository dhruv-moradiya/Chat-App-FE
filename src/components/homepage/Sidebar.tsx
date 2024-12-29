import ChatEntry from "./ChatEntry";

const Sidebar = () => {
  return (
    <div className="scrollbar w-96 h-full overflow-y-scroll flex flex-col gap-1 p-4 pl-0 rounded-lg">
      {new Array(20).fill(0).map((_, i) => {
        return <ChatEntry key={i} />;
      })}
    </div>
  );
};

export default Sidebar;
