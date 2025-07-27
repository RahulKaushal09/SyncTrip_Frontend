'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically load actual map logic to reduce initial bundle size
const DynamicMap = dynamic(() => import('./PlacesToVisitMapContent'), {
    ssr: false,
    loading: () => <p>Loading map...</p>,
});

import { PlacesToVisit } from '@/types';

interface Props {
    places: PlacesToVisit[];
}

const PlacesToVisitMap: React.FC<Props> = ({ places }) => {
    return <DynamicMap places={places} />;
};

export default PlacesToVisitMap;
