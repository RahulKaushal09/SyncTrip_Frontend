import { cache } from "react";
import { Club, ClubEvent, ClubMedia, MegaEvent } from "@/types";
import apiClient from "./apiClient";

/**
 * Public reads for the shared club / event pages.
 *
 * Two rules hold everywhere in this file:
 *
 * 1. No token is ever attached. These pages are rendered for whoever opened a
 *    shared link, so they must show exactly what a logged-out caller sees -
 *    sending an auth header would let viewer-specific state into a response
 *    that Next then caches for everyone.
 *
 * 2. Every response is passed through a whitelist before it leaves this file.
 *    The club APIs also return attendee samples, host phone numbers and the
 *    caller's own booking. Not rendering them is NOT enough: React serializes
 *    the props of the server component tree into the RSC payload embedded in
 *    the HTML, so an un-stripped field ships to the browser in plain text and
 *    is readable with View Source. Dropping it here is the only place that
 *    actually removes it.
 */

/**
 * Every read here goes through `apiClient`, the same axios instance the rest of
 * the app uses, so base URL, timeout and headers stay in one place.
 *
 * It MUST stay wrapped in try/catch. axios rejects on 4xx/5xx as well as on
 * network failure, and these are public pages reached by a shared link: a club
 * that was deleted, an event id someone mistyped, or a backend that is briefly
 * down all have to render notFound() or a degraded page — never an unhandled
 * AggregateError that turns into a 500 for whoever opened the link.
 *
 * Paths are relative: `apiClient` already carries the /api base URL, so passing
 * an absolute one here would only work by accident.
 */
async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await apiClient.get<T>(path);
    return res.data ?? null;
  } catch (error) {
    const status =
      typeof error === "object" && error !== null && "response" in error
        ? (error as { response?: { status?: number } }).response?.status
        : undefined;
    // A 404 is the normal "this link is dead" case and not worth a stack trace.
    if (status === 404) return null;
    console.error(`Club API request failed: ${path}`, status ?? error);
    return null;
  }
}

/** Untyped JSON straight off the wire - narrowed field by field by the pickers below. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Raw = Record<string, any>;

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v : null);
const num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined);
const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((item): item is string => typeof item === "string" && !!item.trim()) : [];

const pickGeo = (v: Raw | null | undefined) =>
  v && (num(v.lat) !== undefined || num(v.lng) !== undefined)
    ? { lat: num(v.lat) ?? null, lng: num(v.lng) ?? null }
    : null;

const pickMedia = (v: unknown): ClubMedia[] =>
  Array.isArray(v)
    ? v
      .filter((m): m is Raw => !!m && typeof m === "object" && typeof m.url === "string")
      .map((m) => ({
        type: m.type === "video" ? "video" : "image",
        url: m.url as string,
        thumbnailUrl: str(m.thumbnailUrl),
      }))
    : [];

/** Club profile, minus its leaders - no named people on a page anyone can open. */
function toPublicClub(raw: Raw | null | undefined): Club | null {
  if (!raw || typeof raw.id !== "string" || typeof raw.name !== "string") return null;

  return {
    id: raw.id,
    slug: str(raw.slug),
    name: raw.name,
    tagline: str(raw.tagline),
    description: str(raw.description),
    logoUrl: str(raw.logoUrl),
    coverImageUrl: str(raw.coverImageUrl),
    gallery: pickMedia(raw.gallery),
    categories: strList(raw.categories),
    cityId: str(raw.cityId),
    locality: str(raw.locality),
    address: str(raw.address),
    location: pickGeo(raw.location),
    isVerified: !!raw.isVerified,
    contact: {
      instagram: str(raw.contact?.instagram),
      website: str(raw.contact?.website),
    },
    stats: {
      followerCount: num(raw.stats?.followerCount) ?? 0,
      eventsHosted: num(raw.stats?.eventsHosted) ?? 0,
      avgRating: num(raw.stats?.avgRating) ?? null,
      ratingCount: num(raw.stats?.ratingCount) ?? 0,
    },
    recurringSchedule: Array.isArray(raw.recurringSchedule)
      ? raw.recurringSchedule
        .filter((slot: Raw) => !!slot && typeof slot.dayLabel === "string")
        .map((slot: Raw) => ({
          dayLabel: slot.dayLabel as string,
          startTime: str(slot.startTime),
          endTime: str(slot.endTime),
          venueName: str(slot.venueName),
          venueAddress: str(slot.venueAddress),
          imageUrl: str(slot.imageUrl),
        }))
      : [],
    whatWeDo: Array.isArray(raw.whatWeDo)
      ? raw.whatWeDo
        .filter((item: Raw) => !!item && typeof item.title === "string")
        .map((item: Raw) => ({
          title: item.title as string,
          description: str(item.description),
          icon: str(item.icon),
        }))
      : [],
    perks: strList(raw.perks),
    faqs: Array.isArray(raw.faqs)
      ? raw.faqs
        .filter((faq: Raw) => !!faq && typeof faq.question === "string" && typeof faq.answer === "string")
        .map((faq: Raw) => ({ question: faq.question as string, answer: faq.answer as string }))
      : [],
  };
}

/**
 * Club event, minus every person-level field the API sends: `attendeesSample`,
 * `totalAttendees`, `hosts` (which carries a host's WhatsApp number for
 * entitled callers), `myBooking` and the viewer flags.
 */
