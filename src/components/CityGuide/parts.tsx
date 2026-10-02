import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronDown, ChevronRight, MapPin, Ticket, Users } from "lucide-react";
import { APP_LINKS, ROUTES } from "@/constants/config";
import type { GuideFaq, GuideImage } from "@/data/cityGuides";
import type { GuideFeed } from "@/lib/cityGuideApi";
import styles from "./CityGuide.module.css";

export { default as GuideIcon } from "./GuideIcon";

const IST = "Asia/Kolkata";
const fmt = (d: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IN", { timeZone: IST, ...o }).format(new Date(d));
const TIME_OF_DAY: Record<string, string> = { morning: "Morning", afternoon: "Afternoon", evening: "Evening", night: "Night" };

/* ---------------- Hero ---------------- */

export function GuideHero({
  crumbs, kicker, title, intro, image, actions, stats,
}: {
  crumbs: { label: string; href?: string }[];
  kicker: string;
  title: string;
  intro: string[];
  image?: GuideImage;
  actions?: React.ReactNode;
  stats?: { icon: React.ReactNode; label: string }[];
}) {
  return (
    <header className={`${styles.hero} ${image ? "" : styles.heroPlain}`}>
      {image && (
        // Static, pre-compressed asset; eager because it is the LCP element.
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.heroImg} src={image.src} alt={image.alt} fetchPriority="high" />
      )}
      {image && <div className={styles.heroShade} />}
      <div className={styles.heroInner}>
        <nav aria-label="Breadcrumb" className={styles.crumbs}>
          {crumbs.map((c, i) => (
            <React.Fragment key={c.label}>
              {i > 0 && <ChevronRight size={13} aria-hidden />}
              {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </React.Fragment>
          ))}
        </nav>
        <span className={styles.kicker}>
          <span className={styles.kickerDot} />
          {kicker}
        </span>
        <h1 className={styles.h1}>{title}</h1>
        {intro.map((p) => (
          <p key={p.slice(0, 32)} className={styles.lead}>
            {p}
          </p>
        ))}
        {stats && stats.length > 0 && (
          <div className={styles.heroStats}>
            {stats.map((s) => (
              <span key={s.label} className={styles.heroStat}>
                {s.icon}
                {s.label}
              </span>
            ))}
          </div>
        )}
        {actions && <div className={styles.heroActions}>{actions}</div>}
      </div>
      {image?.credit && (
        <span className={styles.photoCredit}>
          Photo:{" "}
          <a href={image.credit.url} target="_blank" rel="noopener noreferrer nofollow">
            {image.credit.author}
          </a>
          , {image.credit.license}
        </span>
      )}
    </header>
  );
}

/* ---------------- Happening on SyncTrip ---------------- */

export function HappeningRail({
  feed, cityName, title, sub, emptyTitle,
}: {
  feed: GuideFeed;
  cityName: string;
  title: string;
  sub: string;
  emptyTitle: string;
}) {
  const items = [
    ...feed.events.map((e) => ({ kind: "event" as const, at: e.startsAt, e })),
    ...feed.plans.map((p) => ({ kind: "plan" as const, at: p.date, p })),
  ].sort((a, b) => +new Date(a.at) - +new Date(b.at));

  return (
    <section id="happening" className={styles.section} aria-labelledby="happening-title">
      <div className={styles.sectionHead}>
        <div>
          <h2 id="happening-title" className={styles.h2}>{title}</h2>
          <p className={styles.sub}>{sub}</p>
        </div>
        <Link href={ROUTES.PLANS} className={styles.btnOutline}>
          All plans in {cityName} <ArrowRight size={15} aria-hidden />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyRail}>
          <span className={styles.emptyIcon}><Users size={22} aria-hidden /></span>
          <div>
            <h3>{emptyTitle}</h3>
            <p>Be the first: post a plan on SyncTrip and people in {cityName} who want the same thing will join.</p>
          </div>
          <a className={styles.btnPrimary} href={APP_LINKS.PLAY_STORE} target="_blank" rel="noopener noreferrer">
            Start a plan <ArrowRight size={16} aria-hidden />
          </a>
        </div>
      ) : (
        <div className={styles.rail}>
          {items.map((it) =>
            it.kind === "event" ? (
              <Link key={`e-${it.e.id}`} href={it.e.url} className={styles.eventCard}>
                <div className={styles.eventMedia}>
                  {it.e.image ? (
                    // Remote club cover, already compressed by our pipeline.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.e.image} alt="" loading="lazy" />
                  ) : (
                    <Ticket size={34} aria-hidden />
                  )}
                  <span className={styles.dateBadge}>
                    <span>{fmt(it.e.startsAt, { month: "short" })}</span>
                    <b>{fmt(it.e.startsAt, { day: "numeric" })}</b>
                  </span>
                  <span className={styles.typePill}>Club event</span>
                </div>
                <div className={styles.eventBody}>
                  <h3 className={styles.eventTitle}>{it.e.title}</h3>
                  <span className={styles.eventMeta}>
                    <CalendarDays size={14} aria-hidden />
                    {fmt(it.e.startsAt, { weekday: "short", hour: "numeric", minute: "2-digit" })}
                  </span>
                  {it.e.venueName && (
                    <span className={styles.eventMeta}>
                      <MapPin size={14} aria-hidden />
                      {it.e.venueName}
                      {it.e.locality ? `, ${it.e.locality}` : ""}
                    </span>
                  )}
                  <div className={styles.eventFoot}>
                    <span className={styles.price}>{it.e.isFree || !it.e.price ? "Free" : `₹${it.e.price}`}</span>
                    <span className={`${styles.seats} ${it.e.soldOut || it.e.seatsLeft <= 3 ? styles.seatsLow : ""}`}>
                      {it.e.soldOut ? "Sold out" : `${it.e.seatsLeft} seats left`}
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <Link key={`p-${it.p.id}`} href={it.p.url} className={styles.eventCard}>
                <div className={styles.eventMedia}>
                  <Users size={34} aria-hidden />
                  <span className={styles.dateBadge}>
                    <span>{fmt(it.p.date, { month: "short" })}</span>
                    <b>{fmt(it.p.date, { day: "numeric" })}</b>
                  </span>
                  <span className={styles.typePill}>{it.p.type === "sports" ? "Sport plan" : "Open plan"}</span>
                </div>
                <div className={styles.eventBody}>
                  <h3 className={styles.eventTitle}>{it.p.title}</h3>
                  <span className={styles.eventMeta}>
                    <CalendarDays size={14} aria-hidden />
                    {fmt(it.p.date, { weekday: "short" })}
                    {it.p.time ? ` · ${TIME_OF_DAY[it.p.time] || it.p.time}` : ""}
                  </span>
                  <div className={styles.eventFoot}>
                    <span className={styles.price}>{it.p.going} going</span>
                    <span className={`${styles.seats} ${it.p.spotsLeft <= 2 ? styles.seatsLow : ""}`}>
                      {it.p.spotsLeft > 0 ? `${it.p.spotsLeft} spots left` : "Full"}
                    </span>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </section>
  );
}

/* ---------------- FAQ ---------------- */

export function GuideFaqList({ faqs, title }: { faqs: GuideFaq[]; title: string }) {
  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={styles.sectionHead}>
        <h2 id="faq-title" className={styles.h2}>{title}</h2>
      </div>
      <div className={styles.faq}>
        {faqs.map((f, i) => (
          <details key={f.question} className={styles.faqItem} open={i === 0}>
            <summary>
              {f.question}
              <ChevronDown size={18} className={styles.faqChevron} aria-hidden />
            </summary>
            <p className={styles.faqAnswer}>{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------------- App CTA ---------------- */

export function AppCtaBand({ cityName }: { cityName: string }) {
  return (
    <aside className={styles.ctaBand}>
      <div>
        <h2>Don&apos;t wait for your group chat to agree.</h2>
        <p>Post what you want to do in {cityName} and people who are free will join. Free on Android and iOS.{" "}
          <Link href="/friendship-app" style={{ color: "#fff", textDecoration: "underline" }}>How SyncTrip works</Link>
        </p>
      </div>
      <div className={styles.storeRow}>
        <a className={styles.btnPrimary} href={APP_LINKS.PLAY_STORE} target="_blank" rel="noopener noreferrer">
          Get it on Android
        </a>
        <a className={styles.btnGhost} href={APP_LINKS.APP_STORE} target="_blank" rel="noopener noreferrer">
          Download for iPhone
        </a>
      </div>
    </aside>
  );
}
