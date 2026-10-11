import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  ArrowRight, Check, Compass, Image as ImageIcon, ListChecks, Map, MapPin, MessageCircle, Mic, Mountain, QrCode,
  ShieldCheck, Star, Ticket, Users, Wallet,
} from "lucide-react";
import { CITY_GUIDES } from "@/data/cityGuides";
import { getAllGuideVenues, getCityFeed, type GuideFeed, type GuideVenue } from "@/lib/cityGuideApi";
import { appStoreUrl, playStoreUrl } from "@/lib/storeLinks";
import { cityImage } from "@/lib/cityImages";
import styles from "@/components/HomeV3/HomeV3.module.css";
import LazyLoopVideo from "@/components/HomeV3/LazyLoopVideo";
import ScrollReveal from "@/components/HomeV3/ScrollReveal";
import WordCycle from "@/components/HomeV3/WordCycle";
import GetItOnPlayStore from "@/assets/icons/GetOnPlayStoreSVG.svg";
import GetItOnAppStore from "@/assets/icons/GetOnAppStore.svg";

/**
 * /newhome: candidate homepage. Shows everything SyncTrip does (plans, club events,
 * group trips, SyncMap, chats, SyncTrust, rewards), one clear section each, with real
 * app screens. Hidden from Google while it is reviewed (noindex + canonical to /);
 * swap it into / when approved.
 *
 * Keyword job (Keyword Planner India, Oct 2026): brand + make friends / meet new
 * people / meetups near you ("meetup groups" 18.1k, "friends near me" 2.9k, "social
 * app india" 2.9k, "find friends" 2.4k, "meetup app" 1.6k). "friendship app" (40.5k)
 * belongs to /friendship-app, so this page links there instead of competing.
 */

export const revalidate = 600;

// Bold display face for headings, closer to the app than the site-wide serif.
const display = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["800"], variable: "--font-home-display", display: "swap" });

const TITLE = "SyncTrip: Make Friends & Meetups Near You";
const DESCRIPTION =
  "Meet new people through real plans near you: sports, game nights, movies, rides, club events and weekend trips. Free app for Gurgaon, Delhi NCR and Chandigarh.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "https://synctrip.in" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://synctrip.in",
    siteName: "SyncTrip",
    locale: "en_IN",
    type: "website",
    images: [{ url: "https://synctrip.in/og-home.png", alt: "SyncTrip: make friends through real plans near you" }],
  },
  twitter: { card: "summary_large_image", site: "@synctrip44398", title: TITLE, description: DESCRIPTION, images: ["https://synctrip.in/og-home.png"] },
  // Preview only until it replaces the homepage.
  robots: { index: false, follow: true },
};

const TRACK = { campaign: "home_v3", term: "home" };

const IDEAS = [
  { title: "Need 3 for badminton at 7", meta: "Sports plan" },
  { title: "Sunday brunch, anyone?", meta: "Hangout" },
  { title: "Board-game night this Friday", meta: "Club event" },
  { title: "Breakfast ride to Damdama", meta: "Ride" },
  { title: "5-a-side, short of 2 players", meta: "Sports plan" },
  { title: "First-day-first-show, who's in?", meta: "Movie plan" },
  { title: "Weekend trip to Kasauli", meta: "Group trip" },
  { title: "Pottery class, first timers", meta: "Club event" },
];

/** The overview grid: one tile per thing SyncTrip does, each jumping to its section. */
const FEATURES = [
  { id: "plans", icon: Users, title: "Plans", text: "Join or post sports, movies, rides and hangouts." },
  { id: "clubs", icon: Ticket, title: "Club events", text: "Game nights, open mics and socials by verified clubs." },
  { id: "trips", icon: Mountain, title: "Group trips", text: "Weekend getaways with people going your way." },
  { id: "syncmap", icon: Map, title: "SyncMap", text: "See plans and events around you on a map." },
  { id: "chats", icon: MessageCircle, title: "Chats & communities", text: "Group chats for every plan, open chats for your city." },
  { id: "synctrust", icon: ShieldCheck, title: "SyncTrust", text: "Scan to confirm you met. Reviews from real meetups." },
  { id: "rewards", icon: Wallet, title: "Rewards", text: "Earn wallet credit for going out and meeting people." },
  { id: "guides", icon: Compass, title: "City guides", text: "The best places to go with friends in your city." },
];

