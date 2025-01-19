import { sendMessage } from "@/api";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { useAppSelector } from "@/store/store";
import { Mic, Plus, Smile, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

function CustomInput({
  replyedMessage,
  setReplyedMessage,
}: {
  replyedMessage: string | null;
  setReplyedMessage: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("chatId");

  const { activeChatDetails, activeChatId } = useAppSelector(
    (state) => state.activeChat
  );

  const messageDetails = activeChatDetails?.messages.find(
    (message) => message._id === replyedMessage
  );
  const { myChats } = useAppSelector((state) => state.myChats);

  const senderName =
    myChats
      .find((chat) => chat._id === activeChatId)
      ?.participants.find(
        (participant) => participant._id === messageDetails?.sender
      )?.username || "Anonymous";

  const [cursorPosition, setCursorPosition] = useState<Range | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [users] = useState(["John Doe", "Jane Smith", "Alice Johnson"]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const plusButtonRef = useRef<HTMLDivElement | null>(null);
  const [isUserTyping, setIsUserTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsUserTyping(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isUserTyping]);

  const handleOnInput = () => {
    setIsUserTyping(true);
    const selection: Selection | null = window.getSelection();
    if (selection?.anchorNode) {
      const textBeforeCursor = selection.anchorNode.textContent?.slice(
        0,
        selection.anchorOffset
      );
      if (textBeforeCursor?.endsWith("@")) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setPopupPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left,
          });
          setShowPopup(true);
          console.log(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error("Error retrieving range or position:", error);
        }
      } else {
        setShowPopup(false);
      }
    } else {
      setShowPopup(false);
    }
  };
  const handleCursorChange = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setCursorPosition(selection.getRangeAt(0));
    }
  };
  const handleItemSelect = (name: string) => {
    if (!cursorPosition || !divRef.current) return;
    const range = cursorPosition;
    const selection: Selection | null = window.getSelection();
    const startOffset = range.startOffset;
    // Remove the '@' character before adding the chip
    const textNode = range.startContainer;
    if (textNode.nodeType === Node.TEXT_NODE) {
      const textContent = textNode.textContent as string;
      const updatedText =
        textContent.slice(0, startOffset - 1) + textContent.slice(startOffset); // Remove '@'
      textNode.textContent = updatedText;
      // Adjust the range after text update
      range.setStart(textNode, startOffset - 1);
      range.setEnd(textNode, startOffset - 1);
    }
    // Create and insert the chip
    const chip = document.createElement("span");
    chip.textContent = `@${name}`;
    chip.className = "chip";
    chip.contentEditable = "false";
    range.insertNode(chip);
    // Move cursor after the chip
    const newRange = document.createRange();
    newRange.setStartAfter(chip);
    newRange.collapse(true);
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    setShowPopup(false);
    handleCursorChange();
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (showPopup) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % users.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + users.length) % users.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex !== -1) {
          handleItemSelect(users[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        setShowPopup(false);
      }
    }
  };
  const handleClickOutside = (e: MouseEvent) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(e.target as Node) &&
      !divRef.current?.contains(e.target as Node)
    ) {
      setShowPopup(false);
    }
  };
  const handleSentMessage = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.metaKey
    ) {
      e.preventDefault();
      console.log("Message :- ", divRef.current?.textContent);

      const response = await sendMessage({
        chatId: paramValue as string,
        content: divRef.current?.textContent as string,
      });
      console.log("response :>> ", response);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPopup, selectedIndex, users]);
  const toggleMenu = () => {
    if (!menuOpen && plusButtonRef.current) {
      setMenuStyle({
        position: "absolute",
        left: 0,
        top: "-180%",
        transformOrigin: "top left",
      });
    }
    setMenuOpen((prev) => !prev);
  };
  const buttonRef = useRef(null);

  return (
    <div className="w-full grid grid-flow-row bg-primary-foreground">
      {replyedMessage && (
        <div className={cn("w-full min-h-14 flex items-center p-2 pb-0")}>
          <div className="min-w-[50px] flex items-center justify-center">1</div>
          <div className="flex-1 bg-black border-l-4 h-full border-primary rounded-lg text-sm py-2 flex flex-col gap-[0.5px] justify-center px-3">
            <p className="text-primary">{capitalizeFirstLetter(senderName)}</p>
            <p>{messageDetails?.content}</p>
          </div>
          <div className="min-w-[50px] flex items-center justify-center">
            <X onClick={() => setReplyedMessage(null)} />
          </div>
        </div>
      )}

      <div className="w-full flex items-center gap-3 p-2">
        <button ref={buttonRef}>
          <Smile />
        </button>
        <button
          onClick={toggleMenu}
          className={`p-1 flex items-center justify-center rounded-full transition-all duration-300 
    ${menuOpen ? "bg-gray-700 rotate-180" : "bg-slate-600 text-white"}`}
        >
          <div className="relative w-6 h-6" ref={plusButtonRef}>
            <Plus
              className={`absolute w-6 h-6 text-white transition-transform duration-300 
        ${menuOpen ? "scale-0 rotate-90" : "scale-100 rotate-0"}`}
            />
            <X
              className={`absolute w-6 h-6 text-white transition-transform duration-300 
        ${menuOpen ? "scale-100 rotate-0" : "scale-0 rotate-90"}`}
            />
          </div>
        </button>
        <div
          className="flex-1 scrollbar min-h-12 max-h-20 overflow-auto bg-slate-800 text-white rounded-lg p-3"
          ref={divRef}
          contentEditable
          onInput={handleOnInput}
          onMouseUp={handleCursorChange}
          onKeyUp={handleCursorChange}
          onKeyDown={handleSentMessage}
        ></div>
        <AudioRecorder />
        {menuOpen && <ExtraMenu menuStyle={menuStyle} />}
        {showPopup && (
          <div
            ref={popupRef}
            style={{
              position: "fixed",
              // top: popupPosition.top,
              bottom: window.screen.availHeight - popupPosition.top - 50,
              left: popupPosition.left,
              background: "black",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {users.map((item, index) => (
              <div
                key={item}
                onClick={() => handleItemSelect(item)}
                style={{
                  padding: "5px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  paddingLeft: "10px",
                  backgroundColor:
                    selectedIndex === index ? "#2b2b2b" : "black ",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
const ExtraMenu = ({ menuStyle }: any) => {
  const handleMenuOptionsClick = (
    e: React.MouseEvent<HTMLUListElement, MouseEvent>
  ) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "LI") {
      console.log(`Option clicked: ${target.textContent}`);
    }
  };
  return (
    <div
      className="bg-black rounded p-4 transition-transform duration-300 ease-in-out transform scale-0 opacity-0 animate-open-menu"
      style={menuStyle}
    >
      <ul
        onClick={handleMenuOptionsClick}
        className="flex flex-col items-center gap-2 text-white"
      >
        <li>Photos</li>
        <li>Videos</li>
        <li>Documents</li>
      </ul>
    </div>
  );
};

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const handleStartRecording = async () => {
    console.log("START RECORDING");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };
  const handleStopRecording = () => {
    console.log("STOP RECORDING");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  return (
    <div className="audio-recorder">
      <div className="controls">
        {isRecording ? (
          <button onClick={handleStopRecording} className="stop-button">
            Stop Recording
          </button>
        ) : (
          <button onClick={handleStartRecording} className="start-button">
            <Mic />
          </button>
        )}
      </div>
      {audioUrl && <div className="playback"></div>}
    </div>
  );
};
export default CustomInput;
// https://i.pinimg.com/736x/0a/86/e5/0a86e5d0c6d593e0091d197cfebcdd7d.jpg
// https://i.pinimg.com/736x/0a/86/e5/0a86e5d0c6d593e0091d197cfebcdd7d.jpg
