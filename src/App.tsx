import { useEffect, useState } from "react";
import "./App.css";
import Cookies from "js-cookie";
import SignIn from "./page/SignIn";
import SignUp from "./page/SignUp";
import HomePage from "./page/HomePage";
import ToastProvider from "./components/common/ToastProvider";
import Layout from "./layout/Layout";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { useAppDispatch, useAppSelector } from "./store/store";
import { isUserLoggedIn, logout } from "./store/auth/AuthSlice";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

const Notification = ({
  message,
  navigateUser,
}: {
  message: string;
  navigateUser: () => void;
}) => {
  // if (!message) return null;

  return (
    <div className="bg-black/50 text-white flex items-center justify-center w-screen h-screen fixed top-0 right-0 ">
      <div className="flex flex-col items-center gap-4 ">
        <p>{message}</p>
        <Button onClick={navigateUser}>Sign-In</Button>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isUserAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  const isLoading = useAppSelector((state) => state.auth.isLoading);

  if (isLoading) {
    return <div className="loader">Loading...</div>;
  }

  return isUserAuthenticated ? children : <Navigate to="/signup" />;
};

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const isTokenExpired = (token: string) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // Handle token expiration
  useEffect(() => {
    const token =
      Cookies.get("token") || (localStorage.getItem("token") as string);

    if (isTokenExpired(token)) {
      setNotification("Your session has expired. Please sign in again.");
      dispatch(logout());

      if (location.pathname === "/") {
        navigate("/signin");
      }
    } else {
      // Set a timeout to handle future token expiration
      const payload = JSON.parse(atob(token.split(".")[1]));
      // console.log("payload :>> ", payload);
      const expirationTime = payload.exp * 1000 - Date.now();

      console.log("MIN", ((expirationTime / 1000) * 1) / 60);

      const timer = setTimeout(() => {
        if (location.pathname === "/") {
          // setNotification("Your session has expired. Please sign in again.");
          dispatch(logout());
          navigate("/signin");
        }
      }, expirationTime);

      return () => clearTimeout(timer);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
    if (token && !isTokenExpired(token)) {
      dispatch(isUserLoggedIn({ token, user: payload }));
      setInitialLoading(false);
      navigate("/");
    } else {
      setInitialLoading(false);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (notification) {
      console.log("notification :>> ", notification);
      // alert(notification);
      setNotification("");
    }
  }, [notification]);

  if (initialLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader size={32} color="white" className="animate-spin" />
      </div>
    );
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
      <ToastProvider />
      {notification && (
        <Notification
          message={notification}
          navigateUser={() => navigate("/signin")}
        />
      )}
    </>
  );
}

export default App;
