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

/** A ticket type on a pass event: "Couple (M+F)", "Racer entry"… */
export type EventPass = {
  id: string;
  name: string;
  description: string | null;
  highlights: string[];
  price: number;
  /** People it admits - a Couple pass is 2. */
  admits: number;
  imageUrl: string | null;
  /** Larger copy to open full size. */
  imageFullUrl?: string | null;
  maxPerBooking: number | null;
  salesEndAt: string | null;
  remaining: number | null;
  state: "on_sale" | "sold_out" | "ended" | "unavailable";
};

export type EventQuestionType = "short_text" | "long_text" | "single_choice" | "multi_choice" | "yes_no" | "number";

export type EventQuestion = {
  id: string;
  label: string;
  helpText: string | null;
  type: EventQuestionType;
  options: string[];
  required: boolean;
  passIds: string[];
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
  /** Early bird / Regular / … ladder; null for a single fixed price. */
  tierInfo?: TicketTierInfo | null;
  /** Ready-to-show refund lines, worded by the backend like the app. */
  refundPolicyLines?: string[];
  /** Who runs it - name, role and photo only (never their number). */
  hosts?: { name: string; role?: string | null; avatarUrl?: string | null }[];
  /** Headcount only - no faces or names on a public page. */
  totalAttendees?: number;
  /** Pass events: ticket types. null/absent = one price per seat. */
  passes?: EventPass[] | null;
  /** Asked before booking (pass events). */
  questions?: EventQuestion[];
  /** Ask each person's name. */
  collectAttendeeNames?: boolean;
};

export type TicketTier = {
  id: string;
  label: string;
  price: number;
  untilSeatsSold?: number | null;
  endsAt?: string | null;
  state: "ended" | "current" | "upcoming";
  seatsLeft?: number | null;
};

export type TicketTierInfo = {
  tiers: TicketTier[];
  current: {
    index: number;
    label: string;
    price: number;
    seatsLeft?: number | null;
    endsAt?: string | null;
    nextPrice?: number | null;
    nextLabel?: string | null;
    isFirst?: boolean;
    isLast?: boolean;
  };
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
