import CommonSheet from "@/components/common/CommonSheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  chatDetailSelector,
  closeChatDetail,
} from "@/store/chatDetail/ChatDetailSlice";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const ChatDetails = () => {
  const dispatch = useDispatch();

  const { isOpen: isChatDetailOpen } = useSelector((state) =>
    chatDetailSelector(state)
  );

  return (
    <div
      className={cn(
        "w-0 overflow-hidden transition-all duration-300",
        isChatDetailOpen && "w-80 px-2"
      )}
    >
      <div className="flex items-center justify-between my-4">
        <h3 className="text-xl my-4">Chat Details</h3>
        <Button
          className="p-2"
          variant="ghost"
          onClick={() => {
            dispatch(closeChatDetail());
          }}
        >
          <X size={20} />
        </Button>
      </div>

      <div className="flex items-center justify-between my-4">
        <h4>Photos and Videos</h4>
        <Button variant="ghost" size="sm">
          See all
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {new Array(4).fill(0).map((_, index) => (
          <div key={index} className="w-full h-28 overflow-hidden rounded-lg">
            <img
              src="https://via.placeholder.com/150"
              alt="media"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between my-4">
          <h4>Shared Link</h4>

          <CommonSheet
            position="bottom"
            name="See all"
            content={<AllLinks />}
          />
        </div>

        <div className="flex items-center space-x-2">
          <ul className="space-y-2">
            {new Array(4).fill(0).map((_, index) => (
              <li key={index} className="flex items-center space-x-2">
                <img
                  src="https://via.placeholder.com/150"
                  alt="member"
                  className="w-8 h-8 rounded-xl"
                />
                <a href="#" className="text-blue-500 text-sm">
                  https://www.example.com
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;

const AllLinks = () => {
  return (
    <>
      <ul className="scrollbar overflow-y-scroll space-y-4 max-h-[80vh]">
        {new Array(100).fill(0).map((_, index) => (
          <li key={index} className="flex items-center space-x-2">
            <img
              src="https://via.placeholder.com/150"
              alt="member"
              className="w-10 h-10 rounded-xl"
            />
            <a href="#" className="text-blue-500 text-sm">
              https://www.example.com
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};
