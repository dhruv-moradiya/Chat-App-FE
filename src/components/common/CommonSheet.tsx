import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const CommonSheet = ({
  name,
  content,
  position = "bottom", // Default position is right
}: {
  name: string;
  content: JSX.Element;
  position?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "xl" | "full";
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          {name}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 border-none rounded-t-xl" side={position}>
        {content}
      </SheetContent>
    </Sheet>
  );
};

export default CommonSheet;
