"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted background loop that only downloads once it is near the viewport, so a
 * below-the-fold tile doesn't cost mobile data on first load. The poster shows until then.
 */
export default function LazyLoopVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setLoad(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <video ref={ref} src={load ? src : undefined} poster={poster} autoPlay muted loop playsInline preload="none" aria-hidden />;
}
