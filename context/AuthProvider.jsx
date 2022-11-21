import { async } from "@firebase/util";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { getDocs, limit, query, where } from "firebase/firestore";
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

  useEffect(() => {
    const unsubcriber = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });

    return unsubcriber;
  }, []);

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
    });
    setLoadingProfile(false);
  }, [currentUser]);

  const logout = function () {
    return signOut(auth);
  };

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
    currentUser,
    loadingUser,
    userProfile,
    loadingProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
