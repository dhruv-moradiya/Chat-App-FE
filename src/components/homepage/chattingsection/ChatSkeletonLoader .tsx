import { Skeleton } from "@/components/ui/skeleton";

const generateRandomWidth = (min: number, max: number) => {
  return `${Math.floor(Math.random() * (max - min + 1) + min)}px`;
};

const SkeletonLoader = ({ numberOfSkeletons = 8 }: { numberOfSkeletons: number }) => {
  const skeletons = Array.from({ length: numberOfSkeletons });

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {skeletons.map((_, index) => (
        <Skeleton
          key={index}
          className={`h-6 ${index % 2 === 0 ? "self-end" : "self-start"} rounded-lg`}
          style={{
            width: generateRandomWidth(100, 450),
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
