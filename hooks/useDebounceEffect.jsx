import React, { useEffect, useRef } from "react";

export default function useDebounceEffect(callback) {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (typeof callback === "function") return callback();
  }, [firstRenderRef]);
}
