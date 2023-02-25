import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthProvider";

export default function useIsAurh() {
  const router = useRouter();
  const { loadingUser, currentUser } = useAuth();

  useEffect(() => {
    if (loadingUser) return;

    if (!currentUser) {
      router.replace(`/account/login?next=${router.asPath}`);
      return;
    }
    if (currentUser && !currentUser.emailVerified) {
      router.replace(`/account/account-activation?next=${router.asPath}`);
      return;
    }
  }, [loadingUser, currentUser]);
}
