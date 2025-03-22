import React from "react";
import Quill from "quill";
import { Mention, MentionBlot } from "quill-mention";
import "quill-mention/dist/quill.mention.css";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";

// Register Mention module and blot
Quill.register({ "blots/mention": MentionBlot, "modules/mention": Mention });

const atValues = [
  { id: 1, value: "Fredrik Sundqvist" },
  { id: 2, value: "Patrik Sjölin" },
];
const hashValues = [
  { id: 3, value: "Fredrik Sundqvist 2" },
  { id: 4, value: "Patrik Sjölin 2" },
];

const InputSection: React.FC = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["image", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
          mention: {
            mentionDenotationChars: ["@", "#"],
            source: function (searchTerm: string, renderList: Function, mentionChar: string) {
              const values = mentionChar === "@" ? atValues : hashValues;

              if (!searchTerm) {
                renderList(values, searchTerm);
              } else {
                const matches = values.filter((item) =>
                  item.value.toLowerCase().includes(searchTerm.toLowerCase())
                );
                renderList(matches, searchTerm);
              }
            },
            listItemClass: "ql-mention",
            mentionContainerClass: "list-group",
            mentionListClass: "list-group-item",
          },
        },
        placeholder: "Write something...",
        theme: "snow",
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  return (
    <div
      key="editor"
      ref={editorRef}
      style={{
        backgroundColor: "black",
        color: "white",
        border: "1px solid #ccc",
        padding: "10px",
      }}
    ></div>
  );
};

export default InputSection;
