"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Smartphone } from "lucide-react";
import type { ClubEvent } from "@/types";
import { useNow } from "@/hooks/useNow";
import { deadlineLabel, hasReservePasses, isLowStock, leadPass, passReserve, passesLeft } from "./shareFormat";
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

/** Date rule for a price tier ("till 18 Nov, 7:30 pm"), in IST. */
function tierRule(t: { endsAt?: string | null }): string | null {
  if (!t.endsAt) return null;
  return `till ${new Date(t.endsAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })}`;
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
  const passes = event.passes?.length ? event.passes : null;
  const tier = passes ? null : event.tierInfo;
  const cur = tier?.current;
  const onSale = (passes ?? []).filter((p) => p.state === "on_sale").map((p) => p.price);
  const passFrom = passes ? Math.min(...(onSale.length ? onSale : passes.map((p) => p.price))) : null;
  const price = passFrom ?? cur?.price ?? event.pricing?.ticketPrice ?? 0;
  const now = useNow();
  const reserve = hasReservePasses(passes);
  const seatsLeft = (event.capacity ?? 0) > 0 ? event.seatsLeft ?? null : null;

  // Pass events: the cheapest ticket still buyable leads the urgency - how
  // few are left at that price, what it goes up to, and when it stops.
  const leading = leadPass(passes, event);
  const lead = leading?.pass ?? null;
  const leadLeft = leading?.left ?? null;
  const leadNext = leading?.next ?? null;
  const showSeatsLeft = bookable && isLowStock(seatsLeft);
  const leadEndsMs = lead?.salesEndAt ? new Date(lead.salesEndAt).getTime() : null;
  const leadCountdown = now != null && leadEndsMs != null && leadEndsMs > now && leadEndsMs - now < 86400e3;

  return (
    <div className={styles.ticket}>
      <div className={styles.ticketHead}>
        <span className={styles.tierPill}>{passes ? `${passes.length} ticket type${passes.length === 1 ? "" : "s"}` : isFree ? "Free entry" : cur ? cur.label : "Ticket"}</span>
        <div className={styles.priceRow}>
          {passes && !isFree && <span className={styles.priceLabel}>from</span>}
          <span className={styles.price}>{isFree ? "Free" : rupees(price)}</span>
          {!isFree && !passes && <span className={styles.priceLabel}>per person</span>}
          {reserve && <span className={styles.priceLabel}>to reserve your spot</span>}
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
        {bookable && isLowStock(cur?.seatsLeft) && (
          <div className={styles.urgentLine}>Only {cur!.seatsLeft} left at this price</div>
        )}

        {bookable && lead && isLowStock(leadLeft) && (
          <div className={styles.urgentLine}>
            Only {leadLeft} {lead.name} left{lead.price > 0 ? ` at ${rupees(passReserve(lead)?.total ?? lead.price)}` : ""}
            {leadNext ? `, then ${rupees(passReserve(leadNext)?.total ?? leadNext.price)}` : ""}
          </div>
        )}
        {bookable && lead?.salesEndAt && (leadCountdown ? (
          <div className={styles.countdownWrap}>
            <div className={styles.countdownLabel}>{lead.name} sales end in</div>
            <Countdown endsAt={lead.salesEndAt} />
          </div>
        ) : now != null && deadlineLabel(lead.salesEndAt, now) ? (
          <div className={styles.countdownLabel} style={{ marginTop: "0.6rem", marginBottom: 0 }}>
            {lead.name} sales end {deadlineLabel(lead.salesEndAt, now)}
          </div>
        ) : null)}
      </div>

      <div className={styles.ticketBody}>
        {/* Seats left only when low (urgency) - never "N going" or "N of M left". */}
        {soldOut ? (
          <div className={styles.seatsHead}>
            <span className={styles.seatsHot}>Sold out</span>
          </div>
        ) : showSeatsLeft ? (
          <div className={styles.seatsHead}>
            <span className={styles.seatsHot}>Only {seatsLeft} spot{seatsLeft === 1 ? "" : "s"} left for this event</span>
          </div>
        ) : null}

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

        {reserve && (
          <p className={styles.reserveNote}>
            This is the reservation amount, not the full price. Pay it now to hold your spot and pay the balance later - each ticket below shows its full price.
          </p>
        )}

        {passes && (
          <div className={styles.ladder}>
            {passes.map((p) => {
              const left = passesLeft(p, event);
              const gone = p.state === "sold_out" || (p.state === "on_sale" && left === 0);
              const off = gone || p.state !== "on_sale";
              const ends = !off && p.salesEndAt && now != null ? deadlineLabel(p.salesEndAt, now) : null;
              return (
                <div key={p.id} className={`${styles.ladderRow} ${off ? styles.ladderEnded : ""}`}>
                  <div>
                    <span className={styles.ladderName}>{p.name}</span>
                    <span className={styles.ladderMeta}>
                      Admits {p.admits === 1 ? "1 person" : `${p.admits} people`}
                      {gone ? " · Sold out" : p.state === "ended" ? " · Sales ended" : ""}
                      {/* Not when it only repeats the event's own "Only N spots left" above. */}
                      {!off && isLowStock(left) && !(showSeatsLeft && left === seatsLeft) && <span className={styles.ladderHot}> · Only {left} left</span>}
                      {ends && <span className={styles.ladderHot}> · Ends {ends}</span>}
                    </span>
                    {(() => {
                      const r = passReserve(p);
                      return r ? (
                        <span className={styles.ladderTotal}>
                          Full price {rupees(r.total)}{r.per ? ` ${r.per}` : ""} · {rupees(p.price)} now to reserve
                        </span>
                      ) : null;
                    })()}
                  </div>
                  <span className={`${styles.ladderPrice} ${off ? styles.struck : ""}`}>{p.price === 0 ? "Free" : rupees(passReserve(p)?.total ?? p.price)}</span>
                </div>
              );
            })}
          </div>
        )}

        {bookable ? (
          <button type="button" className={`${styles.primaryBtn} ${styles.cardBookBtn}`} onClick={onBook}>
            {passes ? "Choose tickets" : isFree ? "Reserve your spot" : `Book now · ${rupees(price)}`}
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
