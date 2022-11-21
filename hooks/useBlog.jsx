import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  articlesCollection,
  blogsCollection,
  fileUpload,
  handleFirestoreErrors,
  handleStorageErrors,
  profilesCollection,
} from "../firebase";
import { v4 } from "uuid";
import { API_ERROR } from "../components/links/AwesomeLink.type";
import { useAuth } from "../context/AuthProvider";
import { useRouter } from "next/router";

export default function useBlog(
  blogId,
  documents = [],
  articleId,
  playlistId,
  postId
) {
  const { currentUser, userProfile } = useAuth();
  const router = useRouter();

  const [blog, setBlog] = useState();
  const [loadingBlog, setLoadingBlog] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /** Get the target blog */
  useEffect(() => {
    if (!blogId) return;

    getDoc(doc(blogsCollection, blogId)).then((_doc) => {
      if (!_doc.exists()) return setBlog(undefined);
      const data = { id: _doc.id, ..._doc.data() };
      setBlog(data);
      setLoadingBlog(false);
    });
  }, [blogId]);

  /** Get all playlists off blog */
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    if (!blogId || !documents.includes("playlists")) return;

    getDocs(
      collection(blogsCollection, blogId, "playlists"),
      orderBy("createAt", "asc")
    )
      .then((snaps) => {
        setPlaylists([]);
        snaps.forEach((doc) => {
          setPlaylists((prev) => [...prev, { id: doc.id, ...doc.data() }]);
        });
      })
      .catch((err) => console.log("Err: ", err));

    setLoadingPlaylists(false);
  }, [blogId, documents]);

  /** Get spécific playlist */
  const [loadingPlaylist, setLoadingPlaylist] = useState(true);
  const [playlist, setPlaylist] = useState();
  useEffect(() => {
    if (!playlistId) return;

    getDoc(doc(blogsCollection, blogId, "playlists", playlistId)).then(
      (playlist) => {
        if (!playlist.exists()) return;
        setPlaylist({ id: playlist.id, ...playlist.data() });
      }
    );

    setLoadingPlaylist(false);
  }, [playlistId]);

  /** Get spécific post */
  const [loadingPost, setLoadingPost] = useState(true);
  const [post, setPost] = useState();
  useEffect(() => {
    if (!postId) return;

    getDoc(doc(blogsCollection, blogId, "posts", postId)).then((post) => {
      if (!post.exists()) return;
      setPost({ id: post.id, ...post.data() });
    });

    setLoadingPost(false);
  }, [postId]);

  /** Get spécific article */
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [article, setArticle] = useState();
  useEffect(() => {
    if (!articleId) return;

    getDoc(doc(articlesCollection, articleId)).then((article) => {
      if (!article.exists()) return;
      setArticle({ id: article.id, ...article.data() });
    });

    setLoadingArticle(false);
  }, [articleId]);

  const create = async function (name, description, banner, logo, adminId) {
    if (!adminId)
      return setError(
        "User is not authorized to perform the desired action. Please contact andmag-ground to continue"
      );
    if (!userProfile)
      return setError(
        "You need to first add a pseudo and a profile picutre. Go to profile page for foward instructions."
      );

    if (userProfile.blogId)
      return setError("You can only create one blog per user account");

    if (name.length < 8 || name.length > 25)
      return setError(
        "The blog name cannot contains more than 25 and less than 08 characters"
      );

    if (description.length < 128 || description.length > 255)
      return setError(
        "The blog description cannot contains more than 255 and less than 128 characters"
      );

    if (!(banner instanceof Blob))
      return setError("Please add a banner to your blog");
    if (!(logo instanceof Blob))
      return setError("Please add a logo to your blog");

    setLoading(true);

    const bannerRef = window.localStorage.getItem("bannerRef") || v4();
    const logoRef = window.localStorage.getItem("logoRef") || v4();

    try {
      const snap = await getDocs(
        query(blogsCollection, where("name", "==", name))
      );
      if (snap.docs && snap.docs.length !== 0) {
        setLoading(false);
        return setError("The name entered is already in use");
      }

      const bannerUrl = await fileUpload(
        `blogs/${bannerRef}`,
        banner,
        null,
        adminId
      );
      if (!bannerUrl) {
        setLoading(false);
        return setError("Banner upload failed");
      }
      window.localStorage.setItem("bannerRef", bannerRef);

      const logoUrl = await fileUpload(`blogs/${logoRef}`, logo, null, adminId);
      if (!logoUrl) return setError("Logo upload failed");
      window.localStorage.setItem("logoRef", logoRef);

      const result = await addDoc(blogsCollection, {
        name,
        description,
        bannerRef,
        logoRef,
        tags: `${description} ${name}`.split(" "),
        banner: bannerUrl,
        logo: logoUrl,
        createBy: currentUser.uid,
        createAt: serverTimestamp(),
      });

      await updateDoc(doc(profilesCollection, userProfile.id), {
        blogId: result.id,
        updateAt: serverTimestamp(),
      });

      router.push(`/blogs/${result.id}`);
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
  };

  const update = async function (
    name,
    description,
    banner,
    logo,
    adminId,
    blog
  ) {
    if (!blog) return;

    if (!adminId)
      return setError(
        "User is not authorized to perform the desired action. Please contact andmag-ground to continue"
      );
    if (name.length < 8 || name.length > 25)
      return setError(
        "The blog name cannot contains more than 25 and less than 08 characters"
      );

    if (description.length < 128 || description.length > 512)
      return setError(
        "The blog description cannot contains more than 512 and less than 128 characters"
      );

    setLoading(true);

    try {
      if (blog.name !== name) {
        const snap = await getDocs(
          query(blogsCollection, where("name", "==", name))
        );
        const exist = snap.docs && snap.docs.length !== 0;
        if (exist) return setError("The name entered is already in use");
      }

      let bannerUrl = null;
      if (banner instanceof Blob) {
        bannerUrl = await fileUpload(
          `blogs/${blog.bannerRef}`,
          banner,
          null,
          adminId
        );
      }

      let logoUrl = null;
      if (logo instanceof Blob) {
        logoUrl = await fileUpload(
          `blogs/${blog.logoRef}`,
          logo,
          null,
          adminId
        );
      }

      let data = {
        updateAt: serverTimestamp(),
      };
      if (blog.name !== name) data = { ...data, name };
      if (blog.description !== description) data = { ...data, description };
      if (bannerUrl !== null) data = { ...data, banner: bannerUrl };
      if (logoUrl !== null) data = { ...data, logo: logoUrl };

      const result = await updateDoc(doc(blogsCollection, blog.id), {
        ...data,
      });

      router.push(`/blogs/${blog.id}`);
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
  };

  return {
    blog,
    loadingBlog,
    create,
    update,
    loading,
    error,
    loadingPlaylists,
    playlists,
    loadingArticle,
    article,
    loadingPlaylist,
    playlist,
    loadingPost,
    post,
  };
}
