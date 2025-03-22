import CommonSheet from "@/components/common/CommonSheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chatDetailSelector, closeChatDetail } from "@/store/chatDetailSidebar/ChatDetailSlice";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const ChatDetails = () => {
  const dispatch = useDispatch();

  const { isOpen: isChatDetailOpen } = useSelector((state) => chatDetailSelector(state));

  return (
    <div
      className={cn(
        "w-0 overflow-hidden transition-all duration-300",
        isChatDetailOpen && "w-80 px-2"
      )}
    >
      <div className="my-4 flex items-center justify-between">
        <h3 className="my-4 text-xl">Chat Details</h3>
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

      <div className="my-4 flex items-center justify-between">
        <h4>Photos and Videos</h4>
        <Button variant="ghost" size="sm">
          See all
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {new Array(4).fill(0).map((_, index) => (
          <div key={index} className="h-28 w-full overflow-hidden rounded-lg">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOncwcdfdMqq42OOJp3l7u5qBLrlZFGYjJ8j8FIo_uU-PYB7fOBL6FyXk&s"
              alt="media"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div>
        <div className="my-4 flex items-center justify-between">
          <h4>Shared Link</h4>

          <CommonSheet position="bottom" name="See all" content={<AllLinks />} />
        </div>

        <div className="flex items-center space-x-2">
          <ul className="space-y-2">
            {new Array(4).fill(0).map((_, index) => (
              <li key={index} className="flex items-center space-x-2">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOncwcdfdMqq42OOJp3l7u5qBLrlZFGYjJ8j8FIo_uU-PYB7fOBL6FyXk&s"
                  alt="member"
                  className="h-8 w-8 rounded-xl"
                />
                <a href="#" className="text-sm text-blue-500">
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
      <ul className="scrollbar max-h-[80vh] space-y-4 overflow-y-scroll">
        {new Array(100).fill(0).map((_, index) => (
          <li key={index} className="flex items-center space-x-2">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOncwcdfdMqq42OOJp3l7u5qBLrlZFGYjJ8j8FIo_uU-PYB7fOBL6FyXk&s"
              alt="member"
              className="h-10 w-10 rounded-xl"
            />
            <a href="#" className="text-sm text-blue-500">
              https://www.example.com
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};
