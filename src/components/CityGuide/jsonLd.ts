import type { ActivityGuide, CityGuide, GuideFaq } from "@/data/cityGuides";
import type { GuideFeed, GuideVenue } from "@/lib/cityGuideApi";

const SITE = "https://synctrip.in";

const SCHEMA_TYPE: [RegExp, string][] = [
  [/pickleball|badminton|padel|football|futsal|cricket|box_cricket/, "SportsActivityLocation"],
  [/nightlife|brewery/, "NightClub"],
  [/cafe|restaurant/, "CafeOrCoffeeShop"],
  [/bowling/, "BowlingAlley"],
  [/trampoline|go_karting|escape_room|paintball|laser_tag|arcade|vr|gaming/, "EntertainmentBusiness"],
  [/theatre|comedy|concerts/, "PerformingArtsTheater"],
  [/trek|day_trip|hike|walks|running/, "TouristAttraction"],
];

function venueType(v: GuideVenue) {
  const acts = v.activities.join(" ");
  return SCHEMA_TYPE.find(([re]) => re.test(acts))?.[1] || "LocalBusiness";
}

function faqNode(id: string, faqs: GuideFaq[]) {
  return {
    "@type": "FAQPage",
    "@id": `${id}#faq`,
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}

function eventNodes(feed: GuideFeed, cityName: string) {
  return feed.events.map((e) => ({
    "@type": "Event",
    name: e.title,
    startDate: e.startsAt,
    endDate: e.endsAt,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${SITE}${e.url}`,
    ...(e.image ? { image: [e.image] } : {}),
    location: {
      "@type": "Place",
      name: e.venueName || cityName,
      address: { "@type": "PostalAddress", addressLocality: e.locality || cityName, addressRegion: cityName, addressCountry: "IN" },
    },
    organizer: { "@type": "Organization", name: e.clubName || "SyncTrip", url: SITE },
    offers: {
      "@type": "Offer",
      price: e.isFree ? 0 : e.price,
      priceCurrency: "INR",
      availability: e.soldOut ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: `${SITE}${e.url}`,
    },
  }));
}

export function activityJsonLd(city: CityGuide, guide: ActivityGuide, venues: GuideVenue[], feed: GuideFeed) {
  const url = `${SITE}/city/${city.citySlug}/${guide.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        url,
        name: guide.h1,
        description: guide.seoDescription,
        inLanguage: "en-IN",
        isPartOf: { "@type": "WebSite", name: "SyncTrip", url: SITE },
        about: { "@type": "City", name: city.cityName },
        ...(guide.image ? { primaryImageOfPage: { "@type": "ImageObject", url: `${SITE}${guide.image.src}` } } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: `Things to do in ${city.cityName}`, item: `${SITE}/city/${city.citySlug}` },
          { "@type": "ListItem", position: 3, name: guide.navLabel, item: url },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${url}#places`,
        name: `${guide.venuesTitle} in ${city.cityName}`,
        numberOfItems: venues.length,
        itemListElement: venues.map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": venueType(v),
            name: v.name,
            ...(v.description ? { description: v.description } : {}),
            address: { "@type": "PostalAddress", streetAddress: v.locality || undefined, addressLocality: v.area || city.cityName, addressCountry: "IN" },
            ...(v.mapsUrl ? { hasMap: v.mapsUrl } : {}),
            ...(v.photos[0] ? { image: v.photos[0].src } : {}),
          },
        })),
      },
      ...eventNodes(feed, city.cityName),
      faqNode(url, guide.faqs),
    ],
  };
}

export function hubJsonLd(city: CityGuide, feed: GuideFeed) {
  const url = `${SITE}/city/${city.citySlug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        url,
        name: city.h1,
        description: city.seoDescription,
        inLanguage: "en-IN",
        isPartOf: { "@type": "WebSite", name: "SyncTrip", url: SITE },
        about: {
          "@type": "City",
          name: city.cityName,
          geo: { "@type": "GeoCoordinates", latitude: city.geo.lat, longitude: city.geo.lng },
        },
        primaryImageOfPage: { "@type": "ImageObject", url: `${SITE}${city.image.src}` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: `Things to do in ${city.cityName}`, item: url },
        ],
      },
      {
        "@type": "ItemList",
        name: `Things to do in ${city.cityName}`,
        itemListElement: city.activities.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.navLabel,
          url: `${url}/${a.slug}`,
        })),
      },
      ...eventNodes(feed, city.cityName),
      faqNode(url, city.faqs),
    ],
  };
}
