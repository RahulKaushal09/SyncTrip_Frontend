"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { portrait, type Movie } from "../_lib/api";

type Picks = {
  movies: Movie[];
  picked: Set<string>;
  anyMovie: boolean;
  toggle: (title: string) => void;
  toggleAny: () => void;
  /** Bumped by "Continue with my picks" so the form can jump past step 1. */
  jump: number;
  continueToForm: () => void;
};

const Ctx = createContext<Picks | null>(null);
export const useMoviePicks = () => useContext(Ctx);

/** Shares movie picks between the "Now showing" rail and the join form. */
export function MoviePicksProvider({ movies, children }: { movies: Movie[]; children: ReactNode }) {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [anyMovie, setAny] = useState(false);
  const [jump, setJump] = useState(0);

  const toggle = useCallback((title: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
    setAny(false);
  }, []);
  const toggleAny = useCallback(() => {
    setAny((a) => !a);
    setPicked(new Set());
  }, []);
  const continueToForm = useCallback(() => {
    setJump((j) => j + 1);
    // The form card itself (not the section heading above it).
    document.getElementById("wiz")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return <Ctx.Provider value={{ movies, picked, anyMovie, toggle, toggleAny, jump, continueToForm }}>{children}</Ctx.Provider>;
}

const TICK = (
  <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M5 10.5l3.2 3.2L15 7" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ShowingRail() {
  const p = useMoviePicks();
  if (!p) return null;
  if (!p.movies.length) {
    return <p className="rail-empty">Movies will show up here as soon as they&apos;re live in the SyncTrip app.</p>;
  }
  return (
    <>
      <div className="rail">
        {p.movies.map((m) => (
          <div key={m.id} className={`movie${p.picked.has(m.title) ? " on" : ""}`} onClick={() => p.toggle(m.title)}>
            <div className="art">
              <img loading="lazy" src={portrait(m.image, 360, 480)} alt={m.title} />
              <span className="tick">{TICK}</span>
            </div>
            <p>{m.title}</p>
            <small>In cinemas now</small>
          </div>
        ))}
      </div>
      <div className="wrap rail-foot">
        <span className="picked">
          {p.picked.size ? <><b>{p.picked.size} picked</b> · more picks = faster match</> : "Tap the posters you'd watch"}
        </span>
        <button type="button" className="sbtn sbtn-primary" onClick={p.continueToForm}>Continue with my picks</button>
      </div>
    </>
  );
}
