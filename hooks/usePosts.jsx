import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { blogsCollection } from "../firebase";

export default function usePosts(blogId, docLimit = 25, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [docs, setDocs] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  /** Pages query system */
  async function goToNextPage() {
    if (!hasMore) {
      return;
    }

    let q = query(
      collection(blogsCollection, blogId, "posts"),
      orderBy("createAt"),
      startAfter(lastDoc || 0),
      limit(docLimit)
    );

    getDocs(q)
      .then((snapshot) => {
        snapshot.forEach((snap) => {
          setDocs((prevDocs) => {
            let newDoc = { id: snap.id, ...snap.data() };
            if (prevDocs.find((doc) => doc.id === newDoc.id)) return prevDocs;
            return [...prevDocs, newDoc];
          });
        });
        setHasMore((prev) => snapshot.docs.length > 0);

        // Get the last document
        const last = snapshot.docs[snapshot.docs.length - 1];
        setLastDoc(last);
      })
      .catch((error) => {
        console.log("error: ", error);
        setError(error.message);
      });
  }

  useEffect(() => {
    if (!pageNumber || !blogId) return;
    setLoading(true);
    setError(null);

    goToNextPage();

    setLoading(false);
  }, [pageNumber, blogId]);

  return { loading, docs, hasMore, error };
}
