import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, MessageCircle, ShieldCheck, Star, Users } from "lucide-react";
import { APP_LINKS } from "@/constants/config";
import { CITY_GUIDES } from "@/data/cityGuides";
import { getCityFeed, type GuideFeed } from "@/lib/cityGuideApi";
import { AppCtaBand, GuideFaqList, GuideHero, GuideIcon, HappeningRail } from "@/components/CityGuide/parts";
import styles from "@/components/CityGuide/CityGuide.module.css";

/**
 * /friendship-app: the landing page for "friendship app" (40.5k/mo in India) and its
 * long tail ("friendship app india", "make friends app", "meet new people app").
 *
 * Positioning is deliberate: real friends, offline, through activities. Not dating
 * and not stranger chat. Claims stay factual; store ratings are dated.
 */

export const revalidate = 1800;

const URL = "https://synctrip.in/friendship-app";
const TITLE = "Friendship App to Make Real Friends Offline";
const DESCRIPTION =
  "SyncTrip is a free friendship app for making real friends offline, not dating. Join board-game nights, sports, outings and trips with people near you.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "friendship app", "friendship app india", "make friends app", "app to make new friends", "meet new people app",
    "best app to make friends", "make friends online not dating", "bumble bff alternative", "friendship app download",
  ].join(", "),
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "SyncTrip",
    locale: "en_IN",
    type: "website",
    images: [{ url: "https://synctrip.in/og-home.png", width: 1200, height: 630, alt: "SyncTrip, the friendship app" }],
  },
  twitter: { card: "summary_large_image", site: "@synctrip44398", title: TITLE, description: DESCRIPTION, images: ["https://synctrip.in/og-home.png"] },
  robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
};

const STEPS = [
  { title: "Pick something to do", text: "A board-game night, a pickleball game, a café meetup, a night out or a weekend trip. Join one people near you already posted." },
  { title: "Or post your own plan", text: "\"Need 3 for badminton at 7\", \"Sunday brunch in Sector 29\". People who are free and up for it join." },
  { title: "Chat, then meet", text: "Talk in the plan's group chat, see who's coming, and meet at the venue. Many people come alone." },
];

const DIFFERENCES = [
  { icon: <Users size={20} aria-hidden />, title: "Friends, not dates", text: "No swiping on faces. You join plans because of what you want to do, so you meet people who like the same things." },
  { icon: <MapPin size={20} aria-hidden />, title: "Offline, near you", text: "Every plan has a real venue and time in your city: cafés, courts, game nights, rides and trips." },
  { icon: <CalendarDays size={20} aria-hidden />, title: "Something to do together", text: "Doing an activity takes the pressure off small talk. A game night or a turf match is the easiest icebreaker there is." },
  { icon: <MessageCircle size={20} aria-hidden />, title: "Group chat before you go", text: "Every plan has a group chat, so you know who's coming and what the plan is before you leave home." },
];

const FAQS = [
  { question: "What is the best friendship app in India?", answer: "It depends on what you want. If you want to make real friends you actually meet (for games, sports, outings or trips) rather than chat online, SyncTrip is built for that: you join activities with people near you in cities like Gurgaon, Delhi and Chandigarh." },
  { question: "Is SyncTrip a dating app?", answer: "No. SyncTrip is for friendships and plans: board-game nights, sports, cafés, nights out, rides and trips. You join a plan because of the activity, in a group." },
  { question: "Is SyncTrip free?", answer: "Yes. Downloading SyncTrip and joining or creating plans is free. Some club events, like hosted board-game nights, have a ticket price shown on the event." },
  { question: "How do I make friends in a new city?", answer: "Do things with people regularly: a weekly game night, a sports group, a running club. On SyncTrip you can join those plans from day one, even if you don't know anyone yet. Many people come alone." },
  { question: "Is it safe to meet people from a friendship app?", answer: "Meet in public venues, keep coordination in the plan chat, tell a friend where you're going and arrange your own ride. On SyncTrip you can see who has joined a plan before you go and report anything that doesn't feel right." },
  { question: "Is SyncTrip a good Bumble BFF alternative?", answer: "If you'd rather meet people through activities than one-on-one chats, yes. SyncTrip is built around group plans (games, sports, outings and trips), so you meet several people at once at a real venue." },
];

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${URL}#page`,
        url: URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en-IN",
        isPartOf: { "@type": "WebSite", name: "SyncTrip", url: "https://synctrip.in" },
        about: { "@id": `${URL}#app` },
      },
      {
        "@type": "MobileApplication",
        "@id": `${URL}#app`,
        name: "SyncTrip: Meet People & Plans",
        operatingSystem: "Android, iOS",
        applicationCategory: "SocialNetworkingApplication",
        description: DESCRIPTION,
        offers: { "@type": "Offer", price: 0, priceCurrency: "INR" },
        downloadUrl: [APP_LINKS.PLAY_STORE, APP_LINKS.APP_STORE],
        publisher: { "@type": "Organization", name: "SyncTrip", url: "https://synctrip.in" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://synctrip.in" },
          { "@type": "ListItem", position: 2, name: "Friendship app", item: URL },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${URL}#faq`,
        mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
      },
    ],
  };
}

