import Header from "@/components/header/Header";
import { Outlet } from "react-router-dom";
import ChatDetails from "./ChatDetails";
import Navbar from "./Navbar";

const Layout = () => {
  // const { isOpen: isChatDetailOpen } = useSelector((state) =>
  //   chatDetailSelector(state)
  // );
  return (
    <div className="w-screen h-screen flex gap-2 overflow-hidden">
      <Navbar />
      <div className="flex-1 bg-[#14151b] rounded-2xl overflow-hidden p-4">
        <Header />
        <Outlet />
      </div>

      <ChatDetails />
    </div>
  );
};

export default Layout;
