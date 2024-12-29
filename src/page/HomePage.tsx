import ChattingSection from "@/components/homepage/chattingsection/ChattingSection";
import Sidebar from "@/components/homepage/Sidebar";

const HomePage = () => {
  return (
    <div className="w-full h-full flex gap-2">
      <Sidebar />
      <ChattingSection />
    </div>
  );
};

export default HomePage;
