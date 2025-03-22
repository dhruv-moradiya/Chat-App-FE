import { cn } from "@/lib/utils";
import { Attachment } from "@/types/ApiResponse.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RenderAttachmentProps {
  attachments: Attachment[];
  isSender: boolean;
}

const RenderAttachments = ({ attachments, isSender }: RenderAttachmentProps) => {
  const MAX_VISIBLE_ATTACHMENTS = 3;

  const visibleAttachments =
    attachments.length > MAX_VISIBLE_ATTACHMENTS
      ? attachments.slice(0, MAX_VISIBLE_ATTACHMENTS)
      : attachments;

  const renderDialogContent = () => (
    <DialogContent className="flex h-[600px] w-[70vw] flex-col gap-4">
      <DialogTitle>Preview</DialogTitle>
      <DialogDescription className="hidden">
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
      <ScrollArea className="h-full w-full rounded-md border-none">
        {attachments.map((attachment, index) => (
          <div
            key={`attachment-full-${index}`}
            className="my-6 !h-[400px] w-full cursor-pointer overflow-hidden rounded-3xl"
          >
            <img
              src={attachment.url}
              alt={`attachment-${index + 1}`}
              className="h-full w-full rounded-3xl object-contain"
            />
          </div>
        ))}
      </ScrollArea>
    </DialogContent>
  );

  const attachmentElements = visibleAttachments.map((attachment, index) => (
    <Dialog key={index}>
      <DialogTrigger>
        <div className="flex h-20 w-20 cursor-pointer items-center gap-2 overflow-hidden rounded-lg">
          <img
            src={attachment.url}
            alt={`attachment-thumbnail-${index + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      </DialogTrigger>
      {renderDialogContent()}
    </Dialog>
  ));

  if (attachments.length > MAX_VISIBLE_ATTACHMENTS) {
    attachmentElements.push(
      <Dialog key="extra-attachments">
        <DialogTrigger>
          <div className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary text-white">
            +{attachments.length - MAX_VISIBLE_ATTACHMENTS}
          </div>
        </DialogTrigger>
        {renderDialogContent()}
      </Dialog>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-2",
        attachments.length >= 2 ? "grid-cols-2" : "grid-cols-1",
        isSender ? "ml-auto place-items-end" : "mr-auto place-items-start"
      )}
    >
      {attachmentElements}
    </div>
  );
};

export default RenderAttachments;
