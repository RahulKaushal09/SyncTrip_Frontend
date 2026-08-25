"use client";

import React from "react";
import Image from "next/image";
import { Calendar, User, MapPin } from "lucide-react";
import styles from "./InfiniteTripMarquee.module.css";
import { TRIPS_HOME } from "@/constants";
import { redirectToStore } from "@/utils/redirectToStore";

// 1. Data Types
type TripData = {
  id: string;
  locationName: string;
  tripSnapshot: {
    tripImage: string;
    tripName: string;
    startDate: string;
    endDate: string;
    budget: string;
    interests: string[];
  };
  userSnapshot: {
    name: string;
    age: number;
  };
};

const formatDates = (start: string, end: string) => {
  const d1 = new Date(start);
  const d2 = new Date(end);
  const startStr = d1.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr =
    d1.getMonth() === d2.getMonth()
      ? d2.getDate().toString()
      : d2.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${startStr} – ${endStr}`;
};

// Subtle colors for the minimal budget indicator dots
const budgetColor: Record<string, string> = {
  Economic: "#3b82f6", // Blue
  Affordable: "#10b981", // Green
  Flexible: "#f59e0b", // Orange
  Luxury: "#a855f7", // Purple
};

// (Your TRIPS data array remains identical here)
const TRIPS: TripData[] = TRIPS_HOME;

// 2. Minimalist Squarish Card Component
const TripCard = ({ data }: { data: TripData }) => {
  const { tripSnapshot, userSnapshot, locationName } = data;
  const color = budgetColor[tripSnapshot.budget] ?? "#ffffff";

  return (
    <article
      className={styles.card}
      // Explicit styles to prevent Next.js Image fill bugs
      style={{ position: 'relative', width: '300px', height: '320px', flexShrink: 0, overflow: 'hidden', borderRadius: '16px' }}
    >
      {/* Background Image */}
      <div className={styles.imageWrapper} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src={tripSnapshot.tripImage}
          alt={tripSnapshot.tripName}
          fill
          sizes="300px"
          className={styles.cardImage}
          style={{ objectFit: 'cover' }}
        />
        {/* Soft, minimal gradient just at the bottom for text contrast */}
        <div className={styles.scrim} aria-hidden="true" />
      </div>

      {/* Top Section: Minimal Budget Pill */}
      <div className={styles.topRow}>
        <span className={styles.minimalPill}>
          {/* Subtle colored dot instead of full colored background */}
          <span className={styles.colorDot} style={{ backgroundColor: color }} />
          {tripSnapshot.budget}
        </span>
      </div>

      {/* Bottom Section: Core Content */}
      <div className={styles.bottomContent}>
        <div className={styles.textContent}>
          <h3 className={styles.tripName}>{tripSnapshot.tripName}</h3>
          <p className={styles.locationText}>
            <MapPin size={13} strokeWidth={2.5} />
            {locationName}
          </p>
        </div>

        {/* Minimal metadata row separated by a subtle line */}
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <Calendar size={13} strokeWidth={2} />
            {formatDates(tripSnapshot.startDate, tripSnapshot.endDate)}
          </div>
          <div className={styles.metaItem}>
            <User size={13} strokeWidth={2} />
            {userSnapshot.name}, {userSnapshot.age}
          </div>
        </div>
      </div>
    </article>
  );
};

export default function InfiniteTripMarquee() {
  // Duplicate array to create the seamless infinite scroll
  const row1 = [...TRIPS, ...TRIPS, ...TRIPS];

  return (
    <section className={`${styles.section} bg-gradient-to-bl from-[#F3FAFF] via-[#F2FAFF] to-[#c2e3f7]`} aria-label="Live trips on SyncTrip">
      {/* Gradients to fade out the left and right edges smoothly */}
      {/* <div className={styles.fadeLeft} aria-hidden="true" />
      <div className={styles.fadeRight} aria-hidden="true" /> */}
      {/* Scrolling Track */}
      <div onClick={redirectToStore} className={styles.trackWrap}>
        <div className={styles.track}>
          {row1.map((trip, idx) => (
            <TripCard key={`r1-${trip.id}-${idx}`} data={trip} />
          ))}
        </div>

      </div>
      <p style={{ padding: 20, textAlign: "center", color: "#ccc" }}>SyncTrip is India&apos;s social travel and activity app to find travel buddies, join local activity groups, and discover club events near you. Free on Android and iOS. No subscription — just trips, companions, and plans waiting to happen.</p>

    </section>
  );
}