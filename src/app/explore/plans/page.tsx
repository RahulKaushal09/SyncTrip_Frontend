// src/app/explore/plans/page.tsx
import { Metadata } from 'next';
import { homeJsonLd } from '@/constants';
import { MoviePlan, RidePlan, SportsPlan, HangoutPlan } from '@/types';
import { ApiService } from '@/utils';
import ActivitiesInner from '@/components/Explore/ActivityClient';

export const metadata: Metadata = {
  title: 'Explore Local Plans & Meetups | SyncTrip',
  description: 'Discover upcoming motorcycle rides, movie plans, sports matches, and casual hangouts in your city. Join local activities and find your crew with SyncTrip.',
  keywords: 'local activities, group plans, motorcycle rides, movie meetups, sports matches, casual hangouts, travel buddy, SyncTrip',
  authors: [{ name: 'SyncTrip' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  openGraph: {
    title: 'Explore Local Plans & Meetups | SyncTrip',
    description: 'Find and join upcoming rides, movie plans, sports matches, and casual hangouts near you. Connect with locals who share your vibe.',
    type: 'website',
    url: 'https://synctrip.in/explore/plans',
    siteName: 'SyncTrip',
    locale: 'en_IN',
    images: [
      {
        url: 'https://synctrip.in/logo_main_withoutBG.png',
        width: 1200,
        height: 630,
        alt: 'SyncTrip - Explore Local Activities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@synctrip44398',
    creator: '@synctrip44398',
    title: 'Explore Local Plans & Meetups | SyncTrip',
    description: 'Find and join upcoming rides, movie plans, sports matches, and casual hangouts near you.',
    images: ['https://synctrip.in/logo_main_withoutBG.png'],
  },
  alternates: {
    canonical: 'https://synctrip.in/explore/plans',
  },
  other: {
    'theme-color': '#1976d2',
    'color-scheme': 'light',
  },
};

export default async function ExploreActivities({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat = '' } = await searchParams;
  let initialRides: RidePlan[] = [];
  let initialMovies: MoviePlan[] = [];
  let initialSports: SportsPlan[] = [];
  let initialHangouts: HangoutPlan[] = [];

  try {
    const [r, m, s, h] = await Promise.all([
      ApiService.getRidePlansSSR().catch(() => []),
      ApiService.getMoviesPlansSSR().catch(() => []),
      ApiService.getSportsPlansSSR().catch(() => []),
      ApiService.getHangoutPlansSSR().catch(() => []),
    ]);
    initialRides = r;
    initialMovies = m;
    initialSports = s;
    initialHangouts = h;
  } catch (error) {
    console.error('Error fetching activities:', error);
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      <ActivitiesInner
        initialRides={initialRides}
        initialMovies={initialMovies}
        initialSports={initialSports}
        initialHangouts={initialHangouts}
        initialCat={cat}
      />
    </>
  );
}