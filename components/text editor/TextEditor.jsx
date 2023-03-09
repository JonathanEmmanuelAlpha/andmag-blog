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
import { articlesCollection, storage } from "../../firebase";
import { useRouter } from "next/router";
import SubmitButton from "../inputs/SubmitButton";
import { useAuth } from "../../context/AuthProvider";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import useIsAdmin from "../../hooks/useIsAdmin";
import { useTargetBlog } from "../../context/BlogProvider";
import { toast } from "react-toastify";

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

const SAVE_INTERVAL = 1000 * 60 * 10;

function TextEditor({ channel, blogId }) {
  const router = useRouter();

  const { currentUser } = useAuth();
  const { adminId } = useIsAdmin(currentUser);
  const { isOwner, blog } = useTargetBlog();

  const [quill, setQuill] = useState();

  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);

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

  /** Quill editor image upload live cycle */
  useEffect(() => {
    if (quill == null || typeof selectLocalImage != "function") return;

    // quill editor add image handler
    quill.getModule("toolbar").addHandler("image", () => {
      selectLocalImage();
    });

    const range = quill.getSelection();
  }, [quill, selectLocalImage]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper === null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const languages = [
      "javascript",
      "typescript",
      "jsx",
      "js",
      "ts",
      "tsx",
      "c",
      "h",
      "hpp",
      "hxx",
      "cpp",
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

    q.setText("loading content...");
    q.disable();

    setQuill(q);
  }, []);

  function selectLocalImage() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files[0];

      // file type is only image.
      if (/^image\//.test(file.type)) {
        saveImageToServer(file);
      } else {
        setError("Importer uniquement des images !");
      }
    };
  }

  function saveImageToServer(file) {
    if (!(file instanceof Blob)) return null;

    const fileRef = ref(storage, `articles/${v4()}`);
    uploadBytes(fileRef, file, {
      customMetadata: { owner: isOwner ? blog.createBy : null, admin: adminId },
    })
      .then((snap) =>
        getDownloadURL(snap.ref)
          .then((url) => insertImageToEditor(url))
          .catch((err) => setError("Echec de l'importation de l'image"))
      )
      .catch((err) => setError("Echec de l'importation de l'image"));
  }

  function insertImageToEditor(url) {
    // push image url to rich editor.
    const range = quill.getSelection();
    quill.insertEmbed(range.index, "image", url);
  }

  function handleSave() {
    if (article.content === JSON.stringify(quill.getContents())) return;
    setSaving(true);

    toast.promise(
      updateDoc(doc(articlesCollection, article.id), {
        content: JSON.stringify(quill.getContents()),
        published: true,
        updateAt: serverTimestamp(),
      }),
      {
        pending: "Sauvegarde en cours...",
        success: `Contenu mis à jour | ${new Date().toLocaleTimeString()}`,
        error: "Echec de la mise à jour du contenu",
      }
    );

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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div ref={wrapperRef} />
      <div className="auto-save">
        <SubmitButton
          loading={saving}
          cannotSubmit
          progress={25}
          text="save"
          onClick={async () => {
            handleSave();
            return router.push(`/articles/${article.id}`);
          }}
        />
      </div>
    </div>
  );
}

export default TextEditor;
