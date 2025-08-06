// src/app/page.tsx
import { Metadata } from 'next';
import HomeContent from '@/components/Home/HomeContent';
import { ApiService } from '@/utils/api.utils';
import { Events, Location } from '@/types';
import { LocationFields, locationsJsonLd, homeJsonLd } from '@/constants';
import FestivalsEvents from '@/components/EventsForBooking/FestivalsEvents';
import HomeClientSection from '@/components/Home/HomeClientSection';
// import { cookies } from 'next/headers';
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};
export const metadata: Metadata = {
  title: 'SyncTrip: Plan Your Perfect Adventure | Group Trips & Curated Destinations',
  description: 'Discover unique group trips & curated travel destinations with SyncTrip. Explore detailed itineraries, connect with fellow adventurers, and book your dream vacation today!',
  keywords: 'group travel, adventure trips, curated destinations, travel planning, India tours, solo travel, budget travel, luxury travel, bespoke itineraries, SyncTrip',
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
      url: 'https://synctrip.in/logo_main_withoutBG.png',
      width: 1200,
      height: 630,
        alt: 'SyncTrip Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@synctrip',
    creator: '@synctrip',
    title: 'SyncTrip - Discover Amazing Travel Destinations',
    description: 'Find and join trips near you. Explore curated travel destinations and connect with fellow travelers.',
    images: ['https://synctrip.in/logo_main_withoutBG.png'],
  },
  alternates: {
    canonical: 'https://synctrip.in',
  },
  other: {
    'theme-color': '#1976d2',
    'color-scheme': 'light',
  },
};
// export const metadata: Metadata = {
//   title: 'SyncTrip - Discover Amazing Travel Destinations | Plan Your Perfect Trip',
//   description: 'Find and join trips near you. Explore curated travel destinations, connect with fellow travelers, and plan your perfect adventure with SyncTrip.',
//   keywords: 'travel, destinations, trips, adventure, explore, tourism, vacation, travel planning, group travel',
//   authors: [{ name: 'SyncTrip' }],
//   robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
//   openGraph: {
//     title: 'SyncTrip - Discover Amazing Travel Destinations',
//     description: 'Find and join trips near you. Explore curated travel destinations and connect with fellow travelers.',
//     type: 'website',
//     url: 'https://synctrip.in',
//     siteName: 'SyncTrip',
//     locale: 'en_US',
//     images: [
//       {
//       url: 'https://synctrip.in/logo_main_withoutBG.png',
//       width: 1200,
//       height: 630,
//         alt: 'SyncTrip Logo',
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     site: '@synctrip',
//     creator: '@synctrip',
//     title: 'SyncTrip - Discover Amazing Travel Destinations',
//     description: 'Find and join trips near you. Explore curated travel destinations and connect with fellow travelers.',
//     images: ['https://synctrip.in/logo_main_withoutBG.png'],
//   },
//   alternates: {
//     canonical: 'https://synctrip.in',
//   },
//   other: {
//     'theme-color': '#1976d2',
//     'color-scheme': 'light',
//   },
// };

const fieldsToFetchForHome = [
  LocationFields.TITLE,
  LocationFields.RATING,
  LocationFields.IMAGES,
  LocationFields.BEST_TIME,
  LocationFields.PLACES_NUMBER_TO_VISIT,
  LocationFields.ID,
];

// Set revalidation time for ISR (1 hour)
export const revalidate = 3600;

export default async function Home() {
  // Data fetching with error handling
  let initialLocations: Location[] = [];
  let initialEvents: Events[] = [];
  let initialLocation: string = 'India';

  try {

    // const cookieStore = await cookies();
    // const tokenCookie = cookieStore.get('userToken')?.value || '';
    initialLocations = (await ApiService.fetchLocations(0, 20, fieldsToFetchForHome)).locations || [];

    const eventsData = await ApiService.getServerSidePropsForEvents();
    initialEvents = eventsData.initialEvents || [];
    initialLocation = eventsData.initialLocation || 'India';

  } catch (error) {
    console.error('Error fetching data for Home page:', error);
  }

  const randomLocations = [...initialLocations]
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  return (
    <>
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(locationsJsonLd(initialLocations.slice(0, 10))) }} />

      <HomeContent
        initialLocations={initialLocations}
        initialHasMore={initialLocations.length >= 12}
      />
      <div className="HomePage">
        <FestivalsEvents
          initialEvents={initialEvents}
          initialLocation={initialLocation}
        />
        <HomeClientSection randomLocations={randomLocations} />
      </div>
    </>
  );
}