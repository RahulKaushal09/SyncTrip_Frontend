/**
 * Custom hook for managing wishlist data integration
 * Helps merge server-side SEO data with client-side wishlist data
 */

import { useState, useEffect } from 'react';
import { ApiService } from '@/utils/api.utils';
import { StorageUtils } from '@/utils/storage.utils';
import { Location } from '@/types';
import { LocationField } from '@/constants';

interface UseWishlistDataProps {
    serverLocations: Location[];
    fields: LocationField[];
    skip?: number;
    limit?: number;
}

interface UseWishlistDataReturn {
    locations: Location[];
    isWishlistLoaded: boolean;
    refreshWishlistData: () => Promise<void>;
}

export const useWishlistData = ({
    serverLocations,
    fields,
    skip = 0,
    limit = 1000
}: UseWishlistDataProps): UseWishlistDataReturn => {
    const [locations, setLocations] = useState<Location[]>(serverLocations);
    const [isWishlistLoaded, setIsWishlistLoaded] = useState(false);

    const loadWishlistData = async () => {
        const token = StorageUtils.getToken();

        if (!token) {
            // User not logged in, use server data as is
            setLocations(serverLocations);
            setIsWishlistLoaded(true);
            return;
        }

        try {
            const wishlistResponse = await ApiService.fetchLocationsWithWishlist(skip, limit, fields);

            if (wishlistResponse?.locations && wishlistResponse.locations.length > 0) {
                const mergedLocations = ApiService.mergeLocationsWithWishlist(serverLocations, wishlistResponse.locations);
                setLocations(mergedLocations);
            } else {
                setLocations(serverLocations);
            }

            setIsWishlistLoaded(true);
        } catch (error) {
            console.error('Failed to load wishlist data:', error);
            // Fallback to server data
            setLocations(serverLocations);
            setIsWishlistLoaded(true);
        }
    };

    useEffect(() => {
        if (!isWishlistLoaded) {
            loadWishlistData();
        }
    }, [serverLocations, isWishlistLoaded]);

    const refreshWishlistData = async () => {
        setIsWishlistLoaded(false);
        await loadWishlistData();
    };

    return {
        locations,
        isWishlistLoaded,
        refreshWishlistData
    };
};
