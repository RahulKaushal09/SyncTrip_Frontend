import { API_CONFIG } from "@/constants/config";
import type { ActivityGuide, GuideFeedFilter } from "@/data/cityGuides";

/** Public venue shape returned by GET /api/city-guide/:city/venues */
export type GuideVenue = {
  id: string;
  slug: string;
  name: string;
  area: string;
  locality: string;
  activities: string[];
  pages: string[];
  description: string;
  priceNote: string;
  hours: string;
  bestFor: string[];
  photos: { src: string; alt: string; credit: string }[];
  syncTripHosted: boolean;
  featured: boolean;
  mapsUrl: string | null;
  plan: {
    locationId: string;
    venueName: string;
    googlePlaceId: string | null;
    category: "sports" | "outing";
    sportType: string | null;
    outingType: string | null;
  };
};

export type GuideEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  venueName: string;
  locality: string;
  clubName: string;
  activity: string;
  skillLevel: string;
  isFree: boolean;
  price: number;
  seatsLeft: number;
  soldOut: boolean;
  image: string | null;
  url: string;
};

export type GuidePlan = {
  id: string;
  type: "outing" | "sports";
  kind: string;
  title: string;
  date: string;
  time: string;
  venueName: string;
  spotsLeft: number;
  going: number;
  url: string;
};

export type GuideFeed = { events: GuideEvent[]; plans: GuidePlan[] };

const BASE = API_CONFIG.BACKEND_BASE_URL;

/** Venues change only when edited in the panel. */
const VENUES_REVALIDATE = 1800;
/** Events and plans fill up through the day. */
const FEED_REVALIDATE = 600;

/**
 * Throws on API failure at request/revalidation time, so Next.js keeps serving the
 * last good page instead of caching an empty (and therefore noindex) one. During
 * `next build` it returns [] so a backend blip can't fail a deploy.
 */
export async function getCityVenues(citySlug: string): Promise<GuideVenue[]> {
  const isBuild = process.env.NEXT_PHASE === "phase-production-build";
  try {
    const res = await fetch(`${BASE}/city-guide/${encodeURIComponent(citySlug)}/venues`, {
      next: { revalidate: VENUES_REVALIDATE, tags: [`city-guide-venues-${citySlug}`] },
    });
    if (!res.ok) throw new Error(`city-guide venues ${res.status}`);
    const data = await res.json();
    return Array.isArray(data?.venues) ? data.venues : [];
  } catch (err) {
    if (isBuild) return [];
    throw err;
  }
}

export async function getCityFeed(citySlug: string, filter: GuideFeedFilter = {}, limit = 8): Promise<GuideFeed> {
  const params = new URLSearchParams({ days: "21", limit: String(limit) });
  if (filter.activities?.length) params.set("activities", filter.activities.join(","));
  if (filter.sports?.length) params.set("sports", filter.sports.join(","));
  if (filter.outings?.length) params.set("outings", filter.outings.join(","));
  try {
    const res = await fetch(`${BASE}/city-guide/${encodeURIComponent(citySlug)}/feed?${params}`, {
      next: { revalidate: FEED_REVALIDATE },
    });
    if (!res.ok) return { events: [], plans: [] };
    const data = await res.json();
    return { events: data?.events || [], plans: data?.plans || [] };
  } catch {
    return { events: [], plans: [] };
  }
}

/** Venues for one activity page: tagged with the page, or sharing one of its activities. */
export function venuesForGuide(all: GuideVenue[], guide: ActivityGuide): GuideVenue[] {
  const pages = new Set(guide.venuePages);
  const acts = new Set(guide.venueActivities || []);
  const primary = all.filter((v) => v.pages.some((p) => pages.has(p)));
  const secondary = all.filter((v) => !primary.includes(v) && v.activities.some((a) => acts.has(a)));
  return [...primary, ...secondary];
}
