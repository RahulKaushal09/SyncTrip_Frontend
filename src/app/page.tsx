import { Metadata } from 'next';
import HomeContent from '@/components/Home/HomeContent';
import { ApiService } from '@/utils/api.utils';
import { Location } from '@/types';
import { LocationFields, locationsJsonLd, homeJsonLd } from '@/constants';
import Head from 'next/head';
import FestivalsEvents from '@/components/EventsForBooking/FestivalsEvents';
import TrendingSection from '@/components/Home/TrendingSection';
import TopDestinations from '@/components/Home/TopDestinations';
import SyncTripAppPushingSection from '@/components/AppPushingComponents/AppPushingSection';

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
  const { initialEvents, initialLocation } = await ApiService.getServerSidePropsForEvents();
  // const initialLocations: Location[] = (await ApiService.fetchLocations(0, 12)).locations; // SSR
  const randomLocations = initialLocations.sort(() => 0.5 - Math.random()).slice(0, 12); // Randomly select 4 locations for the top destinations
  return (
    <>
      <Head>
        {initialLocations[0]?.images?.[0] && (
          <link
            rel="preload"
            as="image"
            href={decodeURIComponent(initialLocations[0].images[0])}
          />
        )}
      </Head>
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      < script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(locationsJsonLd(initialLocations)) }} />

      <HomeContent
        initialLocations={initialLocations}
        initialHasMore={initialLocations.length >= 12}
      />
      <div className='HomePage'>
        <FestivalsEvents
          initialEvents={initialEvents}
          initialLocation={initialLocation}
        />
        <TrendingSection
        />
        <TopDestinations locations={randomLocations} />
        <SyncTripAppPushingSection />
      </div>
    </>
  );
}
