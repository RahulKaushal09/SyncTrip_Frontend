import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Coins, Smartphone, Star, Ticket } from "lucide-react";
import { CITY_GUIDES } from "@/data/cityGuides";
import { getAllGuideVenues, getCityFeed, type GuideFeed, type GuideVenue } from "@/lib/cityGuideApi";
import { appStoreUrl, playStoreUrl } from "@/lib/storeLinks";
import styles from "@/components/HomeV3/HomeV3.module.css";

/**
 * /newhome: candidate homepage (clean, tripbff-style). Hidden from Google while it is
 * reviewed (noindex + canonical to /); swap it into / when approved.
 *
 * Keyword job (Keyword Planner India, Oct 2026): brand + make friends / meet new
 * people / meetups near you ("meetup groups" 18.1k, "friends near me" 2.9k, "social
 * app india" 2.9k, "find friends" 2.4k, "meetup app" 1.6k). "friendship app" (40.5k)
 * belongs to /friendship-app, so this page links there instead of competing.
 */

export const revalidate = 600;

const TITLE = "SyncTrip: Make Friends & Meetups Near You";
const DESCRIPTION =
  "Make real friends offline. Join game nights, sports, café meetups, nights out and weekend trips with people near you in Gurgaon, Delhi NCR and Chandigarh.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "https://synctrip.in" },
  // Preview only until it replaces the homepage.
  robots: { index: false, follow: true },
};

const TRACK = { campaign: "home_v3", term: "home" };

const IDEAS = [
  { kind: "Idea", title: "Need 3 for badminton at 7", meta: "Sports plan" },
  { kind: "Idea", title: "Sunday brunch, anyone?", meta: "Café meetup" },
  { kind: "Idea", title: "Board-game night this Friday", meta: "Club event" },
  { kind: "Idea", title: "Night out in Cyber Hub", meta: "Nightlife" },
  { kind: "Idea", title: "Breakfast ride to Damdama", meta: "Ride plan" },
  { kind: "Idea", title: "5-a-side, short of 2 players", meta: "Turf game" },
  { kind: "Idea", title: "Pottery class, first timers", meta: "Workshop" },
  { kind: "Idea", title: "Weekend trip to Kasauli", meta: "Group trip" },
];

const VIBES = [
  { title: "Board games & gaming", img: "/city-guides/friendship-game-night.jpg", accent: "#2785E7", slug: "gaming-board-games" },
  { title: "Pickleball & badminton", img: "/city-guides/activity-pickleball.jpg", accent: "#059669", slug: "pickleball-badminton" },
  { title: "Turf & box cricket", img: "/city-guides/chandigarh-box-cricket.jpg", accent: "#16A34A", slug: "turf-football-cricket" },
  { title: "Cafés to meet people", img: "/city-guides/activity-cafe-friends.jpg", accent: "#B45309", slug: "cafes-to-meet-people" },
  { title: "Nightlife", img: "/city-guides/chandigarh-nightlife.jpg", accent: "#7C3AED", slug: "nightlife" },
  { title: "Trampoline, karting & bowling", img: "/city-guides/activity-go-karting.jpg", accent: "#F3359E", slug: "fun-activities" },
  { title: "Pottery & workshops", img: "/city-guides/workshops-pottery.jpg", accent: "#EA580C", slug: "workshops" },
  { title: "Runs & day trips", img: "/city-guides/gurgaon-running.jpg", accent: "#0891B2", slug: "outdoors-running" },
];

const CITIES = [
  { name: "Gurgaon", href: "/city/gurgaon", img: "/city-guides/gurgaon-cyber-hub.jpg", note: "Cyber Hub · Golf Course Rd · Sohna Rd" },
  { name: "Chandigarh", href: "/city/chandigarh", img: "/city-guides/landmark-sukhna-lake.jpg", note: "Tricity · Mohali · Zirakpur" },
  { name: "Delhi", href: "/city/delhi", note: "Hauz Khas · CP · South Delhi" },
  { name: "Noida", href: "/city/noida", note: "Sector 18 · 62 · Greater Noida" },
];

