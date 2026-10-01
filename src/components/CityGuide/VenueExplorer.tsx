"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Clock, ExternalLink, IndianRupee, MapPin, Star, Users, X } from "lucide-react";
import { APP_LINKS, ROUTES } from "@/constants/config";
import type { GuideVenue } from "@/lib/cityGuideApi";
import GuideIcon from "./GuideIcon";
import styles from "./CityGuide.module.css";

const AREA_ORDER = ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Himachal"];
const BEST_FOR_LABEL: Record<string, string> = {
  "solo-friendly": "Solo-friendly", groups: "Groups", date: "Date", birthdays: "Birthdays", beginners: "Beginners",
  "rainy day": "Rainy day", "late night": "Late night", budget: "Budget", "day out": "Day out", weekend: "Weekend",
};

/**
 * Venue list with an area filter and a "plan this with people" sheet.
 * Every venue is rendered on the server too (the filter only hides cards), so all
 * venue copy is in the HTML Google indexes.
 */
export default function VenueExplorer({
  venues, icon, cityName, emptyText,
}: {
  venues: GuideVenue[];
  icon: string;
  cityName: string;
  emptyText: string;
}) {
  const [area, setArea] = useState<string>("all");
  const [planning, setPlanning] = useState<GuideVenue | null>(null);

  const areas = useMemo(() => {
    const counts = new Map<string, number>();
    venues.forEach((v) => counts.set(v.area || cityName, (counts.get(v.area || cityName) || 0) + 1));
    return [...counts.entries()].sort((a, b) => {
      const ia = AREA_ORDER.indexOf(a[0]), ib = AREA_ORDER.indexOf(b[0]);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
  }, [venues, cityName]);

  if (venues.length === 0) {
    return <p className={styles.sub}>{emptyText}</p>;
  }

  return (
    <>
      {areas.length > 1 && (
        <div className={styles.filterBar} role="toolbar" aria-label="Filter by area">
          <button type="button" className={`${styles.chip} ${area === "all" ? styles.chipOn : ""}`} aria-pressed={area === "all"} onClick={() => setArea("all")}>
            All areas <span className={styles.chipCount}>{venues.length}</span>
          </button>
          {areas.map(([name, n]) => (
            <button key={name} type="button" className={`${styles.chip} ${area === name ? styles.chipOn : ""}`} aria-pressed={area === name} onClick={() => setArea(name)}>
              <MapPin size={13} aria-hidden /> {name} <span className={styles.chipCount}>{n}</span>
            </button>
          ))}
        </div>
      )}

      <div className={styles.venueGrid}>
        {venues.map((v) => {
          const hidden = area !== "all" && (v.area || cityName) !== area;
          const cover = v.photos[0];
          return (
            <article key={v.id} className={styles.venueCard} hidden={hidden} id={`venue-${v.slug}`}>
              <div className={styles.venueMedia}>
                {cover ? (
                  // Our own uploads served from the image CDN.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover.src} alt={cover.alt || v.name} loading="lazy" />
                ) : (
                  <div className={styles.venueFallback} aria-hidden>
                    <span className={styles.venueFallbackIcon}><GuideIcon name={icon} size={20} /></span>
                    <span style={{ minWidth: 0 }}>
                      <span className={styles.venueFallbackArea}>{v.area}</span>
                      <div className={styles.venueFallbackName}>{v.name}</div>
                    </span>
                  </div>
                )}
                {(v.syncTripHosted || v.featured) && (
                  <span className={styles.badgeRow}>
                    {v.featured && <span className={`${styles.badge} ${styles.badgeFeatured}`}><Star size={12} aria-hidden /> Partner</span>}
                    {v.syncTripHosted && <span className={`${styles.badge} ${styles.badgeHosted}`}><BadgeCheck size={12} aria-hidden /> SyncTrip hosted here</span>}
                  </span>
                )}
                {v.photos.length > 1 && <span className={styles.photoCount}>{v.photos.length} photos</span>}
              </div>

              <div className={styles.venueBody}>
                <h3 className={styles.venueName}>{v.name}</h3>
                <span className={styles.venueWhere}>
                  <MapPin size={14} aria-hidden />
                  {[v.locality, v.area].filter(Boolean).join(", ")}
                </span>
                {v.description && <p className={styles.venueDesc}>{v.description}</p>}
                {(v.hours || v.priceNote) && (
                  <div className={styles.venueFacts}>
                    {v.hours && <span><Clock size={13} aria-hidden /> {v.hours}</span>}
                    {v.priceNote && <span><IndianRupee size={13} aria-hidden /> {v.priceNote}</span>}
                  </div>
                )}
                {v.bestFor.length > 0 && (
                  <div className={styles.tagRow}>
                    {v.bestFor.map((b) => <span key={b} className={styles.tag}>{BEST_FOR_LABEL[b] || b}</span>)}
                  </div>
                )}
                <div className={styles.venueActions}>
                  <button type="button" className={styles.btnOutline} onClick={() => setPlanning(v)}>
                    <Users size={15} aria-hidden /> Go with people
                  </button>
                  {v.mapsUrl && (
                    <a className={styles.btnLight} href={v.mapsUrl} target="_blank" rel="noopener noreferrer nofollow">
                      <ExternalLink size={14} aria-hidden /> Directions
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {planning && <PlanSheet venue={planning} cityName={cityName} onClose={() => setPlanning(null)} />}
    </>
  );
}

function PlanSheet({ venue, cityName, onClose }: { venue: GuideVenue; cityName: string; onClose: () => void }) {
  const [platform, setPlatform] = useState<"android" | "ios" | "other">("other");

  useEffect(() => {
    const ua = navigator.userAgent;
    setPlatform(/android/i.test(ua) ? "android" : /iphone|ipad|ipod/i.test(ua) ? "ios" : "other");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const kind = venue.plan.category === "sports"
    ? `a ${venue.plan.sportType && venue.plan.sportType !== "other" ? venue.plan.sportType : "sport"} plan`
    : venue.plan.outingType === "nightlife" ? "a night-out plan" : venue.plan.outingType === "cafe" ? "a café outing" : "an outing";

  return (
    <div className={styles.sheetBackdrop} onClick={onClose} role="presentation">
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="plan-sheet-title" onClick={(e) => e.stopPropagation()}>
        <div className={styles.sheetHead}>
          <div>
            <h3 id="plan-sheet-title">Go to {venue.name} with people</h3>
            <p>{[venue.locality, venue.area].filter(Boolean).join(", ")}</p>
          </div>
          <button type="button" className={styles.sheetClose} onClick={onClose} aria-label="Close">
            <X size={18} aria-hidden />
          </button>
        </div>
        <ol className={styles.steps}>
          <li><span className={styles.stepNum}>1</span><span>Open SyncTrip (free) and set your city to <b>{cityName}</b>.</span></li>
          <li><span className={styles.stepNum}>2</span><span>Create {kind}, pick a date and time, and add <b>{venue.name}</b> as the venue.</span></li>
          <li><span className={styles.stepNum}>3</span><span>People nearby join. Chat in the plan, then meet at the venue.</span></li>
        </ol>
        <div className={styles.sheetStores}>
          {platform !== "ios" && (
            <a className={styles.storeBtn} href={APP_LINKS.PLAY_STORE} target="_blank" rel="noopener noreferrer">Get it on Android</a>
          )}
          {platform !== "android" && (
            <a className={styles.storeBtn} href={APP_LINKS.APP_STORE} target="_blank" rel="noopener noreferrer">Download for iPhone</a>
          )}
          <Link className={styles.btnLight} href={ROUTES.PLANS} style={{ gridColumn: "1 / -1" }}>
            Or browse open plans in {cityName}
          </Link>
        </div>
      </div>
    </div>
  );
}
