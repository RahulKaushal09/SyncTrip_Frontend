import TripPreviewClient from "@/components/Trips/TripPreviewClient";
import PlanPreviewClient from "@/components/Trips/PlanPreviewClient";
import { UserTripPreview, PlanPreview } from "@/types";
import { ApiService } from "@/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation"; // 👈 Import notFound for 404 handling

// ─── Types ───────────────────────────────────────────────────────────────────

type SeoData = {
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
};

type JsonLd = {
  "@context": string;
  "@graph": Array<Record<string, unknown>>;
};

type InviteType = "trip" | "sports" | "riders" | "outing" | "movies";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PLAN_TYPE_LABELS: Record<string, string> = {
  sports: "Sports Plan",
  riders: "Ride",
  outing: "Outing",
  movies: "Movie Plan",
};

const getTripIdFromSlug = (slug: string): string => {
  const parts = slug.split("_");
  return parts[parts.length - 1];
};

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getTripData(tripId: string): Promise<UserTripPreview | null> {
  try {
    return await ApiService.fetchTripPreviewById(tripId);
  } catch (error) {
    console.error("Failed to fetch trip data:", error);
    return null;
  }
}

async function getPlanData(type: InviteType, planId: string): Promise<PlanPreview | null> {
  const fetchers: Record<string, () => Promise<PlanPreview>> = {
    sports: () => ApiService.fetchSportPreviewById(planId),
    riders: () => ApiService.fetchRidePreviewById(planId),
    outing: () => ApiService.fetchHangoutPreviewById(planId),
    movies: () => ApiService.fetchMoviePreviewById(planId),
  };

  const fetcher = fetchers[type];
  if (!fetcher) return null;

  // 👈 Wrap in try/catch to handle the thrown errors from ApiService
  try {
    return await fetcher();
  } catch (error) {
    console.error(`Failed to fetch ${type} data:`, error);
    return null;
  }
}

// ─── JSON-LD builders ────────────────────────────────────────────────────────

function buildTripJsonLd(trip: UserTripPreview, seo: SeoData, slug: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "SyncTrip",
        url: "https://synctrip.in",
        logo: "https://synctrip.in/logo_main_withoutBG.png",
        foundingDate: "2025",
        description: "A collaborative travel planning platform letting groups synchronise trips, rides, sports and outings in real-time.",
      },
      {
        "@type": "TouristTrip",
        name: seo.seo_title || trip.tripName,
        description: seo.seo_description || trip.tripDescription,
        image: trip.tripImage,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/invite/trip/${slug}`,
        startDate: trip.startDate,
        endDate: trip.endDate,
        location: {
          "@type": "Place",
          name: trip.placeName || trip.locationName,
        },
      },
    ],
  };
}

function buildPlanJsonLd(plan: PlanPreview, type: string, seo: SeoData, slug: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "SyncTrip",
        url: "https://synctrip.in",
        logo: "https://synctrip.in/logo_main_withoutBG.png",
        foundingDate: "2025",
        description: "A collaborative travel planning platform letting groups synchronise trips, rides, sports and outings in real-time.",
      },
      {
        "@type": "SocialEvent",
        name: seo.seo_title || plan.title,
        description: seo.seo_description || plan.description,
        image: plan.image ?? "https://synctrip.in/logo_main_withoutBG.png",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${type}/${slug}`,
        startDate: plan.scheduleDate ?? undefined,
        location: plan.venueName || plan.locationName
          ? {
              "@type": "Place",
              name: plan.venueName || plan.locationName,
            }
          : undefined,
      },
    ],
  };
}

// ─── generateMetadata ────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}): Promise<Metadata> {
  const { type, slug } = await params;
  const id = getTripIdFromSlug(slug);

  if (type === "trip") {
    const trip = await getTripData(id);
    
    // 👈 Handle null trip gracefully for metadata
    if (!trip) {
      return { title: "Trip Not Found | SyncTrip" };
    }

    const seo: SeoData = (trip as UserTripPreview)?.seo || {};
    const title = seo.seo_title || `${trip.tripName} · ${trip.locationName}`;
    const description = seo.seo_description || trip.tripDescription;

    return {
      title,
      description,
      keywords: seo.seo_keywords || trip.interests?.join(", "),
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/invite/trip/${slug}`,
        images: trip.tripImage ? [{ url: trip.tripImage, alt: trip.tripName }] : undefined,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/invite/trip/${slug}`,
      },
    };
  }

  // Non-trip types
  const plan = await getPlanData(type as InviteType, id);
  
  // 👈 Handle null plan gracefully for metadata
  if (!plan) {
    return { title: "Plan Not Found | SyncTrip" };
  }

  const seo: SeoData = {
    seo_title: plan.title,
    seo_description: plan.description || `${PLAN_TYPE_LABELS[type] ?? type} on SyncTrip`,
  };
  const typeLabel = PLAN_TYPE_LABELS[type] ?? type;
  const title = seo.seo_title || `${plan.title} · ${typeLabel}`;
  const description = seo.seo_description || plan.description || `Join this ${typeLabel.toLowerCase()} on SyncTrip`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${type}/${slug}`,
      images: plan.image ? [{ url: plan.image, alt: plan.title }] : {url: "https://synctrip.in/logo_main_withoutBG.png", alt: plan.title},
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${type}/${slug}`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const InvitePage = async ({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) => {
  const { type, slug } = await params;
  const id = getTripIdFromSlug(slug);

  if (type === "trip") {
    const trip = await getTripData(id);
    
    // 👈 Redirects to the closest default Next.js 404 page (app/not-found.tsx)
    if (!trip) notFound();

    const seo: SeoData = (trip as UserTripPreview)?.seo || {};
    const jsonLd = buildTripJsonLd(trip, seo, slug);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <TripPreviewClient trip={trip} />
      </>
    );
  }

  // Non-trip plan types
  const plan = await getPlanData(type as InviteType, id);
  
  // 👈 Redirects to the closest default Next.js 404 page
  if (!plan) notFound();

  const seo: SeoData = {
    seo_title: plan.title,
    seo_description: plan.description || `${PLAN_TYPE_LABELS[type] ?? type} on SyncTrip`,
    seo_keywords: ["synctrip", "social planning", "collaborative planning", "trip planning", "ride sharing", "sports meetups", "movie plans", "hangouts"]
  };
  const jsonLd = buildPlanJsonLd(plan, type, seo, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlanPreviewClient plan={plan} type={type} />
    </>
  );
};

export default InvitePage;