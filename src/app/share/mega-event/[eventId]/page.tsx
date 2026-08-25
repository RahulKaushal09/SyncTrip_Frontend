import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MegaEventShareDetail from "@/components/Share/MegaEventShareDetail";
import { formatDate, isPast } from "@/components/Share/shareFormat";
import { MegaEvent } from "@/types";
import { ClubApiService } from "@/utils/club.api.utils";
import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  absoluteUrl,
  toOgImageUrl,
  toPreviewText,
} from "@/utils/og.utils";

/**
 * /share/mega-event/:id - the landing page for a shared mega event link.
 *
 * Built by DeepLinks.megaEvent() in the app. Mega events are image-first, so
 * the poster is the preview: it goes through the OG re-crop rather than being
 * handed to crawlers at the app's square dimensions.
 */

const APP_STORE_ID = "6761762665";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ eventId: string }>;
};

function eventTitle(event: MegaEvent): string {
  const when = formatDate(event.startsAt);
  const parts = [event.title];
  if (when) parts.push(when);
  if (event.venueName) parts.push(event.venueName);
  return parts.join(" · ");
}

function eventDescription(event: MegaEvent): string {
  const explicit = toPreviewText(event.subtitle || event.description, 150);
  if (explicit) return explicit;

  const bits = [
    event.organisedBy ? `By ${event.organisedBy}` : null,
    formatDate(event.startsAt),
    event.venueName,
  ].filter(Boolean);

  return `${bits.join(" · ")}. Register on SyncTrip and join the event chat.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await ClubApiService.getMegaEvent(eventId);

  if (!event) {
    return { title: "Event not found | SyncTrip", robots: { index: false, follow: true } };
  }

  const title = eventTitle(event);
  const description = eventDescription(event);
  const canonical = absoluteUrl(`/share/mega-event/${event.id}`);
  const image = toOgImageUrl(event.image);

  return {
    title,
    description,
    keywords: [
      event.title,
      event.venueName ? `events at ${event.venueName}` : "events near me",
      event.organisedBy,
      "mega events",
      "meetups",
      "SyncTrip",
    ].filter(Boolean) as string[],
    alternates: { canonical },
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

function buildJsonLd(event: MegaEvent, canonical: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description || event.subtitle || undefined,
    image: toOgImageUrl(event.image),
    url: canonical,
    startDate: event.startsAt,
    endDate: event.endsAt || undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    organizer: {
      "@type": "Organization",
      name: event.organisedBy || "SyncTrip",
      url: "https://synctrip.in",
    },
    location: event.venueName
      ? {
        "@type": "Place",
        name: event.venueName,
        address: { "@type": "PostalAddress", addressCountry: "IN" },
        geo: event.venueLocation?.lat && event.venueLocation?.lng
          ? {
            "@type": "GeoCoordinates",
            latitude: event.venueLocation.lat,
            longitude: event.venueLocation.lng,
          }
          : undefined,
      }
      : undefined,
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "INR",
      url: canonical,
      availability: isPast(event.endsAt || event.startsAt)
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
    },
  };
}

export default async function MegaEventSharePage({ params }: PageProps) {
  const { eventId } = await params;
  const event = await ClubApiService.getMegaEvent(eventId);

  if (!event) notFound();

  const canonical = absoluteUrl(`/share/mega-event/${event.id}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(event, canonical)) }}
      />
      <MegaEventShareDetail event={event} />
    </>
  );
}
