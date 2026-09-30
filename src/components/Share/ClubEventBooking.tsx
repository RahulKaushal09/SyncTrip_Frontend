"use client";

import React, { useEffect, useState } from "react";
import type { ClubEvent } from "@/types";
import { APP_LINKS } from "@/constants/config";
import { appOpenUrl } from "@/utils/appDeepLink";
import { captureWebAttribution } from "@/utils/webAttribution";
import { trackViewContent } from "@/utils/adTracking";
import ClubTicketCard from "./ClubTicketCard";
import ClubCheckoutSheet from "./ClubCheckoutSheet";
import styles from "./ClubBooking.module.css";

/**
 * Booking on the event page: the ticket card (desktop sidebar / inline on
 * phones), a fixed "Book" bar on phones, and the checkout sheet.
 *
 * Replaces the old "Get the app" card for bookable events. That card also
 * auto-redirected phones to the app after 5 seconds - fatal for someone who
 * just tapped an ad to BUY here, so there is no redirect any more; opening
 * the app is a plain link.
 */
export default function ClubEventBooking({ event }: { event: ClubEvent }) {
  const [open, setOpen] = useState(false);
  const [appHref, setAppHref] = useState<string>(APP_LINKS.PLAY_STORE);

  const isCancelled = event.status === "cancelled";
  const startMs = new Date(event.startsAt).getTime();
  const [started, setStarted] = useState(false);
  const soldOut = event.status === "sold_out" || ((event.capacity ?? 0) > 0 && (event.seatsLeft ?? 0) <= 0);
  const bookable = !isCancelled && !started && !soldOut && (event.status === "published");
  const closedLabel = isCancelled ? "Event cancelled" : started ? "Booking closed" : event.status !== "published" && !soldOut ? "Not open for booking" : null;

  const price = event.tierInfo?.current?.price ?? event.pricing?.ticketPrice ?? 0;

  useEffect(() => {
    captureWebAttribution();
    setAppHref(appOpenUrl(`/share/club-event/${event.id}`));
    setStarted(Date.now() >= startMs);
    trackViewContent({ eventId: event.id, title: event.title, price });
  }, [event.id, event.title, price, startMs]);

  return (
    <>
      <ClubTicketCard
        event={event}
        bookable={bookable}
        soldOut={soldOut}
        closedLabel={closedLabel}
        appHref={appHref}
        onBook={() => setOpen(true)}
      />

      {bookable && !open && (
        <div className={styles.mobileBar}>
          <div className={styles.mobilePrice}>
            <span className={styles.mobilePriceValue}>
              {event.pricing?.isFree ? "Free" : `₹${Math.round(price).toLocaleString("en-IN")}`}
            </span>
            {event.tierInfo?.current && !event.pricing?.isFree ? (
              <span className={styles.mobilePriceNote}>{event.tierInfo.current.label}</span>
            ) : event.isFillingFast ? (
              <span className={styles.mobilePriceNote}>Filling fast</span>
            ) : null}
          </div>
          <button type="button" className={styles.primaryBtn} onClick={() => setOpen(true)}>
            {event.pricing?.isFree ? "Reserve spot" : "Book now"}
          </button>
        </div>
      )}

      {open && <ClubCheckoutSheet event={event} onClose={() => setOpen(false)} />}
    </>
  );
}
