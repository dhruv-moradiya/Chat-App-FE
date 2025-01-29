import { logout } from "@/store/auth/AuthSlice";
import { useAppDispatch } from "@/store/store";
import Cookies from "js-cookie";
import {
  BriefcaseBusiness,
  HandMetal,
  LogOut,
  MessageCircle,
  Settings,
} from "lucide-react";

const NavItem = ({
  icon,
  label,
  onClick,
}: {
  icon: JSX.Element;
  label: string;
  onClick?: () => void;
}) => (
  <li
    className="flex flex-col items-center gap-2 cursor-pointer"
    onClick={onClick}
  >
    {icon}
    <p className="text-[12px] md:text-md">{label}</p>
  </li>
);

const Navbar = () => {
  const dispatch = useAppDispatch();

  const navList = [
    {
      label: "All Chats",
      path: "/",
      icon: <MessageCircle fill="white" size={14} />,
    },
    {
      label: "Work",
      path: "/",
      icon: <BriefcaseBusiness fill="white" size={14} />,
    },
    {
      label: "Friends",
      path: "/",
      icon: <HandMetal fill="white" size={14} />,
    },
  ];

  const handleLogOut = () => {
    dispatch(logout());
    localStorage.clear();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    window.location.href = "/signin";
  };

  return (
    <nav className="h-full w-14 md:w-20 flex flex-col items-center py-4">
      <h2 className="text-2xl md:text-3xl mb-10">DM</h2>

      <ul className="flex-1 flex flex-col gap-6">
        {navList.map((item) => (
          <NavItem key={item.label} icon={item.icon} label={item.label} />
        ))}
      </ul>

      <div className="flex flex-col items-center gap-4">
        <NavItem icon={<Settings size={14} />} label="Settings" />
        <NavItem
          icon={<LogOut size={14} />}
          label="Logout"
          onClick={handleLogOut}
        />
      </div>
    </nav>
  );
};

export default Navbar;
