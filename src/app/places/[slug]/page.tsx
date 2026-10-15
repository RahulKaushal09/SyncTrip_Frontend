import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITY_GUIDES, getCityGuide } from "@/data/cityGuides";
import { feedAtVenue, getAllGuideVenues, getCityFeed, venuesForGuide, type GuideVenue } from "@/lib/cityGuideApi";
import VenueDetail from "@/components/CityGuide/VenueDetail";

/**
 * /places/<slug>: one page per venue in the `venues` collection (SyncTrip_Panel →
 * Venues). Targets venue-name searches ("hopup zirakpur", "smaaash airia mall",
 * "mystery rooms chandigarh"), which together are ~55k searches/month in India.
 */

export const revalidate = 1800;
export const dynamicParams = true;

type PageProps = { params: Promise<{ slug: string }> };

const CITY_SLUGS = CITY_GUIDES.map((c) => c.citySlug);
const SITE = "https://synctrip.in";

async function findVenue(slug: string) {
  const all = await getAllGuideVenues(CITY_SLUGS);
  const hit = all.find((x) => x.venue.slug === slug);
  if (!hit) return null;
  const city = getCityGuide(hit.citySlug)!;
  const cityVenues = all.filter((x) => x.citySlug === hit.citySlug).map((x) => x.venue);
  // Guides that list this venue, primary (its own `pages` tag) first.
  const guides = city.activities
    .filter((g) => venuesForGuide([hit.venue], g).length > 0)
    .sort((a, b) => Number(hit.venue.pages.includes(b.slug)) - Number(hit.venue.pages.includes(a.slug)));
  const related = guides[0]
    ? venuesForGuide(cityVenues, guides[0]).filter((v) => v.slug !== slug).slice(0, 6)
    : [];
  return { city, venue: hit.venue, guides, related };
}

/**
 * Titles and descriptions written to match what people actually search (GSC, Oct 2026),
 * where that differs from our listing name: "mystery rooms cp", "smash2play", "kalagram
 * events today", "timezone dwarka", "go karting sector 38". Titles stay <= 49 chars.
 */
const VENUE_SEO: Record<string, { title: string; description?: string }> = {
  "mystery-rooms-connaught-place-delhi": { title: "Mystery Rooms CP: Escape Room, Connaught Place", description: "Mystery Rooms in CP (Connaught Place) runs live escape rooms for teams of 4–6: about an hour to crack the clues. Find a team to play with on SyncTrip." },
  "mystery-rooms-golf-course-road-gurugram": { title: "Mystery Rooms Golf Course Road: Escape Room" },
  "mystery-rooms-spectrum-mall-noida": { title: "Mystery Rooms Spectrum Mall Noida: Escape Room" },
  "mystery-rooms-rajouri-garden-delhi": { title: "Mystery Rooms Rajouri Garden: Escape Room" },
  "smash2play-saket-delhi": { title: "Smash2Play Saket: Badminton, Turf & Box Cricket", description: "Smash2Play in Saket, South Delhi, has badminton courts, a football turf and box cricket in one venue. Find players for your next game on SyncTrip." },
  "kalagram-chandigarh": { title: "Kalagram Chandigarh: Events, Fairs & Things to Do", description: "Kalagram, Chandigarh's crafts and culture complex near Manimajra, hosts fairs, exhibitions and festivals. See what's on and go with people from SyncTrip." },
  "timezone-vegas-mall-delhi": { title: "Timezone Vegas Mall Dwarka: Bowling & Arcade", description: "Timezone at Vegas Mall, Dwarka has bowling lanes, VR and dozens of arcade games. Fill a bowling lane with people from a SyncTrip plan." },
  "timezone-pacific-mall-delhi": { title: "Timezone Pacific Mall: Bowling & Arcade, Delhi" },
  "formula-11-karting-noida": { title: "Formula 11 Go Karting Noida, Sector 38A", description: "Formula 11 at Worlds of Wonder, Sector 38A, next to Gardens Galleria, is one of India's biggest go-karting tracks (700 m, 11 turns). Race with a group." },
  "skyjumper-trampoline-park-rohini-delhi": { title: "SkyJumper Trampoline Park Rohini, Delhi" },
};

