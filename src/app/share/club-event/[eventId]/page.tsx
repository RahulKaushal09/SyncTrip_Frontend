import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClubEventShareDetail from "@/components/Share/ClubEventShareDetail";
import { formatDate, formatPrice, humanize, isPast } from "@/components/Share/shareFormat";
import { ClubEvent } from "@/types";
import { ClubApiService } from "@/utils/club.api.utils";
import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  absoluteUrl,
  toOgImageUrl,
  toPreviewText,
} from "@/utils/og.utils";

/**
 * /share/club-event/:id - the landing page for a shared club event link.
 *
 * Built by DeepLinks.clubEvent() in the app. What matters most here is the
 * unfurled preview in whatever chat the link was pasted into: title, date,
 * venue and a 1200x630 image, because that card is what decides whether anyone
 * taps through.
 */

const APP_STORE_ID = "6761762665";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ eventId: string }>;
};

function eventImage(event: ClubEvent): string | null {
  return event.coverImageUrl || event.media?.find((m) => m.type === "image")?.url || null;
}

function eventTitle(event: ClubEvent): string {
  const when = formatDate(event.startsAt);
  const where = event.venue?.locality || event.venue?.name;
  const parts = [event.title];
  if (when) parts.push(when);
  if (where) parts.push(where);
  return parts.join(" · ");
}

function eventDescription(event: ClubEvent): string {
  const explicit = toPreviewText(event.subtitle || event.description, 150);
  if (explicit) return explicit;

  const bits = [
    event.club?.name ? `Hosted by ${event.club.name}` : null,
    formatDate(event.startsAt),
    event.venue?.name || event.venue?.locality,
    formatPrice(event.pricing?.isFree, event.pricing?.ticketPrice, event.pricing?.currency),
  ].filter(Boolean);

  return `${bits.join(" · ")}. Book your spot on SyncTrip.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await ClubApiService.getClubEvent(eventId);

  if (!event) {
    return { title: "Event not found | SyncTrip", robots: { index: false, follow: true } };
  }

  const title = eventTitle(event);
  const description = eventDescription(event);
  const canonical = absoluteUrl(`/share/club-event/${event.id}`);
  const image = toOgImageUrl(eventImage(event) || event.club?.logoUrl);

  // A cancelled event should still unfurl for whoever holds the link, but it is
  // not something to leave in the index competing with live listings.
  const isCancelled = event.status === "cancelled";

  return {
    title,
    description,
    keywords: [
      event.title,
      event.category ? `${humanize(event.category)} events` : null,
      event.venue?.locality ? `events in ${event.venue.locality}` : "events near me",
      event.club?.name,
      "club events",
      "SyncTrip",
    ].filter(Boolean) as string[],
    alternates: { canonical },
    robots: isCancelled ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "SyncTrip",
      locale: "en_IN",
      type: "website",
      images: [{ url: image, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    other: {
      // Apple's own "open the app if you have it, get it if you don't" banner -
      // the one thing on iOS that can tell the difference without guessing.
      "apple-itunes-app": `app-id=${APP_STORE_ID}`,
    },
  };
}

function buildJsonLd(event: ClubEvent, canonical: string) {
  const price = event.pricing?.isFree ? 0 : event.pricing?.ticketPrice ?? 0;
  const soldOut = typeof event.seatsLeft === "number" && event.seatsLeft <= 0;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description || event.subtitle || undefined,
    image: toOgImageUrl(eventImage(event)),
    url: canonical,
    startDate: event.startsAt,
    endDate: event.endsAt || undefined,
    doorTime: event.doorsOpenAt || undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus:
      event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    typicalAgeRange: typeof event.ageMin === "number" && event.ageMin > 0 ? `${event.ageMin}-` : undefined,
    inLanguage: event.languages?.length ? event.languages : undefined,
    organizer: event.club?.name
      ? {
        "@type": "Organization",
        name: event.club.name,
        url: absoluteUrl(`/share/club/${event.clubId}`),
      }
      : undefined,
    location: event.venue?.name || event.venue?.locality
      ? {
        "@type": "Place",
        name: event.venue?.name || event.venue?.locality,
        address: {
          "@type": "PostalAddress",
          streetAddress: event.venue?.address || undefined,
          addressLocality: event.venue?.locality || undefined,
          addressCountry: "IN",
        },
        geo: event.venue?.location?.lat && event.venue?.location?.lng
          ? {
            "@type": "GeoCoordinates",
            latitude: event.venue.location.lat,
            longitude: event.venue.location.lng,
          }
          : undefined,
      }
      : undefined,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: event.pricing?.currency || "INR",
      url: canonical,
      availability: soldOut
        ? "https://schema.org/SoldOut"
        : isPast(event.endsAt || event.startsAt)
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      validFrom: undefined,
    },
  };
}

export default async function ClubEventSharePage({ params }: PageProps) {
  const { eventId } = await params;
  const event = await ClubApiService.getClubEvent(eventId);

  if (!event) notFound();

  const canonical = absoluteUrl(`/share/club-event/${event.id}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(event, canonical)) }}
      />
      <ClubEventShareDetail event={event} />
    </>
  );
}
