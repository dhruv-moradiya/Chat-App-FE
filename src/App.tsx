import "./App.css";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { getCurrentUser } from "./api";
import { Button } from "./components/ui/button";
import { useMediaQuery } from "react-responsive";
import { setUserData } from "./store/auth/AuthSlice";
import { CircleLoader } from "./components/common/Loader";
import { useAppDispatch, useAppSelector } from "./store/store";
import { createConnection, disconnected } from "@/store/socket/SocketSlice";
import ToastProvider, { showErrorToast } from "./components/common/ToastProvider";
import { Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import Text from "@/page/Text";
import SignUp from "./page/SignUp";
import SignIn from "./page/SignIn";
import Layout from "./layout/Layout";
import HomePage from "./page/desktop/HomePage";
import HomeScreenMobile from "@/page/mobile/HomeScreenMobile";
import ChatScreenMobile from "@/page/mobile/ChatScreenMobile";
import MobileLayout from "@/layout/mobile-layout/MobileLayout";
import ModalManager from "./components/common/modals/ModalManager";

const ProtectedRoute = ({
  children,
  setShowSessionExpiryModal,
}: {
  children: React.ReactNode;
  setShowSessionExpiryModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      const expiryTime = user.refreshTokenExp * 1000 - Date.now();

      const duration = moment.duration(expiryTime);
      const formattedTime = `${duration.days()} days, ${duration.hours()} hours, ${duration.minutes()} minutes and ${duration.seconds()} seconds`;
      console.log("formattedTime", formattedTime);

      let timeout: NodeJS.Timeout;
      if (expiryTime) {
        timeout = setTimeout(() => {
          setShowSessionExpiryModal(true);
        }, expiryTime);
      }

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("❌ No token found");
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    async function verifyUser() {
      try {
        const response = await getCurrentUser();
        dispatch(setUserData(response));
        setIsAuthenticated(true);
      } catch (error) {
        if (error instanceof AxiosError) {
          showErrorToast(error.response?.data.message);
        } else {
          showErrorToast("Something went wrong");
        }
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    verifyUser();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <CircleLoader />
      </div>
    );

  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
};

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const isMobileScreen = useMediaQuery({ maxWidth: 767 });
  const user = useAppSelector((state) => state.auth.user);

  const [showSessionExpiryModal, setShowSessionExpiryModal] = useState(false);

  const LayoutComponent = isMobileScreen ? MobileLayout : Layout;
  const HomeComponent = isMobileScreen ? HomeScreenMobile : HomePage;
  const ChatComponent = isMobileScreen ? (
    <Route path="/chat/:chatId" element={<ChatScreenMobile />} />
  ) : null;

  useEffect(() => {
    if (user) {
      dispatch(createConnection());
    }

    return () => {
      dispatch(disconnected());
    };
  }, [user]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute setShowSessionExpiryModal={setShowSessionExpiryModal}>
              <LayoutComponent />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeComponent />} />
          {ChatComponent}
        </Route>

        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/test" element={<Text />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>

      <ToastProvider />
      {showSessionExpiryModal && location.pathname !== "/signin" && <SessionExpireModal />}

      <ModalManager />
    </>
  );
}

export default App;

const SessionExpireModal = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-opacity duration-300">
      <div className="flex flex-col items-center gap-5 rounded-lg bg-primary-foreground p-6 shadow-lg">
        <p className="text-center text-white">
          🔒 **Your session has expired!** ⏳ Please log in again to continue. 😊✨
        </p>

        <Button
          variant="outline"
          onClick={() => navigate("/signin")}
          className="group relative flex w-fit items-center justify-center rounded-lg border border-primary/50 bg-transparent p-0 px-6 py-2 text-white transition-all duration-200 hover:bg-primary/20 active:scale-95"
        >
          Login
        </Button>
      </div>
    </div>
  );
};
