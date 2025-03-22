import React, { useEffect, useRef } from "react";
import Quill from "quill";
import { Mention, MentionBlot } from "quill-mention";
import "quill-mention/dist/quill.mention.css";
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";

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
          toolbar: "#custom-toolbar",
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
    <div className="absolute bottom-10 w-full rounded-lg border border-white">
      {/* Custom Toolbar */}
      <div id="custom-toolbar" className="!border-none">
        {/* Basic Tools */}
        <Button className="ql-bold bg-red" title="Bold"></Button>
        <button className="ql-italic" title="Italic"></button>
        <button className="ql-underline" title="Underline"></button>

        {/* Font Size */}
        <select className="ql-size" title="Font Size">
          <option value="small"></option>
          <option defaultValue=""></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>

        {/* Font Family */}
        <select className="ql-font" title="Font Family">
          <option defaultValue="sans-serif"></option>
          <option value="serif"></option>
          <option value="monospace"></option>
        </select>

        {/* Text Alignment */}
        <select className="ql-align" title="Align">
          <option defaultValue=""></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>

        {/* Colors */}
        <select className="ql-color" title="Text Color"></select>
        <select className="ql-background" title="Background Color"></select>

        {/* Indent */}
        <button className="ql-indent" value="-1" title="Indent -"></button>
        <button className="ql-indent" value="+1" title="Indent +"></button>

        {/* Blockquote */}
        <button className="ql-blockquote" title="Blockquote"></button>

        {/* Clear Formatting */}
        <button className="ql-clean" title="Clear Formatting"></button>
      </div>

      <div className="max-h-16 border-none" key="editor" ref={editorRef}></div>
    </div>
  );
};

export default InputSection;
