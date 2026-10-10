"use client";

import React, { useState } from "react";
import { ExternalLink, Users } from "lucide-react";
import type { GuideVenue } from "@/lib/cityGuideApi";
import type { StoreTrack } from "@/lib/storeLinks";
import { PlanSheet } from "./VenueExplorer";
import styles from "./CityGuide.module.css";

/** "Go with people" (opens the plan sheet) + directions, for a venue page. */
export default function VenueActions({ venue, cityName, track }: { venue: GuideVenue; cityName: string; track: StoreTrack }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.venueCtaStack}>
      <button type="button" className={styles.btnPrimary} onClick={() => setOpen(true)}>
        <Users size={16} aria-hidden /> Go with people
      </button>
      {venue.mapsUrl && (
        <a className={styles.btnOutline} href={venue.mapsUrl} target="_blank" rel="noopener noreferrer nofollow">
          <ExternalLink size={15} aria-hidden /> Directions on Google Maps
        </a>
      )}
      {open && <PlanSheet venue={venue} cityName={cityName} track={track} onClose={() => setOpen(false)} />}
    </div>
  );
}
