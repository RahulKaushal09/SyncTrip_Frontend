import React from 'react';
import LocationCard from '../LocationCard/LocationCard';
import MoreLocationsUnlocking from './MoreLocationsUnlocking';
import ShowMoreButton from './ShowMoreButton';
import { Location } from '@/types';
import {
    typeOfLocationCardEnum
} from '@/constants';
import { CommonServices } from '@/utils';

// interface ExploreLocationData {
//     id: string;
//     title?: string;
//     rating?: string;
//     placesNumberToVisit?: number;
//     best_time?: string;
//     images?: string[];
//     isWishlisted?: boolean;
//     country?: string;
//     description?: string;
//     fullDetails?: {
//         coordinates?: {
//             lat: number;
//             long: number;
//         };
//     };
// }

interface ExploreSectionProps {
    locations: Location[];
    isLoading?: boolean;
    hasMoreBtn: boolean;
    handleShowMoreClick?: () => void;
    searching: boolean;
    showMoreButtonToShow: boolean;
}

const ExploreSection: React.FC<ExploreSectionProps> = ({
    locations,
    isLoading = false,
    hasMoreBtn,
    handleShowMoreClick,
    searching,
    showMoreButtonToShow
}) => {
    // Server-side visible count - show all locations passed from parent
    const visibleCount = locations.length;
    



    // Show loading spinner when searching
    if (!locations.length && searching) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
                <div>Loading destinations...</div>
            </div>
        );
    }

    return (
        <section className="" aria-label="Explore destinations " 
        >
            {/* Main Grid */}
            <div style={{textAlign:'center',marginTop:"40px"}}>
            <h2 style={{color:"var(--secondary-1)"}}>Active Travel Zones (Early Access)</h2>
            </div>
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    rowGap: "15px",
                    marginTop:"50px",
                    marginBottom: "50px"
                }}
            >
                {locations.length > 0 ? (
                    locations.slice(0, visibleCount).map((location, index) => (
                        <LocationCard
                            key={location.id || index}
                            name={location.title?.replace(/[0-9.]/g, '') || 'Unknown Destination'}
                            rating={location.rating || 'N/A'}
                            places={location.placesNumberToVisit as string}
                            bestTime={CommonServices.convertLongBestTimeNameToShortNotations(location.best_time || '')}
                            images={
                                location.images && location.images.length > 0
                                    ? location.images
                                    : ['https://via.placeholder.com/300x200?text=No+Image']
                            }
                            isWishlisted={location.isWishlisted || false}
                            typeOfWhishlistCardEnum="location"
                            cardId={location.id}
                            placeConnectedwithid={""}
                            isLoading={false}
                            typeOfCard={typeOfLocationCardEnum.location}
                        />
                    ))
                ) : searching ? (
                    // Show skeleton cards while searching
                    Array.from({ length: 12 }).map((_, index) => (
                        <LocationCard key={`skeleton-${index}`} isLoading={true} typeOfWhishlistCardEnum='location' />
                    ))
                ) : (
                    // No results found
                    <div className="col-span-full text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No destinations found
                        </h3>
                        <p className="text-gray-500">
                            Try searching for something else or explore our featured destinations.
                        </p>
                    </div>
                )}
            </div>
            <MoreLocationsUnlocking/>

            {/* Show More Button - Client Component x
            {handleShowMoreClick && (
                <ShowMoreButton
                    hasMoreBtn={hasMoreBtn}
                    showMoreButtonToShow={showMoreButtonToShow}
                    locationsLength={locations.length}
                    isLoading={isLoading}
                    onShowMoreClick={handleShowMoreClick}
                />
            )} */}

            {/* Loading indicator for pagination */}
            {/* {isLoading && locations.length > 0 && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <span aria-live="polite">Loading more destinations...</span>
                </div>
            )} */}

            {/* SEO-friendly hidden content for search engines */}
            {/* <div className="sr-only">
                <h2>Top Travel Destinations</h2>
                <p>
                    Explore the world&apos;s most beautiful destinations with SyncTrip.
                    From pristine beaches to majestic mountains, discover your next adventure
                    and join group trips with fellow travelers.
                </p>
                <ul>
                    {locations.slice(0, 10).map((location) => (
                        <li key={location.id}>
                            <a href={`/location/${location.id}`}>
                                {location.title} - {location.description || 'Discover this amazing destination'}
                            </a>
                        </li>
                    ))}
                </ul>
            </div> */}
        </section>
    );
};

export default ExploreSection;