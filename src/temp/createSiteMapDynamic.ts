// import { MetadataRoute } from 'next';
// import { ApiService } from '@/utils/api.utils';
// import { Location, Trip } from '@/types';
// import { CommonServices, TripsApiService } from '@/utils';

// // Helper function to generate URL entries
// const generateSitemapEntry = (url: string, lastModified: Date, priority: number) => ({
//     url,
//     lastModified,
//     priority,
// });

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//     const baseUrl = 'https://synctrip.in';
//     const currentDate = new Date();

//     // Static pages
//     const staticPages = [
//         generateSitemapEntry(`${baseUrl}/`, new Date('2025-07-07'), 1.0),
//         generateSitemapEntry(`${baseUrl}/trips`, new Date('2025-07-07'), 0.9),
//     ];

//     // Fetch all locations
//     let locations: Location[] = [];
//     try {
//         locations = (await ApiService.fetchLocations(0, 1000, ['id', 'title', 'placesToVisit'])).locations || [];
//     } catch (error) {
//         console.error('Error fetching locations for sitemap:', error);
//     }

//     // Generate location URLs
//     const locationPages = locations.map((location) => {
//         const uuid = location.id;
//         const placesCount = location.placesToVisit?.length ?? 10;
//         const country = location.country ?? 'India';
//         const destination = location.title ?? 'Destination';
//         const canonicalSlug = CommonServices.generateLocationSlug(
//             uuid, destination, String(placesCount), country
//         );

//         generateSitemapEntry(
//             `${baseUrl}/location/${canonicalSlug}`,
//             currentDate,
//             0.9
//         )
//     });

//     // Fetch all trips (assuming ApiService.fetchTrips exists)
//     let trips: Trip[] = [];
//     try {
//         trips = ((await TripsApiService.fetchAllTrips()).trips) || [];
//     } catch (error) {
//         console.error('Error fetching trips for sitemap:', error);
//     }

//     // Generate trip URLs
//     const tripPages = trips.map((trip) => {
//         const title = trip.title || 'Best Trip';
//         const expectedSlug = CommonServices.generateTripSlug(trip.id, title);
//         return generateSitemapEntry(
//             `${baseUrl}/trips/${expectedSlug}`,
//             currentDate,
//             0.8
//         );
//     }
//     );

// }