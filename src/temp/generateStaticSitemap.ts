import fs from 'fs/promises';
import path from 'path';
import { ApiService, CommonServices, TripsApiService } from '../utils';
import { Location, Trip } from '@/types';
import { API_CONFIG, LocationField } from '@/constants';

// Type for sitemap entry
interface SitemapEntry {
    url: string;
    lastModified: Date;
    priority: number;
}


// Helper function to generate URL entries
const generateSitemapEntry = (url: string, lastModified: Date, priority: number): SitemapEntry => ({
    url,
    lastModified,
    priority,
});

// Generate XML content from sitemap entries
const generateSitemapXml = (entries: SitemapEntry[]): string => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
            .map(
                (entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
            )
            .join('')}
</urlset>`;
    return xml;
};

async function generateSitemap() {
    const baseUrl = 'https://synctrip.in';
    const currentDate = new Date();

    // Static pages
    const staticPages: SitemapEntry[] = [
        generateSitemapEntry(`${baseUrl}/`, currentDate, 1.0),
        generateSitemapEntry(`${baseUrl}/trips`, currentDate, 0.9),
    ];

    // Fetch all locations
    let locations: Location[] = [];
    try {

        const locationResponse = await ApiService.fetchLocations(0, 1000, ['id', 'title', 'placesToVisit', 'country']);
        // console.log('Fetched locations for sitemap:', locationResponse.locations.length);
        locations = locationResponse.locations as Location[] || [];
    } catch (error) {
        console.error('Error fetching locations for sitemap:', error);
    }

    // Generate location URLs
    const locationPages: SitemapEntry[] = locations.map((location) => {
        const uuid = location.id;
        const placesCount = location.placesToVisit?.length ?? 10;
        const country = location.country ?? 'India';
        const destination = location.title ?? 'Destination';
        const canonicalSlug = CommonServices.generateLocationSlug(uuid, destination, String(placesCount), country);

        return generateSitemapEntry(
            `${baseUrl}/location/${canonicalSlug}`,
            currentDate,
            0.9
        );
    });

    // Fetch all trips
    let trips: Trip[] = [];
    try {
        const tripResponse = await TripsApiService.fetchAllTrips();
        trips = tripResponse?.trips || [];
    } catch (error) {
        console.error('Error fetching trips for sitemap:', error);
    }

    // Generate trip URLs
    const tripPages: SitemapEntry[] = trips.map((trip) => {
        const title = trip.title || 'Best Trip';
        const expectedSlug = CommonServices.generateTripSlug(trip.id, title);
        return generateSitemapEntry(
            `${baseUrl}/trips/${expectedSlug}`,
            currentDate,
            0.9
        );
    });
    // console.log('Generated trip URLs for sitemap:', locationPages.length);
    // Combine all entries
    const allEntries: SitemapEntry[] = [...staticPages, ...locationPages, ...tripPages];

    // Generate XML
    const sitemapXml = generateSitemapXml(allEntries);
    // Write to public/sitemap.xml
    const outputPath = path.join('D:\\DOITBUNNYY\\NextJs\\synctrip-frontend\\public', 'sitemap.xml');
    try {
        await fs.writeFile(outputPath, sitemapXml);
        // console.log('✅ Static sitemap.xml generated successfully at public/sitemap.xml');
    } catch (error) {
        console.error('Error writing sitemap.xml:', error);
    }
}

export default generateSitemap;
