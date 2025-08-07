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

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { slug } = await params; // Await params
    let [uuid] = slug.split('_');
    if (uuid) {
        uuid = mapPreviousIdsWithNew(uuid);
    }
    // 2. Fetch dynamic data.
    const location = await ApiService.fetchLocationByIdServer(uuid);
    if (!location) return {};

    // 3. Derive dynamic counts.
    const placesCount = location.placesToVisit?.length ?? 10;
    const hotelsCount = location.hotels?.length ?? 5;
    const country = location.country ?? 'India';
    const destination = location.title ?? 'Destination';

    // 4. Generate reusable strings.
    const title = `${destination} Travel Guide: Top ${placesCount} Things to Do & Plan Your Trip with SyncTrip`;
    const description =
        `Explore ${destination} with SyncTrip! Discover ${placesCount}+ must-see attractions, ${hotelsCount}+ top hotels, and expert tips for your perfect ${destination} adventure. Book now!`;
    const canonicalSlug = CommonServices.generateLocationSlug(
        uuid, destination, String(placesCount), country
    );
    const canonicalURL = `https://synctrip.in/location/${canonicalSlug}`;
    const ogImage =
        location.images?.[0] ?? 'https://via.placeholder.com/1200x630?text=SyncTrip+Destination';

    return {
        title, // ≤60 chars
        description, // 120-155 chars
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
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${destination} – Travel Guide`,
                },
            ],
        },

        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
            site: '@synctrip_in',
            creator: '@synctrip_in',
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
//     const title = `${destination} Travel Guide & Trip Planner | Top ${placesCount} Things To Do`;
//     const description =
//         `Plan your ${destination} getaway. Explore ${placesCount}+ attractions, ${hotelsCount}+ hotels, group adventures & weather tips for stress-free travel.`;
//     const canonicalSlug = CommonServices.generateLocationSlug(
//         uuid, destination, String(placesCount), country
//     );
//     const canonicalURL = `https://synctrip.in/location/${canonicalSlug}`;
//     const ogImage =
//         location.images?.[0] ??
//         'https://via.placeholder.com/1200x630?text=SyncTrip+Destination';

//     return {
//         title, // ≤60 chars
//         description, // 120-155 chars
//         keywords: [
//             `${destination} trip planner`,
//             `top ${placesCount} places to visit`,
//             `best ${hotelsCount} hotels`,
//             `plan ${destination} trip`,
//             `best time to visit ${destination}`,
//             `${destination} itinerary`,
//             'group trips', 'SyncTrip', country + ' travel',
//         ].join(', '),

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
    const placesToVisit = await ApiService.getPlacesByIds(placeIds as string[]);
    locationData.placesToVisit = placesToVisit.map(place => ({
        ...place,
        image: place.image ? place.image.map(img => decodeURIComponent(img)) : ['https://via.placeholder.com/300x200?text=No+Image']
    })) as PlacesToVisit[];
    return (
        <>

            <LocationPageDetails locationData={locationData} uuid={uuid} />
        </>
    );
}
