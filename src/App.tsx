import Cookies from "js-cookie";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isUserLoggedIn, logout } from "./store/auth/AuthSlice";
import { useAppDispatch, useAppSelector } from "./store/store";
import HomePage from "./page/HomePage";
import SignIn from "./page/SignIn";
import SignUp from "./page/SignUp";
import { Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import { Loader } from "lucide-react";

const Notification = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  if (!message) return null;

  return (
    <div className="notification-container">
      <div className="notification">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
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

  return isUserAuthenticated ? children : <Navigate to="/signin" />;
};

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
      navigate("/signin");
    } else {
      // Set a timeout to handle future token expiration
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("payload :>> ", payload);
      const expirationTime = payload.exp * 1000 - Date.now();

      console.log("MIN", ((expirationTime / 1000) * 1) / 60);

      const timer = setTimeout(() => {
        setNotification("Your session has expired. Please sign in again.");
        dispatch(logout());
        navigate("/signin");
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
      // alert(notification);
      <Notification
        message={notification}
        onClose={() => setNotification("")}
      />;
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
    </>
  );
}

export default App;