function fitTitle(venue: GuideVenue) {
  if (VENUE_SEO[venue.slug]) return VENUE_SEO[venue.slug].title;
  const place = venue.area && !/day trips/i.test(venue.area) && !venue.name.toLowerCase().includes(venue.area.toLowerCase().split(" ")[0]) ? `, ${venue.area.split(" & ")[0]}` : "";
  const base = `${venue.name}${place}`;
  // Only promise timings/price when the page actually has them.
  const realHours = /\d/.test(venue.hours || "");
  const realPrice = /\d/.test(venue.priceNote || "");
  const full = realHours && realPrice ? `${base}: Timings, Price & Plans` : realHours ? `${base}: Timings & Plans` : realPrice ? `${base}: Price & Plans` : `${base}: Plans & Things to Do`;
  // The layout appends " | SyncTrip" (11 chars); keep the whole thing ≤ 60.
  return full.length <= 49 ? full : base.length <= 49 ? base : venue.name.slice(0, 49);
}

function fitDescription(text: string, max = 155) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,:;–-]+$/, "")}…`;
}

export async function generateStaticParams() {
  const all = await getAllGuideVenues(CITY_SLUGS);
  return all.map(({ venue }) => ({ slug: venue.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const found = await findVenue(slug);
  if (!found) return { title: "Place not found", robots: { index: false, follow: true } };
  const { venue } = found;
  const title = fitTitle(venue);
  const description = VENUE_SEO[venue.slug]?.description || fitDescription(venue.description || `${venue.name}, ${venue.locality}. Plans and events on SyncTrip.`);
  const canonical = `${SITE}/places/${venue.slug}`;
  const image = venue.photos[0]?.src || `${SITE}/og-home.png`;
  // A venue page is worth indexing once it has real copy.
  const indexable = (venue.description || "").split(/\s+/).length >= 25;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: "SyncTrip", locale: "en_IN", type: "website", images: [{ url: image, alt: venue.name }] },
    twitter: { card: "summary_large_image", site: "@synctrip44398", title, description, images: [image] },
    robots: indexable ? { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } : { index: false, follow: true },
  };
}

const SCHEMA_TYPE: [RegExp, string][] = [
  [/pickleball|badminton|padel|football|futsal|cricket/, "SportsActivityLocation"],
  [/nightlife|brewery/, "BarOrPub"],
  [/cafe|restaurant/, "CafeOrCoffeeShop"],
  [/bowling/, "BowlingAlley"],
  [/trampoline|go_karting|escape_room|paintball|laser_tag|arcade|vr|gaming|board_games/, "EntertainmentBusiness"],
  [/theatre|comedy|concerts/, "PerformingArtsTheater"],
  [/pottery|art/, "LocalBusiness"],
  [/trek|day_trip|hike|walks|running|cycling/, "TouristAttraction"],
];

export default async function VenuePage({ params }: PageProps) {
  const { slug } = await params;
  const found = await findVenue(slug);
  if (!found) notFound();
  const { city, venue, guides, related } = found;

  const cityFeed = await getCityFeed(city.citySlug, {}, 20);
  const feed = feedAtVenue(cityFeed, venue);
  const url = `${SITE}/places/${venue.slug}`;
  // Schema type follows the venue's main (first) activity.
  const type = SCHEMA_TYPE.find(([re]) => re.test(venue.activities[0] || ""))?.[1]
    || SCHEMA_TYPE.find(([re]) => re.test(venue.activities.join(" ")))?.[1] || "LocalBusiness";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}#place`,
        name: venue.name,
        description: venue.description,
        url,
        address: { "@type": "PostalAddress", streetAddress: venue.locality || undefined, addressLocality: venue.area || city.cityName, addressRegion: city.state.split("·").pop()?.trim(), addressCountry: "IN" },
        ...(venue.mapsUrl ? { hasMap: venue.mapsUrl } : {}),
        ...(venue.photos.length ? { image: venue.photos.map((p) => p.src) } : {}),
        ...(venue.priceNote ? { priceRange: venue.priceNote } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: `Things to do in ${city.cityName}`, item: `${SITE}/city/${city.citySlug}` },
          ...(guides[0] ? [{ "@type": "ListItem", position: 3, name: guides[0].navLabel, item: `${SITE}/city/${city.citySlug}/${guides[0].slug}` }] : []),
          { "@type": "ListItem", position: guides[0] ? 4 : 3, name: venue.name, item: url },
        ],
      },
      ...feed.events.map((e) => ({
        "@type": "Event",
        name: e.title,
        startDate: e.startsAt,
        endDate: e.endsAt,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        url: `${SITE}${e.url}`,
        location: { "@id": `${url}#place` },
        organizer: { "@type": "Organization", name: e.clubName || "SyncTrip", url: SITE },
        offers: { "@type": "Offer", price: e.isFree ? 0 : e.price, priceCurrency: "INR", availability: e.soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock", url: `${SITE}${e.url}` },
      })),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VenueDetail city={city} venue={venue} guides={guides} related={related} feed={feed} />
    </>
  );
}
