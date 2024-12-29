import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosResponse } from "axios";

type ChatAppResponse = {
  statusCode: number;
  message: string;
  data: any;
  success: boolean;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const requestHandler = async (
  api: () => Promise<AxiosResponse<ChatAppResponse, any>>,
  setLoading?: ((loading: boolean) => void) | null
): Promise<ChatAppResponse> => {
  try {
    setLoading && setLoading(true);
    const response = await api();

    const { data } = response;

    if (data?.success) {
      return data; // Return the data directly
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
