import React from "react";
import Link from "next/link";
import { BadgeCheck, CalendarDays, Languages, MapPin, Ticket, Users } from "lucide-react";
import { ClubEvent } from "@/types";
import styles from "./ShareDetail.module.css";
import GetAppCta from "./GetAppCta";
import { formatPrice, formatTime, formatWhen, humanize, isPast } from "./shareFormat";

type Props = {
  event: ClubEvent;
};

/**
 * A single club event, as seen by whoever opened the shared link.
 *
 * The API also returns an attendee sample and host phone numbers for callers
 * who are entitled to them. Neither is rendered here at all - a public URL is
 * not a place to publish who is going.
 */
export default function ClubEventShareDetail({ event }: Props) {
  const heroImage = event.coverImageUrl || event.media?.find((m) => m.type === "image")?.url || null;
  const venue = event.venue ?? null;
  const venueLine = [venue?.name, venue?.address || venue?.locality].filter(Boolean).join(" · ");
  const price = formatPrice(event.pricing?.isFree, event.pricing?.ticketPrice, event.pricing?.currency);
  const isCancelled = event.status === "cancelled";
  const hasEnded = !isCancelled && isPast(event.endsAt || event.startsAt);
  const whenLine = formatWhen(event.startsAt, event.endsAt);
  const seatsLeft = event.seatsLeft;
  const tags = (event.tags ?? []).slice(0, 8);

  return (
    <div className={styles.page}>
      <header className={`${styles.hero} ${styles.heroTall}`}>
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote CDN art, already sized by Gumlet
          <img
            src={heroImage}
            alt={`${event.title}${venue?.name ? ` at ${venue.name}` : ""}`}
            className={styles.heroImage}
          />
        ) : (
          <div className={styles.heroFallback} aria-hidden="true">🎟️</div>
        )}
        <div className={styles.heroOverlay} />

        <div className={styles.heroInner}>
          <div className={styles.badgeRow}>
            {event.category && <span className={styles.badge}>{humanize(event.category)}</span>}
            <span className={styles.badge}>{price}</span>
            {isCancelled ? (
              <span className={`${styles.badge} ${styles.badgeWarn}`}>Cancelled</span>
            ) : hasEnded ? (
              <span className={styles.badge}>Past event</span>
            ) : event.isFillingFast ? (
              <span className={`${styles.badge} ${styles.badgeAccent}`}>Filling fast</span>
            ) : null}
          </div>

          {event.club?.name && (
            <div className={styles.heroByline}>
              {event.club.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={event.club.logoUrl} alt="" className={styles.heroLogo} aria-hidden="true" />
              ) : null}
              <span>
                Hosted by {event.club.name}
                {event.club.isVerified ? " ✓" : ""}
              </span>
            </div>
          )}

          <h1 className={styles.heroTitle}>{event.title}</h1>
          {event.subtitle && <p className={styles.heroSubtitle}>{event.subtitle}</p>}
        </div>
      </header>

      <div className={styles.container}>
        <main className={styles.main}>
          {isCancelled && (
            <div className={`${styles.banner} ${styles.bannerWarn}`}>
              This event was cancelled by the organiser.
              {event.cancellation?.reason ? ` Reason: ${event.cancellation.reason}` : ""}
            </div>
          )}

          {event.description && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>About this event</h2>
              <p className={styles.prose}>{event.description}</p>
            </section>
          )}

          {(event.whatToExpect?.length ?? 0) > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>What to expect</h2>
              <ul className={styles.bulletList}>
                {event.whatToExpect!.map((item) => (
                  <li key={item} className={styles.bulletItem}>
                    <span className={styles.bulletDot} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(event.whatsIncluded?.length ?? 0) > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>What&apos;s included</h2>
              <ul className={styles.bulletList}>
                {event.whatsIncluded!.map((item) => (
                  <li key={item} className={styles.bulletItem}>
                    <span className={styles.bulletDot} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(event.rules?.length ?? 0) > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Good to know</h2>
              <ul className={styles.bulletList}>
                {event.rules!.map((item) => (
                  <li key={item} className={styles.bulletItem}>
                    <span className={styles.bulletDot} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tags.length > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Tags</h2>
              <div className={styles.chipRow}>
                {tags.map((tag) => (
                  <span key={tag} className={styles.chip}>{humanize(tag)}</span>
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className={styles.aside}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaPrice}>
              <span className={styles.ctaPriceValue}>{price}</span>
              {!event.pricing?.isFree && <span className={styles.ctaPriceLabel}>per person</span>}
            </div>
            <h2 className={styles.ctaTitle}>
              {isCancelled ? "This event was cancelled" : hasEnded ? "This event has ended" : "Book your spot"}
            </h2>
            <p className={styles.ctaText}>
              {isCancelled || hasEnded
                ? `Follow ${event.club?.name || "this club"} on SyncTrip to catch the next one.`
                : "Booking, tickets and the event chat all happen inside the SyncTrip app."}
            </p>
            <GetAppCta
              appPath={`/share/club-event/${event.id}`}
              label={isCancelled || hasEnded ? "Open in the app" : "Book on SyncTrip"}
              note="Free on Android and iOS."
            />
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Event details</h2>
            <div className={styles.factList}>
              {whenLine && (
                <div className={styles.fact}>
                  <span className={styles.factIcon} aria-hidden="true"><CalendarDays size={18} /></span>
                  <div>
                    <p className={styles.factLabel}>When</p>
                    <p className={styles.factValue}>{whenLine}</p>
                    {event.doorsOpenAt && (
                      <p className={styles.factNote}>Doors open {formatTime(event.doorsOpenAt)}</p>
                    )}
                  </div>
                </div>
              )}
              {venueLine && (
                <div className={styles.fact}>
                  <span className={styles.factIcon} aria-hidden="true"><MapPin size={18} /></span>
                  <div>
                    <p className={styles.factLabel}>Where</p>
                    <p className={styles.factValue}>{venueLine}</p>
                  </div>
                </div>
              )}
              <div className={styles.fact}>
                <span className={styles.factIcon} aria-hidden="true"><Ticket size={18} /></span>
                <div>
                  <p className={styles.factLabel}>Entry</p>
                  <p className={styles.factValue}>{price}</p>
                  {!isCancelled && !hasEnded && typeof seatsLeft === "number" && seatsLeft > 0 && seatsLeft <= 10 && (
                    <p className={styles.factNote}>Only {seatsLeft} left</p>
                  )}
                </div>
              </div>
              {typeof event.ageMin === "number" && event.ageMin > 0 && (
                <div className={styles.fact}>
                  <span className={styles.factIcon} aria-hidden="true"><Users size={18} /></span>
                  <div>
                    <p className={styles.factLabel}>Age</p>
                    <p className={styles.factValue}>{event.ageMin}+</p>
                  </div>
                </div>
              )}
              {(event.languages?.length ?? 0) > 0 && (
                <div className={styles.fact}>
                  <span className={styles.factIcon} aria-hidden="true"><Languages size={18} /></span>
                  <div>
                    <p className={styles.factLabel}>Languages</p>
                    <p className={styles.factValue}>{event.languages!.map(humanize).join(", ")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {event.club?.name && (
            <Link href={`/share/club/${event.clubId}`} className={styles.card} style={{ textDecoration: "none" }}>
              <h2 className={styles.cardTitle}>Organiser</h2>
              <div className={styles.fact}>
                <span className={styles.factIcon} aria-hidden="true"><BadgeCheck size={18} /></span>
                <div>
                  <p className={styles.factValue}>{event.club.name}</p>
                  <p className={styles.factNote}>See the club and its other events →</p>
                </div>
              </div>
            </Link>
          )}
        </aside>
      </div>

      <p className={styles.footerNote}>
        Club events are booked in the SyncTrip app.{" "}
        <Link href="/explore/plans">Explore more local plans and meetups</Link>.
      </p>
    </div>
  );
}
