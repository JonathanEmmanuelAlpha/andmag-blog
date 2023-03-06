import React, { useCallback, useEffect, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/tomorrow-night-bright.css";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TOOLBAR_OPTIONS = [
  [
    "bold",
    "italic",
    { color: [] },
    { background: [] },
    { list: "ordered" },
    { list: "bullet" },
    { align: [] },
    "link",
    "blockquote",
    "code-block",
    "formula",
  ],
];

function SimpleTextEditor({ onReady, initialDelta }) {
  const [quill, setQuill] = useState();

  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper === null) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);

      const languages = [
        "javascript",
        "typescript",
        "jsx",
        "js",
        "c",
        "h",
        "hpp",
        "cpp",
        "hpp",
        "java",
        "python",
        "html",
        "css",
        "scss",
        "csharp",
        "ruby",
        "xml",
      ];
      const q = new Quill(editor, {
        theme: "snow",
        modules: {
          syntax: {
            highlight: (text) => hljs.highlightAuto(text, languages).value,
          },
          toolbar: TOOLBAR_OPTIONS,
        },
      });

      if (initialDelta) q.setContents(initialDelta);
      setQuill(q);

      console.log("Render !");

      if (typeof onReady === "function") onReady(q);
    },
    [initialDelta]
  );

  return (
    <div className="simple-text-editor-container">
      <div ref={wrapperRef} style={{ width: "100%" }} />
    </div>
  );
}

export default SimpleTextEditor;
