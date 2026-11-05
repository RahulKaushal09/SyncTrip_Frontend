/**
 * Server-side data for the category subdomains (movies., hangouts., events., sports.).
 * Everything is fetched on the server, so the backend's CORS list doesn't matter,
 * and cached for 10 minutes. A failed call returns an empty list; pages render
 * their own empty state instead of erroring.
 */
const BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "https://synctrip.in/api";

/** Movies, hangouts and sports are open in Chandigarh Tricity only for now. */
export const CHANDIGARH_CITY_ID = "b536b222-3661-4c60-9695-f34c7a5519d4";

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (error) {
    console.error(`Hangouts API request failed: ${path}`, error);
    return null;
  }
}

export type Movie = { id: string; title: string; image: string };
export type Venue = { id: string; name: string; locality: string; activities: string[]; syncTripHosted: boolean };
export type City = { id: string; title: string };
export type ClubEvent = {
  id: string;
  title: string;
  subtitle?: string;
  coverImageUrl?: string;
  startsAt: string;
  category?: string;
  activity?: { slug: string; label: string; emoji?: string };
  venue?: { name?: string; locality?: string; cityId?: string };
  club?: { name?: string; logoUrl?: string };
  ticketPrice?: number;
  isFree?: boolean;
  hasPasses?: boolean;
  priceTier?: { label?: string } | null;
  seatsLeft?: number;
};
export type Club = {
  id: string;
  slug?: string;
  name: string;
  tagline?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  isVerified?: boolean;
  activity?: string | { label?: string };
  category?: string;
};

/** GET /movies/collections/active - the movies live in the app right now. */
export async function getActiveMovies(): Promise<Movie[]> {
  const data = await get<{ data?: { id: string; title: string; mainImage: string }[] }>("/movies/collections/active");
  return (data?.data || []).map((m) => ({ id: m.id, title: m.title, image: m.mainImage }));
}

/** GET /city-guide/chandigarh/venues - cafés, courts and turfs in the Chandigarh city guide. */
export async function getChandigarhVenues(): Promise<Venue[]> {
  const data = await get<{ venues?: Venue[] }>("/city-guide/chandigarh/venues");
  return data?.venues || [];
}

/** GET /app/getCitiesActiveZoneData - cities switched on in the app (CityModel.isActive). */
export async function getActiveCities(): Promise<City[]> {
  const data = await get<{ cities?: City[] }>("/app/getCitiesActiveZoneData");
  return (data?.cities || []).map((c) => ({ id: c.id, title: c.title }));
}

/** GET /club-events/feed - every upcoming public club event, soonest first. */
export async function getClubEvents(limit = 60, cityId?: string): Promise<ClubEvent[]> {
  const q = new URLSearchParams({ limit: String(limit) });
  if (cityId) q.set("cityId", cityId);
  const data = await get<{ events?: ClubEvent[] }>(`/club-events/feed?${q}`);
  return (data?.events || []).sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
}

/** GET /clubs/discovery/clubs - the public club directory. */
export async function getClubs(limit = 20): Promise<Club[]> {
  const data = await get<{ clubs?: Club[] }>(`/clubs/discovery/clubs?limit=${limit}`);
  return data?.clubs || [];
}

/** Portrait crop of a Gumlet poster. */
export const portrait = (url: string, w: number, h: number) => `${url.split("?")[0]}?w=${w}&h=${h}&q=75&fit=crop`;
