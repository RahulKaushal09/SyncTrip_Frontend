"use client";

import { useEffect } from "react";

/**
 * Turns on the page's scroll animations: marks the page root with data-motion="on",
 * then flags each [data-reveal] element with data-shown as it enters the viewport.
 * Everything is visible in the server HTML; without JS, or with reduced motion,
 * nothing is hidden.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-motion-root]");
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = root.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-head]");
    // Anything already on screen shows immediately, so the first paint never blinks.
    items.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) el.dataset.shown = "";
    });
    root.dataset.motion = "on";

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.shown = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    items.forEach((el) => el.dataset.shown === undefined && io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
