// pages/trips/[tripId].tsx

import { Location } from '@/types';
import { ApiService, CommonServices, TripsApiService } from '@/utils';
import { TripDetailsResponse } from '@/classes/ApiResponse.classes';
// import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import TripDetailsContentClient from '@/components/Trips/TripDetailsClient';
import { Metadata } from 'next';
// import { PageTypeEnum } from '@/constants';
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [uuid] = slug.split('_');
  const tripData = await TripsApiService.fetchTripById(uuid);
  if (!tripData) {
    return {
      title: 'Trip Not Found | SyncTrip',
      description: 'This trip is no longer available.',
      robots: { index: false, follow: false }
    };
  }

  const trip = tripData.trip;
  const { title: tripTitle, MainImageUrl, essentials: { price, duration, region, typeOfTrip, bestTime }, tripRating } = trip;
  const metaTitle = `${tripTitle} — ${duration}d | From ₹${price} | SyncTrip`;
  const metaDescription = `Book "${tripTitle}", a ${duration}-day ${typeOfTrip ?? 'trip'} in ${region || 'India'}. Starts at ₹${price}. Includes accommodation and meals (if listed). Limited seats — reserve now.`;

  const canonicalSlug = CommonServices.generateTripSlug(uuid, tripTitle || 'trip');
  const canonicalURL = `https://synctrip.in/trips/${canonicalSlug}`;
  const imageUrl = MainImageUrl ?? 'https://synctrip.in/logo_1200.png';

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [tripTitle, `${region} trips`, `${duration} day trip`, 'group tours', 'SyncTrip'].filter(Boolean).join(', '),
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalURL,
      type: 'website',
      siteName: 'SyncTrip',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${tripTitle} — SyncTrip` }],
      locale: 'en_IN',
    },
    twitter: { card: 'summary_large_image', title: metaTitle, description: metaDescription, images: [imageUrl] },
    alternates: { canonical: canonicalURL },
    robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' }
  };
}


// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//     const { slug } = await params; // Await params

//     const [uuid] = slug.split('_');

//     const tripData = await TripsApiService.fetchTripById(uuid);
//     if (!tripData) {
//         return {
//             title: 'Trip Not Found | YourTravelBrand',
//             description: 'Travel package no longer available.',
//             robots: { index: false, follow: false },
//         };
//     }
//     const trip = tripData.trip;
//     // Core fields
//     const {
//         title,
//         MainImageUrl,
//         essentials: {
//             price,
//             duration,
//             region,
//             season,
//             bestTime,
//             typeOfTrip,
//             availableSeats,
//         },
//         requirements,
//         tripRating,
//         include: { food, hotel, travel },
//     } = trip;

//     // Title
//     const metaTitle = `${title} – ${typeOfTrip ? typeOfTrip + ' | ' : ''}${region ? region + ' | ' : ''}${duration} Days ₹${price}+ | SyncTrip`;

//     // Description (make it benefit-driven & keyword-rich)
//     const metaDescription = `Book the "${title}" group trip${typeOfTrip ? ' (' + typeOfTrip + ')' : ''} to ${region ? region + ', ' : ''}India. Experience ${duration} days${bestTime ? ' (' + bestTime + ')' : ''} for only ₹${price}. Includes${hotel ? ' hotel,' : ''}${food ? ' meals,' : ''}${travel ? ' travel' : ''}. Rated ${tripRating ?? 'highly'}. Limited seats – reserve now!`;

//     // Keywords (long-tail targeting)
//     const metaKeywords = [
//         `${title}`,
//         typeOfTrip,
//         region,
//         'group tours',
//         'adventure trips',
//         'all inclusive trips',
//         `${title} itinerary`,
//         `${region} travel packages`,
//         `best time to visit ${region}`,
//         'India tours',
//         'travel deals',
//     ]
//         .filter(Boolean)
//         .join(', ');

//     // OG/Twitter images
//     const imageUrl = MainImageUrl || '/images/default-og.jpg';
//     const expectedSlug = CommonServices.generateTripSlug(uuid, title || 'Best Trip');
//     const canonicalURL = `https://synctrip.in/trips/${expectedSlug}`;
//     return {
//         title: metaTitle,
//         description: metaDescription,
//         keywords: metaKeywords,
//         openGraph: {
//             title: metaTitle,
//             description: metaDescription,
//             type: 'website',
//             url: `https://synctrip.in/trips/${expectedSlug}`,
//             siteName: 'SyncTrip',
//             images: [
//                 {
//                     url: imageUrl,
//                     width: 1200,
//                     height: 630,
//                     alt: `${title} Trip`,
//                 },
//             ],
//             locale: 'en_IN',
//         },
//         twitter: {
//             card: 'summary_large_image',
//             title: metaTitle,
//             description: metaDescription,
//             images: [imageUrl],
//         },
//         robots: {
//             index: true,
//             follow: true,
//             'max-snippet': -1,
//             'max-image-preview': 'large',
//             'max-video-preview': -1,
//         },
//         // You CAN add canonical if you handle it in <head>
//         alternates: { canonical: canonicalURL },
//     };
// }

interface Props {
    params: Promise<{ slug: string }>; // Define params as a Promise
}


const TripsDetailsPage = async ({ params }: Props) => {

    const { slug } = await params; // Await params
    const [uuid] = slug.split('_');
    // const cookieStore = await cookies();
    // const tokenCookie = cookieStore.get('userToken');
    const tripsData: TripDetailsResponse = await TripsApiService.fetchTripById(uuid);
    if (!tripsData) return notFound();
    const expectedSlug = CommonServices.generateTripSlug(uuid, tripsData.trip.title || 'Best Trip');
    if (slug !== expectedSlug) {
        redirect(`/trips/${expectedSlug}`);
    }

    


    const LocationIdConnectedWith = tripsData.trip.locationId;
    const locationData: Location | null = await ApiService.fetchLocationByIdServer(LocationIdConnectedWith);
    if (!locationData) return notFound();
    const otherGoing = tripsData.appliedUsers || [];

    const canonicalURL = `https://synctrip.in/trips/${expectedSlug}`;
    const offerSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": tripsData.trip.title,
        "image": [tripsData.trip.MainImageUrl],
        "description": locationData?.description || tripsData.trip.title,
        "aggregateRating": locationData?.rating ? { "@type": "AggregateRating", "ratingValue": locationData.rating, "reviewCount": 150 } : undefined,
        "offers": {
            "@type": "Offer",
            "url": canonicalURL,
            "priceCurrency": "INR",
            "price": String(tripsData.trip.essentials.price),
            "availability": tripsData.trip.essentials.availableSeats > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut"
        }
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }} />
        <TripDetailsContentClient
            tripData={tripsData.trip}
            locationData={locationData}
            otherGoing={otherGoing}
        />
        </>
    );
};

export default TripsDetailsPage;