
import { Location } from "@/types";
export const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SyncTrip',
    url: 'https://synctrip.in',
    description: 'Discover amazing travel destinations and plan your perfect trip',
    potentialAction: {
        '@type': 'SearchAction',
        target: 'https://synctrip.in/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
    },
    publisher: {
        '@type': 'Organization',
        name: 'SyncTrip',
        url: 'https://synctrip.in'
    }
};
export const locationsJsonLd = (locations: Location[] = []) => {
    const trimmedLocations = locations.slice(0, 6); // Limit to 6 for SEO-performance balance

    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Popular Travel Destinations",
        description: "Discover the best destinations to explore, curated list of amazing travel destinations.",
        numberOfItems: trimmedLocations.length,
        itemListElement: trimmedLocations.map((loc, index) => {
            const numericRating =
                typeof loc.rating === 'number'
                    ? loc.rating
                    : typeof loc.rating === 'string' && loc.rating.includes('/')
                        ? parseFloat(loc.rating.split('/')[0])
                        : undefined;

            return {
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "Place",
                    name: loc.title?.replace(/[0-9.]/g, '').trim() || `Destination ${index + 1}`,
                    url: `https://synctrip.in/location/${loc.id || index}`,
                    image: Array.isArray(loc.images) && loc.images.length > 0 ? decodeURIComponent(loc.images[0]) : undefined,
                    aggregateRating: numericRating ? {
                        "@type": "AggregateRating",
                        ratingValue: numericRating,
                        bestRating: 5,
                        worstRating: 1,
                        reviewCount: 1
                    } : undefined
                }
            };
        })
    };
};
