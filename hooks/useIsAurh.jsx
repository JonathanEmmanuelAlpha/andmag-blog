import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function useIsAurh(currentUser, loading) {
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!currentUser) router.replace(`/login?next=${router.asPath}`);
  }, [loading]);
}
