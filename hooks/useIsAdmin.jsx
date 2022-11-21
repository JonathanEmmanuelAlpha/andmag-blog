import { getDocs, limit, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import { adminsCollection } from "../firebase";

export default function useIsAdmin(currentUser) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminId, setAdminId] = useState(null);

  const getAdmin = async function () {
    try {
      const snap = await getDocs(
        query(
          adminsCollection,
          where("email", "==", currentUser.email),
          where("userId", "==", currentUser.uid),
          limit(1)
        )
      );
      return snap.docs;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    getAdmin()
      .then((res) => {
        setIsAdmin(res.length === 1);
        setAdminId(res[0].id);
        if (res.length < 1) return router.push("/");
      })
      .catch((err) => {
        setIsAdmin(false);
        setAdminId(null);
        router.push("/");
      });
  }, [currentUser]);

  return { isAdmin, adminId };
}
