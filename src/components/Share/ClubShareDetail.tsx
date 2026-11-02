import React from "react";
import Link from "next/link";
import { BadgeCheck, CalendarDays, Clock, Gift, MapPin, Star, Users } from "lucide-react";
import { Club, ClubEvent } from "@/types";
import styles from "./ShareDetail.module.css";
import GetAppCta from "./GetAppCta";
import EventTimeline from "./EventTimeline";
import clubStyles from "./ClubPage.module.css";
import type { EventCard } from "@/utils/club.api.utils";
import { formatDayTile, formatPrice, formatTime, humanize } from "./shareFormat";
import RichText from "@/components/common/RichText";

type Props = {
  club: Club;
  upcomingEvents: ClubEvent[];
  pastEvents?: EventCard[];
};

/**
 * The public face of a club, rendered for whoever opened a shared link.
 *
 * People are deliberately absent: no leaders, no members, no attendees. The
 * app shows those to signed-in users; a page that anyone can reach by guessing
 * a slug is the wrong place for them.
 */
export default function ClubShareDetail({ club, upcomingEvents, pastEvents = [] }: Props) {
  const place = [club.locality, club.address].filter(Boolean).join(" · ");
  const categories = (club.categories ?? []).slice(0, 6);
  const stats = club.stats ?? {};
  const schedule = club.recurringSchedule ?? [];
  const whatWeDo = club.whatWeDo ?? [];
  const perks = club.perks ?? [];
  const faqs = club.faqs ?? [];
  const gallery = (club.gallery ?? []).filter((m) => m.type === "image").slice(0, 8);

  return (
    <div className={styles.page}>
      <header className={`${styles.hero} ${styles.heroTall}`}>
        {club.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote CDN art, already sized by Gumlet
          <img
            src={club.coverImageUrl}
            alt={`${club.name} club in ${club.locality || "your city"}`}
            className={styles.heroImage}
          />
        ) : (
          <div className={styles.heroFallback} aria-hidden="true">🎉</div>
        )}
        <div className={styles.heroOverlay} />

        <div className={styles.heroInner}>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>Club</span>
            {club.isVerified && (
              <span className={`${styles.badge} ${styles.badgeAccent}`}>
                <BadgeCheck size={13} aria-hidden="true" /> Verified
              </span>
            )}
            {categories.slice(0, 2).map((category) => (
              <span key={category} className={styles.badge}>{humanize(category)}</span>
            ))}
          </div>

          {club.logoUrl ? (
            <div className={styles.heroByline}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={club.logoUrl} alt="" className={styles.heroLogo} aria-hidden="true" />
              <span>{club.locality || "On SyncTrip"}</span>
            </div>
          ) : null}

          <h1 className={styles.heroTitle}>{club.name}</h1>
          {club.tagline && <p className={styles.heroSubtitle}>{club.tagline}</p>}
          <div className={clubStyles.heroActions}>
            {upcomingEvents.length > 0 && (
              <a href="#upcoming" className={clubStyles.heroBtnPrimary}>See upcoming events</a>
            )}
            {pastEvents.length > 0 && (
              <a href="#past-events" className={clubStyles.heroBtn}>Past events</a>
            )}
          </div>
        </div>
      </header>

      {upcomingEvents.length > 0 && (
        <section id="upcoming" className={clubStyles.upcoming} aria-labelledby="upcoming-title">
          <h2 id="upcoming-title" className={clubStyles.sectionTitle}>Upcoming events</h2>
          <div className={clubStyles.upGrid}>
            {upcomingEvents.map((event) => {
              const tile = formatDayTile(event.startsAt);
              const image = event.coverImageUrl || event.media?.find((m) => m.type === "image")?.url;
              const venue = event.venue?.name || event.venue?.locality || club.locality;
              const minPass = event.passes?.length ? Math.min(...event.passes.map((p) => p.price)) : null;
              return (
                <Link key={event.id} href={`/share/club-event/${event.id}`} className={clubStyles.upCard}>
                  <div className={clubStyles.upMedia}>
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- Gumlet CDN, already sized
                      <img src={image} alt={event.title} loading="lazy" />
                    ) : null}
                    <span className={clubStyles.upDate}>
                      <b>{tile.day}</b>
                      <span>{tile.month}</span>
                    </span>
                  </div>
                  <div className={clubStyles.upBody}>
                    {event.category && <span className={clubStyles.upCat}>{humanize(event.category)}</span>}
                    <h3>{event.title}</h3>
                    <p>{[formatTime(event.startsAt), venue].filter(Boolean).join(" · ")}</p>
                    <div className={clubStyles.upFoot}>
                      <span className={clubStyles.upPrice}>
                        {minPass !== null && minPass > 0 ? `from ₹${minPass.toLocaleString("en-IN")}` : formatPrice(event.pricing?.isFree, event.pricing?.ticketPrice)}
                      </span>
                      <span className={clubStyles.upCta}>Book →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div id="past-events">
        <EventTimeline
          events={pastEvents}
          title={`Past events by ${club.name}`}
          subtitle="Scroll back through what this club has hosted. Tap any event to see the details and photos."
        />
      </div>

      <div className={styles.container}>
        <main className={styles.main}>
          {(stats.followerCount || stats.eventsHosted || stats.avgRating) && (
            <section className={styles.card}>
              <div className={styles.statRow}>
                {typeof stats.followerCount === "number" && stats.followerCount > 0 && (
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{stats.followerCount.toLocaleString("en-IN")}</span>
                    <span className={styles.statLabel}>Followers</span>
                  </div>
                )}
                {typeof stats.eventsHosted === "number" && stats.eventsHosted > 0 && (
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{stats.eventsHosted.toLocaleString("en-IN")}</span>
                    <span className={styles.statLabel}>Events hosted</span>
                  </div>
                )}
                {typeof stats.avgRating === "number" && (
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{stats.avgRating.toFixed(1)}</span>
                    <span className={styles.statLabel}>
                      Rating{stats.ratingCount ? ` · ${stats.ratingCount}` : ""}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {club.description && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>About {club.name}</h2>
              <RichText text={club.description} className={styles.prose} />
            </section>
          )}

          {gallery.length > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Photos</h2>
              <div className={clubStyles.gallery}>
                {gallery.map((m, i) => (
                  // eslint-disable-next-line @next/next/no-img-element -- Gumlet CDN, already sized
                  <img key={m.url} src={m.thumbnailUrl || m.url} alt={`${club.name} photo ${i + 1}`} loading="lazy" />
                ))}
              </div>
            </section>
          )}

          {whatWeDo.length > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>What we do</h2>
              <div className={styles.rowList}>
                {whatWeDo.map((item) => (
                  <div key={item.title} className={styles.row}>
                    <div className={styles.rowBody}>
                      <h3 className={styles.rowTitle}>{item.title}</h3>
                      {item.description && <RichText text={item.description} className={styles.rowMeta} />}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {schedule.length > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Weekly schedule</h2>
              <div className={styles.rowList}>
                {schedule.map((slot, index) => (
                  <div key={`${slot.dayLabel}-${index}`} className={styles.row}>
                    <div className={styles.rowDate}>
                      <span className={styles.rowDay}>{slot.dayLabel.slice(0, 3)}</span>
                    </div>
                    <div className={styles.rowBody}>
                      <h3 className={styles.rowTitle}>
                        {slot.startTime ? `${slot.startTime}${slot.endTime ? ` - ${slot.endTime}` : ""}` : slot.dayLabel}
                      </h3>
                      <p className={styles.rowMeta}>
                        {[slot.venueName, slot.venueAddress].filter(Boolean).join(" · ") || club.locality || ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {perks.length > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Member perks</h2>
              <ul className={styles.bulletList}>
                {perks.map((perk) => (
                  <li key={perk} className={styles.bulletItem}>
                    <span className={styles.bulletDot} aria-hidden="true" />
                    {perk}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {faqs.length > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Frequently asked questions</h2>
              {faqs.map((faq) => (
                <div key={faq.question} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{faq.question}</h3>
                  <RichText text={faq.answer} className={styles.faqAnswer} />
                </div>
              ))}
            </section>
          )}
        </main>

        <aside className={styles.aside}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Follow {club.name}</h2>
            <p className={styles.ctaText}>
              Following a club on SyncTrip gets you into its chat room and notifies you the moment it announces a new event or meetup.
            </p>
            <GetAppCta
              appPath={`/share/club/${club.id}`}
              label="Open in the app"
              note="Free on Android and iOS."
            />
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Club details</h2>
            <div className={styles.factList}>
              {place && (
                <div className={styles.fact}>
                  <span className={styles.factIcon} aria-hidden="true"><MapPin size={18} /></span>
                  <div>
                    <p className={styles.factLabel}>Where</p>
                    <p className={styles.factValue}>{place}</p>
                  </div>
                </div>
              )}
              {schedule.length > 0 && (
                <div className={styles.fact}>
                  <span className={styles.factIcon} aria-hidden="true"><Clock size={18} /></span>
                  <div>
                    <p className={styles.factLabel}>Meets</p>
                    <p className={styles.factValue}>
                      {schedule.map((slot) => slot.dayLabel).join(", ")}
                    </p>
                  </div>
                </div>
              )}
              {upcomingEvents.length > 0 && (
                <div className={styles.fact}>
                  <span className={styles.factIcon} aria-hidden="true"><CalendarDays size={18} /></span>
                  <div>
                    <p className={styles.factLabel}>Upcoming</p>
                    <p className={styles.factValue}>
                      {upcomingEvents.length} event{upcomingEvents.length === 1 ? "" : "s"} scheduled
                    </p>
                  </div>
                </div>
              )}
              {typeof stats.followerCount === "number" && stats.followerCount > 0 && (
                <div className={styles.fact}>
                  <span className={styles.factIcon} aria-hidden="true"><Users size={18} /></span>
                  <div>
                    <p className={styles.factLabel}>Community</p>
                    <p className={styles.factValue}>{stats.followerCount.toLocaleString("en-IN")} following</p>
                  </div>
                </div>
              )}
              {typeof stats.avgRating === "number" && (
                <div className={styles.fact}>
                  <span className={styles.factIcon} aria-hidden="true"><Star size={18} /></span>
                  <div>
                    <p className={styles.factLabel}>Rated</p>
                    <p className={styles.factValue}>{stats.avgRating.toFixed(1)} / 5</p>
                  </div>
                </div>
              )}
              {perks.length > 0 && (
                <div className={styles.fact}>
                  <span className={styles.factIcon} aria-hidden="true"><Gift size={18} /></span>
                  <div>
                    <p className={styles.factLabel}>Perks</p>
                    <p className={styles.factNote}>{perks.slice(0, 3).join(" · ")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {categories.length > 0 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Activities</h2>
              <div className={styles.chipRow}>
                {categories.map((category) => (
                  <span key={category} className={styles.chip}>{humanize(category)}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <p className={styles.footerNote}>
        Clubs, chat rooms and club events live inside the SyncTrip app.{" "}
        <Link href="/explore/plans">Explore local plans and meetups</Link> or{" "}
        <Link href="/">see what SyncTrip is</Link>.
      </p>
    </div>
  );
}
