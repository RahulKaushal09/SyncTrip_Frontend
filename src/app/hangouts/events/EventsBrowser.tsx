"use client";

import { useMemo, useState } from "react";
import type { City, ClubEvent } from "../_lib/api";
import { SITE } from "../_lib/links";
import { Ico } from "../_components/Shell";

const IST = { timeZone: "Asia/Kolkata" } as const;
const day = (d: string) => new Date(d).toLocaleDateString("en-IN", { ...IST, day: "numeric" });
const mon = (d: string) => new Date(d).toLocaleDateString("en-IN", { ...IST, month: "short" });
const time = (d: string) => new Date(d).toLocaleString("en-IN", { ...IST, weekday: "short", hour: "numeric", minute: "2-digit" });
const catOf = (e: ClubEvent) => e.activity?.label || e.category || "Other";

/** City + category filters over the live club-events feed. Only active cities appear. */
export default function EventsBrowser({ events, cities }: { events: ClubEvent[]; cities: City[] }) {
  const [city, setCity] = useState("all");
  const [cat, setCat] = useState("All");

  const inCity = useMemo(() => events.filter((e) => city === "all" || e.venue?.cityId === city), [events, city]);
  const cats = useMemo(() => {
    const m = new Map<string, string | undefined>();
    events.forEach((e) => m.set(catOf(e), e.activity?.emoji));
    return Array.from(m);
  }, [events]);
  const list = inCity.filter((e) => cat === "All" || catOf(e) === cat);

  return (
    <>
      <div className="filters">
        <div className="frow">
          <button type="button" className={`fchip${city === "all" ? " on" : ""}`} onClick={() => setCity("all")}>All cities</button>
          {cities.map((c) => (
            <button type="button" key={c.id} className={`fchip${city === c.id ? " on" : ""}`} onClick={() => setCity(c.id)}>
              <Ico name="i-pin" style={{ width: 15, height: 15 }} />{c.title}
            </button>
          ))}
        </div>
        <div className="frow">
          <button type="button" className={`fchip${cat === "All" ? " on" : ""}`} onClick={() => setCat("All")}>Everything</button>
          {cats.map(([label, emoji]) => (
            <button type="button" key={label} className={`fchip${cat === label ? " on" : ""}`} onClick={() => setCat(label)}>
              {emoji ? `${emoji} ` : ""}{label}
            </button>
          ))}
        </div>
      </div>

      <div className="egrid">
        {list.length === 0 && (
          <div className="empty">
            No events here yet. Try another city or category, or follow a club in the SyncTrip app to hear about the next one.
          </div>
        )}
        {list.map((e) => {
          const price = e.isFree ? "Free" : `₹${Number(e.ticketPrice || 0).toLocaleString("en-IN")}`;
          return (
            <a key={e.id} className="ev" href={`${SITE}/share/club-event/${encodeURIComponent(e.id)}`}>
              <div className="cover" style={{ backgroundImage: e.coverImageUrl ? `url('${e.coverImageUrl}')` : undefined }}>
                <div className="date"><b>{day(e.startsAt)}</b><small>{mon(e.startsAt)}</small></div>
                {e.activity && <span className="cat">{e.activity.emoji} {e.activity.label}</span>}
                {/* Web pages show "Sold out" only, never seat counts. */}
                {e.seatsLeft === 0 && <div className="sold">Sold out</div>}
              </div>
              <div className="body">
                <h3>{e.title}</h3>
                <div className="meta">
                  <div><Ico name="i-clock" />{time(e.startsAt)}</div>
                  <div><Ico name="i-pin" /><span>{e.venue?.name}{e.venue?.locality ? `, ${e.venue.locality}` : ""}</span></div>
                </div>
                <div className="foot">
                  <div className="club">
                    {e.club?.logoUrl && <img src={e.club.logoUrl} alt="" />}
                    <span>{e.club?.name}</span>
                    <Ico name="i-verified" />
                  </div>
                  <div className="ep">
                    {e.priceTier?.label ? <small className="tier">{e.priceTier.label}</small> : <small>{e.isFree ? "" : e.hasPasses ? "From" : "per person"}</small>}
                    <b>{price}</b>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}
