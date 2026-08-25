/**
 * Shapes returned by the public club endpoints.
 *
 * These mirror ClubService.shapeForClient, ClubEventService.shapeDetail and
 * MegaEventService.shapeForClient on the backend, but only the fields the
 * website is allowed to render. Anything person-level the API also sends
 * (attendeesSample, hosts[].whatsapp, leaders) is intentionally absent here so
 * a future edit cannot casually put it on a public page.
 */

export type GeoPoint = {
  lat?: number | null;
  lng?: number | null;
  googlePlaceId?: string | null;
};

export type ClubMedia = {
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string | null;
};

export type ClubScheduleSlot = {
  dayLabel: string;
  startTime?: string | null;
  endTime?: string | null;
  venueName?: string | null;
  venueAddress?: string | null;
  imageUrl?: string | null;
};

export type ClubOffering = {
  title: string;
  description?: string | null;
  icon?: string | null;
};

export type ClubFaq = {
  question: string;
  answer: string;
};

export type Club = {
  id: string;
  slug?: string | null;
  name: string;
  tagline?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  gallery?: ClubMedia[];
  categories?: string[];
  cityId?: string | null;
  locality?: string | null;
  address?: string | null;
  location?: GeoPoint | null;
  isVerified?: boolean;
  contact?: {
    instagram?: string | null;
    website?: string | null;
  };
  stats?: {
    followerCount?: number;
    eventsHosted?: number;
    avgRating?: number | null;
    ratingCount?: number;
  };
  recurringSchedule?: ClubScheduleSlot[];
  whatWeDo?: ClubOffering[];
  perks?: string[];
  faqs?: ClubFaq[];
};

export type ClubEventVenue = {
  name?: string | null;
  address?: string | null;
  locality?: string | null;
  cityId?: string | null;
  location?: GeoPoint | null;
};

export type ClubEvent = {
  id: string;
  clubId: string;
  club?: {
    name?: string | null;
    logoUrl?: string | null;
    isVerified?: boolean;
  };
  title: string;
  subtitle?: string | null;
  description?: string | null;
  media?: ClubMedia[];
  coverImageUrl?: string | null;
  category?: string | null;
  tags?: string[];
  venue?: ClubEventVenue | null;
  startsAt: string;
  endsAt?: string | null;
  doorsOpenAt?: string | null;
  pricing?: {
    isFree?: boolean;
    ticketPrice?: number;
    currency?: string;
    maxSeatsPerBooking?: number;
  };
  capacity?: number;
  seatsLeft?: number;
  isFillingFast?: boolean;
  status?: "draft" | "published" | "completed" | "cancelled" | string;
  whatToExpect?: string[];
  whatsIncluded?: string[];
  rules?: string[];
  ageMin?: number | null;
  languages?: string[];
  rating?: number | null;
  cancellation?: {
    reason?: string | null;
    cancelledAt?: string | null;
    wasLate?: boolean;
  } | null;
};

export type MegaEvent = {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  image: string;
  organisedBy?: string | null;
  ctaLabel?: string | null;
  venueName?: string | null;
  venueLocation?: GeoPoint | null;
  startsAt: string;
  endsAt?: string | null;
  capacity?: number | null;
  registeredCount?: number;
};
