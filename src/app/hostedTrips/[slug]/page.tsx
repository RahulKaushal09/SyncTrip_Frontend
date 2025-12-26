// pages/trips/[tripId].tsx

import { HostedTrip, Location } from '@/types';
import { ApiService, CommonServices, TripsApiService } from '@/utils';
import { HostedTripDetailsResponse, TripDetailsResponse } from '@/classes/ApiResponse.classes';
// import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import TripDetailsContentClient from '@/components/Trips/TripDetailsClient';
import { Metadata } from 'next';
import { LocationFields } from '@/constants';



export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params; // Await params

    const [uuid] = slug.split('_');
    console.log('Generating metadata for trip UUID:', uuid);
    const tripData = await TripsApiService.fetchHostedTripById(uuid);
    if (!tripData) {
        return {
            title: 'Trip Not Found | YourTravelBrand',
            description: 'Travel package no longer available.',
            robots: { index: false, follow: false },
        };
    }
    const trip = tripData;
    // Core fields
    const {
        title,
        mainImageUrl: MainImageUrl,
        dates,
        locationId,
        locationName,
        price,
        id,
        inclusions: { food, hotel, travel },
    } = trip;
    const {startDate, endDate,availableSeats} = dates[0] || {};
    const duration = endDate && startDate ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 'N/A';
    // Title
    const metaTitle = `${title} – ${locationName ? locationName + ' | ' : ''}${duration} Days ₹${price}+ | SyncTrip`;

    // Description (make it benefit-driven & keyword-rich)
    const metaDescription = `Book the "${title}" group trip to ${locationName ? locationName + ', ' : ''}India. Experience ${duration} days for only ₹${price}. Includes${hotel ? ' hotel,' : ''}${food ? ' meals,' : ''}${travel ? ' travel' : ''}. Limited seats – reserve now!`;

    // Keywords (long-tail targeting)
    const metaKeywords = [
        `${title}`,
        locationName ? `${locationName} trips` : '',
        'group tours',
        'adventure trips',
        'all inclusive trips',
        `${title} itinerary`,
        `${locationName} travel packages`,
        `best time to visit ${locationName || 'India'}`,
        'India tours',
        'travel deals',
    ]
        .filter(Boolean)
        .join(', ');

    // OG/Twitter images
    const imageUrl = MainImageUrl || '/images/default-og.jpg';
    const expectedSlug = uuid +"_" + trip.slug;
    const canonicalURL = `https://synctrip.in/hostedTrips/${expectedSlug}`;
    return {
        title: metaTitle,
        description: metaDescription,
        keywords: metaKeywords,
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            type: 'website',
            url: `https://synctrip.in/hostedTrips/${expectedSlug}`,
            siteName: 'SyncTrip',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: `${title} Trip`,
                },
            ],
            locale: 'en_IN',
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: [imageUrl],
        },
        robots: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
        // You CAN add canonical if you handle it in <head>
        alternates: { canonical: canonicalURL },
    };
}

interface Props {
    params: Promise<{ slug: string }>; // Define params as a Promise
}


const TripsDetailsPage = async ({ params }: Props) => {

    const { slug } = await params; // Await params
    const [uuid] = slug.split('_');
    // const cookieStore = await cookies();
    // const tokenCookie = cookieStore.get('userToken');
    const tripsData: HostedTrip = await TripsApiService.fetchHostedTripById(uuid);
    if (!tripsData) return notFound();
    
    const expectedSlug = uuid +"_" + tripsData.slug;
    if (slug !== expectedSlug) {
        redirect(`/hostedTrips/${expectedSlug}`);
    }

    


    const LocationIdConnectedWith = tripsData.locationId;
    const locationData: Location | null = await ApiService.fetchLocationByIdServerWithSpecificFields(LocationIdConnectedWith,[LocationFields.BEST_TIME,LocationFields.TITLE,LocationFields.PLACES_TO_VISIT,LocationFields.DESCRIPTION,LocationFields.RATING,LocationFields.PLACES_NUMBER_TO_VISIT,LocationFields.IMAGES,LocationFields.PHOTOS,LocationFields.ID]);
    if (!locationData) return notFound();
    // const otherGoing = tripsData.appliedUsers || [];

    const canonicalURL = `https://synctrip.in/hostedTrips/${expectedSlug}`;
    const offerSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": tripsData.title,
        "image": [tripsData.mainImageUrl],
        "description": locationData?.description || tripsData.title,
        "aggregateRating": locationData?.rating ? { "@type": "AggregateRating", "ratingValue": locationData.rating, "reviewCount": 150 } : undefined,
        "offers": {
            "@type": "Offer",
            "url": canonicalURL,
            "priceCurrency": "INR",
            "price": String(tripsData.price),
            "availability": tripsData.dates[0].availableSeats > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut"
        }
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }} />
        <TripDetailsContentClient
            tripData={tripsData}
            locationData={locationData}
            // otherGoing={otherGoing}
            otherGoing={[]}
        />
        </>
    );
};

export default TripsDetailsPage;