import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DeleteMessageModalForSelectedParticipants = ({
  toggleModal,
  deleteMessageForSelectedParticipants,
  isSelectedAllMessageFromCurrentUserSide,
}: {
  toggleModal: () => void;
  deleteMessageForSelectedParticipants: (isForEveryone: boolean) => void;
  isSelectedAllMessageFromCurrentUserSide: boolean;
}) => {
  return (
    <div className="flex flex-col gap-4 min-w-96">
      <p className="text-md mb-4">Delete Message?</p>
      <div
        className={cn(
          "self-end flex flex-row items-end gap-4",
          isSelectedAllMessageFromCurrentUserSide ? "flex-col" : "flex-row"
        )}
      >
        {isSelectedAllMessageFromCurrentUserSide && (
          <Button
            variant="outline"
            onClick={() => deleteMessageForSelectedParticipants(true)}
          >
            Delete for everyone
          </Button>
        )}
        <Button
          variant="outline"
          className={cn(
            !isSelectedAllMessageFromCurrentUserSide &&
              "bg-primary/80 text-black/80 hover:bg-primary/90"
          )}
          onClick={() => deleteMessageForSelectedParticipants(false)}
        >
          Delete for me
        </Button>

        <Button variant="outline" onClick={toggleModal}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export { DeleteMessageModalForSelectedParticipants };
