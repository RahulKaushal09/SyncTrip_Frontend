// src/app/location/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ApiService } from '@/utils/api.utils';
import LocationPageDetails from '@/components/PageDetails/LocationPageDetails';
import { mapPreviousIdsWithNew } from '@/constants/mapPreviousIdsWithNew';
import { PlacesToVisit } from '@/types';
import { cache } from 'react';

interface Props {
    params: Promise<{ slug: string }>;
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};

// ✅ 30 day revalidation - location data never changes
export const revalidate = 2592000;

// ✅ new location slugs SSR on first hit, cached after
export const dynamicParams = true;

/**
 * One fetch per slug, shared by generateMetadata and LocationPage.
 *
 * Resolves BY SLUG, which is what these URLs actually are. It used to take the
 * uuid from `slug.split('_')[0]`, but the slugs stopped carrying a uuid when
 * they became "things-to-do-in-<place>" - so the lookup silently missed, every
 * page fell back to the literal word "Destination" for its title, and the
 * canonical was built out of that fallback and pointed at a URL that 404s.
 * Google drops a page whose canonical it cannot fetch: that was all 776
 * location pages telling the index to ignore them.
 *
 * Legacy "<uuid>_<words>" slugs still resolve through the id lookup below, so
 * older shared links keep working.
 */
const getLocation = cache(async (slug: string) => {
    try {
        const bySlug = await ApiService.fetchLocationBySlugServer(slug);
        if (bySlug) return bySlug;

        // Legacy slug shape: "<uuid>_<title>-<n>-places-to-visit-in-<country>".
        const [maybeUuid] = slug.split('_');
        if (!maybeUuid || maybeUuid === slug) return null;
        return await ApiService.fetchLocationByIdServer(mapPreviousIdsWithNew(maybeUuid)) ?? null;
    } catch {
        return null;
    }
});

// ✅ pre-build all location slugs at deploy time
export async function generateStaticParams() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
        const res = await fetch(`${baseUrl}/locations/slugs`, {

            cache: 'force-cache',
        });
        const slugs: string[] = await res.json();
        // console.log(`Pre-building ${slugs.length} location pages`);
        return slugs.map((slug) => ({ slug }));
    } catch (err) {
        console.error('generateStaticParams /location failed:', err);
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const location = await getLocation(slug); // ✅ cached, shared with the page
    if (!location) return { title: 'Destination not found | SyncTrip', robots: { index: false, follow: true } };

    const placesCount = location.placesToVisit?.length ?? 10;
    const destination = location.title;

    // No `?? 'Destination'` fallback anywhere in here. A page that cannot name
    // its own destination must not publish a title and canonical built out of
    // the placeholder - that is exactly how 776 pages ended up identical.
    if (!destination) return { robots: { index: false, follow: true } };

    const title = `Things to Do in ${destination} – Travel Guide & Trip Companions`;
    const description = `Plan your ${destination} trip with SyncTrip. Discover ${placesCount}+ attractions, find verified travel companions heading to ${destination}, and join India's traveler community. Free on Android & iOS.`;
    // The canonical is the URL being served. It used to be re-derived from the
    // title, which produced a slug no route matched.
    const canonicalURL = `https://synctrip.in/location/${slug}`;
    const ogImage = location.images?.[0] ?? 'https://synctrip.in/logo_1200.png';
    // India-first: a young domain cannot afford to spend its crawl budget on
    // Basel and Pigeon Forge. Non-India destinations stay reachable and keep
    // passing links, they just leave the index.
    const isIndia = (location.country ?? 'India').trim().toLowerCase() === 'india';

    return {
        title,
        description,
        keywords: [
            `${destination} travel guide`,
            `${destination} trip planner`,
            `things to do in ${destination}`,
            `${destination} attractions`,
            `best hotels ${destination}`,
            `${destination} itinerary`,
            `${destination} tours`,
            `group trips ${destination}`,
            `${destination} vacation`,
            `SyncTrip ${destination}`,
        ].join(", "),
        alternates: { canonical: canonicalURL },
        openGraph: {
            title,
            description,
            url: canonicalURL,
            siteName: 'SyncTrip',
            locale: 'en_IN',
            type: 'website',
            images: [{ url: ogImage, width: 1200, height: 630, alt: `${destination} – Travel Guide` }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
            site: '@synctrip44398',
            creator: '@synctrip44398',
        },
        robots: {
            index: isIndia,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    };
}

export default async function LocationPage({ params }: Props) {


    const { slug } = await params; // Await params
    const locationData = await getLocation(slug); // same cached fetch as generateMetadata

    if (!locationData) return notFound();

    // const expectedSlug = CommonServices.generateLocationSlug(
    //     uuid,
    //     locationData.title || 'Destination',
    //     locationData.placesNumberToVisit || "10",
    //     locationData.country || 'India'
    // );

    // const expectedSlug = CommonServices.generateLocationSlug(uuid, locationData.title || 'Destination', locationData.placesNumberToVisit || "10", locationData.country || 'India');

    // Redirect if slug is outdated or mismatched
    // if (slug !== expectedSlug) {
    //     redirect(`/location/${expectedSlug}`);
    // }

    const ldObjects: Record<string, unknown>[] = [];
    const ogImage =
        locationData.images?.[0] ??
        "https://via.placeholder.com/1200x630?text=SyncTrip";
    const canonicalURL = `https://synctrip.in/location/${slug}`;

    if (locationData.seo?.schema?.jsonld) {
        ldObjects.push({
            ...locationData.seo.schema.jsonld,
            url: canonicalURL,
            image: ogImage,
            geo: locationData.geo && {
                "@type": "GeoCoordinates",
                latitude: locationData.geo.coordinates[1],
                longitude: locationData.geo.coordinates[0]
            }
        });
    } else {
        ldObjects.push({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": locationData.title,
            "description": locationData.description,
            "url": canonicalURL,
            "image": ogImage,
            ...(locationData.geo && {
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": locationData.geo.coordinates[1],
                    "longitude": locationData.geo.coordinates[0]
                }
            })
        });
    }

    if (locationData.seo?.faq?.length) {
        ldObjects.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: locationData.seo.faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer }
            }))
        });
    }

    const placeIds = locationData?.placesToVisit || [];
    const placesToVisit = await ApiService.getPlacesByIds(placeIds as string[]);
    locationData.placesToVisit = placesToVisit.map(place => ({
        ...place,
        image: place.image
            ? place.image.map(img => decodeURIComponent(img))
            : ['https://via.placeholder.com/300x200?text=No+Image']
    })) as PlacesToVisit[];

    return (
        <>
            {ldObjects.map((obj, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
                />
            ))}
            {/* <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /> */}
            <LocationPageDetails locationData={locationData} uuid={locationData.id} />
        </>
    );
}