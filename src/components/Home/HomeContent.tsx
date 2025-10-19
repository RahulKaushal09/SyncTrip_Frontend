"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ApiService } from '@/utils/api.utils';
// import MainSearchBar from '../SearchPanel/MainSearchBar';
// import ExploreSection from '../Explore/ExploreSection';
// import PreMadeItinerary from '../preItineraries/PreMadeItinerary';
import { LocationFields, WishlistTypeEnum } from '@/constants';
import '../../../styles/home/home.css';
import { Location } from '@/types';
import dynamic from 'next/dynamic';
import { MainSearchBarSkeleton } from '../SearchPanel/MainSearchBar';
// import { StorageUtils } from '@/utils';
import { UserApiService } from '@/utils/user.api.utils';
interface HomeContentProps {
    initialLocations: Location[];
    initialHasMore: boolean;
}
interface MainSearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    searchBarPlaceHolder: string;
}

const MainSearchBar = dynamic<MainSearchBarProps>(
    () => import('../SearchPanel/MainSearchBar').then((mod) => mod.default),
    {
        ssr: false,
        loading: () => {
            return <MainSearchBarSkeleton searchBarPlaceHolder='Search destinations, hotels' />;
        },
    }
);
const PreMadeItinerary = dynamic(() => import('../preItineraries/PreMadeItinerary'), {
    ssr: false,
    loading: () => <div className="skeleton-pre-made-itinerary" style={{ height: '400px', background: '#e0e0e0' }} />,
});
const ExploreSection = dynamic(() => import('../Explore/ExploreSection'), { ssr: true });

export default function HomeContent({ initialLocations, initialHasMore }: HomeContentProps) {
    const [locations, setLocations] = useState(initialLocations);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [searching, setSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetchedAll, setHasFetchedAll] = useState(false);
    const [wishlistLoaded, setWishlistLoaded] = useState(false);
    const [skip, setSkip] = useState(initialLocations.length);
    const limit = 16; // Number of locations to fetch per page
    const fieldsToFetchForHome = [
        LocationFields.TITLE,
        LocationFields.RATING,
        LocationFields.IMAGES,
        LocationFields.BEST_TIME,
        LocationFields.PLACES_NUMBER_TO_VISIT,
        LocationFields.ID
    ];
    const premadeItineariesLocations: Location[] = initialLocations.slice(0, 4);
    // Load wishlist data on component mount
    // useEffect(() => {
    //     const loadWishlistData = async () => {
    //         const token = StorageUtils.getToken();
    //         if (token && !wishlistLoaded) {
    //             try {
    //                 const response = await ApiService.fetchLocationsWithWishlist(0, locations.length, fieldsToFetchForHome);
    //                 if (response?.locations && response.locations.length > 0) {
    //                     const mergedLocations: Location[] = ApiService.mergeLocationsWithWishlist(locations, response.locations);
    //                     setLocations(mergedLocations);
    //                     setWishlistLoaded(true);
    //                 }
    //             } catch (error) {
    //                 console.error('Failed to load wishlist data:', error);
    //             }
    //         }
    //     };

    //     loadWishlistData();
    // }, [wishlistLoaded]); // Only run when wishlistLoaded changes
    useEffect(() => {
        const updateUserWishlist = async () => {
            if (wishlistLoaded) return; // Avoid re-fetching if already loaded

            const userWishList = await UserApiService.fetchUserWishlist(WishlistTypeEnum.location);
            if (userWishList && userWishList.length > 0) {
                const updatedLocations = locations.map((location) => {
                    const isWishlisted = userWishList.some((wish) => wish.refId === location.id);
                    return { ...location, isWishlisted };
                });
                setLocations(updatedLocations);
                setWishlistLoaded(true);
            }
        };
        updateUserWishlist();
    }, []);

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
    };

    const AllfetchLocations = async () => {
        try {
            const response = await ApiService.fetchLocationsUnified(1, 1000, fieldsToFetchForHome);

            if (response?.locations?.length) {
                return {
                    locations: response.locations,
                    hasMore: response.hasMore ?? false,
                };
            }

            return { locations: [], hasMore: false };
        } catch (error) {
            console.error('Error fetching all locations:', error);
            return { locations: [], hasMore: false };
        }
    };

    const handleShowMoreHome = async () => {
        if (searching || !hasMore) return;

        setIsLoading(true);

        try {
            const response = await ApiService.fetchLocationsUnified(skip, limit, fieldsToFetchForHome);

            if (response?.locations?.length) {
                const newLocations = response.locations;

                // Merge with previous locations (preserve isWishlisted where needed)
                setLocations(prev => {
                    const mergedMap = new Map();

                    // Start with previous ones
                    prev.forEach(loc => mergedMap.set(loc.id, loc));

                    // Merge new ones
                    newLocations.forEach(loc => {
                        const existing = mergedMap.get(loc.id);
                        if (existing) {
                            mergedMap.set(loc.id, { ...existing, isWishlisted: loc.isWishlisted ?? existing.isWishlisted });
                        } else {
                            mergedMap.set(loc.id, loc);
                        }
                    });

                    return Array.from(mergedMap.values());
                });

                setSkip(prev => prev + newLocations.length);
                setHasMore(response.hasMore ?? false);
            }
        } catch (error) {
            console.error('Error fetching more locations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Optimized filtering with better performance
    const filteredLocations = useMemo(() => {
        if (!searchTerm.trim()) {
            return locations;
        }

        const lowerSearch = searchTerm.toLowerCase();
        const startsWith: Location[] = [];
        const includes: Location[] = [];

        for (const location of locations) {
            const title = location.title?.toLowerCase() || "";
            if (title.startsWith(lowerSearch)) {
                startsWith.push(location);
            } else if (title.includes(lowerSearch)) {
                includes.push(location);
            }
        }

        const localFiltered = [...startsWith, ...includes];

        // If no results found in current data and haven't fetched all, trigger search
        if (localFiltered.length === 0 && !hasFetchedAll && !searching && searchTerm.length > 3) {
            (async () => {
                try {
                    setSearching(true);
                    const result = await AllfetchLocations();

                    const all = Array.isArray(result?.locations) ? result.locations : [];
                    const merged = [...locations];

                    all.forEach(loc => {
                        if (!merged.some(existing => existing.id === loc.id)) {
                            merged.push(loc);
                        }
                    });

                    setLocations(merged);
                    setHasFetchedAll(true);

                    if (!result.hasMore) {
                        setHasMore(false);
                    }
                } catch (error) {
                    console.error("Error fetching all locations:", error);
                } finally {
                    setSearching(false);
                }
            })();
        }

        return localFiltered;
    }, [searchTerm, locations, hasFetchedAll, searching]);

    return (
        <main className="min-h-screen HomePage paddingSectionLeftRight">
            <MainSearchBar
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
                searchBarPlaceHolder="Search destinations, hotels"
            />


            <ExploreSection
                locations={filteredLocations}
                handleShowMoreClick={handleShowMoreHome}
                searching={searching}
                showMoreButtonToShow={searchTerm.length === 0}
                hasMoreBtn={hasMore}
                isLoading={isLoading}
            />
            <PreMadeItinerary
                locations={premadeItineariesLocations}
            />



        </main>
    );
}