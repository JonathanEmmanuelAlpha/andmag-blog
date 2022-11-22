import React, { useState, useEffect } from "react";
import styles from "../../../../styles/blog/all.module.css";
import { useRouter } from "next/router";
import BlogContainer from "../../../../components/blog/BlogContainer";
import { v4 } from "uuid";
import Header from "../../../../components/header/Header";
import { Layout } from "../../../../components/skeleton-layout/SkeletonLayout";
import Form from "../../../../components/inputs/Form";
import Uploader from "../../../../components/images-manipulation/Uploader";
import SubmitButton from "../../../../components/inputs/SubmitButton";
import LoadingScreen from "../../../../components/inputs/LoadingScreen";
import dynamic from "next/dynamic";
import Alert from "../../../../components/inputs/Alert";
import {
  blogsCollection,
  handleFirestoreErrors,
  handleStorageErrors,
  multiFileUpload,
} from "../../../../firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useTargetBlog } from "../../../../context/BlogProvider";
import useIsAdmin from "../../../../hooks/useIsAdmin";
import { useAuth } from "../../../../context/AuthProvider";
import useBlog from "../../../../hooks/useBlog";

const TextEditor = dynamic(
  () => import("../../../../components/text editor/SimpleTextEditor"),
  { ssr: false }
);

export default function Publish() {
  const router = useRouter();
  const { isOwner, blog } = useTargetBlog();
  const { currentUser } = useAuth();
  const { isAdmin, adminId } = useIsAdmin(currentUser);
  const { loadingPost, post } = useBlog(
    router.query.blogId,
    [],
    null,
    null,
    router.query.channel
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnails, setThumbnails] = useState(null);
  const [initialValue, setInitialValue] = useState(null);
  const [editor, setEditor] = useState();

  useEffect(() => {
    if (!post) return;

    setName(post.name);
    setDescription(post.description);
    setInitialValue(JSON.parse(post.content));
  }, [post]);

  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const files = await multiFileUpload(
        `posts`,
        thumbnails,
        null,
        isOwner ? blog.createBy : null,
        adminId
      );

      const post = {
        content: JSON.stringify(editor.getContents()),
        thumbnails: files,
        createAt: serverTimestamp(),
        createBy: currentUser.uid,
        adminId: adminId,
      };

      const res = await addDoc(
        collection(blogsCollection, blog.id, "posts"),
        post
      );
      setSuccess("Your post has been added successfully");
      router.push(`/blogs/${blog.id}/posts`);
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
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let files = null;
      const filesName = post.thumbnails.map((value) => {
        return value.fileName;
      });
      if (thumbnails !== null && Array.from(thumbnails)) {
        files = await multiFileUpload(
          `posts`,
          thumbnails,
          filesName,
          isOwner ? blog.createBy : null,
          adminId
        );
      }

      let data = { updateAt: serverTimestamp() };
      if (post.content !== JSON.stringify(editor.getContents()))
        data = { ...data, content: JSON.stringify(editor.getContents()) };
      if (files !== null) {
        let array = null;
        if (files.length < post.thumbnails.length) {
          // On ajoutes les nouvelles images dans la base de données.
          array = post.thumbnails.map((value, index) => {
            if (files[index] && value.fileName === files[index].fileName)
              return files[index];
            return value;
          });
        }
        data = {
          ...data,
          thumbnails: array === null ? files : array,
        };
      }

      await updateDoc(doc(blogsCollection, blog.id, "posts", post.id), {
        ...data,
      });
      setSuccess("Your post has been updated successfully");
      router.push(`/blogs/${blog.id}/posts`);
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
    <BlogContainer title="Publish" robots={"noindex,nofollow"}>
      <Form
        title={
          post && post.id
            ? "Mise à jour d'une publication"
            : "Nouvelle publication"
        }
        onSubmit={async (event) => {
          event.preventDefault();
          if (post && post.id) return await handleSave();
          return await handleSubmit();
        }}
      >
        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}

        <TextEditor onReady={(q) => setEditor(q)} initialDelta={initialValue} />
        <Uploader
          openUploader
          multiple
          label="thumbnail"
          message="Add less than 06 images to your post"
          inforMessage="Drag and drop images files here to proccess"
          onFilesUpload={(files) => setThumbnails(files)}
        />
        <SubmitButton
          loading={loading}
          text={post && post.id && isOwner ? "sauvegarder" : "publier"}
          progress={25}
        />
      </Form>
    </BlogContainer>
  );
}
