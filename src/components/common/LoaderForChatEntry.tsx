import { Skeleton } from "@/components/ui/skeleton";

const LoaderForChatEntry = () => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 ">
      <div>
        <Skeleton className="w-12 h-12 rounded-lg" />
      </div>
      <div className="w-full h-12 rounded-lg flex flex-col items-center gap-2">
        <Skeleton className="flex-1 h-4 w-full rounded-lg" />
        <Skeleton className="flex-1 h-4 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default LoaderForChatEntry;
