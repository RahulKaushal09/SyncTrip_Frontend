import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClubShareDetail from "@/components/Share/ClubShareDetail";
import { humanize } from "@/components/Share/shareFormat";
import { Club, ClubEvent } from "@/types";
import { ClubApiService } from "@/utils/club.api.utils";
import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  absoluteUrl,
  toOgImageUrl,
  toPreviewText,
} from "@/utils/og.utils";

/**
 * /share/club/:idOrSlug - the landing page for a shared club link.
 *
 * The app builds this URL in DeepLinks.club(), so on a phone with SyncTrip
 * installed the OS opens the app and this page is never seen. It exists for
 * everyone else: the link preview in the chat where it was pasted, the desktop
 * click, and the person who does not have the app yet.
 */

const APP_STORE_ID = "6761762665";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ idOrSlug: string }>;
};

function clubHeadline(club: Club): string {
  const category = humanize(club.categories?.[0]);
  const where = club.locality;
  if (category && where) return `${club.name} - ${category} club in ${where}`;
  if (category) return `${club.name} - ${category} club on SyncTrip`;
  if (where) return `${club.name} - club in ${where}`;
  return `${club.name} on SyncTrip`;
}

function clubDescription(club: Club): string {
  const fromClub = toPreviewText(club.tagline || club.description, 155);
  if (fromClub) return fromClub;
  const where = club.locality ? ` in ${club.locality}` : "";
  return `Follow ${club.name}${where} on SyncTrip - join the club chat room and get notified about upcoming club events and meetups.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { idOrSlug } = await params;
  const club = await ClubApiService.getClub(idOrSlug);

  if (!club) {
    return { title: "Club not found | SyncTrip", robots: { index: false, follow: true } };
  }

  const title = clubHeadline(club);
  const description = clubDescription(club);
  const canonical = absoluteUrl(`/share/club/${club.id}`);
  const image = toOgImageUrl(club.coverImageUrl || club.logoUrl);

  return {
    title,
    description,
    keywords: [
      club.name,
      ...(club.categories ?? []).map(humanize),
      club.locality ? `clubs in ${club.locality}` : "clubs near me",
      "club events",
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
      images: [{ url: image, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: club.name }],
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

function buildJsonLd(club: Club, events: ClubEvent[], canonical: string) {
  const address = club.locality || club.address
    ? {
      "@type": "PostalAddress",
      streetAddress: club.address || undefined,
      addressLocality: club.locality || undefined,
      addressCountry: "IN",
    }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${canonical}#club`,
        name: club.name,
        description: club.description || club.tagline || undefined,
        url: canonical,
        logo: club.logoUrl || undefined,
        image: toOgImageUrl(club.coverImageUrl || club.logoUrl),
        address,
        sameAs: [club.contact?.instagram, club.contact?.website].filter(Boolean),
        aggregateRating:
          typeof club.stats?.avgRating === "number" && (club.stats?.ratingCount ?? 0) >= 3
            ? {
              "@type": "AggregateRating",
              ratingValue: club.stats.avgRating,
              ratingCount: club.stats.ratingCount,
            }
            : undefined,
      },
      ...events.slice(0, 5).map((event) => ({
        "@type": "Event",
        name: event.title,
        startDate: event.startsAt,
        endDate: event.endsAt || undefined,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus:
          event.status === "cancelled"
            ? "https://schema.org/EventCancelled"
            : "https://schema.org/EventScheduled",
        url: absoluteUrl(`/share/club-event/${event.id}`),
        image: toOgImageUrl(event.coverImageUrl),
        organizer: { "@id": `${canonical}#club` },
        location: event.venue?.name
          ? {
            "@type": "Place",
            name: event.venue.name,
            address: {
              "@type": "PostalAddress",
              streetAddress: event.venue.address || undefined,
              addressLocality: event.venue.locality || club.locality || undefined,
              addressCountry: "IN",
            },
          }
          : undefined,
      })),
    ],
  };
}

export default async function ClubSharePage({ params }: PageProps) {
  const { idOrSlug } = await params;
  const club = await ClubApiService.getClub(idOrSlug);

  if (!club) notFound();

  const upcomingEvents = await ClubApiService.getClubUpcomingEvents(club.id, 6);
  const canonical = absoluteUrl(`/share/club/${club.id}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(club, upcomingEvents, canonical)) }}
      />
      <ClubShareDetail club={club} upcomingEvents={upcomingEvents} />
    </>
  );
}
