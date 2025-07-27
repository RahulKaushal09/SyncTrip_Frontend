import TripSection from '../../components/Trips/TripSection';
// import { tripListSchema } from '../../seoData/seoSchemas';
// import { metaTags } from '../../seoData/metaTags';
import '../../../styles/trips/Trip.css';
import { Trip } from '@/types';
import { TripsApiService } from './../../utils/trips.api.utils';
import { getAllTripsResponseSchema } from '@/classes/ApiResponse.classes';
import { Metadata } from 'next';


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

        return {
            title,
            description,
            keywords: 'travel packages, group tours, holiday packages, all-inclusive trips, best travel deals, affordable tours, adventure travel, family vacations, solo travel, group adventures',
            openGraph: {
                title,
                description,
                type: 'website',
                url: 'https://yourdomain.com/trips',
                siteName: 'YourTravelBrand',
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
        }
    } catch (error) {
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
    const totaltrips = tripsResponse.totalTrips || 0;
    return (
        <div className="trips-container">
            <TripSection
                trips={trips}
            />
        </div>
    );
};


export default TripsPage;