/** Chat bubbles around the "post a plan" screen (TripBFF-style). */
const BUBBLES = [
  { text: "anyone for badminton at 7? 🏸" },
  { text: "I'm in 🙌", mine: true },
  { text: "board games tonight?" },
  { text: "let's meet at 8", mine: true },
  { text: "chai after? ☕" },
  { text: "ride to Kasauli on Sunday?", mine: true },
];

const VIBES: { title: string; img: string; video?: string; accent: string; slug: string }[] = [
  { title: "Board games & gaming", img: "/city-guides/gaming-loop-poster.webp", video: "/city-guides/gaming-loop.mp4", accent: "#2785E7", slug: "gaming-board-games" },
  { title: "Pickleball & badminton", img: "/city-guides/activity-pickleball.jpg", accent: "#059669", slug: "pickleball-badminton" },
  { title: "Turf & box cricket", img: "/city-guides/chandigarh-box-cricket.jpg", accent: "#16A34A", slug: "turf-football-cricket" },
  { title: "Cafés to meet people", img: "/city-guides/activity-cafe-meetup.webp", accent: "#B45309", slug: "cafes-to-meet-people" },
  { title: "Nightlife", img: "/city-guides/chandigarh-nightlife.jpg", accent: "#7C3AED", slug: "nightlife" },
  { title: "Trampoline, karting & bowling", img: "/city-guides/activity-fun-hopup.jpg", accent: "#F3359E", slug: "fun-activities" },
  { title: "Pottery & workshops", img: "/city-guides/workshops-pottery.jpg", accent: "#EA580C", slug: "workshops" },
  { title: "Runs & day trips", img: "/city-guides/activity-rafting.jpg", accent: "#0891B2", slug: "outdoors-running" },
];

// City photos are the backend's `cities.imageUrl` (same images as the app), resized by Gumlet.
const cityImg = (slug: string) => cityImage(slug, 640)!.src;
const CITIES = [
  { name: "Gurgaon", href: "/city/gurgaon", img: cityImg("gurgaon"), note: "Cyber Hub · Golf Course Rd · Sohna Rd" },
  { name: "Chandigarh", href: "/city/chandigarh", img: cityImg("chandigarh"), note: "Tricity · Mohali · Zirakpur" },
  { name: "Delhi", href: "/city/delhi", img: cityImg("delhi"), note: "Hauz Khas · CP · South Delhi" },
  { name: "Noida", href: "/city/noida", img: cityImg("noida"), note: "Sector 18 · 62 · Greater Noida" },
];

const FAQS = [
  { q: "What is SyncTrip?", a: "SyncTrip is a free app for meeting new people through real plans. Join or post plans (sports, movies, bike rides, hangouts and weekend trips), book club events like board-game nights and open mics, chat with the group, and meet at the venue." },
  { q: "How do I make new friends in a new city?", a: "Do things with people regularly: a weekly game night, a sports group or a running club. On SyncTrip you can join those plans from day one, even if you don't know anyone yet. Many people join alone." },
  { q: "Is SyncTrip a dating app?", a: "No. SyncTrip is for friendships and plans. You join because of the activity, usually in a group, at a real venue." },
  { q: "Is it safe to meet people from SyncTrip?", a: "Plans happen in groups at public venues. When you meet, you scan each other's SyncTrust QR, so reviews only come from people who actually met you. SyncMap shows approximate locations only, and if something felt off you can report it privately to our safety team." },
  { q: "How do SyncTrip rewards work?", a: "You earn wallet credit for real meetups: ₹5 for each new person you meet and scan at a plan, up to ₹25 for reviewing a club event, and ₹20 when 3 people show up to a plan you host. Use it on club event tickets and SyncTrip Plus. Credit isn't cash, lasts 20 days, and is capped at ₹150 a month." },
  { q: "Which cities is SyncTrip in?", a: "SyncTrip is active in Gurgaon, Delhi, Noida and Chandigarh (with Mohali, Panchkula and Zirakpur), with more cities coming." },
  { q: "Is SyncTrip free?", a: "Yes. Downloading the app and joining or creating plans is free. Some club events are ticketed, and the club sets the price." },
  { q: "I run a club or host events. Can I list them?", a: "Yes. Verified clubs can publish events, sell tickets and keep a community chat for their members in the SyncTrip app. Get in touch through the Contact page and we'll help you get verified." },
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
        featureList: FEATURES.map((f) => f.title).join(", "),
        offers: { "@type": "Offer", price: 0, priceCurrency: "INR" },
        publisher: { "@id": "https://synctrip.in/#org" },
      },
      { "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
}

