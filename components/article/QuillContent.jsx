import React, { useCallback } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/post/PostContainer.module.css";
import hljs from "highlight.js";
import "highlight.js/styles/tomorrow-night-bright.css";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useState, useEffect } from "react";

function QuillContent({ delta }) {
  const [quill, setQuill] = useState();

  useEffect(() => {
    if (!quill) return;

    const updateScroll = quill.scroll.update.bind(quill.scroll);
    quill.scroll.update = (mutations, context) => {
      if (!quill.isEnabled()) {
        return;
      }
      updateScroll(mutations, context);
    };
    const scrollEnable = quill.scroll.enable.bind(quill.scroll);
    quill.scroll.enable = (enabled = true) => {
      quill.container.classList.toggle("notranslate", enabled);
      scrollEnable(enabled);
    };
    quill.container.classList.toggle("notranslate", quill.isEnabled());
  }, [quill]);

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

      setQuill(q);
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
