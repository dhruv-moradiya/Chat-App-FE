import moment from "moment";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { AxiosError, AxiosResponse } from "axios";
import { ChatMessage } from "@/types/ApiResponse.types";
import { showErrorToast } from "@/components/common/ToastProvider";

type ChatAppResponse = {
  statusCode: number;
  message: string;
  data: any;
  success: boolean;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const errorLogger = (error: unknown, doToast?: boolean) => {
  if (error instanceof AxiosError) {
    console.error("Axios error:", {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      response: error.response?.data,
    });
    showErrorToast(error.response?.data?.message);
  } else if (error instanceof Error) {
    console.error("General error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    doToast && showErrorToast(error.message);
  } else {
    console.error("Unknown error type:", error);
    doToast && showErrorToast("Something went wrong");
  }
};

const requestHandler = async (
  api: () => Promise<AxiosResponse<ChatAppResponse, any>>,
  setLoading?: ((loading: boolean) => void) | null
): Promise<ChatAppResponse> => {
  try {
    setLoading && setLoading(true);
    const response = await api();

    const { data } = response;

    if (data?.success) {
      return data; // Return the data directly`
    } else {
      throw new Error(data?.message || "Request failed");
    }
  } catch (error: any) {
    console.log(error);
    // Handle authentication errors specifically
    if ([401, 403].includes(error?.response?.status)) {
      console.log("USER IS UNAUTHORIZED");
      localStorage.clear();
      if (typeof window !== "undefined") {
        // window.location.href = "/signin";
      }
    }

    // Throw a standardized error for thunks to handle
    if (error?.response?.data?.message) {
      return Promise.reject(error?.response?.data?.message);
    }
    throw new Error(error?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading && setLoading(false);
  }
};

const capitalizeFirstLetter = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const playNotificationSound = (soundUrl = "/to_the_point.mp3") => {
  const audio = new Audio(soundUrl);
  audio.currentTime = 0;
  audio.play().catch((error) => {
    console.error("Failed to play the notification sound:", error);
  });
};

const isNewDate = (messages: ChatMessage[], index: number) => {
  if (index === 0) return true;
  const currentDate = moment(messages[index]?.createdAt).format("DD-MM-YYYY");
  const prevDate = moment(messages[index - 1]?.createdAt).format("DD-MM-YYYY");
  return currentDate !== prevDate;
};

export { errorLogger, requestHandler, capitalizeFirstLetter, playNotificationSound, isNewDate };
