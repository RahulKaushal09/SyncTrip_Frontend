// src/app/page.tsx
import { Metadata } from 'next';
import HomeContent from '@/components/Home/HomeContent';
import { ApiService } from '@/utils/api.utils';
import { Events, ExplorePageData, Location } from '@/types';
import { LocationFields, locationsJsonLd, homeJsonLd } from '@/constants';
import HomeContentV2 from '@/components/Home/HomeContentV2';
import { LocationServices } from '@/utils/location.utils';
// import FestivalsEvents from '@/components/EventsForBooking/FestivalsEvents';
// import HomeClientSection from '@/components/Home/HomeClientSection';
// import ExploreNearby from '@/components/Explore/ExploreNearby';
// import { cookies } from 'next/headers';
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

// export const metadata: Metadata = {
//   title: "Explore India's Top Destinations — SyncTrip",
//   description: 'Explore curated destinations, city guides, festivals and group trips across India. Find itineraries, hotels and verified travel companions on SyncTrip.',
//   keywords: 'explore India, travel destinations India, curated trips, group trips, SyncTrip destinations',
//   authors: [{ name: 'SyncTrip' }],
//   robots: 'index, follow, max-snippet:-1, max-image-preview:large',
//   openGraph: {
//     title: "Explore India's Top Destinations — SyncTrip",
//     description: 'Explore curated destinations and group trips across India. Find itineraries, hotels and verified companions.',
//     url: 'https://synctrip.in/explore',
//     siteName: 'SyncTrip',
//     locale: 'en_IN',
//     type: 'website',
//     images: [
//       {
//         url: 'https://synctrip.in/logo_1200.png',
//         width: 1200,
//         height: 630,
//         alt: 'Explore destinations on SyncTrip',
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: "Explore India's Top Destinations — SyncTrip",
//     description: 'Find curated group trips, city guides and itineraries across India.',
//     creator: '@synctrip',
//     images: ['https://synctrip.in/logo_1200.png'],
//   },
//   alternates: { canonical: 'https://synctrip.in/explore' },
// };
// export const metadata: Metadata = {
//   title: 'Explore Travel Destinations in India | SyncTrip',
//   // description: 'Discover the best travel destinations in India with SyncTrip. Explore cities, hill stations, beaches, and cultural hotspots with itineraries, hotels, events, and travel guides.',
//   // keywords: 'travel destinations India, explore places to visit, hill stations, beaches, cultural trips, adventure travel, group trips, SyncTrip explore',
//   // authors: [{ name: 'SyncTrip' }],
//     description: 'Discover unique group trips & curated travel destinations with SyncTrip. Explore detailed itineraries, connect with fellow adventurers, and book your dream vacation today!',
//   keywords: 'group travel, adventure trips, curated destinations, travel planning, India tours, solo travel, budget travel, luxury travel, bespoke itineraries, SyncTrip',
//   authors: [{ name: 'SyncTrip' }],
//   robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
//   openGraph: {
//     title: 'Explore Amazing Travel Destinations in India | SyncTrip',
//     description: 'Plan your next trip with SyncTrip. Explore curated travel destinations across India including beaches, hill stations, cultural hotspots, and festivals.',
//     type: 'website',
//     url: 'https://synctrip.in/explore',
//     siteName: 'SyncTrip',
//     locale: 'en_US',
//     images: [
//       {
//         url: 'https://synctrip.in/logo_main_withoutBG.png',
//         width: 1200,
//         height: 630,
//         alt: 'SyncTrip Explore Destinations',
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     site: '@synctrip',
//     creator: '@synctrip',
//     title: 'Explore Travel Destinations in India | SyncTrip',
//     description: 'Find and join group trips, explore curated travel destinations, and discover events across India with SyncTrip.',
//     images: ['https://synctrip.in/logo_main_withoutBG.png'],
//   },
//   alternates: {
//     canonical: 'https://synctrip.in/explore',
//   },
//   other: {
//     'theme-color': '#1976d2',
//     'color-scheme': 'light',
//   },
// };
// export const metadata: Metadata = {
//   // TARGET: High-volume "Travel Buddy" + "Lead" intent
//   title: 'SyncTrip | Lead Your Own Trip & Find Verified Travel Buddies',

