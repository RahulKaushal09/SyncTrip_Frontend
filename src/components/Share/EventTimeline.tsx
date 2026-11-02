"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from "lucide-react";
import type { EventCard } from "@/utils/club.api.utils";
import { formatDate, humanize } from "./shareFormat";
import styles from "./EventTimeline.module.css";

type Props = {
  events: EventCard[];
  title: string;
  subtitle?: string;
  /** Show the hosting club on each card (for pages that mix clubs). */
  showClub?: boolean;
  headingId?: string;
};

const TAG_TONES = ["toneSky", "toneSun", "toneRose", "toneMint", "toneLilac"] as const;

/**
 * Past events on a horizontal timeline: a date pill and a dot on the line, the
 * event card hanging below. Newest on the left, older to the right. Drag with a
 * mouse, swipe on touch, or use the arrows. Filter chips appear when the events
 * span more than one category.
 */
export default function EventTimeline({ events, title, subtitle, showClub = false, headingId = "past-events-title" }: Props) {
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    events.forEach((e) => e.category && counts.set(e.category, (counts.get(e.category) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
  }, [events]);
  const toneOf = (category: string | null) =>
    styles[TAG_TONES[Math.max(0, categories.indexOf(category ?? "")) % TAG_TONES.length]];

  const [filter, setFilter] = useState<string | null>(null);
  const shown = filter ? events.filter((e) => e.category === filter) : events;

  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * Math.max(260, el.clientWidth * 0.8), behavior: "smooth" });
  };

  if (events.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.head}>
        <div>
          <h2 id={headingId} className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.arrows}>
          <button type="button" className={styles.arrow} onClick={() => scrollBy(-1)} aria-label="Newer events">
            <ArrowLeft size={18} aria-hidden />
          </button>
          <button type="button" className={styles.arrow} onClick={() => scrollBy(1)} aria-label="Older events">
            <ArrowRight size={18} aria-hidden />
          </button>
        </div>
      </div>

      {categories.length > 1 && (
        <div className={styles.filters} role="group" aria-label="Filter events">
          <button type="button" className={`${styles.filter} ${!filter ? styles.filterOn : ""}`} onClick={() => setFilter(null)}>
            All
          </button>
          {categories.slice(0, 6).map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.filter} ${filter === c ? styles.filterOn : ""}`}
              onClick={() => setFilter(filter === c ? null : c)}
            >
              {humanize(c)}
            </button>
          ))}
          <span className={styles.hint}>Swipe or drag. Older events are to the right.</span>
        </div>
      )}

      <div
        ref={track}
        className={styles.track}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !track.current) return;
          drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || !track.current) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 5) d.moved = true;
          track.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => setTimeout(() => (drag.current = null), 0)}
        onPointerLeave={() => (drag.current = null)}
        onClickCapture={(e) => {
          if (drag.current?.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <ol className={styles.rail}>
          {shown.map((e) => (
            <li key={e.id} className={styles.item}>
              <span className={styles.datePill}>{formatDate(e.startsAt)?.replace(/^\w+, /, "")}</span>
              <span className={styles.dot} aria-hidden />
              <span className={styles.stem} aria-hidden />
              <Link href={`/share/club-event/${e.id}`} className={styles.card} draggable={false}>
                <div className={styles.media}>
                  {e.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- Gumlet CDN, already sized
                    <img src={e.imageUrl} alt={`${e.title}${e.venueName ? ` at ${e.venueName}` : ""}`} loading="lazy" draggable={false} />
                  ) : (
                    <span className={styles.mediaFallback} aria-hidden>🎲</span>
                  )}
                </div>
                <div className={styles.body}>
                  {e.category && <span className={`${styles.tag} ${toneOf(e.category)}`}>{humanize(e.category)}</span>}
                  <h3 className={styles.cardTitle}>{e.title}</h3>
                  <p className={styles.meta}>
                    <CalendarDays size={14} aria-hidden /> {formatDate(e.startsAt)}
                  </p>
                  {(e.venueName || e.locality) && (
                    <p className={styles.meta}>
                      <MapPin size={14} aria-hidden /> {[e.venueName, e.locality].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {showClub && e.clubName && (
                    <p className={styles.club}>
                      {e.clubLogoUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={e.clubLogoUrl} alt="" aria-hidden />
                      )}
                      {e.clubName}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
