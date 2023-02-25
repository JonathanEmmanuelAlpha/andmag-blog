import React, { useEffect, useState } from "react";

/**
 * Retourne le quotient et le reste dans une division euclidienne
 * @param {Number} number
 * @param {Number} divider
 * @returns
 */
export function getQuotAndRemainder(number, divider) {
  const r = number % divider;
  const q = (number - r) / divider;

  return { rest: r, quotient: q };
}

export default function useTimer(initialTime, onTimeOver, waiting = false) {
  const [timer, setTimer] = useState(0);
  const [output, setOutput] = useState("");

  function updateOutput() {
    if (timer < 60) return `${timer}s`;

    if (timer >= 60 && timer < 60 * 60) {
      const { rest, quotient } = getQuotAndRemainder(timer, 60);
      return `${quotient}:${rest}s`;
    }

    if (timer >= 60 * 60 && timer < 60 * 60 * 24) {
      const { rest, quotient } = getQuotAndRemainder(timer, 60 * 60);
      const { rest: r, quotient: q } = getQuotAndRemainder(rest, 60);

      return `${quotient}h ${q}:${r}s`;
    }

    if (timer >= 60 * 60 * 24 && timer < 60 * 60 * 24 * 30) {
      const { rest, quotient } = getQuotAndRemainder(timer, 60 * 60 * 24);
      const { rest: r1, quotient: q1 } = getQuotAndRemainder(rest, 60 * 60);
      const { rest: r2, quotient: q2 } = getQuotAndRemainder(r1, 60);

      return `${quotient}j ${q1}h ${q2}:${r2}s`;
    }

    if (timer >= 60 * 60 * 24 * 30 && timer < 60 * 60 * 24 * 30 * 12) {
      const { rest, quotient } = getQuotAndRemainder(timer, 60 * 60 * 24 * 30);
      const { rest: r1, quotient: q1 } = getQuotAndRemainder(
        rest,
        60 * 60 * 24
      );
      const { rest: r2, quotient: q2 } = getQuotAndRemainder(r1, 60 * 60);
      const { rest: r3, quotient: q3 } = getQuotAndRemainder(r2, 60);

      return `${quotient}m ${q1}j ${q2}h ${q3}:${r3}s`;
    }
  }

  useEffect(() => {
    if (!initialTime || typeof initialTime !== "number" || waiting) return;

    setTimer((prevTimer) => initialTime);

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 1) return prevTimer - 1;
        return prevTimer;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [initialTime, waiting]);

  useEffect(() => {
    if (!timer || typeof timer !== "number") return;

    if (typeof onTimeOver === "function" && timer <= 1) {
      onTimeOver();
    }

    setOutput((prev) => {
      return updateOutput();
    });
  }, [timer]);

  return { output, timer, updateOutput };
}
