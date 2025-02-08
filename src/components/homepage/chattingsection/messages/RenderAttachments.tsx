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

const RenderAttachments = ({
  attachments,
  isSender,
}: RenderAttachmentProps) => {
  const MAX_VISIBLE_ATTACHMENTS = 3;

  const visibleAttachments =
    attachments.length > MAX_VISIBLE_ATTACHMENTS
      ? attachments.slice(0, MAX_VISIBLE_ATTACHMENTS)
      : attachments;

  const renderDialogContent = () => (
    <DialogContent className="w-[70vw] h-[600px] flex flex-col gap-4">
      <DialogTitle>Preview</DialogTitle>
      <DialogDescription className="hidden">
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
      <ScrollArea className="h-full w-full rounded-md border-none">
        {attachments.map((attachment, index) => (
          <div
            key={`attachment-full-${index}`}
            className="w-full !h-[400px] rounded-3xl overflow-hidden cursor-pointer my-6"
          >
            <img
              src={attachment.url}
              alt={`attachment-${index + 1}`}
              className="w-full h-full object-contain rounded-3xl"
            />
          </div>
        ))}
      </ScrollArea>
    </DialogContent>
  );

  const attachmentElements = visibleAttachments.map((attachment, index) => (
    <Dialog key={index}>
      <DialogTrigger>
        <div className="w-20 h-20 overflow-hidden rounded-lg flex items-center gap-2 cursor-pointer">
          <img
            src={attachment.url}
            alt={`attachment-thumbnail-${index + 1}`}
            className="w-full h-full object-cover"
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
          <div className="w-20 h-20 overflow-hidden rounded-lg flex items-center justify-center bg-primary text-white cursor-pointer">
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
        "grid  gap-2",
        attachments.length >= 2 ? "grid-cols-2" : "grid-cols-1",
        isSender ? "ml-auto place-items-end" : "mr-auto place-items-start"
      )}
    >
      {attachmentElements}
    </div>
  );
};

export default RenderAttachments;
