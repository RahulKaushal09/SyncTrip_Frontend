import TripSection from '../../components/Trips/TripSection';
// import { tripListSchema } from '../../seoData/seoSchemas';
// import { metaTags } from '../../seoData/metaTags';
import '../../../styles/trips/Trip.css';
import { Trip } from '@/types';
import { TripsApiService } from './../../utils/trips.api.utils';
import { getAllTripsResponseSchema } from '@/classes/ApiResponse.classes';
import { Metadata } from 'next';

// export async function generateMetadata(): Promise<Metadata> {
//   try {
//     const tripsResponse = await TripsApiService.fetchAllTrips();
//     const trips = tripsResponse.trips || [];
//     const totalTrips = trips.length;
//     const samplePrice = trips.length ? Math.min(...trips.map(t => t.essentials.price)) : null;
//     const title = totalTrips > 0
//       ? `${totalTrips} Handpicked Group Trips & Tour Packages — SyncTrip`
//       : 'Handpicked Group Trips & Tour Packages — SyncTrip';
//     const description = totalTrips > 0
//       ? `Discover ${totalTrips} curated group trips starting from ${samplePrice ? `₹${samplePrice}` : 'affordable prices'}. Book immersive group adventures with verified companions.`
//       : 'Discover curated group trips, itineraries and affordable tour packages on SyncTrip.';

//     return {
//       title,
//       description,
//       keywords: 'group trips, tour packages India, SyncTrip tours, travel packages, group adventures',
//       openGraph: {
//         title,
//         description,
//         url: 'https://synctrip.in/trips',
//         type: 'website',
//         siteName: 'SyncTrip',
//         locale: 'en_IN',
//         images: [
//           {
//             url: trips.length ? trips[0].MainImageUrl : 'https://synctrip.in/logo_1200.png',
//             width: 1200,
//             height: 630,
//             alt: 'SyncTrip - Group Trips'
//           }
//         ],
//       },
//       twitter: { card: 'summary_large_image', title, description, images: [trips.length ? trips[0].MainImageUrl : 'https://synctrip.in/logo_1200.png'] },
//       alternates: { canonical: 'https://synctrip.in/trips' },
//       robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' }
//     };
//   } catch {
//     return {
//       title: 'Handpicked Group Trips & Tour Packages — SyncTrip',
//       description: 'Discover curated group trips, itineraries and affordable tour packages on SyncTrip.'
//     };
//   }
// }
export async function generateMetadata(): Promise<Metadata> {
    try {
        const tripsResponse: getAllTripsResponseSchema = await TripsApiService.fetchAllTrips();
        const trips: Trip[] = tripsResponse.trips || [];
        // Calculate key metrics for dynamic content
        const totalTrips = trips.length
        const destinations = [...new Set(trips.map(trip => trip.title.split(' ')[0]))].slice(0, 3)

        // Create dynamic title based on available trips
        const title = totalTrips > 0
            ? `${totalTrips} Amazing Travel Packages & Group Tours - Starting ₹${Math.min(...trips.map(t => t.essentials.price))}+ | YourTravelBrand`
            : 'Best Travel Packages & Group Tours 2025 | YourTravelBrand'

        // Create compelling meta description with key selling points
        const description = totalTrips > 0
            ? `Discover ${totalTrips} handpicked travel packages starting from ₹${Math.min(...trips.map(t => t.essentials.price))}. ${destinations.join(', ')} tours with accommodation, meals & transport included. Book your adventure today!`
            : 'Explore amazing travel packages and group tours with all-inclusive deals. Book your perfect getaway with accommodation, meals & transport included. Best prices guaranteed!'
        const canonicalURL = 'https://synctrip.in/trips';
        return {
            title,
            description,
            keywords: 'travel packages, group tours, holiday packages, all-inclusive trips, best travel deals, affordable tours, adventure travel, family vacations, solo travel, group adventures',
            openGraph: {
                title,
                description,
                type: 'website',
                url: 'https://synctrip.in/trips',
                siteName: 'SyncTrip',
                images: [
                    {
                        url: trips.length > 0 ? trips[0].MainImageUrl : '/images/default-travel-og.jpg',
                        width: 1200,
                        height: 630,
                        alt: 'Best Travel Packages and Group Tours',
                        type: 'image/jpeg',
                    }
                ],
                locale: 'en_IN',
            },

            // Twitter Card optimization
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [trips.length > 0 ? trips[0].MainImageUrl : '/images/default-travel-twitter.jpg'],
            },

            // SEO robots configuration
            robots: {
                index: true,
                follow: true,
                'max-snippet': -1,
                'max-image-preview': 'large',
                'max-video-preview': -1,
            },
            alternates: { canonical: canonicalURL },
        }
    } catch (error: unknown) {
        // Fallback metadata for error scenarios
        return {
            title: 'Best Travel Packages & Group Tours 2025 | YourTravelBrand',
            description: 'Discover amazing travel packages and group tours with all-inclusive deals.',
        }
    }
}


const TripsPage = async ({ }) => {
    let trips: Trip[] = [];
    const tripsResponse: getAllTripsResponseSchema = await TripsApiService.fetchAllTrips();
    trips = tripsResponse.trips || [];
    // const totaltrips = tripsResponse.totalTrips || 0;
    return (
        <div className="trips-container ">
            <TripSection
                trips={trips}
            />
        </div>
    );
};


export default TripsPage;
