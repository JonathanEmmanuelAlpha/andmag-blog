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
import Alert from "../../../../components/inputs/Alert";
import { useAuth } from "../../../../context/AuthProvider";
import useIsAdmin from "../../../../hooks/useIsAdmin";
import { useTargetBlog } from "../../../../context/BlogProvider";
import {
  blogsCollection,
  fileUpload,
  handleFirestoreErrors,
  handleStorageErrors,
} from "../../../../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import useBlog from "../../../../hooks/useBlog";

export default function NewPlayList() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { adminId, isAdmin } = useIsAdmin(currentUser);
  const { isOwner, blog } = useTargetBlog();
  const { loadingPlaylist, playlist } = useBlog(
    router.query.blogId,
    [],
    null,
    router.query.channel
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState();

  useEffect(() => {
    if (!playlist) return;

    setName(playlist.name);
    setDescription(playlist.description);
  }, [playlist]);

  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setSuccess("");

    if (name.length < 6 || name.length > 28) {
      return setError(
        "Name may contain more than 06 and less than 28 characters."
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
    setLoading(true);

    try {
      const fileRef = v4();
      const downloadURL = await fileUpload(
        `playlists/${fileRef}`,
        thumbnail,
        isOwner ? blog.createBy : null,
        adminId
      );

      const data = {
        createBy: currentUser.uid,
        adminId: adminId,
        name: name,
        description: description,
        thumbnail: downloadURL,
        fileRef: fileRef,
        createAt: serverTimestamp(),
      };

      const res = await addDoc(
        collection(blogsCollection, blog.id, "playlists"),
        data
      );

      setSuccess("Playlist added successfully");
      return router.push(
        `/blogs/${router.query.blogId}/playlists?list=${res.id}`
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

    if (name.length < 6 || name.length > 28) {
      return setError(
        "Name may contain more than 06 and less than 28 characters."
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
    setLoading(true);

    try {
      let downloadURL = null;
      if (thumbnail instanceof Blob) {
        downloadURL = await fileUpload(
          `playlists/${playlist.fileRef}`,
          thumbnail,
          isOwner ? blog.createBy : null,
          adminId
        );
      }

      let data = { updateAt: serverTimestamp() };
      if (playlist.name !== name) data = { ...data, name };
      if (playlist.description !== description) data = { ...data, description };
      if (downloadURL !== null) data = { ...data, thumbnail: downloadURL };

      await updateDoc(doc(blogsCollection, blog.id, "playlists", playlist.id), {
        ...data,
      });

      setSuccess("Playlist saved successfully");
      return router.push(
        `/blogs/${router.query.blogId}/playlists?list=${playlist.id}`
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

  return (
    <BlogContainer
      title={
        playlist && playlist.id ? "Mise à jour d'une liste" : "Nouvelle liste"
      }
      robots={"noindex,nofollow"}
    >
      <Form
        onSubmit={async (event) => {
          event.preventDefault();
          if (playlist && playlist.id) return await handleSave();
          return await handleSubmit();
        }}
        title="liste de lecture"
      >
        {error && <Alert type="danger" message={error} />}
        {success && <Alert type="success" message={success} />}
        <Input
          type={"text"}
          required
          label="Playlist name"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxChar={28}
        />
        <Textarea
          label="Description"
          placeholder="Description *"
          required
          id="description"
          name="description"
          maxChar={255}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Uploader
          openUploader
          label="thumbnail"
          message="Add a thumbnail"
          inforMessage="Drag and drop an image file here"
          onFilesUpload={(files) => setThumbnail(files[0])}
        />
        <SubmitButton
          loading={loading}
          text={playlist && playlist.id && isOwner ? "sauvegarder" : "créer"}
          progress={25}
        />
      </Form>
    </BlogContainer>
  );
}
