import { sendFriendRequest } from "@/api";
import { Button } from "@/components/ui/button";
import { FriendRequestResponse } from "@/type";
import { Handshake } from "lucide-react";
import { memo } from "react";

type SearchedUserProps = {
  imgSrc: string;
  name: string;
  _id: string;
};

const SearchedUser = ({ imgSrc, name, _id }: SearchedUserProps) => {
  const sendFriendRequestFun = async () => {
    const data: FriendRequestResponse = await sendFriendRequest(_id);

    console.log("data :>> ", data);
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
