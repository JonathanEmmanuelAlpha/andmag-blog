import {
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { blogsCollection } from "../firebase";

export default function useBlogSearch(searchQuery, docLimit = 5, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [docs, setDocs] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  /** A chaque nouvelle recherche, réinitialisez la lite de documents */
  useEffect(() => {
    setDocs([]);
    setLastDoc(null);
    setHasMore(true);
  }, [searchQuery]);

  /** Pages query system */
  async function goToNextPage() {
    if (!hasMore) {
      return;
    }

    let q = null;
    if (typeof searchQuery === "string" && searchQuery.length > 1) {
      q = query(
        blogsCollection,
        where("tags", "array-contains-any", searchQuery.split(" ")),
        orderBy("createAt"),
        startAfter(lastDoc || 0),
        limit(docLimit)
      );
    } else {
      q = query(
        blogsCollection,
        orderBy("createAt"),
        startAfter(lastDoc || 0),
        limit(docLimit)
      );
    }

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
    if (!pageNumber) return;
    setLoading(true);
    setError(null);

    goToNextPage();

    setLoading(false);
  }, [pageNumber, searchQuery]);

  return { loading, docs, hasMore, error };
}
