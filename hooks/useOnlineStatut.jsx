import React, { useEffect, useState } from "react";

const CHECK_INTERVAL = 1000 * 60;

export default function useOnlineStatut() {
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  const isAppOnline = async () => {
    const url = new URL(window.location.origin);

    try {
      const response = await fetch(url.toString(), {
        method: "HEAD",
        cache: "no-store",
      });

      return response.ok;
    } catch {
      return false;
    }
  };

  const updateStatut = async function () {
    try {
      const status = await isAppOnline();

      if (!isOnline && status) window.location.reload();

      setIsOnline(status);
    } catch (error) {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    updateStatut();
    setLoading(false);

    const interval = setInterval(() => {
      updateStatut();
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return { isOnline, loading };
}
