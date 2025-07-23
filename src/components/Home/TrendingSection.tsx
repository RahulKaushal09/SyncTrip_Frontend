// components/Home/TrendingSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import DestinationCardLayout from './DestinationCardLayout';
import { TrendingLocationData } from '@/types';
import '../../../styles/Trending.css';
import { triggerLogin } from '@/utils';



export default function TrendingSection({ }) {
    const [trending, setTrending] = useState<TrendingLocationData[]>([{
        imgUrl: 'https://www.holidify.com/images/bgImages/ALLEPPEY.jpg',
        Title: 'Top Destination of 2024',
        Location: 'Kurli, Koembatur',
        peopleVisited: 'Aryan & 24 others visited this month'
    },
    {
        imgUrl: 'https://www.holidify.com/images/bgImages/GOA.jpg',
        Title: 'Beaches of Goa',
        Location: 'Goa, India',
        peopleVisited: 'Priya & 15 others visited this month'
    },
    {
        imgUrl: 'https://www.holidify.com/images/bgImages/MANALI.jpg',
        Title: 'Snowy Peaks of Manali',
        Location: 'Manali, Himachal Pradesh',
        peopleVisited: 'Rohan & 30 others visited this month'
    }]);
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    if (isMobile) {
        return null; // Hide on mobile devices
    }

    return (
        <section className="trending-section">
            <h2 className="text-start fw-bold majorHeadings" style={{ fontSize: '2rem' }}>
                Stay updated on what’s Trending
            </h2>

            {trending.length === 3 && <DestinationCardLayout cards={trending} />}

            <div className="text-center mt-4">
                <button
                    className="btn btn-dark btn-lg px-4"
                    onClick={() => triggerLogin()}
                    aria-label="Explore more destinations"
                >
                    Explore more
                </button>
            </div>
        </section>
    );
}
