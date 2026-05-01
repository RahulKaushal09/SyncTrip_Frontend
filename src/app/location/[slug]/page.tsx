// src/app/location/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ApiService } from '@/utils/api.utils';
import LocationPageDetails from '@/components/PageDetails/LocationPageDetails';
import { mapPreviousIdsWithNew } from '@/constants/mapPreviousIdsWithNew';
import { redirect } from 'next/navigation';
import { CommonServices } from '@/utils';
import { PlacesToVisit } from '@/types';
import { cache } from 'react';

interface Props {
    params: Promise<{ slug: string }>;
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};

// ✅ 30 day revalidation — location data never changes
export const revalidate = 2592000;

// ✅ new location slugs SSR on first hit, cached after
export const dynamicParams = true;

// ✅ single fetch per slug, reused by generateMetadata + LocationPage
const getLocation = cache(async (uuid: string) => {
    try {
        return await ApiService.fetchLocationByIdServer(uuid) ?? null;
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
    let [uuid] = slug.split('_');
    if (uuid) uuid = mapPreviousIdsWithNew(uuid);

    const location = await getLocation(uuid); // ✅ cached
    if (!location) return {};

    const placesCount = location.placesToVisit?.length ?? 10;
    const hotelsCount = location.hotels?.length ?? 5;
    const country = location.country ?? 'India';
    const destination = location.title ?? 'Destination';

    const title = `Things to Do in ${destination} – Travel Guide & Trip Companions`;
    const description = `Plan your ${destination} trip with SyncTrip. Discover ${placesCount}+ attractions, find verified travel companions heading to ${destination}, and join India's 5,000+ traveler community. Free on Android & iOS.`;
    const canonicalSlug = CommonServices.generateLocationSlug(uuid, destination, String(placesCount), country);
    const canonicalURL = `https://synctrip.in/location/${canonicalSlug}`;
    const ogImage = location.images?.[0] ?? 'https://via.placeholder.com/1200x630?text=SyncTrip+Destination';

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
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    };
}

export default async function LocationPage({ params }: Props) {
<<<<<<< HEAD
    const { slug } = await params;
    let [uuid] = slug.split('_');
    if (uuid) uuid = mapPreviousIdsWithNew(uuid);

    const locationData = await getLocation(uuid); // ✅ cached, no second fetch
=======


    const { slug } = await params; // Await params
    const locationData = await ApiService.fetchLocationBySlugServer(slug);
>>>>>>> 939c4d1 (Location Slug based)

    if (!locationData) return notFound();

    const expectedSlug = CommonServices.generateLocationSlug(
        uuid,
        locationData.title || 'Destination',
        locationData.placesNumberToVisit || "10",
        locationData.country || 'India'
    );

<<<<<<< HEAD
    if (slug !== expectedSlug) {
        redirect(`/location/${expectedSlug}`);
    }
=======
    // const expectedSlug = CommonServices.generateLocationSlug(uuid, locationData.title || 'Destination', locationData.placesNumberToVisit || "10", locationData.country || 'India');

    // Redirect if slug is outdated or mismatched
    // if (slug !== expectedSlug) {
    //     redirect(`/location/${expectedSlug}`);
    // }
>>>>>>> 939c4d1 (Location Slug based)

    const ldObjects: Record<string, unknown>[] = [];
<<<<<<< HEAD
    const ogImage = locationData.images?.[0] ?? "https://via.placeholder.com/1200x630?text=SyncTrip";
    const canonicalURL = `https://synctrip.in/location/${expectedSlug}`;
=======
    const ogImage =
        locationData.images?.[0] ??
        "https://via.placeholder.com/1200x630?text=SyncTrip";
    const canonicalURL = `https://synctrip.in/location/${slug}`;
>>>>>>> 939c4d1 (Location Slug based)

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