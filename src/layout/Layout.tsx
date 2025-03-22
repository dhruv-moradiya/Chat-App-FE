import Header from "@/components/header/Header";
import { Outlet } from "react-router-dom";
import ChatDetails from "./ChatDetails";
import Navbar from "./Navbar";

const Layout = () => {
  // const { isOpen: isChatDetailOpen } = useSelector((state) =>
  //   chatDetailSelector(state)
  // );
  return (
    <div className="flex h-screen w-screen gap-2 overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden rounded-2xl bg-[#14151b] py-4">
        <Header />
        <Outlet />
      </div>

      <ChatDetails />
    </div>
  );
};

export default Layout;
