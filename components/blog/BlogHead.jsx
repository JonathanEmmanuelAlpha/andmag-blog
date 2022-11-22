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
import { blogsCollection, profilesCollection } from "../../firebase";
import styles from "../../styles/blog/BlogHead.module.css";
import LoadingScreen from "../inputs/LoadingScreen";

export function SubButton({ blog }) {
  const router = useRouter();
  const { currentUser, userProfile } = useAuth();

  const [isFollower, setIsFollower] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Fonction permettant l 'abonnement des utilisateurs au blog ciblé.
   * Pour des socis de performances, les followers sont sauvegardés par paquets de 100_000
   * les paquets sus mentionés sont des documents de la sous collection followers du blog.
   * Chaque document(paquet) contient 02 champs:
   *    -> un tableau followers, pouvant contenir un maximum de 100_000 ID d'utilisateurs
   *    -> joinOn qui est la date à la quelle le dernier utilisateur à rejoin ce paquet
   * Une fois un paquet complet (tableau followers contient 100_000 ID), créer un nouveau paquet
   * @returns
   */
  async function subscribe() {
    if (!blog || !blog.id || isFollower) return;

    setLoading(true);
    try {
      /** On recupere le dernier paquet */
      const followers = await getDocs(
        collection(blogsCollection, blog.id, "followers")
      );
      const lastDoc = followers.docs[followers.docs.length - 1];

      /** Si on a bien un dernier paquet, on ajoute l'ID de l'utisateur courent au champ followers et on met à jour joinON */
      if (lastDoc && lastDoc.data().followers.length < 100_000) {
        await updateDoc(
          doc(blogsCollection, blog.id, "followers", lastDoc.id),
          {
            followers: arrayUnion(currentUser.uid),
            joinOn: serverTimestamp(),
          }
        );
      }

      /** S'il n'ya pas de paquet, ou si le dernier paquet à déjà 100_000 ID, on crée un nouveau paquet */
      if (!lastDoc || lastDoc.data().followers.length >= 100_000) {
        await addDoc(collection(blogsCollection, blog.id, "followers"), {
          followers: arrayUnion(currentUser.uid),
          joinOn: serverTimestamp(),
        });
      }

      await updateDoc(doc(profilesCollection, userProfile.id), {
        followed: arrayUnion(blog.id),
        updateAt: serverTimestamp(),
      });

      setIsFollower(!isFollower);
    } catch (error) {}

    setLoading(false);
  }

  async function unsubscribe() {
    if (!blog || !blog.id || !isFollower) return;

    setLoading(true);
    try {
      /** On recupere les paquets */
      const followers = await getDocs(
        collection(blogsCollection, blog.id, "followers")
      );
      const exist = followers.docs.find(
        (f) =>
          f.data().followers.find((_f) => _f === currentUser.uid) != undefined
      );

      /** Si on n'est pas un follower on sort de la fonction */
      if (!exist.exists()) return;

      await updateDoc(doc(blogsCollection, blog.id, "followers", exist.id), {
        followers: arrayRemove(currentUser.uid),
      });

      await updateDoc(doc(profilesCollection, userProfile.id), {
        followed: arrayRemove(blog.id),
        updateAt: serverTimestamp(),
      });

      setIsFollower(!isFollower);
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
  }, [userProfile, isFollower]);

  return (
    <div className={styles.sub_btn}>
      {loading ? (
        <LoadingScreen />
      ) : isFollower ? (
        <button onClick={async () => await unsubscribe()}>Se désabonner</button>
      ) : (
        <button onClick={async () => await subscribe()}>S'abonner</button>
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
