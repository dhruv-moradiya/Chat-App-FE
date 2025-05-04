import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import { sendAttachments } from "@/api";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { sendMessage } from "@/store/activeChat/ActiveChatSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { UserPreview } from "@/types/ApiResponse.types";
import { SelectedMessagesForInteraction } from "@/types/Common.types";
import { Mic, Pin, Send, X } from "lucide-react";
import { showWarnToast } from "../ToastProvider";

function CustomInput({
  selectedMessage,
  setSelectedMessage,
}: {
  selectedMessage: SelectedMessagesForInteraction | null;
  setSelectedMessage: React.Dispatch<React.SetStateAction<SelectedMessagesForInteraction | null>>;
}) {
  const dispatch = useAppDispatch();
  const divRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  const isMobileScreen = useMediaQuery({ maxWidth: 767 });
  const paramValue = searchParams.get("chatId");
  const mobileParamValue = useParams().chatId;

  const { activeChatDetails, activeChatId } = useAppSelector((state) => state.activeChat);
  const { user } = useAppSelector((state) => state.auth);

  const messageDetails = activeChatDetails?.messages.find(
    (message) =>
      selectedMessage &&
      selectedMessage.type === "Reply" &&
      selectedMessage.messages[0]._id === message?._id
  );
  const { myChats } = useAppSelector((state) => state.myChats);

  const senderName =
    myChats
      .find((chat) => chat._id === activeChatId)
      ?.participants.find((participant) => participant._id === messageDetails?.sender._id)
      ?.username || "Anonymous";

  const [users, setUsers] = useState<UserPreview[]>([]); // Users details to mention
  const [showPopup, setShowPopup] = useState(false); // Show mention popup
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [cursorPosition, setCursorPosition] = useState<Range | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1); // Selected user index in popup
  const [listOfMentionedUsers, setListOfMentionedUsers] = useState<string[]>([]);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [fileInputValue, setFileInputValue] = useState<File[] | null>(null);

  useEffect(() => {
    const chat = myChats.find(
      (chat) => chat._id === (isMobileScreen ? mobileParamValue : paramValue)
    );
    if (!chat) return;

    const userData = chat.participants.filter((p) => p.username !== user!.username);

    if (chat.isGroup) {
      userData.unshift({
        _id: "all",
        username: "all",
        email: "all",
        profilePicture: "",
      });
    }

    setUsers(userData);
  }, [paramValue, mobileParamValue, myChats]);

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
      const textBeforeCursor = selection.anchorNode.textContent?.slice(0, selection.anchorOffset);
      if (textBeforeCursor?.endsWith("@")) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setPopupPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left,
          });
          setShowPopup(true);
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
      const updatedText = textContent.slice(0, startOffset - 1) + textContent.slice(startOffset); // Remove '@'
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

  // Handle keyboard events for popup
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!showPopup) return;

    e.preventDefault();
    let newIndex = selectedIndex;

    switch (e.key) {
      case "ArrowDown":
        newIndex = (selectedIndex + 1) % users.length;
        break;
      case "ArrowUp":
        newIndex = (selectedIndex - 1 + users.length) % users.length;
        break;
      case "Enter":
        if (selectedIndex !== -1) {
          handleItemSelect(users[selectedIndex].username);
          setListOfMentionedUsers((prev) => [...prev, users[newIndex]._id]);
        }
        break;
      case "Escape":
        setShowPopup(false);
        return;
      default:
        return;
    }

    setSelectedIndex(newIndex);
  };

  // Close popup when clicked outside
  const handleClickOutside = (e: MouseEvent) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(e.target as Node) &&
      !divRef.current?.contains(e.target as Node)
    ) {
      setShowPopup(false);
    }
  };

  const lastMessageId = useMemo(() => {
    return activeChatDetails?.messages?.[activeChatDetails.messages.length - 1]?._id;
  }, [activeChatDetails?.messages]);

  useEffect(() => {
    if (!lastMessageId) return;

    if (fileInputValue && fileInputValue.length > 0) {
      sendAttachments({
        attachments: fileInputValue,
        chatId: isMobileScreen ? (mobileParamValue as string) : (paramValue as string),
        messageId: lastMessageId,
      })
        .then(() => {
          setFileInputValue(null);
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            console.log("error.response?.data :>> ", error.response?.data.message);
          } else {
            console.log("error :>> ", error);
          }
        });
    }
  }, [lastMessageId]);

  const sendMessageHandler = () => {
    if (showPopup) return;

    const payload: {
      chatId: string;
      content: string;
      replyTo?: string;
      isAttachment?: boolean;
      mentionedUsers?: string[];
    } = {
      chatId: isMobileScreen ? (mobileParamValue as string) : (paramValue as string),
      content: divRef.current?.innerHTML as string,
      mentionedUsers: listOfMentionedUsers,
    };

    if (selectedMessage && selectedMessage.type === "Reply") {
      payload.replyTo = selectedMessage.messages[0]._id;
    }

    if (fileInputValue && fileInputValue.length > 0) {
      payload.isAttachment = true;
    }

    dispatch(sendMessage(payload));

    divRef.current!.textContent = "";
    setSelectedMessage(null);
    setListOfMentionedUsers([]);
    setFileInputValue(null);
  };

  const handleSentMessage = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      sendMessageHandler();
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (fileInputValue && fileInputValue.length >= 2) {
      showWarnToast("Only 2 files can be send at a time");
      return;
    }
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    if (file) {
      setFileInputValue((prev) => (prev ? [...prev, file] : [file]));
    }
  };

  const removeSelectedFile = (index: number) => {
    setFileInputValue((prev) => {
      if (!prev) return prev;
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPopup, selectedIndex, users]);

  return (
    <div className="relative grid w-full grid-flow-row bg-primary-foreground">
      <div
        className={cn(
          "flex w-full transform items-center overflow-hidden transition-all duration-150",
          selectedMessage && selectedMessage.type === "Reply"
            ? "h-auto p-2 pb-0 opacity-100"
            : "h-0 p-0 opacity-0"
        )}
      >
        <div className="flex min-w-[50px] items-center justify-center">1</div>
        <div className="flex h-full flex-1 flex-col justify-center gap-[0.5px] rounded-lg border-l-4 border-primary bg-black px-3 py-2 text-sm">
          <p className="text-primary">{capitalizeFirstLetter(senderName)}</p>
          <p>{messageDetails?.content}</p>
        </div>
        <div className="flex min-w-[50px] items-center justify-center">
          <X onClick={() => setSelectedMessage(null)} />
        </div>
      </div>

      {fileInputValue && (
        <div className="absolute -top-full left-0 grid grid-cols-2 gap-2">
          {fileInputValue.map((file, index) => (
            <div
              key={index}
              className="h-16 w-16 overflow-hidden rounded-lg"
              onClick={() => removeSelectedFile(index)}
            >
              <img
                src={URL.createObjectURL(file)}
                alt="Image"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex w-full items-center gap-3 p-2">
        {/* <button ref={buttonRef}>
          <Smile />
        </button> */}
        <button onClick={handleFileButtonClick}>
          <Pin />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </button>

        <div
          className="scrollbar max-h-20 min-h-12 flex-1 overflow-auto rounded-lg bg-slate-800 p-3 text-white"
          ref={divRef}
          contentEditable
          onInput={handleOnInput}
          onMouseUp={handleCursorChange}
          onKeyUp={handleCursorChange}
          onKeyDown={handleSentMessage}
        ></div>

        <Button
          onClick={sendMessageHandler}
          className="rounded-xl border-[1px] bg-transparent transition-all duration-150 hover:bg-primary/10 active:scale-95"
        >
          <Send className="text-white" />
        </Button>
        <AudioRecorder />
        {showPopup && (
          <div
            ref={popupRef}
            className="animate-fade-in fixed space-y-2 rounded-lg bg-secondary p-3 shadow-lg transition-all duration-200 ease-in-out"
            style={{
              bottom: window.screen.availHeight - popupPosition.top - 50,
              left: popupPosition.left,
              zIndex: 1000,
            }}
          >
            {users.map((item, index) => (
              <div
                key={item._id}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-lg p-1 px-3 transition-all duration-200 hover:bg-primary/50",
                  selectedIndex === index ? "bg-primary/50" : ""
                )}
                onClick={() => handleItemSelect(item.username)}
              >
                <div className="h-6 w-6 overflow-hidden rounded-lg bg-gray-200">
                  {item.username !== "all" && (
                    <img
                      src={item.profilePicture}
                      alt={item.username}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <p>{item.username}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------- AudioRecorder.tsx --------------------------
import { LiveAudioVisualizer } from "react-audio-visualize";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "react-responsive";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();

  const handleStartRecording = async () => {
    console.log("START RECORDING");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      setMediaRecorder(mediaRecorder);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
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

      {audioBlob && (
        <LiveAudioVisualizer
          mediaRecorder={mediaRecorder!}
          width={500}
          height={75}
          backgroundColor="#000"
          barColor="#fff"
          gap={3}
        />
      )}

      {audioUrl && (
        <div className="playback">
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
};
export default memo(CustomInput);
