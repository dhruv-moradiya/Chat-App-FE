import { Skeleton } from "@/components/ui/skeleton";

const LoaderForChatEntry = () => {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
      <div className="flex h-12 w-full flex-col items-center gap-2 rounded-lg">
        <Skeleton className="h-4 w-full flex-1 rounded-lg" />
        <Skeleton className="h-4 w-full flex-1 rounded-lg" />
      </div>
    </div>
  );
};

export default LoaderForChatEntry;
