import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { blogsCollection } from "../firebase";

export default function useBlogFollowers(blogId) {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    if (!blogId) return;

    getDocs(collection(blogsCollection, blogId, "followers")).then((snaps) => {
      setFollowers([]);
      snaps.forEach((snap) => {
        setFollowers((prev) => prev + snap.data().followers.length);
      });
    });
  }, [blogId]);

  return followers;
}
