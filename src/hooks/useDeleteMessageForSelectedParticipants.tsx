import { deleteMessageForSelectedParticipantsApi } from "@/api";
import { AxiosError } from "axios";
import { useState } from "react";

interface UseDeleteMessageForSelectedParticipants {
  deleteMessages: (
    selectedMessages: string[],
    isDeletedForAll: boolean,
    onSuccess?: () => void
  ) => Promise<void>;
  isDeleting: boolean;
  error: string;
}

const useDeleteMessageForSelectedParticipants = (): UseDeleteMessageForSelectedParticipants => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const deleteMessages = async (
    selectedMessages: string[],
    isDeletedForAll: boolean,
    onSuccess?: () => void
  ): Promise<void> => {
    try {
      setIsDeleting(true);
      await deleteMessageForSelectedParticipantsApi(selectedMessages, isDeletedForAll);
      onSuccess && onSuccess();
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "An error occurred");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteMessages, isDeleting, error };
};

export default useDeleteMessageForSelectedParticipants;