function toPublicClubEvent(raw: Raw | null | undefined): ClubEvent | null {
  if (!raw || typeof raw.id !== "string" || typeof raw.title !== "string") return null;

  return {
    id: raw.id,
    clubId: typeof raw.clubId === "string" ? raw.clubId : "",
    club: {
      name: str(raw.club?.name),
      logoUrl: str(raw.club?.logoUrl),
      isVerified: !!raw.club?.isVerified,
    },
    title: raw.title,
    subtitle: str(raw.subtitle),
    description: str(raw.description),
    media: pickMedia(raw.media),
    coverImageUrl: str(raw.coverImageUrl),
    category: str(raw.category),
    tags: strList(raw.tags),
    venue: raw.venue
      ? {
        name: str(raw.venue.name),
        address: str(raw.venue.address),
        locality: str(raw.venue.locality),
        cityId: str(raw.venue.cityId),
        location: pickGeo(raw.venue.location),
      }
      : null,
    startsAt: typeof raw.startsAt === "string" ? raw.startsAt : new Date(raw.startsAt ?? 0).toISOString(),
    endsAt: str(raw.endsAt),
    doorsOpenAt: str(raw.doorsOpenAt),
    pricing: {
      isFree: !!raw.pricing?.isFree,
      ticketPrice: num(raw.pricing?.ticketPrice) ?? 0,
      currency: str(raw.pricing?.currency) ?? "INR",
      maxSeatsPerBooking: num(raw.pricing?.maxSeatsPerBooking) ?? 4,
    },
    capacity: num(raw.capacity) ?? 0,
    seatsLeft: num(raw.seatsLeft) ?? 0,
    isFillingFast: !!raw.isFillingFast,
    status: str(raw.status) ?? "published",
    whatToExpect: strList(raw.whatToExpect),
    whatsIncluded: strList(raw.whatsIncluded),
    rules: strList(raw.rules),
    ageMin: num(raw.ageMin) ?? null,
    languages: strList(raw.languages),
    rating: num(raw.rating) ?? null,
    cancellation: raw.cancellation
      ? {
        reason: str(raw.cancellation.reason),
        cancelledAt: str(raw.cancellation.cancelledAt),
        wasLate: !!raw.cancellation.wasLate,
      }
      : null,
  };
}

/** Mega event, minus `attendeesSample` - the aggregate count is public, the faces are not. */
function toPublicMegaEvent(raw: Raw | null | undefined): MegaEvent | null {
  if (!raw || typeof raw.id !== "string" || typeof raw.title !== "string") return null;

  return {
    id: raw.id,
    title: raw.title,
    subtitle: str(raw.subtitle),
    description: str(raw.description),
    image: str(raw.image) ?? "",
    organisedBy: str(raw.organisedBy) ?? "SyncTrip",
    ctaLabel: str(raw.ctaLabel),
    venueName: str(raw.venueName),
    venueLocation: pickGeo(raw.venueLocation),
    startsAt: typeof raw.startsAt === "string" ? raw.startsAt : new Date(raw.startsAt ?? 0).toISOString(),
    endsAt: str(raw.endsAt),
    capacity: num(raw.capacity) ?? null,
    registeredCount: num(raw.registeredCount) ?? 0,
  };
}

/**
 * Each read is wrapped in React's `cache()`.
 *
 * generateMetadata and the page component both need the same record, and axios
 * — unlike `fetch` — is not deduplicated by Next. Without this every share page
 * would hit the backend twice per render.
 */

/** GET /clubs/:idOrSlug - accepts a uuid or a slug, so shared links resolve either way. */
const getClub = cache(async (idOrSlug: string): Promise<Club | null> => {
  const data = await getJson<{ club: Raw }>(`/clubs/${encodeURIComponent(idOrSlug)}`);
  return toPublicClub(data?.club);
});

/**
 * GET /clubs/:clubId/events?filter=upcoming
 *
 * Only the club's own next few events, for its own page. There is no all-clubs
 * or all-events listing on the website by design.
 */
const getClubUpcomingEvents = cache(async (clubId: string, limit = 6): Promise<ClubEvent[]> => {
  const data = await getJson<{ events: Raw[] }>(
    `/clubs/${encodeURIComponent(clubId)}/events?filter=upcoming&limit=${limit}`
  );
  return (data?.events ?? [])
    .map(toPublicClubEvent)
    .filter((event): event is ClubEvent => event !== null);
});

/** GET /club-events/:id */
const getClubEvent = cache(async (eventId: string): Promise<ClubEvent | null> => {
  const data = await getJson<{ event: Raw }>(`/club-events/${encodeURIComponent(eventId)}`);
  return toPublicClubEvent(data?.event);
});

/** GET /megaEvents/:id - note the camelCase mount path on the backend. */
const getMegaEvent = cache(async (eventId: string): Promise<MegaEvent | null> => {
  const data = await getJson<{ event: Raw }>(`/megaEvents/${encodeURIComponent(eventId)}`);
  return toPublicMegaEvent(data?.event);
});

export class ClubApiService {
  static getClub = getClub;
  static getClubUpcomingEvents = getClubUpcomingEvents;
  static getClubEvent = getClubEvent;
  static getMegaEvent = getMegaEvent;
}
