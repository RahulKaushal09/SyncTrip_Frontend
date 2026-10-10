import React from "react";
import Link from "next/link";
import { BadgeCheck, Clock, IndianRupee, MapPin, Sparkles, Users } from "lucide-react";
import type { ActivityGuide, CityGuide } from "@/data/cityGuides";
import type { GuideFeed, GuideVenue } from "@/lib/cityGuideApi";
import { AppCtaBand, GuideHero, GuideIcon, HappeningRail } from "./parts";
import VenueActions from "./VenueActions";
import styles from "./CityGuide.module.css";

const BEST_FOR_LABEL: Record<string, string> = {
  "solo-friendly": "Solo-friendly", groups: "Groups", date: "Date", birthdays: "Birthdays", beginners: "Beginners",
  "rainy day": "Rainy day", "late night": "Late night", budget: "Budget", "day out": "Day out", weekend: "Weekend",
};
const label = (s: string) => s.replace(/_/g, " ");

/**
 * /places/<slug>: one venue. Answers the navigational search ("hopup zirakpur",
 * "mystery rooms chandigarh") with the facts people want, then the SyncTrip angle:
 * plans and events happening there, and a way to go with people.
 */
export default function VenueDetail({
  city, venue, guides, related, feed,
}: {
  city: CityGuide;
  venue: GuideVenue;
  /** Activity guides that list this venue (first = primary). */
  guides: ActivityGuide[];
  related: GuideVenue[];
  feed: GuideFeed;
}) {
  const guide = guides[0];
  const where = [venue.locality, venue.area].filter(Boolean).join(", ");
  const track = { campaign: `venue_${city.citySlug}`, term: venue.slug };
  const cover = venue.photos[0];

  return (
    <div className={styles.page} style={guide ? ({ ["--accent" as string]: guide.accent } as React.CSSProperties) : undefined}>
      <GuideHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: city.cityName, href: `/city/${city.citySlug}` },
          ...(guide ? [{ label: guide.navLabel, href: `/city/${city.citySlug}/${guide.slug}` }] : []),
          { label: venue.name },
        ]}
        kicker={`${guide ? guide.navLabel : "Place"} · ${venue.area || city.cityName}`}
        title={`${venue.name}${venue.area && !venue.name.toLowerCase().includes(venue.area.toLowerCase()) && !/day trips/i.test(venue.area) ? `, ${venue.area}` : ""}`}
        intro={[where ? `${where}.` : ""].filter(Boolean)}
        // Only the venue's own photo: a guide's stock header (e.g. go-karting) would
        // misrepresent other venues. No photo yet → the branded gradient header.
        image={cover ? { src: cover.src, alt: cover.alt || venue.name } : undefined}
        tone={cover ? undefined : "brand"}
        stats={[
          ...(venue.hours ? [{ icon: <Clock size={15} aria-hidden />, label: venue.hours }] : []),
          ...(venue.priceNote ? [{ icon: <IndianRupee size={15} aria-hidden />, label: venue.priceNote }] : []),
          ...(venue.syncTripHosted ? [{ icon: <BadgeCheck size={15} aria-hidden />, label: "SyncTrip has hosted here" }] : []),
        ]}
      />

      <div className={styles.body}>
        <div className={styles.venueLayout}>
          <div>
            <section className={styles.venuePanel} aria-labelledby="about-title">
              <h2 id="about-title">About {venue.name}</h2>
              <p className={styles.venueAbout}>{venue.description}</p>
            </section>

            {venue.photos.length > 1 && (
              <section className={styles.venuePanel} aria-labelledby="photos-title">
                <h2 id="photos-title">Photos</h2>
                <div className={styles.venueGallery}>
                  {venue.photos.slice(0, 6).map((p) => (
                    // Our own uploads, served from the image CDN.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={p.src} src={p.src} alt={p.alt || venue.name} loading="lazy" />
                  ))}
                </div>
                {venue.photos.some((p) => p.credit) && <p className={styles.photoNote}>Photos: {[...new Set(venue.photos.map((p) => p.credit).filter(Boolean))].join(", ")}</p>}
              </section>
            )}

            <section className={styles.venuePanel} aria-labelledby="plan-title">
              <h2 id="plan-title">Go to {venue.name} with people</h2>
              <p className={styles.venueAbout}>
                Friends busy? Post a plan for {venue.name} on SyncTrip with a date and time, or join one someone already posted. People
                in {city.cityName} who are up for the same thing join, you chat in the group, and meet here.
              </p>
            </section>
          </div>

          <aside className={styles.venueSticky} aria-label="Key details">
            <div className={styles.venuePanel}>
              <h2>Key details</h2>
              <ul className={styles.factList}>
                {where && (
                  <li><MapPin size={18} aria-hidden /><span><b>Where</b>{where}</span></li>
                )}
                {venue.hours && (
                  <li><Clock size={18} aria-hidden /><span><b>Hours</b>{venue.hours}</span></li>
                )}
                {venue.priceNote && (
                  <li><IndianRupee size={18} aria-hidden /><span><b>Price</b>{venue.priceNote}</span></li>
                )}
                {venue.activities.length > 0 && (
                  <li><Sparkles size={18} aria-hidden /><span><b>What to do</b>{venue.activities.map(label).join(", ")}</span></li>
                )}
                {venue.bestFor.length > 0 && (
                  <li><Users size={18} aria-hidden /><span><b>Best for</b>{venue.bestFor.map((b) => BEST_FOR_LABEL[b] || b).join(", ")}</span></li>
                )}
              </ul>
              <VenueActions venue={venue} cityName={city.cityName} track={track} />
            </div>
          </aside>
        </div>

        <HappeningRail
          track={track}
          feed={feed}
          cityName={city.cityName}
          title={`Plans at ${venue.name}`}
          sub={`Upcoming SyncTrip club events and open plans at ${venue.name}.`}
          emptyTitle={`No plans at ${venue.name} yet`}
        />

        {related.length > 0 && guide && (
          <section className={styles.section} aria-labelledby="more-title">
            <div className={styles.sectionHead}>
              <div>
                <h2 id="more-title" className={styles.h2}>More {guide.navLabel.toLowerCase()} in {city.cityName}</h2>
                <p className={styles.sub}>Other places people go for the same thing.</p>
              </div>
              <Link href={`/city/${city.citySlug}/${guide.slug}`} className={styles.btnOutline}>
                See the full guide
              </Link>
            </div>
            <div className={styles.linkGrid}>
              {related.map((r) => (
                <Link key={r.slug} href={`/places/${r.slug}`} className={styles.linkCard}>
                  <span className={styles.linkTop}>
                    {r.name}
                    <span className={styles.linkDist}>{r.area}</span>
                  </span>
                  <span className={styles.linkNote}>{r.locality}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {guides.length > 0 && (
          <section className={styles.section} aria-labelledby="guides-title">
            <div className={styles.sectionHead}>
              <h2 id="guides-title" className={styles.h2}>Featured in</h2>
            </div>
            <div className={styles.relatedRow}>
              {guides.map((g) => (
                <Link key={g.slug} href={`/city/${city.citySlug}/${g.slug}`} className={styles.relatedLink}>
                  <GuideIcon name={g.icon} size={16} /> {g.navLabel} in {city.cityName}
                </Link>
              ))}
              <Link href={`/city/${city.citySlug}`} className={styles.relatedLink}>
                Everything in {city.cityName}
              </Link>
            </div>
          </section>
        )}

        <AppCtaBand cityName={city.cityName} track={track} />
      </div>
    </div>
  );
}
