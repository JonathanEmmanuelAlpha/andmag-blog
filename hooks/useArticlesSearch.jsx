import {
  documentId,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { articlesCollection, blogsCollection } from "../firebase";

export default function useBlogSearch(searchQuery, docLimit = 9, pageNumber) {
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
        articlesCollection,
        where("tags", "array-contains-any", searchQuery.split(" ")),
        orderBy("createAt"),
        startAfter(lastDoc || 0),
        limit(docLimit)
      );
    } else {
      q = query(
        articlesCollection,
        orderBy("createAt"),
        startAfter(lastDoc || 0),
        limit(docLimit)
      );
    }

    getDocs(q)
      .then((snapshot) => {
        console.log("Articles snapshot: ", snapshot);
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
        setError(error.message);
      });
  }

  /** Listening for more documents */
  useEffect(() => {
    if (!pageNumber) return;
    setLoading(true);
    setError(null);

    goToNextPage();
  }, [pageNumber, searchQuery]);

  return { loading, docs, hasMore, error };
}
