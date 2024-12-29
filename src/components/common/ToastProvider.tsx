import React from "react";
import { Bell, Check, CircleX, Info, Loader, OctagonAlert } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          backgroundColor: "#14151B",
          color: "#fff",
          fontSize: "14px",
          borderRadius: "8px",
          padding: "12px 24px",
          animation: "slideInFromRight 0.3s ease-out",
        },
        className: "toast",
      }}
    />
  );
};

export const showSuccessToast = (message: string): void => {
  toast.success(message, {
    style: {
      border: "1px solid #4caf50",
    },
    icon: <Check size={18} />,
    className: "toast",
  });
};

export const showErrorToast = (message: string): void => {
  toast.error(message, {
    style: {
      border: "1px solid #f44336",
    },
    icon: <CircleX size={18} />,
    className: "toast",
  });
};

export const showInfoToast = (message: string): void => {
  toast(message, {
    icon: <Info size={18} />,
    style: {
      border: "1px solid #2196f3",
    },
    className: "toast",
  });
};

export const showWarnToast = (message: string): void => {
  toast(message, {
    icon: <OctagonAlert size={18} />,
    style: {
      border: "1px solid #ff9800",
    },
    className: "toast",
  });
};

export const showNotificationToast = (message: string): void => {
  toast(message, {
    icon: <Bell size={18} />,
    style: {
      border: "1px solid #673ab7",
    },
    className: "toast",
  });
};

export const showPromiseToast = (promise: Promise<any>): void => {
  toast.promise(promise, {
    loading: <Loader className="animate-spin" size={18} />,
    success: <Check size={18} />,
    error: <CircleX size={18} />,
  });
};

export default ToastProvider;
