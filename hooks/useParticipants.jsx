import React, { useEffect, useState } from "react";
import {
  handleFirestoreErrors,
  profilesCollection,
  trainningsCollection,
} from "../firebase";
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { showErrorToast } from "../components/skeleton-layout/ToasComponent";
import { useAuth } from "../context/AuthProvider";

export default function useParticipants(
  testId,
  pageNumber,
  withParticipant = false
) {
  const { userProfile } = useAuth();
  const [participant, setParticipant] = useState(null);

  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  /** Get current user test result if asked */
  useEffect(() => {
    if (!userProfile || !testId || !withParticipant) return;

    setLoading(true);
    getDoc(doc(profilesCollection, userProfile.id, "tests", testId))
      .then((snap) => {
        if (!snap.exists()) return;
        setParticipant({ id: snap.id, ...snap.data() });
      })
      .catch((error) => {
        showErrorToast(handleFirestoreErrors(error));
      });
    setLoading(false);
  }, [userProfile, testId, withParticipant]);

  /** Pages query system */
  async function goToNextPage() {
    if (!hasMore) {
      return;
    }

    const q = query(
      collection(trainningsCollection, testId, "participants"),
      orderBy("updateAt"),
      startAfter(lastDoc || 0),
      limit(10)
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
        return showErrorToast(handleFirestoreErrors(error));
      });
  }

  /** Get all trainnings */
  useEffect(() => {
    if (!pageNumber || !testId) return;
    setLoading(true);

    goToNextPage();

    setLoading(false);
  }, [pageNumber, testId]);

  /** Get participants profile */
  useEffect(() => {
    if (docs.length === 0) return;

    /** Get all participantID of documents without a profile object */
    const participantsId = docs.filter((d) => !d.profile).map((d) => d.id);
    if (participantsId.length < 1) return;

    console.log(docs);
    console.log(participantsId);

    const q = query(
      profilesCollection,
      where(documentId(), "in", participantsId)
    );
    getDocs(q).then((snaps) => {
      console.log(snaps.size);
      snaps.forEach((snap) => {
        setDocs((prevDocs) => {
          const profile = {
            id: snap.id,
            pseudo: snap.data().pseudo,
            pp: snap.data().pp,
          };
          return prevDocs.map((d) => {
            if (d.id === profile.id) return { ...d, profile };
            return d;
          });
        });
      });
    });
  }, [docs.length]);

  /**
   * Sort all participants by score and time
   * @param {Array} parts
   */
  function sortByScoreAndTime(parts) {
    return parts.sort((a, b) => {
      if (a.score < b.score) return 1;
      if (a.score > b.score) return -1;
      if (a.score === b.score) {
        if (a.evaluationTime < b.evaluationTime) return -1;
        if (a.evaluationTime > b.evaluationTime) return 1;
        return 0;
      }
    });
  }

  return {
    loading,
    hasMore,
    participant,
    participants: sortByScoreAndTime(docs),
  };
}
