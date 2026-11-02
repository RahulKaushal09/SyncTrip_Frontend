"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, LocateFixed, MapPin } from "lucide-react";
import type { ClubCard, EventCard } from "@/utils/club.api.utils";
import EventTimeline from "@/components/Share/EventTimeline";
import { formatDayTile, formatTime, humanize } from "@/components/Share/shareFormat";
import { CITIES, cityOf, distanceKm, type CityKey } from "./cities";
import styles from "./Events.module.css";

type Props = {
  upcoming: EventCard[];
  past: EventCard[];
  clubs: (ClubCard & { city: CityKey | null })[];
};

type Filter = "all" | "near" | CityKey;
const STORE_KEY = "synctrip:events-city";

const priceLabel = (e: EventCard) => (e.isFree || e.price <= 0 ? "Free" : `₹${e.price.toLocaleString("en-IN")}`);

/**
 * Upcoming club events with a city filter and a "Near me" sort, then the past
 * events and clubs for the same city. Everything is server-rendered first, so
 * the full list is in the HTML; location only re-sorts it in the browser and
 * never leaves the device.
 */
export default function EventsNearby({ upcoming, past, clubs }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [here, setHere] = useState<{ lat: number; lng: number } | null>(null);
  const [locState, setLocState] = useState<"idle" | "asking" | "denied">("idle");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved && saved in CITIES) setFilter(saved as CityKey);
    } catch {
      /* storage blocked - start on "All" */
    }
  }, []);

  const choose = (f: Filter) => {
    setFilter(f);
    try {
      if (f in CITIES) localStorage.setItem(STORE_KEY, f);
      else localStorage.removeItem(STORE_KEY);
    } catch {
      /* ignore */
    }
  };

  const nearMe = () => {
    if (!("geolocation" in navigator)) return setLocState("denied");
    setLocState("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHere({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocState("idle");
        choose("near");
      },
      () => setLocState("denied"),
      { maximumAge: 10 * 60 * 1000, timeout: 10000 }
    );
  };

  const withCity = useMemo(() => upcoming.map((e) => ({ e, city: cityOf(e) })), [upcoming]);

  const shown = useMemo(() => {
    if (filter === "near" && here) {
      return withCity
        .map((x) => ({ ...x, km: x.e.lat != null && x.e.lng != null ? distanceKm(here, { lat: x.e.lat, lng: x.e.lng }) : null }))
        .sort((a, b) => (a.km ?? 1e9) - (b.km ?? 1e9));
    }
    const list = filter === "all" || filter === "near" ? withCity : withCity.filter((x) => x.city === filter);
    return list.map((x) => ({ ...x, km: null as number | null }));
  }, [withCity, filter, here]);

  const cityName = filter in CITIES ? CITIES[filter as CityKey].name : null;
  const pastShown = filter in CITIES ? past.filter((e) => cityOf(e) === filter) : past;
  const clubsShown = filter in CITIES ? clubs.filter((c) => c.city === filter) : clubs;

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Choose a city">
        <button type="button" className={`${styles.chip} ${filter === "near" ? styles.chipOn : ""}`} onClick={nearMe}>
          <LocateFixed size={15} aria-hidden /> {locState === "asking" ? "Finding you…" : "Near me"}
        </button>
        <button type="button" className={`${styles.chip} ${filter === "all" ? styles.chipOn : ""}`} onClick={() => choose("all")}>
          All cities
        </button>
        {(Object.keys(CITIES) as CityKey[]).map((k) => (
          <button key={k} type="button" className={`${styles.chip} ${filter === k ? styles.chipOn : ""}`} onClick={() => choose(k)}>
            {CITIES[k].name}
          </button>
        ))}
      </div>
      {locState === "denied" && (
        <p className={styles.note}>Location is off for this site, so pick your city instead.</p>
      )}

      <section aria-labelledby="upcoming-title" className={styles.block}>
        <h2 id="upcoming-title" className={styles.h2}>
          {filter === "near" ? "Upcoming events near you" : cityName ? `Upcoming events in ${cityName}` : "Upcoming events"}
        </h2>

        {shown.length > 0 ? (
          <div className={styles.grid}>
            {shown.map(({ e, km }) => {
              const tile = formatDayTile(e.startsAt);
              return (
                <Link key={e.id} href={`/share/club-event/${e.id}`} className={styles.card}>
                  <div className={styles.media}>
                    {e.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- Gumlet CDN, already sized
                      <img src={e.imageUrl} alt={e.title} loading="lazy" />
                    ) : null}
                    <span className={styles.date}>
                      <b>{tile.day}</b>
                      <span>{tile.month}</span>
                    </span>
                    {km != null && <span className={styles.km}>{km < 1 ? "<1" : Math.round(km)} km away</span>}
                  </div>
                  <div className={styles.cardBody}>
                    {e.category && <span className={styles.cat}>{humanize(e.category)}</span>}
                    <h3>{e.title}</h3>
                    <p className={styles.meta}>
                      <MapPin size={14} aria-hidden />
                      {[formatTime(e.startsAt), e.venueName, e.locality].filter(Boolean).join(" · ")}
                    </p>
                    {e.clubName && (
                      <p className={styles.club}>
                        {e.clubLogoUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={e.clubLogoUrl} alt="" aria-hidden />
                        )}
                        {e.clubName}
                        {e.clubVerified && <BadgeCheck size={14} aria-label="Verified club" className={styles.tick} />}
                      </p>
                    )}
                    <div className={styles.foot}>
                      <span className={styles.price}>{priceLabel(e)}</span>
                      <span className={styles.cta}>Book →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <h3>No events posted{cityName ? ` in ${cityName}` : ""} right now</h3>
            <p>
              Clubs usually post their next game night or meetup a few days ahead. Follow a club below to get a
              notification the moment it does, or post your own plan in the SyncTrip app.
            </p>
            {filter !== "all" && (
              <button type="button" className={styles.emptyBtn} onClick={() => choose("all")}>
                See events in all cities
              </button>
            )}
          </div>
        )}
      </section>

      {pastShown.length > 0 && (
        <div className={styles.timelineWrap}>
          <EventTimeline
            events={pastShown}
            showClub
            headingId="recent-title"
            title={cityName ? `Recently in ${cityName}` : "Recently on SyncTrip"}
            subtitle="Board game nights, treks, tournaments and meetups clubs have hosted. Tap any event to see how it went."
          />
        </div>
      )}

      {clubsShown.length > 0 && (
        <section aria-labelledby="clubs-title" className={styles.block}>
          <h2 id="clubs-title" className={styles.h2}>{cityName ? `Clubs in ${cityName}` : "Clubs hosting events"}</h2>
          <div className={styles.clubs}>
            {clubsShown.map((c) => {
              const next = upcoming.find((e) => e.clubId === c.id);
              const tags = c.categories.filter((x) => !/^(multi_activity|community_space|other)$/.test(x)).slice(0, 3);
              return (
                <Link key={c.id} href={`/share/club/${c.id}`} className={styles.clubCard}>
                  <div className={styles.clubCover}>
                    {c.coverImageUrl || c.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- Gumlet CDN, already sized
                      <img
                        src={(c.coverImageUrl || c.logoUrl) as string}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        className={`${styles.coverImg} ${c.coverImageUrl ? "" : styles.coverBlur}`}
                      />
                    ) : null}
                    {c.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.logoUrl} alt={`${c.name} logo`} className={styles.clubLogo} loading="lazy" />
                    ) : (
                      <span className={styles.clubLogo} aria-hidden>{c.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className={styles.clubBody}>
                    <h3 className={styles.clubName}>
                      {c.name}
                      {c.isVerified && <BadgeCheck size={17} aria-label="Verified club" className={styles.tick} />}
                    </h3>
                    {c.city && (
                      <p className={styles.clubPlace}>
                        <MapPin size={14} aria-hidden /> {CITIES[c.city].name}
                      </p>
                    )}
                    {tags.length > 0 && (
                      <div className={styles.clubTags}>
                        {tags.map((x) => <span key={x}>{humanize(x)}</span>)}
                      </div>
                    )}
                    <div className={styles.clubFoot}>
                      {next && <span className={styles.clubNext}>Next: {formatDayTile(next.startsAt).day} {formatDayTile(next.startsAt).month.charAt(0) + formatDayTile(next.startsAt).month.slice(1).toLowerCase()}</span>}
                      <span className={styles.clubCta}>View club →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
