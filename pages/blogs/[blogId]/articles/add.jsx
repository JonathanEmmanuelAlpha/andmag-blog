import React, { useState, useEffect } from "react";
import styles from "../../../../styles/blog/all.module.css";
import { useRouter } from "next/router";
import BlogContainer from "../../../../components/blog/BlogContainer";
import { v4 } from "uuid";
import Header from "../../../../components/header/Header";
import { Layout } from "../../../../components/skeleton-layout/SkeletonLayout";
import Form from "../../../../components/inputs/Form";
import Input from "../../../../components/inputs/Input";
import Textarea from "../../../../components/inputs/Textarea";
import Uploader from "../../../../components/images-manipulation/Uploader";
import SubmitButton from "../../../../components/inputs/SubmitButton";
import useBlog from "../../../../hooks/useBlog";
import LoadingScreen from "../../../../components/inputs/LoadingScreen";
import Select from "../../../../components/inputs/Select";
import usePosts from "../../../../hooks/usePosts";
import Alert from "../../../../components/inputs/Alert";
import {
  articlesCollection,
  blogsCollection,
  fileUpload,
  handleFirestoreErrors,
  handleStorageErrors,
} from "../../../../firebase";
import { useAuth } from "../../../../context/AuthProvider";
import useIsAdmin from "../../../../hooks/useIsAdmin";
import { useTargetBlog } from "../../../../context/BlogProvider";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import Link from "next/link";

