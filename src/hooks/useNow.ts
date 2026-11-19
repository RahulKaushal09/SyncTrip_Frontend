"use client";
import { useEffect, useState } from "react";

/**
 * The current time, or null until the page has mounted - so anything worded
 * from it ("ends today") renders empty on the server and the HTML never
 * disagrees with the visitor's clock. Ticks every `everyMs`.
 */
export function useNow(everyMs = 30_000): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), everyMs);
    return () => clearInterval(id);
  }, [everyMs]);
  return now;
}
