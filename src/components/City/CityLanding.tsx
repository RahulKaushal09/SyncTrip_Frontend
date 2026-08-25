import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { CityPage, getCityPage } from "@/data/cityPages";
import { ROUTES } from "@/constants";
import styles from "./CityLanding.module.css";

type Props = {
  city: CityPage;
};

/**
 * A city landing page for the Delhi NCR cluster.
 *
 * Two jobs, in this order:
 *  1. Answer the search ("make friends in gurgaon", "weekend plans", "turf near
 *     me") with specific, locally true copy rather than a signup wall.
 *  2. Be the internal-linking hub the homepage never was — every getaway links
 *     to its /location page, every activity to /explore/plans, and each city to
 *     its neighbours. That link graph is what gets 776 orphaned pages crawled.
 */
export default function CityLanding({ city }: Props) {
  const nearby = city.nearby.map(getCityPage).filter((c): c is CityPage => c !== null);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.kickerWrap}>
            <span className={styles.kickerDot} />
            <span className={styles.kicker}>
              {city.name}
              {city.altName ? ` · ${city.altName}` : ""} · {city.state}
            </span>
          </div>

          <h1 className={styles.h1}>{city.h1}</h1>

          {city.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className={styles.intro}>
              {paragraph}
            </p>
          ))}

          <div className={styles.heroCtaRow}>
            <Link href={ROUTES.PLANS} className={styles.ctaPrimary}>
              See plans near {city.name}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href={ROUTES.EXPLORE} className={styles.ctaSecondary}>
              Explore destinations
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <section>
          <h2 className={styles.sectionTitle}>What people do together in {city.name}</h2>
          <p className={styles.sectionLead}>
            Four kinds of plan run all week here. Every one of them is easier with three or four other people, and every
            one of them is on SyncTrip.
          </p>

          <div className={styles.cardGrid}>
            {city.activities.map((activity) => (
              <article key={activity.id} className={styles.card}>
                <span className={styles.cardIcon} aria-hidden="true">
                  {activity.icon}
                </span>
                <h3 className={styles.cardTitle}>{activity.title}</h3>
                <p className={styles.cardBlurb}>{activity.blurb}</p>
                <ul className={styles.spotList}>
                  {activity.spots.map((spot) => (
                    <li key={spot} className={styles.spotItem}>
                      <span className={styles.spotDot} aria-hidden="true" />
                      {spot}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Where {city.name} meets up</h2>
          <div className={styles.chipRow}>
            {city.localities.map((locality) => (
              <span key={locality} className={styles.chip}>
                {locality}
              </span>
            ))}
          </div>
          <p className={styles.note}>{city.localitiesNote}</p>
        </section>

        <section className={styles.band}>
          <h2 className={styles.bandTitle}>Clubs and club events in {city.name}</h2>
          <p className={styles.bandText}>{city.clubsNote}</p>
          <Link href={ROUTES.PLANS} className={styles.ctaPrimary}>
            Discover clubs &amp; events
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Weekend getaways from {city.name}</h2>
          <p className={styles.sectionLead}>
            Drive times are the realistic ones, not the ones Google shows at 4am. Each destination has a guide with what
            to see and who else is planning a trip there.
          </p>
          <div className={styles.linkGrid}>
            {city.getaways.map((getaway) => (
              <Link key={getaway.slug} href={`/location/${getaway.slug}`} className={styles.linkCard}>
                <span className={styles.linkTop}>
                  <span className={styles.linkName}>{getaway.name}</span>
                  <span className={styles.linkDistance}>{getaway.distance}</span>
                </span>
                <span className={styles.linkNote}>{getaway.note}</span>
              </Link>
            ))}
          </div>
        </section>

        {city.reads.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>Worth reading before you plan</h2>
            <div className={styles.inlineLinks}>
              {city.reads.map((read) => (
                <Link key={read.slug} href={`/blogs/${read.slug}`} className={styles.inlineLink}>
                  {read.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className={styles.sectionTitle}>Questions people ask about meeting people in {city.name}</h2>
          <div className={styles.faqList}>
            {city.faqs.map((faq) => (
              <article key={faq.question} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{faq.question}</h3>
                <p className={styles.faqA}>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        {nearby.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>Nearby in Delhi NCR</h2>
            <div className={styles.inlineLinks}>
              {nearby.map((other) => (
                <Link key={other.slug} href={`/city/${other.slug}`} className={styles.inlineLink}>
                  <MapPin size={15} aria-hidden="true" />
                  Plans in {other.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
