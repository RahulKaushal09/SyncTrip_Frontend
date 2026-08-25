"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, MessageCircle, Users } from "lucide-react";
import { ROUTES } from "@/constants";
import styles from "./ClubEvents.module.css";

/**
 * Clubs live inside the app today, so every link in this section points at the
 * public plans/events page. Swap this single constant once /club ships.
 */
const CLUBS_HREF = ROUTES.PLANS;

type Highlight = {
  label: string;
  accent: string;
  icon: React.ReactNode;
};

const HIGHLIGHTS: Highlight[] = [
  { label: "Local communities", accent: "#4bbef5", icon: <Users size={16} /> },
  { label: "Open chat rooms", accent: "#F3359E", icon: <MessageCircle size={16} /> },
  { label: "Real-world events", accent: "#10B981", icon: <CalendarDays size={16} /> }
];

type Club = {
  id: string;
  icon: string;
  name: string;
  meta: string;
  event: string;
  accent: string;
};

const CLUBS: Club[] = [
  {
    id: "riders",
    icon: "🏍️",
    name: "Weekend Riders Club",
    meta: "Motorcycle community near you",
    event: "Sunday breakfast ride",
    accent: "#F59E0B"
  },
  {
    id: "turf",
    icon: "🏏",
    name: "City Turf & Sports Club",
    meta: "Pickup games every week",
    event: "Friday night turf match",
    accent: "#10B981"
  },
  {
    id: "film",
    icon: "🎬",
    name: "Film Lovers Club",
    meta: "Movie buffs in your city",
    event: "Weekend premiere night",
    accent: "#F3359E"
  }
];

const ClubEvents = () => {
  return (
    <section
      id="clubs"
      aria-labelledby="club-events-title"
      className={`${styles.section} bg-gradient-to-b from-[#F7FAFC] via-[#FFFFFF] to-[#F6F9FB]`}
    >
      <div className={styles.contentWrap}>
        <div className={styles.copy}>
          <div className={styles.kickerWrap}>
            <span className={styles.kickerDot} />
            <span className={styles.kicker}>CLUBS &amp; EVENTS</span>
          </div>

          <h2 id="club-events-title" className={styles.title}>
            Join clubs. Show up to events.
            Meet your community.
          </h2>

          <p className={styles.body}>
            SyncTrip clubs bring people together around what they love - riding, sports, travel, movies, and more. Join a club near you, jump into open chat rooms, and get notified about upcoming club events and meetups. Come as a stranger, leave with a crew.
          </p>

          <ul className={styles.pillList}>
            {HIGHLIGHTS.map((highlight) => (
              <li
                key={highlight.label}
                className={styles.pill}
                style={{ "--pill-accent": highlight.accent } as React.CSSProperties}
              >
                <span className={styles.pillIcon} aria-hidden="true">{highlight.icon}</span>
                {highlight.label}
              </li>
            ))}
          </ul>

          <Link href={CLUBS_HREF} className={styles.ctaButton}>
            Discover Clubs &amp; Events
            <ArrowRight size={18} className={styles.ctaArrow} aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.visual}>
          {CLUBS.map((club) => (
            <article
              key={club.id}
              className={styles.clubCard}
              style={{ "--accent": club.accent } as React.CSSProperties}
            >
              <span className={styles.clubIcon} aria-hidden="true">{club.icon}</span>
              <div className={styles.clubInfo}>
                <h3 className={styles.clubName}>{club.name}</h3>
                <p className={styles.clubMeta}>{club.meta}</p>
                <span className={styles.clubEvent}>
                  <CalendarDays size={13} aria-hidden="true" />
                  Next event: {club.event}
                </span>
              </div>
            </article>
          ))}

          <div className={styles.liveChip}>
            <div className={styles.livePulseWrap}>
              <span className={styles.liveDot} aria-hidden="true" />
              <span className={styles.livePing} aria-hidden="true" />
            </div>
            <span className={styles.liveText}>Club events every week</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubEvents;
