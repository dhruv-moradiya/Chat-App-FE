import { memo } from "react";
import { AxiosError } from "axios";
import { SentFriendRequestData } from "@/types/ApiResponse.types";
import { sendFriendRequest } from "@/api";
import { Button } from "@/components/ui/button";
import { Handshake } from "lucide-react";

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

      <p className="text-lg min-w-40">{name}</p>

      <Button
        variant="outline"
        className="p-0 px-4 text-green-500 transition-colors duration-150 hover:bg-green-500"
        onClick={sendFriendRequestFun}
      >
        <Handshake size={22} />
      </Button>
    </div>
  );
};

export default memo(SearchedUser);
