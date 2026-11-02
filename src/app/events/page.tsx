import type { Metadata } from "next";
import Link from "next/link";
import { ClubApiService, type EventCard } from "@/utils/club.api.utils";
import EventsNearby from "@/components/Events/EventsNearby";
import { CITIES, cityOf, type CityKey } from "@/components/Events/cities";
import styles from "@/components/Events/Events.module.css";

/**
 * /events - every upcoming SyncTrip club event, with a city filter and a
 * "Near me" sort, then what clubs have hosted recently and the clubs
 * themselves. Upcoming events are few at a time, so the recent events and the
 * club list keep the page useful in a quiet week.
 */

export const revalidate = 300;

const SITE = "https://synctrip.in";
const TITLE = "Events Near Me: Game Nights, Meetups & Club Events | SyncTrip";
const DESCRIPTION =
  "Upcoming board game nights, treks, tournaments and social meetups near you in Delhi, Gurgaon, Noida and Chandigarh. Hosted by verified clubs. Book on SyncTrip.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}/events` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE}/events`, siteName: "SyncTrip", locale: "en_IN", type: "website", images: [{ url: `${SITE}/og-home.png` }] },
  twitter: { card: "summary_large_image", site: "@synctrip44398", title: TITLE, description: DESCRIPTION, images: [`${SITE}/og-home.png`] },
  robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
};

const FAQS = [
  {
    question: "How do I find events near me?",
    answer:
      "Tap “Near me” at the top of this page to sort upcoming events by distance, or pick your city. Your location stays on your device and is only used to sort the list.",
  },
  {
    question: "Who hosts these events?",
    answer:
      "Clubs on SyncTrip: board game groups, running clubs, sports clubs and community organisers. Clubs are verified before their events go live.",
  },
  {
    question: "Can I go alone?",
    answer:
      "Yes. Most people at SyncTrip club events come on their own, and every event has a group chat in the app so you can say hello before you arrive.",
  },
  {
    question: "How do I book a ticket?",
    answer:
      "Open the event and book on the website or in the SyncTrip app. Your ticket and the event chat are in the app; free events only need you to reserve a spot.",
  },
];

function jsonLd(upcoming: EventCard[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Upcoming events on SyncTrip",
        itemListElement: upcoming.slice(0, 20).map((e, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Event",
            name: e.title,
            startDate: e.startsAt,
            url: `${SITE}/share/club-event/${e.id}`,
            image: e.imageUrl || undefined,
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: {
              "@type": "Place",
              name: e.venueName || e.locality || "Venue shared on booking",
              address: { "@type": "PostalAddress", addressLocality: e.locality || undefined, addressCountry: "IN" },
            },
            organizer: e.clubName ? { "@type": "Organization", name: e.clubName, url: `${SITE}/share/club/${e.clubId}` } : undefined,
            offers: {
              "@type": "Offer",
              price: e.isFree ? 0 : e.price,
              priceCurrency: "INR",
              url: `${SITE}/share/club-event/${e.id}`,
              availability: "https://schema.org/InStock",
            },
          },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Events", item: `${SITE}/events` },
        ],
      },
    ],
  };
}

export default async function EventsPage() {
  const [upcoming, clubs] = await Promise.all([ClubApiService.getUpcomingEventCards(), ClubApiService.getPublicClubs()]);
  const pastByClub = await Promise.all(clubs.map((c) => ClubApiService.getClubPastEvents(c.id, 8)));
  const past = pastByClub
    .flat()
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt))
    .slice(0, 24);

  // A club's city: where most of its events were, past or upcoming.
  const clubsWithCity = clubs.map((c, i) => {
    const counts = new Map<CityKey, number>();
    [...pastByClub[i], ...upcoming.filter((e) => e.clubId === c.id)].forEach((e) => {
      const city = cityOf(e);
      if (city) counts.set(city, (counts.get(city) ?? 0) + 1);
    });
    const city = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? cityOf({ lat: null, lng: null, locality: c.locality });
    const own = [...pastByClub[i], ...upcoming.filter((e) => e.clubId === c.id)];
    return {
      ...c,
      city,
      // No cover or tags on the club yet: borrow from its most recent event.
      coverImageUrl: c.coverImageUrl ?? own.find((e) => e.imageUrl)?.imageUrl ?? null,
      categories: c.categories.length ? c.categories : [...new Set(own.map((e) => e.category).filter((x): x is string => !!x))],
    };
  });

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(upcoming)) }} />
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link> <span aria-hidden>›</span> <span>Events</span>
          </nav>
          <span className={styles.kicker}>Delhi NCR · Chandigarh</span>
          <h1 className={styles.h1}>Events near you: game nights, meetups and club events</h1>
          <p className={styles.intro}>
            Board game nights, treks, tournaments and social meetups, hosted by clubs on SyncTrip. Pick your city or tap
            “Near me”, book a spot, and meet the group in the event chat before you go. Most people come alone.
          </p>
        </div>
      </header>

      <div className={styles.body}>
        <EventsNearby upcoming={upcoming} past={past} clubs={clubsWithCity} />

        <section className={styles.seo} aria-labelledby="by-city-title">
          <h2 id="by-city-title">Things to do this weekend, by city</h2>
          <p>
            Looking for more than club events? Our city guides list board game cafés, turfs, pickleball courts,
            trampoline parks and the best places to meet people in each city.
          </p>
          <div className={styles.cityLinks}>
            {(Object.keys(CITIES) as CityKey[]).map((k) => (
              <Link key={k} href={`/city/${k}/events-this-weekend`}>Events in {CITIES[k].name} this weekend</Link>
            ))}
            <Link href="/games">Social deduction &amp; party games</Link>
            <Link href="/for-clubs">Run a club? Host events on SyncTrip</Link>
          </div>
        </section>

        <section className={styles.seo} aria-labelledby="faq-title">
          <h2 id="faq-title">Questions about SyncTrip events</h2>
          <div className={styles.faq}>
            {FAQS.map((f) => (
              <details key={f.question}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
