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
import { useAuth } from "../context/AuthProvider";
import { articlesCollection, blogsCollection } from "../firebase";

export default function useBlogSearch(searchQuery, docLimit = 20, pageNumber) {
  const { currentUser } = useAuth();

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

  /**
   * Return the number of tags that document contain in the search query
   */
  function getTagsNumber(tags = []) {
    if (!searchQuery || !(tags instanceof Array)) return 0;

    let sum = 0;

    const search = searchQuery
      .toLowerCase()
      .split(" ")
      .map((s) => `#${s}`);

    tags.forEach((t) => {
      if (search.find((_t) => _t === t)) sum += 1;
    });

    return sum;
  }

  /** Pages query system */
  async function goToNextPage() {
    if (!hasMore) {
      return;
    }

    let q = null;
    if (typeof searchQuery === "string" && searchQuery.length > 1) {
      const search = searchQuery
        .toLowerCase()
        .split(" ")
        .map((s) => `#${s}`);

      q = query(
        articlesCollection,
        where("tags", "array-contains-any", search),
        orderBy("createAt"),
        startAfter(lastDoc || 0),
        limit(10)
      );
    } else {
      q = query(
        articlesCollection,
        orderBy("createAt"),
        startAfter(lastDoc || 0),
        limit(10)
      );
    }

    getDocs(q)
      .then((snapshot) => {
        snapshot.forEach((snap) => {
          setDocs((prevDocs) => {
            let newDoc = { id: snap.id, ...snap.data() };

            /** If already in the list or not published yet, skeep */
            if (
              prevDocs.find((doc) => doc.id === newDoc.id) ||
              (newDoc.published === false &&
                newDoc.createBy !== currentUser?.uid)
            )
              return prevDocs;

            /** Filtering the list base on tags. If old docs contains more tags than the new one, add it at the end of list. */
            if (
              prevDocs.find(
                (d) => getTagsNumber(d.tags) >= getTagsNumber(newDoc.tags)
              )
            )
              return [...prevDocs, newDoc];
            return [newDoc, ...prevDocs]; // Else put the new doc at the begining of list.
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
  }, [searchQuery, lastDoc, pageNumber, currentUser]);

  /** Get associated blogs */
  useEffect(() => {
    if (docs.length === 0) return;

    /** Get all blogID of documents with a null blog path */
    const targets = docs.filter((d) => !d.blog).map((d) => d.blogId);
    if (targets.length < 1) return;

    /** Find the targets blogID and add them to assciated post */
    const q = query(blogsCollection, where(documentId(), "in", targets));
    getDocs(q).then((snaps) => {
      snaps.forEach((snap) => {
        setDocs((prevDocs) => {
          const blog = { id: snap.id, ...snap.data() };
          return prevDocs.map((d) => {
            if (d.blogId === blog.id) return { ...d, blog };
          });
        });
      });
    });
  }, [docs]);

  return { loading, docs, hasMore, error };
}
