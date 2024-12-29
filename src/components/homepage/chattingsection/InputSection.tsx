// InputSection.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Paperclip, Send } from "lucide-react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill's CSS

const InputSection = () => {
  return (
    <div className="w-full absolute bottom-4 flex items-center gap-2 p-4">
      <div id="editor"></div>
      <Button variant="outline">
        <Paperclip color="white" />
      </Button>
      <Input type="text" placeholder="Type a message..." />
      <Button variant="outline">
        <Mic color="white" />
      </Button>
      <Button variant="outline">
        <Send color="white" />
      </Button>
    </div>
  );
};

export default InputSection;

const Test = () => {
  const quill = new Quill("#editor", {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        ["image", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
    },
    placeholder: "Write something...",
    theme: "snow",
  });
};