/** Official store badges (same artwork as the footer), Google Play first since most users are on Android. */
function StoreButtons({ content, light }: { content: string; light?: boolean }) {
  return (
    <div className={`${styles.storeRow} ${light ? styles.storeLight : ""}`}>
      <a className={styles.storeBtn} href={playStoreUrl({ ...TRACK, content })} target="_blank" rel="noopener noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG badge */}
        <img src={GetItOnPlayStore.src} alt="Get it on Google Play" width={160} height={48} />
      </a>
      <a className={styles.storeBtn} href={appStoreUrl({ ...TRACK, content })} target="_blank" rel="noopener noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG badge */}
        <img src={GetItOnAppStore.src} alt="Download on the App Store" width={144} height={48} />
      </a>
    </div>
  );
}

/** A phone with a real app screen. */
function Phone({ src, alt, children, eager, video }: { src: string; alt: string; children?: React.ReactNode; eager?: boolean; video?: string }) {
  return (
    <div className={styles.phoneStage}>
      <div className={styles.phone}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static, pre-compressed screenshot */}
        <img src={src} alt={alt} width={640} height={1306} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} />
        {/* Optional screen recording over the still (which stays as poster, alt text and reduced-motion view). */}
        {video && <LazyLoopVideo src={video} poster={src} />}
      </div>
      {children}
    </div>
  );
}

/** One feature section: copy on one side, the app on the other. */
function Feature({
  id, eyebrow, title, lead, points, links, visual, flip, tint,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  points: string[];
  links?: { href: string; label: string }[];
  visual: React.ReactNode;
  flip?: boolean;
  tint: string;
}) {
  return (
    <section id={id} data-reveal className={`${styles.feature} ${flip ? styles.flip : ""}`} style={{ ["--tint" as string]: tint } as React.CSSProperties} aria-labelledby={`${id}-h`}>
      <div className={styles.featureCopy}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 id={`${id}-h`} className={styles.h2}>{title}</h2>
        <p className={styles.lead}>{lead}</p>
        <ul className={styles.points}>
          {points.map((p) => (
            <li key={p}><Check size={18} aria-hidden /> <span>{p}</span></li>
          ))}
        </ul>
        {links && (
          <div className={styles.featureLinks}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={styles.textLink}>{l.label} <ArrowRight size={15} aria-hidden /></Link>
            ))}
          </div>
        )}
      </div>
      <div className={styles.featureVisual}>{visual}</div>
    </section>
  );
}

