import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import {
  blogsCollection,
  handleFirestoreErrors,
  profilesCollection,
} from "../../firebase";
import styles from "../../styles/blog/BlogHead.module.css";
import LoadingScreen from "../inputs/LoadingScreen";
import { showErrorToast } from "../skeleton-layout/ToasComponent";

export function SubButton({ blog, onSubscribe, onUnSubscribe }) {
  const router = useRouter();
  const { currentUser, userProfile } = useAuth();

  const [isFollower, setIsFollower] = useState(false);
  const [loading, setLoading] = useState(true);

  async function subscribe() {
    if (!blog || !blog.id || isFollower) return;

    setLoading(true);
    try {
      await updateDoc(doc(profilesCollection, userProfile.id), {
        followed: arrayUnion(blog.id),
        updateAt: serverTimestamp(),
      });

      setIsFollower(!isFollower);
      return onSubscribe();
    } catch (error) {
      showErrorToast(handleFirestoreErrors(error));
    }

    setLoading(false);
  }

  async function unsubscribe() {
    if (!blog || !blog.id || !isFollower) return;

    setLoading(true);
    try {
      await updateDoc(doc(profilesCollection, userProfile.id), {
        followed: arrayRemove(blog.id),
        updateAt: serverTimestamp(),
      });

      setIsFollower(!isFollower);
      return onUnSubscribe();
    } catch (error) {}
    setLoading(false);
  }

  useEffect(() => {
    if (!userProfile) return;

    setIsFollower((prev) => {
      if (
        userProfile.followed &&
        userProfile.followed.find((f) => f === blog.id)
      ) {
        return true;
      }
      return prev;
    });

    setLoading(false);
  }, [blog, userProfile, isFollower]);

  return (
    <div className={styles.sub_btn}>
      {loading ? (
        <LoadingScreen />
      ) : isFollower ? (
        <button disabled={loading} onClick={async () => await unsubscribe()}>
          Se désabonner
        </button>
      ) : (
        <button disabled={loading} onClick={async () => await subscribe()}>
          {"S'abonner"}
        </button>
      )}
    </div>
  );
}

export default function BlogHead({ name }) {
  return (
    <div className={styles.bi_head}>
      <div>
        <h2>{name}</h2>
      </div>
    </div>
  );
}
