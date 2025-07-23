// components/Home/DestinationCardLayout.tsx
'use client';

import React, { useState } from 'react';
import DestinationCard from './DestinationCard';
import { TrendingLocationData } from '@/types';
import '../../../styles/DestinationCard.css';

interface DestinationCardLayoutProps {
    cards: TrendingLocationData[];
}

const DestinationCardLayout: React.FC<DestinationCardLayoutProps> = ({ cards }) => {
    const [positions, setPositions] = useState([0, 1, 2]);

    const rotateLeft = () => {
        console.log('Rotating left');
        setPositions(prev => [prev[1], prev[2], prev[0]]);
    };

    const rotateRight = () => {
        console.log('Rotating right');
        setPositions(prev => [prev[2], prev[0], prev[1]]);
    };

    return (
        <div className="destination-card-container">
            <button className="arrow-button left-arrow" onClick={rotateLeft}>
                ‹
            </button>

            <div className={`card-item position-${positions[0]}`}>
                <DestinationCard {...cards[0]} />
            </div>
            <div className={`card-item position-${positions[1]}`}>
                <DestinationCard {...cards[1]} />
            </div>
            <div className={`card-item position-${positions[2]}`}>
                <DestinationCard {...cards[2]} />
            </div>

            <button className="arrow-button right-arrow" onClick={rotateRight}>
                ›
            </button>
        </div>
    );
};

export default DestinationCardLayout;
