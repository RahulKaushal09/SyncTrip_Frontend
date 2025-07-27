// components/Home/HomeClientSection.tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Location } from '@/types';

const TrendingSection = dynamic(() => import('@/components/Home/TrendingSection'), {
  ssr: false,
});
const TopDestinations = dynamic(() => import('@/components/Home/TopDestinations'), {
  ssr: false,
});
const SyncTripAppPushingSection = dynamic(() => import('@/components/AppPushingComponents/AppPushingSection'), {
  ssr: false,
});

type Props = {
  randomLocations: Location[];
};

export default function HomeClientSection({ randomLocations }: Props) {
  return (
    <>
      <TrendingSection />
      <TopDestinations locations={randomLocations} />
      <SyncTripAppPushingSection />
    </>
  );
}
