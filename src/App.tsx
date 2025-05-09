import "./App.css";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "./api";
import ToastProvider, { showErrorToast } from "./components/common/ToastProvider";
import { Button } from "./components/ui/button";
import { setUserData } from "./store/auth/AuthSlice";
import { CircleLoader } from "./components/common/Loader";
import { useAppDispatch, useAppSelector } from "./store/store";
import moment from "moment";
import SignUp from "./page/SignUp";
import SignIn from "./page/SignIn";
import Layout from "./layout/Layout";
import HomePage from "./page/HomePage";
import ModalManager from "./components/common/modals/ModalManager";
import Text from "@/page/Text";
import { useMediaQuery } from "react-responsive";
import MobileLayout from "@/layout/mobile-layout/MobileLayout";
import HomeScreenMobile from "@/page/mobile/HomeScreenMobile";
import ChatScreenMobile from "@/page/mobile/ChatScreenMobile";
import { createConnection, disconnected } from "@/store/socket/SocketSlice";

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
  const [showSessionExpiryModal, setShowSessionExpiryModal] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

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
      {isMobileScreen ? (
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute setShowSessionExpiryModal={setShowSessionExpiryModal}>
                <MobileLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomeScreenMobile />} />
            <Route path="/chat/:chatId" element={<ChatScreenMobile />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/test" element={<Text />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute setShowSessionExpiryModal={setShowSessionExpiryModal}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/test" element={<Text />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      )}

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