const FAQS = [
  { q: "What is SyncTrip?", a: "SyncTrip is a free app for making real friends offline. You join or post plans (board-game nights, sports, café meetups, nights out, rides and weekend trips) with people near you, chat in the group, and meet at the venue." },
  { q: "How do I make new friends in a new city?", a: "Do things with people regularly: a weekly game night, a sports group or a running club. On SyncTrip you can join those plans from day one, even if you don't know anyone yet. Many people join alone." },
  { q: "Is SyncTrip a dating app?", a: "No. SyncTrip is for friendships and plans. You join because of the activity, usually in a group, at a real venue." },
  { q: "Which cities is SyncTrip in?", a: "SyncTrip is active in Gurgaon, Delhi NCR, Chandigarh (with Mohali, Panchkula and Zirakpur) and Bangalore, with more cities coming." },
  { q: "Is SyncTrip free?", a: "Yes. Downloading the app and joining or creating plans is free. Some hosted club events are ticketed, and you can earn wallet credit for reviewing events you attend." },
];

const IST = "Asia/Kolkata";
const day = (d: string) => new Intl.DateTimeFormat("en-IN", { timeZone: IST, weekday: "short", day: "numeric", month: "short" }).format(new Date(d));

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": "https://synctrip.in/#org", name: "SyncTrip", url: "https://synctrip.in", logo: "https://synctrip.in/logo_main_withoutBG.png", sameAs: ["https://www.instagram.com/synctrips"] },
      { "@type": "WebSite", name: "SyncTrip", url: "https://synctrip.in", publisher: { "@id": "https://synctrip.in/#org" } },
      {
        "@type": "MobileApplication",
        name: "SyncTrip: Meet People & Plans",
        operatingSystem: "Android, iOS",
        applicationCategory: "SocialNetworkingApplication",
        offers: { "@type": "Offer", price: 0, priceCurrency: "INR" },
        publisher: { "@id": "https://synctrip.in/#org" },
      },
      { "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
}

function StoreButtons({ content }: { content: string }) {
  return (
    <div className={styles.storeRow}>
      <a className={styles.storeBtn} href={appStoreUrl({ ...TRACK, content })} target="_blank" rel="noopener noreferrer">
        <Smartphone size={22} aria-hidden />
        <span><small>Download on the</small><b>App Store</b></span>
      </a>
      <a className={styles.storeBtn} href={playStoreUrl({ ...TRACK, content })} target="_blank" rel="noopener noreferrer">
        <Smartphone size={22} aria-hidden />
        <span><small>Get it on</small><b>Google Play</b></span>
      </a>
    </div>
  );
}

