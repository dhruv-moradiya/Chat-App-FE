import { Mic, Plus, Smile, X } from "lucide-react";
import { useState, useRef } from "react";

const CustomInput = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const [inputValue, setInputValue] = useState("");
  const plusButtonRef = useRef<HTMLDivElement | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      console.log("object");
    }
  };

  return (
    <div className="relative w-full h-16 rounded-lg px-4 bg-origin-padding flex items-center justify-center gap-4">
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
      <div className="w-full flex items-center gap-3">
        <button>
          <Smile />
        </button>
        <input
          type="text"
          className="w-full h-10 px-2 rounded-lg bg-primary-foreground"
        />
      </div>
      <AudioRecorder />

      {menuOpen && <ExtraMenu menuStyle={menuStyle} />}
    </div>
  );
};

const ExtraMenu = ({ menuStyle }: any) => {
  return (
    <div
      className="bg-black rounded p-4 transition-transform duration-300 ease-in-out transform scale-0 opacity-0 animate-open-menu"
      style={menuStyle}
    >
      <ul className="flex flex-col items-center gap-2 text-white">
        <li>Photos</li>
        <li>Videos</li>
        <li>Documents</li>
      </ul>
    </div>
  );
};

export default CustomInput;

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

  console.log("audioUrl :>> ", audioUrl);

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