export default function NewArticle() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { adminId } = useIsAdmin(currentUser);
  const { isOwner, blog } = useTargetBlog();
  const { loadingPlaylists, playlists, article, loadingArticle } = useBlog(
    router.query.blogId,
    ["playlists"],
    router.query.channel
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState();
  const [playlist, setPlaylist] = useState("");

  useEffect(() => {
    if (loadingArticle || !article) return;

    setTitle(article.title || "");
    setDescription(article.description || "");
    setTags(article.tags || "");
    setPlaylist((prev) => {
      const list = playlists.find((art) => art.id === article.playlist);
      if (list) return list.name;
      return prev;
    });
  }, [loadingArticle, article]);

  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setSuccess("");

    if (title.length < 6 || title.length > 64) {
      return setError(
        "Title may contain more than 06 and less than 64 characters."
      );
    }
    if (description.length < 64 || name.length > 255) {
      return setError(
        "Description may contain more than 64 and less than 255 characters."
      );
    }
    if (!(thumbnail instanceof Blob)) {
      return setError("You need to provide a thumbnail.");
    }

    const list = playlists.find((list) => list.name === playlist);
    if (!list || !list.id) return setError("Selected an existing playlist");

    setLoading(true);

    try {
      const existQ = query(
        articlesCollection,
        where("title", "==", title),
        limit(1)
      );
      const exist = await getDocs(existQ);
      if (!exist.empty) {
        return (
          setError("The provided title is already in use.") && setLoading(false)
        );
      }

      const fileRef = v4();
      const channel = v4();

      const downloadURL = await fileUpload(
        `articles/${fileRef}`,
        thumbnail,
        isOwner ? blog.createBy : null,
        adminId
      );

      const data = {
        blogId: blog.id,
        playlist: list.id,
        createBy: currentUser.uid,
        adminId: adminId,
        title: title,
        description: description,
        tags: tags
          .toLowerCase()
          .split(" ")
          .filter((t, i) => i < 10),
        thumbnail: downloadURL,
        fileRef: fileRef,
        channel: channel,
        published: false,
        createAt: serverTimestamp(),
      };

      const res = await addDoc(articlesCollection, data);

      await updateDoc(doc(blogsCollection, blog.id, "playlists", list.id), {
        articles: arrayUnion(res.id),
        updateAt: serverTimestamp(),
      });

      await updateDoc(doc(blogsCollection, blog.id), {
        articles: arrayUnion(res.id),
        mostRecentArticle: res.id,
        updateAt: serverTimestamp(),
      });

      setSuccess("Article added successfully");
      router.push(
        `/blogs/${router.query.blogId}/articles/edit?channel=${channel}`
      );
    } catch (error) {
      setError((prev) => {
        const store = handleFirestoreErrors(error);
        const storage = handleStorageErrors(error);
        if (store) return store;
        if (storage) return storage;
        return prev;
      });
    }

    setLoading(false);
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    if (title.length < 6 || title.length > 64) {
      return setError(
        "Title may contain more than 06 and less than 64 characters."
      );
    }
    if (description.length < 64 || name.length > 255) {
      return setError(
        "Description may contain more than 64 and less than 255 characters."
      );
    }

    const list = playlists.find((list) => list.name === playlist);
    if (!list || !list.id) return setError("Selected an existing playlist");

    setLoading(true);
    try {
      const existQ =
        article.title !== title &&
        query(articlesCollection, where("title", "==", title), limit(1));
      const exist = existQ && (await getDocs(existQ));
      if (exist && !exist.empty)
        return (
          setError("The provided title is already in use.") && setLoading(false)
        );

      const channel = v4();
      let downloadURL = null;
      if (thumbnail instanceof Blob) {
        downloadURL = await fileUpload(
          `articles/${article.fileRef}`,
          thumbnail,
          isOwner ? blog.createBy : null,
          adminId
        );
      }

      const __tags = tags
        .toLowerCase()
        .split(" ")
        .filter((t, i) => i < 10);

      let data = { updateAt: serverTimestamp(), channel: channel };
      if (article.title !== title) data = { ...data, title };
      if (article.description !== description) data = { ...data, description };
      if (
        !(article.tags instanceof Array) ||
        article.tags.join(" ") !== tags.toLowerCase()
      )
        data = { ...data, tags: __tags };
      if (article.playlist !== playlist) data = { ...data, playlist: list.id };
      if (downloadURL !== null) data = { ...data, thumbnail: downloadURL };

      await updateDoc(doc(articlesCollection, article.id), { ...data });

      setSuccess("Article updated successfully");
    } catch (error) {
      setError((prev) => {
        const store = handleFirestoreErrors(error);
        const storage = handleStorageErrors(error);
        if (store) return store;
        if (storage) return storage;
        return prev;
      });
      console.log("Err: ", error);
    }

    setLoading(false);
  }

  return (
    <BlogContainer
      title={
        article && article.id
          ? "Mise à jour d'un article"
          : "Ajouter un article"
      }
      robots={"noindex,nofollow"}
    >
      <Form
        onSubmit={async (event) => {
          event.preventDefault();
          if (article && article.id) return await handleSave();
          return await handleSubmit();
        }}
        title="Ajouter un article"
      >
        {error && <Alert type="danger" message={error} />}
        {success && <Alert type="success" message={success} />}
        <Input
          type={"text"}
          required
          label="Article title"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxChar={64}
        />
        <Textarea
          label="Description"
          required
          id="description"
          name="description"
          maxChar={255}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Textarea
          label="Mots clés (ex: #key #another)"
          required
          id="tags"
          name="tags"
          rows={"3"}
          maxChar={128}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <Select
          list="playlist"
          label="Select a playlist"
          name="playlist"
          id="playlist"
          required
          value={playlist}
          onChange={(e) => setPlaylist(e.target.value)}
        >
          {playlists.map((list) => (
            <option key={list.id} value={list.name} />
          ))}
        </Select>
        <Uploader
          openUploader
          label="thumbnail"
          message="Add a thumbnail"
          inforMessage="Drag and drop an image file here"
          onFilesUpload={(files) => setThumbnail(files[0])}
        />
        <div className={styles.edit_btns}>
          <SubmitButton
            loading={loading}
            text={article && article.id && isOwner ? "sauvegarder" : "créer"}
            progress={25}
          />
          {article && (
            <Link
              href={`/blogs/${router.query.blogId}/articles/edit?channel=${article.channel}`}
            >
              Editer le contenu
            </Link>
          )}
        </div>
      </Form>
    </BlogContainer>
  );
}
