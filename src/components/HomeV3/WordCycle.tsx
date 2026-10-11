"use client";

import { useEffect, useState } from "react";
import styles from "./HomeV3.module.css";

/** Cycles through words with a slide-up swap. The server renders the first word; reduced motion keeps it still. */
export default function WordCycle({ words, every = 2200 }: { words: string[]; every?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % words.length), every);
    return () => clearInterval(t);
  }, [words.length, every]);

  return (
    <span className={styles.cycle} aria-live="off">
      <span key={i} className={styles.cycleWord}>{words[i]}</span>
    </span>
  );
}