export default async function NewHomePage() {
  const citySlugs = CITY_GUIDES.map((c) => c.citySlug);
  const [feeds, venues] = await Promise.all([
    Promise.all(citySlugs.map((c) => getCityFeed(c, {}, 6))),
    getAllGuideVenues(citySlugs),
  ]);
  const feed: GuideFeed = { events: feeds.flatMap((f) => f.events), plans: feeds.flatMap((f) => f.plans) };

  // Real plans first (marked Live), then generic ideas so the strip is never empty.
  const live = [
    ...feed.events.map((e) => ({ kind: "Live", title: e.title, meta: `${day(e.startsAt)} · ${e.venueName || e.locality}`, href: e.url })),
    ...feed.plans.map((p) => ({ kind: "Live", title: p.title, meta: `${day(p.date)}${p.venueName ? ` · ${p.venueName}` : ""}`, href: p.url })),
  ];
  const strip = [...live, ...IDEAS.map((i) => ({ ...i, href: undefined as string | undefined }))].slice(0, 12);

  // Popular places: hosted/featured first, then a spread across both cities.
  const rank = (v: GuideVenue) => (v.featured ? 4 : 0) + (v.syncTripHosted ? 2 : 0) + (v.photos.length ? 1 : 0);
  const places = [...venues]
    .filter(({ venue }) => !/day trips/i.test(venue.area))
    .sort((a, b) => rank(b.venue) - rank(a.venue))
    .reduce<{ citySlug: string; venue: GuideVenue }[]>((acc, x) => (acc.filter((y) => y.citySlug === x.citySlug).length < 4 ? [...acc, x] : acc), [])
    .slice(0, 8);

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />

      {/* ---------- Hero ---------- */}
      <header className={styles.hero}>
        {/* eslint-disable @next/next/no-img-element -- static, pre-compressed assets */}
        <figure className={`${styles.polaroid} ${styles.p1}`}><img src="/city-guides/friendship-game-night.jpg" alt="" /><span>game night</span></figure>
        <figure className={`${styles.polaroid} ${styles.p2}`}><img src="/city-guides/chandigarh-box-cricket.jpg" alt="" /><span>box cricket</span></figure>
        <figure className={`${styles.polaroid} ${styles.p3}`}><img src="/city-guides/workshops-pottery.jpg" alt="" /><span>pottery</span></figure>
        <figure className={`${styles.polaroid} ${styles.p4}`}><img src="/city-guides/chandigarh-gaming-theory.jpg" alt="" /><span>gaming</span></figure>
        {/* eslint-enable @next/next/no-img-element */}

        <div className={styles.wrap}>
          <span className={styles.pill}><span className={styles.liveDot} /> Plans happening near you this week</span>
          <h1 className={styles.h1}>
            Make real friends,{" "}
            <span className={styles.circled}>
              offline.
              <svg viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden>
                <path d="M10 44 C 12 12, 186 6, 192 38 C 198 70, 30 78, 14 52" fill="none" stroke="#4bbef5" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className={styles.heroSub}>
            Join game nights, sports, café meetups, nights out and weekend trips with people near you. Not dating. No awkward
            one-on-ones. Just plans, and people to do them with.
          </p>
          <div className={styles.trustRow}>
            <span className={styles.trust}><span className={styles.stars}>★★★★★</span> 4.8 on Google Play</span>
            <span className={styles.trust}><Star size={14} aria-hidden /> Free on Android &amp; iOS</span>
          </div>
          <StoreButtons content="hero" />
          <nav className={styles.cityRow} aria-label="Cities">
            Plans in
            {CITIES.map((c) => (
              <Link key={c.name} href={c.href} className={styles.cityLink}>{c.name}</Link>
            ))}
          </nav>
        </div>

        {/* ---------- What people are planning ---------- */}
        <div className={styles.marqueeWrap} aria-label="Plans on SyncTrip">
          <div className={styles.marquee}>
            {[...strip, ...strip].map((p, i) => {
              const body = (
                <>
                  <span className={styles.planTop}>
                    <span className={`${styles.planTag} ${p.kind === "Live" ? styles.planTagLive : ""}`}>{p.kind === "Live" ? "● On SyncTrip" : "Plan idea"}</span>
                  </span>
                  <span className={styles.planTitle}>{p.title}</span>
                  <span className={styles.planMeta}>{p.meta}</span>
                </>
              );
              const hidden = i >= strip.length;
              return p.href ? (
                <Link key={i} href={p.href} className={styles.planCard} aria-hidden={hidden || undefined} tabIndex={hidden ? -1 : undefined}>{body}</Link>
              ) : (
                <div key={i} className={styles.planCard} aria-hidden={hidden || undefined}>{body}</div>
              );
            })}
          </div>
        </div>
      </header>

      <main className={styles.wrap}>
        {/* ---------- How it works ---------- */}
        <section className={`${styles.section} ${styles.center}`} aria-labelledby="how">
          <span className={styles.eyebrow}>How it works</span>
          <h2 id="how" className={styles.h2}>Meet new people by doing things together</h2>
          <p className={styles.lead}>Making friends as an adult is hard because nobody plans anything. SyncTrip fixes the planning part.</p>
          <div className={styles.steps}>
            <div className={styles.step}><span className={styles.stepNum}>01</span><h3>Pick something to do</h3><p>Board games, badminton, a café, a night out or a weekend trip. Join a plan people near you already posted.</p></div>
            <div className={styles.step}><span className={styles.stepNum}>02</span><h3>Or post your own</h3><p>&ldquo;Need 3 for pickleball at 7.&rdquo; People who are free and up for it join in.</p></div>
            <div className={styles.step}><span className={styles.stepNum}>03</span><h3>Chat, then meet</h3><p>Talk in the group, see who&apos;s coming, and meet at the venue. Many people come alone.</p></div>
          </div>
        </section>

        {/* ---------- Pick your vibe ---------- */}
        <section className={`${styles.section} ${styles.center}`} aria-labelledby="vibes">
          <span className={styles.eyebrow}>Things to do with friends</span>
          <h2 id="vibes" className={styles.h2}>What do you feel like doing?</h2>
          <p className={styles.lead}>City guides with the best places, and the SyncTrip plans happening there this week.</p>
          <div className={styles.vibes}>
            {VIBES.map((v) => (
              <div key={v.slug} className={styles.vibe} style={{ ["--accent" as string]: v.accent } as React.CSSProperties}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.img} alt="" loading="lazy" />
                <h3>{v.title}</h3>
                <div className={styles.vibeLinks}>
                  <Link href={`/city/gurgaon/${v.slug}`}>Gurgaon</Link>
                  <Link href={`/city/chandigarh/${v.slug}`}>Chandigarh</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Rewards ---------- */}
        <section className={styles.rewards} aria-labelledby="rewards">
          <div>
            <span className={styles.eyebrow}>New</span>
            <h2 id="rewards" className={styles.h2}>Go out. Review. Earn credit.</h2>
            <p className={styles.lead}>Every event you attend can pay for part of the next one.</p>
            <p className={styles.fine}>Credit is for use in SyncTrip, isn&apos;t cash and expires if unused.</p>
          </div>
          <div className={styles.rewardList}>
            <div className={styles.rewardItem}><span className={styles.rewardIcon}><CalendarCheck size={20} aria-hidden /></span><span><b>Attend an event</b><span>Board-game nights, sports sessions, socials.</span></span></div>
            <div className={styles.rewardItem}><span className={styles.rewardIcon}><Star size={20} aria-hidden /></span><span><b>Share a quick review</b><span>Add a few words or a photo to earn more.</span></span></div>
            <div className={styles.rewardItem}><span className={styles.rewardIcon}><Ticket size={20} aria-hidden /></span><span><b>Use credit on your next ticket</b><span>Straight from your SyncTrip wallet.</span></span></div>
            <div className={styles.rewardItem}><span className={styles.rewardIcon}><Coins size={20} aria-hidden /></span><span><b>Host? Earn a bonus</b><span>When people show up to your event.</span></span></div>
          </div>
        </section>

        {/* ---------- Popular places ---------- */}
        {places.length > 0 && (
          <section className={`${styles.section} ${styles.center}`} aria-labelledby="places">
            <span className={styles.eyebrow}>Popular places</span>
            <h2 id="places" className={styles.h2}>Where SyncTrip plans happen</h2>
            <div className={styles.places}>
              {places.map(({ venue }) => (
                <Link key={venue.slug} href={`/places/${venue.slug}`} className={styles.place}>
                  <b>{venue.name}</b>
                  <span>{[venue.locality, venue.area].filter(Boolean).join(", ")}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ---------- Cities ---------- */}
        <section className={`${styles.section} ${styles.center}`} aria-labelledby="cities">
          <span className={styles.eyebrow}>Cities</span>
          <h2 id="cities" className={styles.h2}>Find meetups and people near you</h2>
          <div className={styles.cities}>
            {CITIES.map((c) => (
              <Link key={c.name} href={c.href} className={styles.city}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {c.img && <img src={c.img} alt="" loading="lazy" />}
                <b>{c.name}</b>
                <span>{c.note}</span>
              </Link>
            ))}
          </div>
          <p className={styles.lead}>
            Looking for a friendship app that gets you off your phone? <Link href="/friendship-app" className={styles.textLink}>See how SyncTrip works</Link>.
          </p>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className={`${styles.section} ${styles.center}`} aria-labelledby="faq">
          <span className={styles.eyebrow}>FAQ</span>
          <h2 id="faq" className={styles.h2}>Questions, answered</h2>
          <div className={styles.faq} style={{ textAlign: "left" }}>
            {FAQS.map((f, i) => (
              <details key={f.q} className={styles.faqItem} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className={styles.final} aria-labelledby="final">
          <h2 id="final" className={styles.h2}>Your next plan is one tap away.</h2>
          <p>Join a game night, find a doubles partner or plan a weekend trip with people near you. Free on Android and iOS.</p>
          <div className={styles.btnRow}><StoreButtons content="final_cta" /></div>
        </section>
      </main>
    </div>
  );
}