export default async function NewHomePage() {
  const citySlugs = CITY_GUIDES.map((c) => c.citySlug);
  const [feeds, venues] = await Promise.all([
    Promise.all(citySlugs.map((c) => getCityFeed(c, {}, 6))),
    getAllGuideVenues(citySlugs),
  ]);
  const feed: GuideFeed = { events: feeds.flatMap((f) => f.events), plans: feeds.flatMap((f) => f.plans) };

  // Real plans first (marked live), then generic ideas so the strip is never empty.
  const live = [
    ...feed.events.map((e) => ({ live: true, title: e.title, meta: `${day(e.startsAt)} · ${e.venueName || e.locality}`, href: e.url as string | undefined })),
    ...feed.plans.map((p) => ({ live: true, title: p.title, meta: `${day(p.date)}${p.venueName ? ` · ${p.venueName}` : ""}`, href: p.url as string | undefined })),
  ];
  const strip = [...live, ...IDEAS.map((i) => ({ ...i, live: false, href: undefined as string | undefined }))].slice(0, 12);

  // Popular places: hosted/featured first, then a spread across both cities.
  const rank = (v: GuideVenue) => (v.featured ? 4 : 0) + (v.syncTripHosted ? 2 : 0) + (v.photos.length ? 1 : 0);
  const places = [...venues]
    .filter(({ venue }) => !/day trips/i.test(venue.area))
    .sort((a, b) => rank(b.venue) - rank(a.venue))
    .reduce<{ citySlug: string; venue: GuideVenue }[]>((acc, x) => (acc.filter((y) => y.citySlug === x.citySlug).length < 4 ? [...acc, x] : acc), [])
    .slice(0, 8);

  return (
    <div className={`${styles.page} ${display.variable}`} data-motion-root>
      <ScrollReveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />

      {/* ---------- Hero ---------- */}
      <header className={styles.hero}>
        <div className={`${styles.wrap} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <span className={styles.pill}>
              <span className={styles.liveDot} /> Find people for{" "}
              <WordCycle words={["board-game nights", "badminton", "movie plans", "bike rides", "café hangouts", "open mics", "weekend trips"]} />
            </span>
            <h1 className={styles.h1}>
              Make friends{" "}
              <span className={styles.underlined}>
                near you.
                <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden>
                  <path pathLength={1} d="M3 13 C 50 5, 120 4, 197 10" />
                </svg>
              </span>{" "}
              Do{" "}
              <span className={styles.circled}>
                <span className={styles.grad}>real plans</span>
                <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden>
                  <path pathLength={1} d="M150 8 C 60 6, 8 22, 10 52 C 12 84, 110 94, 196 90 C 268 86, 296 64, 290 40 C 284 14, 214 2, 120 10" />
                </svg>
              </span>{" "}
              together.
            </h1>
            <p className={styles.heroSub}>
              SyncTrip is the free app for meeting new people through plans in your city: sports, movies, bike rides, hangouts,
              club events and weekend trips. Join one or post your own, chat with the group, and meet for real.
            </p>
            <StoreButtons content="hero" />
            <div className={styles.trustRow}>
              <span className={styles.trust}><span className={styles.stars}>★★★★★</span> 4.8 on Google Play</span>
              <span className={styles.trust}><Star size={14} aria-hidden /> Free · Not a dating app</span>
            </div>
          </div>

          <Phone src="/home/hero-home-poster.webp" video="/home/hero-home.mp4" alt="SyncTrip app home screen: event carousel, plan categories, and new chat notifications arriving" eager>
            {/* eslint-disable @next/next/no-img-element -- static, pre-compressed photos */}
            <figure className={`${styles.polaroid} ${styles.pA}`}><img src="/home/real-roundtable.webp" alt="" /><figcaption>meetup night</figcaption></figure>
            <figure className={`${styles.polaroid} ${styles.pB} ${styles.polaroidWide}`}><img src="/home/real-dinner.webp" alt="" /><figcaption>dinner meetup</figcaption></figure>
            {/* eslint-enable @next/next/no-img-element */}
            <div className={`${styles.float} ${styles.fA}`}>
              <span className={styles.floatIcon} style={{ background: "#10b981" }}><QrCode size={16} aria-hidden /></span>
              <span><b>+₹5 · You met Rahul</b><small>Scanned at Sunday Smash Social</small></span>
            </div>
            <div className={`${styles.float} ${styles.fB}`}>
              <span className={styles.floatIcon} style={{ background: "#2785e7" }}><Users size={16} aria-hidden /></span>
              <span><b>Badminton · 3/6 joined</b><small>Thu, 8 Oct · Evening</small></span>
            </div>
          </Phone>
        </div>

        {/* ---------- What people are planning ---------- */}
        <div className={styles.marqueeWrap} aria-label="Plans on SyncTrip">
          <div className={styles.marquee}>
            {[...strip, ...strip].map((p, i) => {
              const body = (
                <>
                  <span className={`${styles.planTag} ${p.live ? styles.planTagLive : ""}`}>{p.live ? "● On SyncTrip" : "Plan idea"}</span>
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
        {/* ---------- Real meetups ---------- */}
        <section className={styles.reel} data-reveal aria-labelledby="reel-h">
          <LazyLoopVideo src="/home/meetup-reel.mp4" poster="/home/meetup-reel-poster.webp" />
          <div className={styles.reelCopy}>
            <span className={styles.eyebrow}>Real meetups</span>
            <h2 id="reel-h" className={styles.h2}>This is what a SyncTrip game night looks like</h2>
            <p>Strangers at 7, a group chat by 10. Board games, chess and card nights, hosted by SyncTrip clubs.</p>
          </div>
        </section>

        {/* ---------- Everything in one place ---------- */}
        <section className={`${styles.section} ${styles.center}`} data-reveal-head aria-labelledby="all">
          <span className={styles.eyebrow}>One app for your social life</span>
          <h2 id="all" className={styles.h2}>Everything you need to meet new people</h2>
          <p className={styles.lead}>Making friends as an adult is hard because nobody makes the plan. SyncTrip gives you the plan, the people and the place.</p>
          <nav className={styles.bento} aria-label="SyncTrip features">
            {FEATURES.map(({ id, icon: Icon, title, text }, i) => (
              <a key={id} href={`#${id}`} className={styles.bentoTile} data-reveal style={{ ["--i" as string]: i } as React.CSSProperties}>
                <span className={styles.bentoIcon}><Icon size={20} aria-hidden /></span>
                <b>{title}</b>
                <span>{text}</span>
              </a>
            ))}
          </nav>
        </section>

        <Feature
          id="plans"
          tint="#eaf4ff"
          eyebrow="Plans"
          title="Join a plan near you, or post your own in a minute"
          lead="Short of players for badminton? Want company for a movie or a Sunday ride? Pick what you want to do, add when and where, and people nearby who are up for it join in."
          points={[
            "Trips, bike rides, movies, hangouts, sports and community plans",
            "Set the time, place and how many people you need",
            "Free to join and free to post. Many people come alone",
          ]}
          links={[{ href: "/explore/plans", label: "Browse plans near you" }]}
          visual={
            <Phone src="/home/app-create.webp" alt="Creating a plan on SyncTrip: plan a trip, start a ride, movie plan, casual outing, sports match or community">
              {BUBBLES.map((b, i) => (
                <span key={b.text} className={`${styles.bubble} ${b.mine ? styles.bubbleMine : ""}`} style={{ ["--i" as string]: i } as React.CSSProperties} aria-hidden>
                  {b.text}
                </span>
              ))}
            </Phone>
          }
        />

        <Feature
          id="clubs"
          flip
          tint="#f4efff"
          eyebrow="Club events"
          title="Meetups and events by verified clubs"
          lead="Board-game nights, open mics, sports socials and workshops, run by local clubs. Book a seat in the app, show up, and you're in the club's community chat afterwards."
          points={[
            "Verified clubs only, with tickets and entry codes in the app",
            "Follow clubs to hear about their next event first",
            "Pay part of a ticket with your SyncTrip wallet credit",
          ]}
          links={[
            { href: "/city/chandigarh", label: "Events in Chandigarh" },
            { href: "/city/gurgaon", label: "Events in Gurgaon" },
          ]}
          visual={
            <Phone src="/home/app-clubs.webp" alt="SyncTrip clubs list: table tennis, poetry and bowling clubs in Chandigarh">
              {/* eslint-disable @next/next/no-img-element -- real SyncTrip club events, pre-compressed */}
              <figure className={`${styles.polaroid} ${styles.snap} ${styles.s1}`}><img src="/home/real-boardgame-cafe.webp" alt="Board-game night at a café, hosted by a SyncTrip club" loading="lazy" /><figcaption>board-game night</figcaption></figure>
              <figure className={`${styles.polaroid} ${styles.snap} ${styles.s2}`}><img src="/home/real-chess.webp" alt="Players at a SyncTrip chess meetup" loading="lazy" /><figcaption>chess meetup</figcaption></figure>
              <figure className={`${styles.polaroid} ${styles.snap} ${styles.s3}`}><img src="/home/real-cardgame.webp" alt="A table of new friends playing a card game" loading="lazy" /><figcaption>card games</figcaption></figure>
              {/* eslint-enable @next/next/no-img-element */}
            </Phone>
          }
        />

        <Feature
          id="trips"
          tint="#ecfbf6"
          eyebrow="Group trips"
          title="Weekend trips with people going your way"
          lead="Join a group trip someone already planned, or post yours and find travel buddies. Split the plan, share the ride, and come back with new friends."
          points={[
            "Hill getaways, heritage stays and day trips from your city",
            "See who's going before you join",
            "Plan the itinerary together in the group chat",
          ]}
          links={[
            { href: "/trips", label: "See group trips" },
            { href: "/explore", label: "Explore destinations" },
          ]}
          visual={
            <div className={styles.collage}>
              {/* eslint-disable @next/next/no-img-element -- static, pre-compressed assets */}
              <img className={styles.cA} src="/city-guides/landmark-kasauli.jpg" alt="Hills at Kasauli, a weekend trip from Chandigarh" loading="lazy" />
              <img className={styles.cB} src="/city-guides/gurgaon-neemrana.jpg" alt="Neemrana Fort, a day trip from Gurgaon" loading="lazy" />
              <img className={styles.cC} src="/city-guides/landmark-morni-tikkar-taal.jpg" alt="Tikkar Taal lake in the Morni Hills" loading="lazy" />
              {/* eslint-enable @next/next/no-img-element */}
              <div className={`${styles.float} ${styles.fE}`}>
                <span className={styles.floatIcon} style={{ background: "#059669" }}><Mountain size={16} aria-hidden /></span>
                <span><b>Weekend in Kasauli</b><small>5 of 8 going</small></span>
              </div>
            </div>
          }
        />

        <Feature
          id="syncmap"
          flip
          tint="#eef7ff"
          eyebrow="SyncMap"
          title="See what's happening around you"
          lead="SyncMap puts plans, club events and people nearby on one map, so you can find something to do tonight in a couple of taps."
          points={[
            "Filter by plans, club events, rides and more",
            "Tap a pin to see the plan and who's going",
            "Approximate locations only. Your exact spot stays private",
          ]}
          visual={<Phone src="/home/app-syncmap.webp" alt="SyncMap showing plans and a board-games club event on a map of Chandigarh" />}
        />

        <Feature
          id="chats"
          tint="#fff4ec"
          eyebrow="Chats & communities"
          title="Group chats for every plan, open chats for your city"
          lead="Every plan gets its own group chat, so you can sort the details and say hi before you meet. City rooms and interest groups keep the conversation going after."
          points={[
            "Photos, voice notes, polls, GIFs and location sharing",
            "City open chats and interest groups like riders and travel lovers",
            "Mute and report, built in",
          ]}
          visual={
            <div className={styles.phoneStage}>
              <div className={`${styles.phone} ${styles.chat}`} role="img" aria-label="Example SyncTrip group chat with a poll, a voice note and a shared location">
                <div className={styles.chatHead}><b>Sunday Smash Social</b><small>6 members</small></div>
                <div className={styles.chatBody}>
                  <span className={styles.sys}>Riya joined the group</span>
                  <p className={styles.them}><i>Arjun</i>Court&apos;s booked for 9. Bring your racquets 🏸</p>
                  <div className={`${styles.them} ${styles.poll}`}>
                    <i>Riya</i>
                    <span className={styles.pollQ}><ListChecks size={15} aria-hidden /> Brunch after?</span>
                    <span className={styles.pollBar} style={{ ["--w" as string]: "80%" } as React.CSSProperties}><span>Yes, obviously</span><b>4</b></span>
                    <span className={styles.pollBar} style={{ ["--w" as string]: "20%" } as React.CSSProperties}><span>Can&apos;t today</span><b>1</b></span>
                  </div>
                  <p className={`${styles.me} ${styles.voice}`}><Mic size={15} aria-hidden /><span className={styles.wave} />0:07</p>
                  <div className={`${styles.them} ${styles.loc}`}>
                    <i>Arjun</i>
                    <span><MapPin size={15} aria-hidden /> Sector 17 Smash Club</span>
                    <small>Shared location</small>
                  </div>
                  <p className={styles.me}>See you all there! <ImageIcon size={14} aria-hidden /></p>
                </div>
                <div className={styles.chatInput}>Message…</div>
              </div>
            </div>
          }
        />

        <Feature
          id="synctrust"
          flip
          tint="#eefbf3"
          eyebrow="SyncTrust"
          title="Know who's real before you meet"
          lead="When you meet someone at a plan, you scan each other's SyncTrust QR. It proves you met in person, builds your trust level, and unlocks a review."
          points={[
            "Reviews only from people who actually met you",
            "Trust levels grow with every real meetup",
            "\"Felt unsafe\" reports go privately to our safety team",
          ]}
          visual={<Phone src="/home/app-synced.webp" alt="SyncTrust scan result: ₹5 added to wallet for meeting someone new and a trust level up" />}
        />

        <Feature
          id="rewards"
          tint="#fdf0f7"
          eyebrow="Rewards"
          title="Go out, meet people, earn credit"
          lead="SyncTrip rewards real meetups, not screen time. Credit lands in your wallet and pays for part of your next event."
          points={[
            "₹5 for every new person you meet and scan",
            "Up to ₹25 for reviewing a club event you went to",
            "₹20 when 3 people show up to a plan you host",
          ]}
          visual={
            <Phone src="/home/app-wallet.webp" alt="SyncTrip wallet with reward credit and transaction history">
              <div className={`${styles.float} ${styles.fF}`}>
                <span className={styles.floatIcon} style={{ background: "#f59e0b" }}><Wallet size={16} aria-hidden /></span>
                <span><b>Use it on tickets</b><small>Club events & SyncTrip Plus</small></span>
              </div>
            </Phone>
          }
        />
        <p className={`${styles.fine} ${styles.center}`}>Up to ₹150 a month. Credit is for use in SyncTrip, isn&apos;t cash, and lasts 20 days.</p>

        {/* ---------- City guides ---------- */}
        <section id="guides" className={`${styles.section} ${styles.center}`} data-reveal-head aria-labelledby="vibes">
          <span className={styles.eyebrow}>City guides</span>
          <h2 id="vibes" className={styles.h2}>Things to do with friends near you</h2>
          <p className={styles.lead}>The best places in Gurgaon and Chandigarh for each plan, and the SyncTrip plans happening there this week.</p>
          <div className={styles.vibes}>
            {VIBES.map((v, i) => (
              <div key={v.slug} className={styles.vibe} data-reveal style={{ ["--accent" as string]: v.accent, ["--i" as string]: i } as React.CSSProperties}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.img} alt="" loading="lazy" />
                {/* Muted loop over its first frame; hidden for reduced motion. */}
                {v.video && <LazyLoopVideo src={v.video} poster={v.img} />}
                <h3>{v.title}</h3>
                <div className={styles.vibeLinks}>
                  <Link href={`/city/gurgaon/${v.slug}`}>Gurgaon</Link>
                  <Link href={`/city/chandigarh/${v.slug}`}>Chandigarh</Link>
                </div>
              </div>
            ))}
          </div>

          {places.length > 0 && (
            <>
              <h3 className={styles.h3}>Popular places for plans</h3>
              <div className={styles.places}>
                {places.map(({ venue }, i) => (
                  <Link key={venue.slug} href={`/places/${venue.slug}`} className={styles.place} data-reveal style={{ ["--i" as string]: i } as React.CSSProperties}>
                    <b>{venue.name}</b>
                    <span>{[venue.locality, venue.area].filter(Boolean).join(", ")}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>

        {/* ---------- Cities ---------- */}
        <section className={`${styles.section} ${styles.center}`} data-reveal-head aria-labelledby="cities">
          <span className={styles.eyebrow}>Cities</span>
          <h2 id="cities" className={styles.h2}>Find meetups and friends near you</h2>
          <div className={styles.cities}>
            {CITIES.map((c, i) => (
              <Link key={c.name} href={c.href} className={styles.city} data-reveal style={{ ["--i" as string]: i } as React.CSSProperties}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={`${c.name} city`} loading="lazy" />
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
        <section className={`${styles.section} ${styles.center}`} data-reveal-head aria-labelledby="faq">
          <span className={styles.eyebrow}>FAQ</span>
          <h2 id="faq" className={styles.h2}>Questions, answered</h2>
          <div className={styles.faq} data-reveal>
            {FAQS.map((f, i) => (
              <details key={f.q} className={styles.faqItem} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className={styles.final} data-reveal aria-labelledby="final">
          <h2 id="final" className={styles.h2}>Your next plan is one tap away.</h2>
          <p>Join a game night, find a doubles partner or plan a weekend trip with people near you. Free on Android and iOS.</p>
          <StoreButtons content="final_cta" light />
        </section>
      </main>
    </div>
  );
}
