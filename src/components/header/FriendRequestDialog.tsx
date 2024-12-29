import { Check, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FriendRequestDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <UserPlus size={24} />
      </DialogTrigger>
      <DialogContent className="scrollbar sm:max-w-[600px] max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Fried Request</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {new Array(10).fill(0).map((_, index) => (
            <div key={index} className="py-2 flex items-center gap-2">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 ml-auto rounded-full overflow-hidden">
                  <img
                    src="https://blogger.googleusercontent.com/img/a/AVvXsEgABZlK0MI0QGE0VRqnrWSTRtmMmzMGfdnJcsxvJViHzXbHuywZLz0xqx8MXsHDa1XQeqsFLpARJ8m2DIrHxHYj_hodbWARPhQK6Wbt1LYJ17DLAKhHZAlFW0tr36Q92ZgoznSHuM4WK_VFwhYjDTUqfy1K3GRUNn0SmYGmIqy1zsKqya4-bJV-YU5niCg"
                    alt={"user"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p>Woonbin Send You a Friend Request</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  className="p-0 px-4 text-green-500 transition-colors duration-150 hover:bg-green-500"
                >
                  <Check />
                </Button>
                <Button
                  variant="outline"
                  className="p-0 px-4 text-red-500  transition-colors duration-150 hover:bg-red-500"
                >
                  <X />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequestDialog;
