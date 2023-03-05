import { async } from "@firebase/util";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { domainName } from "../components/links/AwesomeLink.type";
import { auth, profilesCollection } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState();
  const [loadingUser, setLoadingUser] = useState(true);

  const [userProfile, setUserProfile] = useState();
  const [loadingProfile, setLoadingProfile] = useState(true);

  /** Listening for auth state change */
  useEffect(() => {
    const unsubcriber = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });

    return unsubcriber;
  }, []);

  /** Get current user profile */
  useEffect(() => {
    if (!currentUser) return;

    setLoadingProfile(true);

    getDocs(
      query(
        profilesCollection,
        where("userId", "==", currentUser.uid),
        limit(1)
      )
    ).then((snaps) => {
      if (snaps.size === 0) return;
      const profileDoc = snaps.docs[0];
      setUserProfile({ id: profileDoc.id, ...profileDoc.data() });
      setLoadingProfile(false);
    });
  }, [currentUser]);

  async function initializeAccount(user) {
    await updateProfile(user, {
      displayName: "Unknown-pseudo",
      photoURL: "/images/default-pp.png",
    });

    await addDoc(profilesCollection, {
      ppRef: null,
      userId: user.uid,
      pp: "/images/default-pp.png",
      pseudo: "Unknown-pseudo",
      createAt: serverTimestamp(),
    });
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateUserEmail(email) {
    return updateEmail(currentUser, email);
  }

  function updateUserPassword(password) {
    return updatePassword(currentUser, password);
  }

  const value = {
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    initializeAccount,
    currentUser,
    loadingUser,
    userProfile,
    loadingProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