export default async function FriendshipAppPage() {
  // Live plans from every guide city, merged so the page always shows real activity.
  const feeds = await Promise.all(CITY_GUIDES.map((c) => getCityFeed(c.citySlug, {}, 4)));
  const feed: GuideFeed = { events: feeds.flatMap((f) => f.events), plans: feeds.flatMap((f) => f.plans) };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      <div className={styles.page}>
        <GuideHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Friendship app" }]}
          kicker="Free on Android & iOS"
          title="The friendship app for making real friends offline"
          intro={[
            "SyncTrip is a free friendship app, but not the kind where you chat with strangers forever. You join real plans with people near you (board-game nights, badminton and pickleball, café meetups, nights out, rides and weekend trips) and meet them there.",
            "Not dating. No awkward one-on-ones. Just something to do and people to do it with.",
          ]}
          stats={[
            { icon: <Star size={15} aria-hidden />, label: "Rated 4.8 on Google Play (Oct 2026)" },
            { icon: <ShieldCheck size={15} aria-hidden />, label: "Friends, not dating" },
          ]}
          actions={
            <>
              <a className={styles.btnPrimary} href={APP_LINKS.PLAY_STORE} target="_blank" rel="noopener noreferrer">
                Get it on Android <ArrowRight size={16} aria-hidden />
              </a>
              <a className={styles.btnGhost} href={APP_LINKS.APP_STORE} target="_blank" rel="noopener noreferrer">
                Download for iPhone
              </a>
            </>
          }
        />

        <div className={styles.body}>
          <section className={styles.section} aria-labelledby="how-title">
            <div className={styles.sectionHead}>
              <div>
                <h2 id="how-title" className={styles.h2}>How SyncTrip works</h2>
                <p className={styles.sub}>Making friends as an adult is hard because nobody plans anything. SyncTrip fixes the planning part.</p>
              </div>
            </div>
            <div className={styles.tipGrid}>
              {STEPS.map((s, i) => (
                <div key={s.title} className={styles.tip}>
                  <span className={styles.tipNum}>{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </section>

          <HappeningRail
            feed={feed}
            cityName="your city"
            title="Plans people are joining this week"
            sub="Real club events and open plans from SyncTrip right now. Tap one to see it in the app."
            emptyTitle="New plans are posted every day"
          />

          <section className={styles.section} aria-labelledby="diff-title">
            <div className={styles.sectionHead}>
              <h2 id="diff-title" className={styles.h2}>Why it isn&apos;t another chat app</h2>
            </div>
            <div className={styles.areaGrid}>
              {DIFFERENCES.map((d) => (
                <div key={d.title} className={styles.area}>
                  <h3>{d.icon} {d.title}</h3>
                  <p>{d.text}</p>
                </div>
              ))}
            </div>
          </section>

          {CITY_GUIDES.map((city) => (
            <section key={city.citySlug} className={styles.section} aria-labelledby={`city-${city.citySlug}`}>
              <div className={styles.sectionHead}>
                <div>
                  <h2 id={`city-${city.citySlug}`} className={styles.h2}>Make friends in {city.cityName}</h2>
                  <p className={styles.sub}>Pick what you feel like doing; each guide lists places and the SyncTrip plans happening there.</p>
                </div>
                <Link href={`/city/${city.citySlug}`} className={styles.btnOutline}>
                  Everything in {city.cityName} <ArrowRight size={15} aria-hidden />
                </Link>
              </div>
              <div className={styles.relatedRow}>
                {city.activities.map((a) => (
                  <Link key={a.slug} href={`/city/${city.citySlug}/${a.slug}`} className={styles.relatedLink}>
                    <GuideIcon name={a.icon} size={16} /> {a.navLabel}
                  </Link>
                ))}
              </div>
            </section>
          ))}

          <GuideFaqList faqs={FAQS} title="Friendship app FAQs" />

          <AppCtaBand cityName="your city" />
        </div>
      </div>
    </>
  );
}
