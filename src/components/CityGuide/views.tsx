import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Compass, MapPin, Store } from "lucide-react";
import type { ActivityGuide, CityGuide } from "@/data/cityGuides";
import { venuesForGuide, type GuideFeed, type GuideVenue } from "@/lib/cityGuideApi";
import { AppCtaBand, GuideFaqList, GuideHero, GuideIcon, HappeningRail } from "./parts";
import VenueExplorer from "./VenueExplorer";
import styles from "./CityGuide.module.css";

const accentStyle = (accent: string) => ({ ["--accent" as string]: accent }) as React.CSSProperties;

/* ======================= /city/<city>/<activity> ======================= */

export function ActivityGuideView({
  city, guide, venues, feed,
}: {
  city: CityGuide;
  guide: ActivityGuide;
  venues: GuideVenue[];
  feed: GuideFeed;
}) {
  const areas = new Set(venues.map((v) => v.area).filter(Boolean));
  const related = guide.related
    .map((s) => city.activities.find((a) => a.slug === s))
    .filter((a): a is ActivityGuide => !!a);
  const upcoming = feed.events.length + feed.plans.length;

  return (
    <div className={styles.page} style={accentStyle(guide.accent)}>
      <GuideHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: city.cityName, href: `/city/${city.citySlug}` },
          { label: guide.navLabel },
        ]}
        kicker={guide.kicker}
        title={guide.h1}
        intro={guide.intro}
        image={guide.image}
        stats={[
          ...(venues.length ? [{ icon: <Store size={15} aria-hidden />, label: `${venues.length} places` }] : []),
          ...(areas.size ? [{ icon: <MapPin size={15} aria-hidden />, label: [...areas].slice(0, 3).join(" · ") }] : []),
          ...(upcoming ? [{ icon: <CalendarDays size={15} aria-hidden />, label: `${upcoming} upcoming on SyncTrip` }] : []),
        ]}
        actions={
          <>
            <a href="#places" className={styles.btnPrimary}>
              See places <ArrowRight size={16} aria-hidden />
            </a>
            <a href="#happening" className={styles.btnGhost}>What&apos;s on this week</a>
          </>
        }
      />

      <div className={styles.body}>
        <HappeningRail
          feed={feed}
          cityName={city.cityName}
          title={`Happening on SyncTrip in ${city.cityName}`}
          sub="Club events and open plans you can join. Most people come alone, so you won't be the only new face."
          emptyTitle={`No ${guide.navLabel.toLowerCase()} plans posted for the next few weeks yet`}
        />

        <section id="places" className={styles.section} aria-labelledby="places-title">
          <div className={styles.sectionHead}>
            <div>
              <h2 id="places-title" className={styles.h2}>{guide.venuesTitle} in {city.cityName}</h2>
              <p className={styles.sub}>
                Across Chandigarh, Mohali, Zirakpur and Panchkula. Tap <b>Go with people</b> on any place to plan it with others on SyncTrip.
              </p>
            </div>
          </div>
          <VenueExplorer
            venues={venues}
            icon={guide.icon}
            cityName={city.cityName}
            emptyText="We're adding places for this guide. Check back soon, or start a plan in the app."
          />
        </section>

        {guide.tips.length > 0 && (
          <section className={styles.section} aria-labelledby="tips-title">
            <div className={styles.sectionHead}>
              <h2 id="tips-title" className={styles.h2}>Good to know</h2>
            </div>
            <div className={styles.tipGrid}>
              {guide.tips.map((t, i) => (
                <div key={t.title} className={styles.tip}>
                  <span className={styles.tipNum}>{i + 1}</span>
                  <h3>{t.title}</h3>
                  <p>{t.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <GuideFaqList faqs={guide.faqs} title={`${guide.navLabel} in ${city.cityName}: FAQs`} />

        <section className={styles.section} aria-labelledby="more-title">
          <div className={styles.sectionHead}>
            <h2 id="more-title" className={styles.h2}>More to do in {city.cityName}</h2>
          </div>
          <div className={styles.relatedRow}>
            {related.map((r) => (
              <Link key={r.slug} href={`/city/${city.citySlug}/${r.slug}`} className={styles.relatedLink} style={accentStyle(r.accent)}>
                <GuideIcon name={r.icon} size={16} /> {r.navLabel}
              </Link>
            ))}
            <Link href={`/city/${city.citySlug}`} className={styles.relatedLink}>
              <Compass size={16} aria-hidden /> Everything in {city.cityName}
            </Link>
          </div>
        </section>

        <AppCtaBand cityName={city.cityName} />
      </div>
    </div>
  );
}

/* ======================= /city/<city> hub ======================= */

export function CityGuideHubView({ city, venues, feed }: { city: CityGuide; venues: GuideVenue[]; feed: GuideFeed }) {
  const counts = new Map(city.activities.map((a) => [a.slug, venuesForGuide(venues, a).length]));
  const areaCounts = new Map<string, number>();
  venues.forEach((v) => areaCounts.set(v.area, (areaCounts.get(v.area) || 0) + 1));

  return (
    <div className={styles.page}>
      <GuideHero
        crumbs={[{ label: "Home", href: "/" }, { label: city.cityName }]}
        kicker={city.kicker}
        title={city.h1}
        intro={city.intro}
        image={city.image}
        stats={[
          { icon: <Compass size={15} aria-hidden />, label: `${city.activities.length} ways to spend a day` },
          ...(venues.length ? [{ icon: <Store size={15} aria-hidden />, label: `${venues.length} places` }] : []),
        ]}
        actions={
          <>
            <a href="#guides" className={styles.btnPrimary}>
              Find something to do <ArrowRight size={16} aria-hidden />
            </a>
            <a href="#happening" className={styles.btnGhost}>What&apos;s on this week</a>
          </>
        }
      />

      <div className={styles.body}>
        <section id="guides" className={styles.section} aria-labelledby="guides-title">
          <div className={styles.sectionHead}>
            <div>
              <h2 id="guides-title" className={styles.h2}>What do you feel like doing?</h2>
              <p className={styles.sub}>Each guide lists the best places in the tricity, and the SyncTrip events and plans happening there.</p>
            </div>
          </div>
          <div className={styles.tileGrid}>
            {city.activities.map((a) => (
              <Link key={a.slug} href={`/city/${city.citySlug}/${a.slug}`} className={styles.tile} style={accentStyle(a.accent)}>
                {a.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image.src} alt="" loading="lazy" />
                )}
                <span className={styles.tileIcon}><GuideIcon name={a.icon} size={20} /></span>
                <h3 className={styles.tileTitle}>{a.navLabel}</h3>
                <span className={styles.tileMeta}>
                  <span>{counts.get(a.slug) ? `${counts.get(a.slug)} places` : "Guide"}</span>
                  <ArrowRight size={16} aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <HappeningRail
          feed={feed}
          cityName={city.cityName}
          title={`This week with SyncTrip in ${city.cityName}`}
          sub="Board-game nights, runs, sports and outings people are organising right now. Join one, or post your own."
          emptyTitle="Nothing posted for the next few weeks yet"
        />

        <section className={styles.section} aria-labelledby="areas-title">
          <div className={styles.sectionHead}>
            <div>
              <h2 id="areas-title" className={styles.h2}>Across the tricity</h2>
              <p className={styles.sub}>Chandigarh, Mohali, Zirakpur and Panchkula are one city for plans: most places are within 30 minutes of each other.</p>
            </div>
          </div>
          <div className={styles.areaGrid}>
            {city.areas.map((a) => (
              <div key={a.name} className={styles.area}>
                <h3>
                  <MapPin size={16} aria-hidden /> {a.name}
                  {areaCounts.get(a.name) ? <span className={styles.chipCount}>· {areaCounts.get(a.name)} places</span> : null}
                </h3>
                <p>{a.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="getaways-title">
          <div className={styles.sectionHead}>
            <div>
              <h2 id="getaways-title" className={styles.h2}>Weekend getaways from {city.cityName}</h2>
              <p className={styles.sub}>Approximate drive times. Each guide shows what to see and who else is planning a trip there.</p>
            </div>
            <Link href={`/city/${city.citySlug}/treks-day-trips`} className={styles.btnOutline}>
              Treks &amp; day trips <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
          <div className={styles.linkGrid}>
            {city.getaways.map((g) => (
              <Link key={g.slug} href={`/location/${g.slug}`} className={styles.linkCard}>
                <span className={styles.linkTop}>
                  {g.name}
                  <span className={styles.linkDist}>{g.distance}</span>
                </span>
                <span className={styles.linkNote}>{g.note}</span>
              </Link>
            ))}
          </div>
        </section>

        <GuideFaqList faqs={city.faqs} title={`Things to do in ${city.cityName}: FAQs`} />

        <AppCtaBand cityName={city.cityName} />
      </div>
    </div>
  );
}
