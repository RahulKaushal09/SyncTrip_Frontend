import { Metadata } from 'next';
import HomeContent from '@/components/Home/HomeContent';
import { ApiService } from '@/utils/api.utils';
import { Location } from '@/types';
import { LocationFields } from '@/constants';

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export const metadata: Metadata = {
  title: 'SyncTrip - Discover Amazing Travel Destinations | Plan Your Perfect Trip',
  description: 'Find and join trips near you. Explore curated travel destinations, connect with fellow travelers, and plan your perfect adventure with SyncTrip.',
  keywords: 'travel, destinations, trips, adventure, explore, tourism, vacation, travel planning, group travel',
  authors: [{ name: 'SyncTrip' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  openGraph: {
    title: 'SyncTrip - Discover Amazing Travel Destinations',
    description: 'Find and join trips near you. Explore curated travel destinations and connect with fellow travelers.',
    type: 'website',
    url: 'https://synctrip.in',
    siteName: 'SyncTrip',
    locale: 'en_US',
    images: [
      {
        url: 'https://synctrip.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SyncTrip - Travel Destinations'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@synctrip',
    creator: '@synctrip',
    title: 'SyncTrip - Discover Amazing Travel Destinations',
    description: 'Find and join trips near you. Explore curated travel destinations and connect with fellow travelers.',
    images: ['https://synctrip.in/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://synctrip.in',
  },
  other: {
    'theme-color': '#1976d2',
    'color-scheme': 'light',
  },
};

export default async function Home() {
  const fieldsToFetchForHome = [
    LocationFields.TITLE,
    LocationFields.RATING,
    LocationFields.IMAGES,
    LocationFields.BEST_TIME,
    LocationFields.PLACES_NUMBER_TO_VISIT,
    LocationFields.ID,
  ];
  const initialLocations: Location[] = (await ApiService.fetchLocations(0, 20, fieldsToFetchForHome)).locations;
  // const initialLocations: Location[] = (await ApiService.fetchLocations(0, 12)).locations; // SSR
  const homeJsonLd = {
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

  const locationsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Popular Travel Destinations',
    description: 'Curated list of amazing travel destinations',
    numberOfItems: initialLocations.length,
    itemListElement: initialLocations.map((location, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Place',
        name: location.title?.replace(/[0-9.]/g, '').trim(),
        description: location.description || 'Amazing destination for travel and adventure',
        image: Array.isArray(location.images) ? location.images[0] : undefined,
        aggregateRating: location.rating && typeof location.rating === 'number'
          ? {
            '@type': 'AggregateRating',
            ratingValue: location.rating,
            bestRating: 5,
            worstRating: 1
          }
          : undefined
      }
    }))
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(locationsJsonLd) }} />

      <HomeContent
        initialLocations={initialLocations}
        initialHasMore={initialLocations.length >= 12}
      />
    </>
  );
}
