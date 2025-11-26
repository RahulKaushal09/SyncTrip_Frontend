// app/location/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
// import Head from 'next/head';
import { ApiService } from '@/utils/api.utils';
// import { locationDataSchema } from '@/constants'; // Make sure this is exported properly
import LocationPageDetails from '@/components/PageDetails/LocationPageDetails';
import { mapPreviousIdsWithNew } from '@/constants/mapPreviousIdsWithNew';
import { redirect } from 'next/navigation';
import { CommonServices } from '@/utils';
import { PlacesToVisit } from '@/types';
// import { cookies } from 'next/headers';

interface Props {
    params: Promise<{ slug: string }>; // Define params as a Promise
}
/* app/location/[slug]/page.tsx */

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    let [uuid] = slug.split("_");
    uuid = mapPreviousIdsWithNew(uuid);

    const location = await ApiService.fetchLocationByIdServer(uuid);
    if (!location) return {};

    const seo = location.seo || {};

    const destination = location.title || "Destination";
    const placesCount = location.placesToVisit?.length ?? 10;
    const hotelsCount = location.hotels?.length ?? 5;
    const country = location.country ?? "India";

    const canonicalSlug = CommonServices.generateLocationSlug(
        uuid, destination, String(placesCount), country
    );
    const canonicalURL = `https://synctrip.in/location/${canonicalSlug}`;

    // Dynamic OG Image
    const ogImage =
        location.images?.[0] ??
        "https://via.placeholder.com/1200x630?text=SyncTrip";

    /** Title + Description: prefer DB SEO over fallback */
    const title =
        seo.title ??
        `${destination} Travel Guide: Top ${placesCount} Things To Do | SyncTrip`;

    const description =
        seo.metaDescription ??
        `Plan your ${destination} trip: ${placesCount}+ attractions, ${hotelsCount}+ hotels and travel tips.`;

    const keywords =
        seo.keywords?.length
            ? seo.keywords.join(", ")
            : [
                `${destination} travel guide`,
                `${destination} itinerary`,
                `${destination} trip planner`,
                `things to do in ${destination}`,
                `SyncTrip ${destination}`,
            ].join(", ");

    // OG + Twitter use dynamic image + dynamic URL
    return {
        title,
        description,
        keywords,

        alternates: { canonical: canonicalURL },

        openGraph: {
            title: seo.og?.title ?? title,
            description: seo.og?.description ?? description,
            url: canonicalURL,
            type: "website",
            siteName: "SyncTrip",
            images: [{ url: ogImage, width: 1200, height: 630 }]
        },

        twitter: {
            card: "summary_large_image",
            title: seo.twitter?.title ?? title,
            description: seo.twitter?.description ?? description,
            images: [ogImage],
            site: "@synctrip_in",
            creator: "@synctrip_in"
        },

        robots: {
            index: true,
            follow: true,
            "max-image-preview": "large"
        }
    };
}


// export async function generateMetadata(
//     { params }: Props
// ): Promise<Metadata> {
//     const { slug } = await params; // Await params
//     let [uuid] = slug.split('_');
//     if (uuid) {
//         uuid = mapPreviousIdsWithNew(uuid);
//     }
//     // 2. Fetch dynamic data.
//     const location = await ApiService.fetchLocationByIdServer(uuid);
//     if (!location) return {};

//     // 3. Derive dynamic counts.
//     const placesCount = location.placesToVisit?.length ?? 10;
//     const hotelsCount = location.hotels?.length ?? 5;
//     const country = location.country ?? 'India';
//     const destination = location.title ?? 'Destination';

//     // 4. Generate reusable strings.
//     const title = `${destination} Travel Guide: Top ${placesCount} Things to Do & Plan Your Trip with SyncTrip`;
//     const description =
//         `Explore ${destination} with SyncTrip! Discover ${placesCount}+ must-see attractions, ${hotelsCount}+ top hotels, and expert tips for your perfect ${destination} adventure. Book now!`;
//     const canonicalSlug = CommonServices.generateLocationSlug(
//         uuid, destination, String(placesCount), country
//     );
//     const canonicalURL = `https://synctrip.in/location/${canonicalSlug}`;
//     const ogImage =
//         location.images?.[0] ?? 'https://via.placeholder.com/1200x630?text=SyncTrip+Destination';

//     return {
//         title, // ≤60 chars
//         description, // 120-155 chars
//         keywords: [
//             `${destination} travel guide`,
//             `${destination} trip planner`,
//             `things to do in ${destination}`,
//             `${destination} attractions`,
//             `best hotels ${destination}`,
//             `${destination} itinerary`,
//             `${destination} tours`,
//             `group trips ${destination}`,
//             `${destination} vacation`,
//             `SyncTrip ${destination}`,
//         ].join(", "),

//         alternates: { canonical: canonicalURL },

//         openGraph: {
//             title,
//             description,
//             url: canonicalURL,
//             siteName: 'SyncTrip',
//             locale: 'en_IN',
//             type: 'website',
//             images: [
//                 {
//                     url: ogImage,
//                     width: 1200,
//                     height: 630,
//                     alt: `${destination} – Travel Guide`,
//                 },
//             ],
//         },

//         twitter: {
//             card: 'summary_large_image',
//             title,
//             description,
//             images: [ogImage],
//             site: '@synctrip_in',
//             creator: '@synctrip_in',
//         },

//         robots: {
//             index: true,
//             follow: true,
//             'max-snippet': -1,
//             'max-image-preview': 'large',
//             'max-video-preview': -1,
//         },

//     };
// }


export default async function LocationPage({ params }: Props) {


    const { slug } = await params; // Await params
    let [uuid] = slug.split('_');
    if (uuid) {
        uuid = mapPreviousIdsWithNew(uuid);
    }
    const locationData = await ApiService.fetchLocationByIdServer(uuid);


    if (!locationData) return notFound();
    const placeIds = locationData?.placesToVisit || [];
    // const token = '';
    // const cookieStore = await cookies();
    // const tokenCookie = cookieStore.get('userToken');


    const expectedSlug = CommonServices.generateLocationSlug(uuid, locationData.title || 'Destination', locationData.placesNumberToVisit || "10", locationData.country || 'India');

    // Redirect if slug is outdated or mismatched
    if (slug !== expectedSlug) {
        redirect(`/location/${expectedSlug}`);
    }




    const ldObjects: Record<string, unknown>[] = [];
    const ogImage =
        locationData.images?.[0] ??
        "https://via.placeholder.com/1200x630?text=SyncTrip";
    const canonicalURL = `https://synctrip.in/location/${expectedSlug}`;

    /* --------------------------------------------
       1) MAIN SCHEMA — DB schema OR FALLBACK
    -------------------------------------------- */

    if (locationData.seo?.schema?.jsonld) {
        // Use admin-provided schema, but attach dynamic SEO fields
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
        // Fallback schema if SEO schema is not present
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

    /* --------------------------------------------
       2) FAQ SCHEMA — only if DB contains FAQs
    -------------------------------------------- */

    if (locationData.seo?.faq?.length) {
        ldObjects.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: locationData.seo.faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: f.answer
                }
            }))
        });
    }


    const placesToVisit = await ApiService.getPlacesByIds(placeIds as string[]);
    locationData.placesToVisit = placesToVisit.map(place => ({
        ...place,
        image: place.image ? place.image.map(img => decodeURIComponent(img)) : ['https://via.placeholder.com/300x200?text=No+Image']
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
            <LocationPageDetails locationData={locationData} uuid={uuid} />
        </>
    );
}
