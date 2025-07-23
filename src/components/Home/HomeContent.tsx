"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ApiService } from '@/utils/api.utils';
import { StorageUtils } from '@/utils/storage.utils';
import MainSearchBar from '../SearchPanel/MainSearchBar';
import ExploreSection from '../Explore/ExploreSection';
import { LocationFields } from '@/constants';
import '../../../styles/home/home.css';
import { Location } from '@/types';
interface HomeContentProps {
    initialLocations: Location[];
    initialHasMore: boolean;
}

export default function HomeContent({ initialLocations, initialHasMore }: HomeContentProps) {
    const [locations, setLocations] = useState(initialLocations);
    const [searchTerm, setSearchTerm] = useState('');
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [searching, setSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetchedAll, setHasFetchedAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [wishlistLoaded, setWishlistLoaded] = useState(false);
    const fieldsToFetchForHome = [
        LocationFields.TITLE,
        LocationFields.RATING,
        LocationFields.IMAGES,
        LocationFields.BEST_TIME,
        LocationFields.PLACES_NUMBER_TO_VISIT,
        LocationFields.ID
    ];

    // Load wishlist data on component mount
    useEffect(() => {
        const loadWishlistData = async () => {
            const token = StorageUtils.getToken();
            if (token && !wishlistLoaded) {
                try {
                    const response = await ApiService.fetchLocationsWithWishlist(0, locations.length, fieldsToFetchForHome);
                    if (response?.locations && response.locations.length > 0) {
                        const mergedLocations: Location[] = ApiService.mergeLocationsWithWishlist(locations, response.locations);
                        setLocations(mergedLocations);
                        setWishlistLoaded(true);
                    }
                } catch (error) {
                    console.error('Failed to load wishlist data:', error);
                }
            }
        };

        loadWishlistData();
    }, [wishlistLoaded]); // Only run when wishlistLoaded changes

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
    };

    const AllfetchLocations = async () => {
        try {
            const token = StorageUtils.getToken();
            const response = await ApiService.fetchLocations(1, 1000, fieldsToFetchForHome); // Fetch more for search

            if (response && response.locations) {
                let finalLocations = response.locations || [];

                // If user is logged in, get wishlist data and merge
                if (token) {
                    try {
                        const wishlistResponse = await ApiService.fetchLocationsWithWishlist(1, 1000, fieldsToFetchForHome);
                        if (wishlistResponse?.locations && wishlistResponse.locations.length > 0) {
                            finalLocations = ApiService.mergeLocationsWithWishlist(finalLocations, wishlistResponse.locations);
                        }
                    } catch (error) {
                        console.error('Failed to fetch wishlist data:', error);
                        // Continue with non-wishlist data
                    }
                }

                return {
                    locations: finalLocations,
                    hasMore: false,
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
            const nextPage = currentPage + 1;
            const token = StorageUtils.getToken();
            const response = await ApiService.fetchLocations(nextPage, 16, fieldsToFetchForHome);

            if (response && response.locations) {
                let newLocations = response.locations || [];

                // If user is logged in, get wishlist data and merge
                if (token) {
                    try {
                        const wishlistResponse = await ApiService.fetchLocationsWithWishlist(nextPage, 16, fieldsToFetchForHome);
                        if (wishlistResponse?.locations && wishlistResponse.locations.length > 0) {
                            newLocations = ApiService.mergeLocationsWithWishlist(newLocations, wishlistResponse.locations);
                        }
                    } catch (error) {
                        console.error('Failed to fetch wishlist data for pagination:', error);
                        // Continue with non-wishlist data
                    }
                }

                setLocations(prev => [...prev, ...newLocations]);
                setHasMore(newLocations.length >= 16); // Estimate hasMore based on response size
                setCurrentPage(nextPage);
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
        const startsWith = [];
        const includes = [];

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
        if (localFiltered.length === 0 && !hasFetchedAll && !searching) {
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
        <main className="min-h-screen HomePage">
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



        </main>
    );
}