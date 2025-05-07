import { Button } from "@/components/ui/button";
import { Pin, X } from "lucide-react";
import { memo } from "react";

const SelectAttachments = () => {
  return (
    <div className="">
      <Button className="rounded-xl border-[1px] bg-transparent transition-all duration-150 hover:bg-primary/10 active:scale-95">
        <Pin />
        <input type="file" className="hidden" accept="image/*" />
      </Button>
    </div>
  );
};

export default memo(SelectAttachments);

export const ImageContainer = ({ onRemove, media }: { onRemove: () => void; media: File }) => {
  return (
    <div className="relative size-16 cursor-pointer">
      <img
        src={media ? URL.createObjectURL(media) : ""}
        alt="Media"
        className="h-full w-full rounded-2xl object-cover"
      />
      <button
        onClick={onRemove}
        className="absolute -right-2.5 -top-2.5 rounded-full border-[4px] border-[#14151b] bg-white p-0.5 shadow-sm"
      >
        <X className="text-black" size={14} />
      </button>
    </div>
  );
};

const ImageOverlay = () => {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center rounded-2xl bg-red-500 text-white opacity-0 transition-all duration-150 group-hover:opacity-100">
      <p className="text-sm">Preview</p>

      <div className="">
        <img
          src="https://pbs.twimg.com/media/F4yaqjsWEAE4eRz?format=jpg&name=4096x4096"
          alt=""
          className="h-full w-full rounded-2xl object-cover"
        />
      </div>

      <button className="absolute right-2.5 top-2.5 rounded-full border-[4px] border-[#14151b] bg-white p-0.5 shadow-sm">
        <X className="text-black" size={20} />
      </button>
    </div>
  );
};
