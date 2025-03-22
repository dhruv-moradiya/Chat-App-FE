import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { closeModal } from "@/store/chatDetailSidebar/ChatDetailSlice";
import useDeleteMessageForSelectedParticipants from "@/hooks/useDeleteMessageForSelectedParticipants";
import { useState } from "react";
import { useAppDispatch } from "@/store/store";
import { SelectedMessagesForInteraction } from "@/types/Common.types";

interface DeleteMessageModalForSelectedParticipantsProps {
  selectedMessage: string[];
  setSelectedMessage: React.Dispatch<React.SetStateAction<SelectedMessagesForInteraction | null>>;
  isSelectedAllMessageFromCurrentUserSide: boolean;
}

const DeleteMessageModalForSelectedParticipants = ({
  selectedMessage,
  setSelectedMessage,
  isSelectedAllMessageFromCurrentUserSide,
}: DeleteMessageModalForSelectedParticipantsProps) => {
  const dispatch = useAppDispatch();
  const { deleteMessages } = useDeleteMessageForSelectedParticipants();
  const [deletingForMe, setDeletingForMe] = useState(false);
  const [deletingForEveryone, setDeletingForEveryone] = useState(false);

  const handleDelete = (isForEveryone: boolean) => {
    if (isForEveryone) {
      setDeletingForEveryone(true);
    } else {
      setDeletingForMe(true);
    }

    deleteMessages(selectedMessage, isForEveryone, () => {
      dispatch(closeModal());
      setSelectedMessage(null);
      setDeletingForEveryone(false);
      setDeletingForMe(false);
    });
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <div className="flex min-w-96 flex-col gap-4">
      <p className="text-md mb-4">Delete Message?</p>
      <div
        className={cn(
          "flex w-full items-end justify-end gap-4 self-end",
          isSelectedAllMessageFromCurrentUserSide ? "flex-col" : "flex-row"
        )}
      >
        {isSelectedAllMessageFromCurrentUserSide && (
          <Button
            variant="outline"
            onClick={() => handleDelete(true)}
            disabled={deletingForEveryone}
          >
            {deletingForEveryone ? "Deleting..." : "Delete for everyone"}
          </Button>
        )}
        <Button
          variant="outline"
          className={cn(
            "w-fit",
            !isSelectedAllMessageFromCurrentUserSide &&
              "bg-primary/80 text-black/80 hover:bg-primary/90"
          )}
          onClick={() => handleDelete(false)}
          disabled={deletingForMe}
        >
          {deletingForMe ? "Deleting..." : "Delete for me"}
        </Button>
        <Button variant="outline" className="w-fit" onClick={handleCloseModal}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export { DeleteMessageModalForSelectedParticipants };
