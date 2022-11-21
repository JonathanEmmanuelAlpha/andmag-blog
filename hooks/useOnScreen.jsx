import React, { useEffect, useState } from "react";

/**
 * @param {String} rootMargin
 * @param {React.MutableRefObject} targetRef
 * @param {Function} onIntersecting
 * @returns
 */
export default function useOnScreen(
  rootMargin = "0px",
  targetRef,
  onIntersecting,
  threshold = 0.0
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (targetRef.current == null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (typeof onIntersecting !== "function") return;
        onIntersecting(entry);
      },
      { rootMargin: rootMargin, threshold: threshold }
    );

    observer.observe(targetRef.current);

    return () => {
      if (targetRef.current === null) return;
      observer.unobserve(targetRef.current);
    };
  }, [targetRef.current, rootMargin]);

  return isVisible;
}
