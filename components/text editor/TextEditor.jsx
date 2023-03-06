import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import hljs from "highlight.js";
import "highlight.js/styles/tomorrow-night-bright.css";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { articlesCollection } from "../../firebase";
import { useRouter } from "next/router";
import SubmitButton from "../inputs/SubmitButton";
import Alert from "../inputs/Alert";
import { useAuth } from "../../context/AuthProvider";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }, { size: [] }],
  ["bold", "italic", "underline", "strike"],
  [{ script: "sub" }, { script: "super" }],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  ["direction", { align: [] }],
  ["link", "image", "video", "blockquote"],
  ["code-block", "formula", "clean"],
];

const SAVE_INTERVAL = 1000 * 60 * 5;

function TextEditor({ channel, blogId }) {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [quill, setQuill] = useState();

  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  /** Get document from target edition channel */
  useEffect(() => {
    if (quill == null || !channel || !blogId || !currentUser) return;

    const queryInfo = query(
      articlesCollection,
      where("blogId", "==", blogId),
      where("channel", "==", channel),
      where("createBy", "==", currentUser.uid),
      limit(1)
    );

    const unsubscriber = onSnapshot(queryInfo, (snaps) => {
      snaps.forEach((snap) => {
        if (!snap.exists()) return setError("The given channel does not exist");
        setArticle({ id: snap.id, ...snap.data() });
      });
    });
    setLoading(false);

    return unsubscriber;
  }, [quill, channel, blogId, currentUser]);

  /** Set quill contents to the existing article content */
  useEffect(() => {
    if (!quill || loading || !article) return;

    if (error) quill.setText(error);

    if (article.content) {
      quill.setContents(JSON.parse(article.content));
    }

    if (!article.content) quill.setText("");

    quill.enable();
  }, [quill, loading, article, error]);

  /** Save current document evry @param SAVE_INTERVAL seconds */
  useEffect(() => {
    if (quill == null || loading || !article) return;

    const interval = setInterval(() => {
      handleSave();
    }, SAVE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [quill, loading, article, handleSave]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper === null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const languages = [
      "javascript",
      "jsx",
      "js",
      "c",
      "h",
      "hpp",
      "cpp",
      "hpp",
      "h",
      "java",
      "python",
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

    q.setText("loading...");
    q.disable();

    setQuill(q);
  }, []);

  async function handleSave() {
    if (article.content === JSON.stringify(quill.getContents())) return;

    setSaveError("");
    setSaveSuccess("");
    setSaving(true);

    updateDoc(doc(articlesCollection, article.id), {
      content: JSON.stringify(quill.getContents()),
      published: true,
      updateAt: serverTimestamp(),
    })
      .then(() => {
        setSaveSuccess("Article content was updated successfully");
      })
      .catch((err) => setSaveError(err.message));
    setSaving(false);
  }

  return (
    <div className="text-editor-container">
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {loading
            ? "loading..."
            : article
            ? article.title
            : "Andmag-ground Text-editor"}
        </title>
        <meta
          name="description"
          content={
            loading
              ? "loading..."
              : article
              ? article.description
              : "Andmag-ground Text-editor"
          }
        />
        <link rel="icon" href="/skill-upgrade.svg" />
      </Head>
      <div ref={wrapperRef} />
      <div className="auto-save">
        <SubmitButton
          loading={saving}
          cannotSubmit
          progress={25}
          text="save"
          onClick={async () => {
            try {
              await handleSave();
              return router.push(`/articles/${article.id}`);
            } catch (error) {
              setSaveError(error.message);
            }
          }}
        />
        {saveError && <Alert type="danger" message={saveError} />}
        {saveSuccess && <Alert type="success" message={saveSuccess} />}
      </div>
    </div>
  );
}

export default TextEditor;
