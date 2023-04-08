import React, { useCallback } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/post/PostContainer.module.css";
import hljs from "highlight.js";
import "highlight.js/styles/tomorrow-night-bright.css";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function QuillContent({ delta }) {
  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper === null || !delta) return;

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
      "kotlin",
      ];

      const q = new Quill(editor, {
        theme: "snow",
        modules: {
          syntax: {
            highlight: (text) => hljs.highlightAuto(text, languages).value,
          },
          toolbar: null,
        },
      });

      q.setContents(delta);

      q.disable();
    },
    [delta]
  );

  return (
    <div
      className={`${styles.quill_content} quill-content-wrapper`}
      ref={wrapperRef}
    />
  );
}
QuillContent.propTypes = {
  delta: PropTypes.any.isRequired,
};

export default QuillContent;
