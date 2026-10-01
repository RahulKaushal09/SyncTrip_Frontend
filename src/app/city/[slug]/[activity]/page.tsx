import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITY_GUIDES, MIN_INDEXABLE_VENUES, getActivityGuide } from "@/data/cityGuides";
import { getCityFeed, getCityVenues, venuesForGuide } from "@/lib/cityGuideApi";
import { ActivityGuideView } from "@/components/CityGuide/views";
import { activityJsonLd } from "@/components/CityGuide/jsonLd";

/**
 * /city/:city/:activity: "plan it with people" activity guides (e.g. /city/chandigarh/fun-activities).
 *
 * Venues come from the `venues` collection (SyncTrip_Panel → Venues), events and
 * open plans from the live feed. Pages with too few venues render but stay
 * noindex so a thin page never reaches Google.
 */

export const revalidate = 1800;
export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string; activity: string }> };

export function generateStaticParams() {
  return CITY_GUIDES.flatMap((city) => city.activities.map((a) => ({ slug: city.citySlug, activity: a.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, activity } = await params;
  const found = getActivityGuide(slug, activity);
  if (!found) return { title: "Not found", robots: { index: false, follow: true } };
  const { city, activity: guide } = found;

  const venues = venuesForGuide(await getCityVenues(city.citySlug), guide);
  const indexable = venues.length >= MIN_INDEXABLE_VENUES;
  const canonical = `https://synctrip.in/city/${city.citySlug}/${guide.slug}`;
  const image = `https://synctrip.in${guide.image?.src || city.image.src}`;

  return {
    title: guide.seoTitle,
    description: guide.seoDescription,
    keywords: guide.keywords.join(", "),
    alternates: { canonical },
    openGraph: {
      title: guide.seoTitle,
      description: guide.seoDescription,
      url: canonical,
      siteName: "SyncTrip",
      locale: "en_IN",
      type: "website",
      images: [{ url: image, alt: guide.image?.alt || city.image.alt }],
    },
    twitter: { card: "summary_large_image", site: "@synctrip44398", title: guide.seoTitle, description: guide.seoDescription, images: [image] },
    robots: indexable
      ? { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" }
      : { index: false, follow: true },
  };
}

export default async function ActivityGuidePage({ params }: PageProps) {
  const { slug, activity } = await params;
  const found = getActivityGuide(slug, activity);
  if (!found) notFound();
  const { city, activity: guide } = found;

  const [all, feed] = await Promise.all([getCityVenues(city.citySlug), getCityFeed(city.citySlug, guide.feed, 8)]);
  const venues = venuesForGuide(all, guide);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(activityJsonLd(city, guide, venues, feed)) }}
      />
      <ActivityGuideView city={city} guide={guide} venues={venues} feed={feed} />
    </>
  );
}
