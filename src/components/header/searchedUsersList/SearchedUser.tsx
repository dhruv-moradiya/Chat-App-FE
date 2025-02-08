import { sendFriendRequest } from "@/api";
import { Button } from "@/components/ui/button";
import { capitalizeFirstLetter } from "@/lib/utils";
import { SentFriendRequestData } from "@/types/ApiResponse.types";
import { AxiosError } from "axios";
import { Heart } from "lucide-react";
import { memo } from "react";

type SearchedUserProps = {
  imgSrc: string;
  name: string;
  _id: string;
};

const SearchedUser = ({ imgSrc, name, _id }: SearchedUserProps) => {
  const sendFriendRequestFun = async () => {
    try {
      const data: SentFriendRequestData = await sendFriendRequest(_id);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error during login:", error.response?.data.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="w-full flex items-center justify-between gap-4">
      <div className="w-10 h-10 rounded-lg overflow-hidden">
        <img src={imgSrc} alt={name} />
      </div>

      <p className="text-lg min-w-40">{capitalizeFirstLetter(name)}</p>

      <Button
        variant="outline"
        className="p-0 px-4 text-white-500 hover:border-green-500 rounded-lg transition-all duration-150 active:scale-90 active:border-green-600"
        onClick={sendFriendRequestFun}
      >
        <Heart size={18} />
      </Button>
    </div>
  );
};

export default memo(SearchedUser);