//   description: 'The DIY social travel platform. Don’t wait for a tour — create your own trip, host a solo traveler group, or find verified travel companions heading your way. Plan together, share costs, and travel safely.',

//   // TARGET: +9,900% Growth keywords: "Solo travel tips", "Verified", "Create"
//   keywords: 'find travel buddy India, solo traveler community, create travel groups, host a trip, verified travel companion, solo travel tips India, group trip coordination, SyncTrip',

//   authors: [{ name: 'SyncTrip Community' }],
//   robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',

//   openGraph: {
//     title: 'Stop Waiting for Tours. Start Leading Your Own Adventure | SyncTrip',
//     description: 'Host your trip or join verified solo traveler groups. Connect safely with people who share your vibe and destination.',
//     type: 'website',
//     url: 'https://synctrip.in', // Ensure this is the root if this is your homepage
//     siteName: 'SyncTrip',
//     locale: 'en_IN',
//     images: [
//       {
//         url: 'https://synctrip.in/logo_main_withoutBG.png',
//         width: 1200,
//         height: 630,
//         alt: 'SyncTrip - The DIY Travel Social Network',
//       },
//     ],
//   },

//   twitter: {
//     card: 'summary_large_image',
//     site: '@synctrips',
//     creator: '@synctrips',
//     title: 'SyncTrip | Find Your Crew & Lead Your Journey',
//     description: 'Create your own trips, find verified buddies, and plan together. The traveler is in the driver’s seat.',
//     images: ['https://synctrip.in/logo_main_withoutBG.png'],
//   },

//   alternates: {
//     canonical: 'https://synctrip.in', // Changed from /explore to root for Home Page
//   },

//   other: {
//     'theme-color': '#3ABEF5', // SyncTrip Primary Blue
//     'color-scheme': 'light',
//   },
// };
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


// const fieldsToFetchForHome = [
//   LocationFields.TITLE,
//   LocationFields.RATING,
//   LocationFields.IMAGES,
//   LocationFields.BEST_TIME,
//   LocationFields.PLACES_NUMBER_TO_VISIT,
//   LocationFields.ID,
// ];

// Set revalidation time for ISR (1 hour)
export const revalidate = 3600;

export default async function Home() {
  // Data fetching with error handling
  // const initialLocations: Location[] = [];
  // let initialEvents: Events[] = [];
  let initialLocations: Location[] = [];
  let initialTotal = 0;
  let initialExplorePageData: ExplorePageData | undefined;

  try {
    const [locationsResponse, explorePageData] = await Promise.all([
      LocationServices.searchLocationsForExploreSSR(
        { term: "", state: "" }, 1
      ),
      LocationServices.getDataForExplorePageSSR(),
    ]);
    initialLocations = locationsResponse.data || [];
    initialTotal = locationsResponse.total ?? initialLocations.length;
    initialExplorePageData = explorePageData;
  } catch (error) {
    console.error('Error fetching data for Home page:', error);
  }

  // try {

  // const cookieStore = await cookies();
  // const tokenCookie = cookieStore.get('userToken')?.value || '';
  // initialLocations = (await LocationServices.searchLocationsForExplore("")) || [];

  // const eventsData = await ApiService.getServerSidePropsForEvents();
  // initialEvents = eventsData.initialEvents || [];
  // initialLocation = eventsData.initialLocation || 'India';

  // } catch (error) {
  //   console.error('Error fetching data for Home page:', error);
  // }

  // const randomLocations = [...initialLocations]
  //   .sort(() => 0.5 - Math.random())
  //   .slice(0, 8);

  return (
    <>
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      {/* <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(locationsJsonLd(initialLocations.slice(0, 10))) }} /> */}
      {/* <ExploreNearby/> */}
      {/* <HomeContent
        initialLocations={initialLocations}
        initialHasMore={initialLocations.length >= 12}
      /> */}
      <HomeContentV2
        initialLocations={initialLocations}
        initialTotal={initialTotal}
        initialExplorePageData={initialExplorePageData}
      />
      {/* <div className="HomePage paddingSectionLeftRight"> */}
      {/* <FestivalsEvents
          initialEvents={initialEvents}
          initialLocation={initialLocation}
        /> */}
      {/* <HomeClientSection randomLocations={randomLocations} /> */}
      {/* </div> */}
    </>
  );
}