import React from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Sparkles, Users } from "lucide-react";
import { MegaEvent } from "@/types";
import styles from "./ShareDetail.module.css";
import GetAppCta from "./GetAppCta";
import { formatWhen, isPast } from "./shareFormat";

type Props = {
  event: MegaEvent;
};

/**
 * A SyncTrip mega event - the city-scale ones, image-first by design.
 *
 * `attendeesSample` comes back from the API and is deliberately not rendered.
 * The aggregate count is fine on a public page; the faces and names are not.
 */
export default function MegaEventShareDetail({ event }: Props) {
  const hasEnded = isPast(event.endsAt || event.startsAt);
  const whenLine = formatWhen(event.startsAt, event.endsAt);
  const registered = event.registeredCount ?? 0;

  return (
    <div className={styles.page}>
      <header className={`${styles.hero} ${styles.heroTall}`}>
        {event.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote CDN art, already sized by Gumlet
          <img
            src={event.image}
            alt={`${event.title}${event.venueName ? ` at ${event.venueName}` : ""}`}
            className={styles.heroImage}
          />
        ) : (
          <div className={styles.heroFallback} aria-hidden="true">🎊</div>
        )}
        <div className={styles.heroOverlay} />

        <div className={styles.heroInner}>
          <div className={styles.badgeRow}>
            <span className={`${styles.badge} ${styles.badgeAccent}`}>
              <Sparkles size={13} aria-hidden="true" /> Mega event
            </span>
            {hasEnded && <span className={styles.badge}>Past event</span>}
          </div>

          {event.organisedBy && (
            <div className={styles.heroByline}>
              <span>Organised by {event.organisedBy}</span>
            </div>
          )}

          <h1 className={styles.heroTitle}>{event.title}</h1>
          {event.subtitle && <p className={styles.heroSubtitle}>{event.subtitle}</p>}
        </div>
      </header>

      <div className={styles.container}>
        <main className={styles.main}>
          {event.description && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>About this event</h2>
              <p className={styles.prose}>{event.description}</p>
            </section>
          )}

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>How it works</h2>
            <ul className={styles.bulletList}>
              <li className={styles.bulletItem}>
                <span className={styles.bulletDot} aria-hidden="true" />
                Register for the event inside the SyncTrip app - it takes a tap.
              </li>
              <li className={styles.bulletItem}>
                <span className={styles.bulletDot} aria-hidden="true" />
                Join the event chat room to plan with everyone else going.
              </li>
              <li className={styles.bulletItem}>
                <span className={styles.bulletDot} aria-hidden="true" />
                Show up, meet people who came for the same thing you did.
              </li>
            </ul>
          </section>
        </main>

        <aside className={styles.aside}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>
              {hasEnded ? "This event has ended" : event.ctaLabel || "Register on SyncTrip"}
            </h2>
            <p className={styles.ctaText}>
              {hasEnded
                ? "Open SyncTrip to see what is happening next in your city."
                : "Registration and the event chat room are in the SyncTrip app."}
            </p>
            <GetAppCta
              appPath={`/share/mega-event/${event.id}`}
              label={hasEnded ? "Open in the app" : event.ctaLabel || "Register on SyncTrip"}
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
                  </div>
                </div>
              )}
              {event.venueName && (
                <div className={styles.fact}>
                  <span className={styles.factIcon} aria-hidden="true"><MapPin size={18} /></span>
                  <div>
                    <p className={styles.factLabel}>Where</p>
                    <p className={styles.factValue}>{event.venueName}</p>
                  </div>
                </div>
              )}
              {registered > 0 && (
                <div className={styles.fact}>
                  <span className={styles.factIcon} aria-hidden="true"><Users size={18} /></span>
                  <div>
                    <p className={styles.factLabel}>Going</p>
                    <p className={styles.factValue}>
                      {registered.toLocaleString("en-IN")} registered
                      {event.capacity ? ` of ${event.capacity.toLocaleString("en-IN")}` : ""}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <p className={styles.footerNote}>
        SyncTrip mega events happen in the app.{" "}
        <Link href="/explore/plans">Explore local plans and meetups</Link> or{" "}
        <Link href="/">see what SyncTrip is</Link>.
      </p>
    </div>
  );
}
