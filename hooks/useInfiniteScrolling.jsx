import {
  CollectionReference,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
} from "firebase/firestore";
import React, { useState, useEffect, useRef, useCallback } from "react";

export default function useInfiniteScrolling(
  targetCollection,
  searchQuery,
  docLimit = 5
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [docs, setDocs] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const observer = useRef();

  /** A chaque nouvelle recherche, réinitialisez la lite de documents */
  useEffect(() => {
    setDocs([]);
  }, [searchQuery]);

  /** Infinite scrolling system */
  useEffect(() => {
    if (!(targetCollection instanceof CollectionReference)) return;
    if (!searchQuery || !(searchQuery instanceof QueryConstraint)) return;

    console.log("Here we are !!!");

    setLoading(true);
    setError(null);

    /** Get the first page documents that match the query */
    const firstPage = query(
      targetCollection,
      searchQuery,
      orderBy("createAt", "asc"),
      limit(docLimit)
    );

    const q = nextPage ? nextPage : firstPage;
    getDocs(q)
      .then((snapshot) => {
        setDocs((prevDocs) => {
          return [...new Set([...prevDocs, ...snapshot.docs])];
        });
        setHasMore(snapshot.docs.length > 0);
        setLoading(false);

        // Get the last document
        const last = snapshot.docs[snapshot.docs.length - 1];

        // Construct a new query starting at the next document.
        const next = query(
          targetCollection,
          searchQuery,
          orderBy("createAt", "asc"),
          limit(docLimit),
          startAfter(last.data().createAt)
        );
        setNextPage(next);
      })
      .catch((error) => {
        setError(error);
      });
  }, [searchQuery, pageNumber, limit]);

  const lastDocumentRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) return observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, pageNumber]
  );

  return { loading, docs, hasMore, error, lastDocumentRef };
}
