"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Smartphone } from "lucide-react";
import type { ClubEvent } from "@/types";
import styles from "./ClubBooking.module.css";

const rupees = (n: number) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;
const pad = (n: number) => String(n).padStart(2, "0");

function partsUntil(endMs: number) {
  const left = Math.max(0, endMs - Date.now());
  const s = Math.floor(left / 1000);
  return { left, d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** DD : HH : MM : SS to when the current price ends - same as the app. */
function Countdown({ endsAt }: { endsAt: string }) {
  const end = new Date(endsAt).getTime();
  // Rendered empty on the server so the HTML never disagrees with the clock.
  const [p, setP] = useState<ReturnType<typeof partsUntil> | null>(null);
  useEffect(() => {
    setP(partsUntil(end));
    const id = setInterval(() => setP(partsUntil(end)), 1000);
    return () => clearInterval(id);
  }, [end]);
  if (!p || p.left <= 0) return null;
  const urgent = p.left < 3600 * 1000;
  const units: [string, number][] = [
    ...(p.d > 0 ? [["Days", p.d] as [string, number]] : []),
    ["Hrs", p.h], ["Min", p.m], ["Sec", p.s],
  ];
  return (
    <div className={styles.countdown} role="timer">
      {units.map(([u, v], i) => (
        <React.Fragment key={u}>
          {i > 0 && <span className={styles.cdColon}>:</span>}
          <span className={styles.cdBox}>
            <span className={`${styles.cdValue} ${urgent && u === "Sec" ? styles.cdUrgent : ""}`}>{pad(v)}</span>
            <span className={styles.cdUnit}>{u}</span>
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

function tierRule(t: { untilSeatsSold?: number | null; endsAt?: string | null }): string | null {
  const bits: string[] = [];
  if (t.untilSeatsSold) bits.push(`first ${t.untilSeatsSold} seats`);
  if (t.endsAt) {
    bits.push(`till ${new Date(t.endsAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}`);
  }
  return bits.length ? bits.join(" · ") : null;
}

type Props = {
  event: ClubEvent;
  bookable: boolean;
  soldOut: boolean;
  closedLabel?: string | null;
  appHref: string;
  onBook: () => void;
};

export default function ClubTicketCard({ event, bookable, soldOut, closedLabel, appHref, onBook }: Props) {
  const isFree = !!event.pricing?.isFree;
  const tier = event.tierInfo;
  const cur = tier?.current;
  const price = cur?.price ?? event.pricing?.ticketPrice ?? 0;
  const capacity = event.capacity || 0;
  const seatsLeft = Math.max(0, event.seatsLeft ?? 0);
  const filledPct = capacity > 0 ? Math.min(100, Math.round(((capacity - seatsLeft) / capacity) * 100)) : 0;
  const hot = capacity > 0 && seatsLeft > 0 && seatsLeft / capacity <= 0.2;

  return (
    <div className={styles.ticket}>
      <div className={styles.ticketHead}>
        <span className={styles.tierPill}>{isFree ? "Free entry" : cur ? cur.label : "Ticket"}</span>
        <div className={styles.priceRow}>
          <span className={styles.price}>{isFree ? "Free" : rupees(price)}</span>
          {!isFree && <span className={styles.priceLabel}>per person</span>}
          {cur?.nextPrice && cur.nextPrice > price && (
            <span className={styles.nextPrice}>
              then {rupees(cur.nextPrice)}{cur.nextLabel ? ` (${cur.nextLabel})` : ""}
            </span>
          )}
        </div>
        {cur?.endsAt && bookable && (
          <div className={styles.countdownWrap}>
            <div className={styles.countdownLabel}>{cur.label} price ends in</div>
            <Countdown endsAt={cur.endsAt} />
          </div>
        )}
        {cur?.seatsLeft != null && cur.seatsLeft > 0 && bookable && (
          <div className={styles.countdownLabel} style={{ marginTop: "0.75rem", marginBottom: 0 }}>
            Only {cur.seatsLeft} seat{cur.seatsLeft === 1 ? "" : "s"} left at this price
          </div>
        )}
      </div>

      <div className={styles.ticketBody}>
        {capacity > 0 && (
          <div>
            <div className={styles.seatsHead}>
              <span className={hot || soldOut ? styles.seatsHot : undefined}>
                {soldOut ? "Sold out" : hot ? `Only ${seatsLeft} seats left` : `${seatsLeft} of ${capacity} seats left`}
              </span>
              {(event.totalAttendees ?? 0) > 0 && <span>{event.totalAttendees} going</span>}
            </div>
            <div className={styles.seatsBar}>
              <div className={styles.seatsFill} style={{ width: `${filledPct}%` }} />
            </div>
          </div>
        )}

        {tier && tier.tiers.length > 1 && (
          <div className={styles.ladder}>
            {tier.tiers.map((t) => (
              <div
                key={t.id}
                className={`${styles.ladderRow} ${t.state === "current" ? styles.ladderCurrent : ""} ${t.state === "ended" ? styles.ladderEnded : ""}`}
              >
                <div>
                  <span className={styles.ladderName}>{t.label}</span>
                  <span className={styles.ladderMeta}>
                    {t.state === "ended" ? "Ended" : t.state === "current" ? "Selling now" : tierRule(t) ? `Then · ${tierRule(t)}` : "Next"}
                    {t.state === "current" && tierRule(t) ? ` · ${tierRule(t)}` : ""}
                  </span>
                </div>
                <span className={`${styles.ladderPrice} ${t.state === "ended" ? styles.struck : ""}`}>{rupees(t.price)}</span>
              </div>
            ))}
          </div>
        )}

        {bookable ? (
          <button type="button" className={`${styles.primaryBtn} ${styles.cardBookBtn}`} onClick={onBook}>
            {isFree ? "Reserve your spot" : `Book now · ${rupees(price)}`}
          </button>
        ) : (
          <button type="button" className={styles.primaryBtn} disabled>
            {closedLabel || (soldOut ? "Sold out" : "Booking closed")}
          </button>
        )}

        <div className={styles.fineRow}>
          <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>Secure payment by Razorpay · UPI, cards and netbanking</span>
        </div>
        <div className={styles.fineRow}>
          <Smartphone size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>Your ticket, check-in and the event group chat are in the SyncTrip app</span>
        </div>
        <a href={appHref} className={styles.secondaryLink} rel="noopener">
          Already have SyncTrip? Open in the app →
        </a>
      </div>
    </div>
  );
}
