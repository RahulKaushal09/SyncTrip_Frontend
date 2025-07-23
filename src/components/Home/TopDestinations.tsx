'use client';

import React, { useState, useEffect } from 'react';
import LocationCard from '../LocationCard/LocationCard';
import { WishlistTypeEnum } from '@/constants';
import '../../../styles/TopDestinations.css';

interface TopDestinationsProps {
    locations: any[]; // Ideally replace `any` with a proper Location type
}

const TopDestinations: React.FC<TopDestinationsProps> = ({ locations }) => {
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        const updateVisibleCount = () => {
            setVisibleCount(window.innerWidth < 550 ? 6 : 12);
        };

        updateVisibleCount(); // Initial run

        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    const handleShowMore = () => {
        setVisibleCount(locations.length); // Show all locations
    };

    return (
        <section>
            <h2 className="fw-bold majorHeadings" style={{ textAlign: 'left' }}>
                Top Destinations
            </h2>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                }}
            >
                {locations.slice(0, visibleCount).map((location, index) => (
                    <LocationCard
                        key={index}
                        name={location.title?.replace(/[0-9.]/g, '') || 'Unknown'}
                        rating={location.rating || 'N/A'}
                        places={location.placesNumberToVisit || '0'}
                        bestTime={location.best_time || 'N/A'}
                        images={
                            location.images ||
                            ['https://via.placeholder.com/300x200?text=No+Image']
                        }
                        whishlistParentId={""}
                        whishlistParentType={""}
                        typeOfWhishlistCardEnum={WishlistTypeEnum.location}
                        cardId={location.id}
                    />
                ))}
            </div>

            {/* Optional: Uncomment to enable "Show More" button */}
            {/* {visibleCount < locations.length && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <button className="btn btn-black" onClick={handleShowMore}>
                        Show More
                    </button>
                </div>
            )} */}
        </section>
    );
};

export default TopDestinations;
