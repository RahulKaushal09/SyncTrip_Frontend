/**
 * SEO meta tags and constants for better search engine optimization
 */

export const metaTags = {
    home: {
        title: 'SyncTrip - Discover Amazing Travel Destinations | Plan Your Perfect Trip',
        description: 'Find and join trips near you. Explore curated travel destinations, connect with fellow travelers, and plan your perfect adventure with SyncTrip.',
        keywords: 'travel, destinations, trips, adventure, explore, tourism, vacation, travel planning, group travel, synctrip'
    },
    explore: {
        title: 'Explore Destinations - SyncTrip',
        description: 'Discover amazing travel destinations around the world. Find perfect places for your next adventure.',
        keywords: 'explore destinations, travel places, tourist attractions, vacation spots'
    },
    search: {
        title: 'Search Travel Destinations - SyncTrip',
        description: 'Search and find the perfect travel destinations for your next trip.',
        keywords: 'search destinations, find travel places, trip search'
    }
};

export const seoSchemas = {
    website: {
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
    },
    organization: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'SyncTrip',
        url: 'https://synctrip.in',
        logo: 'https://synctrip.in/logo.png',
        description: 'Your trusted travel companion for discovering amazing destinations',
        foundingDate: '2024',
        founders: [{
            '@type': 'Person',
            name: 'SyncTrip Team'
        }]
    }
};