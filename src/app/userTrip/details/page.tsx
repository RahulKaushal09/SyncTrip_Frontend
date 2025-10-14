'use client';

import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiService } from '@/utils/api.utils';
import LocationPageDetails from '@/components/PageDetails/LocationPageDetails';
import TripServices from '@/utils/trip.utils';
import { Location, PlacesToVisit, UserTrip } from '@/types';

export default function UserTripDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tripId = searchParams?.get('tripId');

    const [tripData, setTripData] = useState<UserTrip | null>(null);
    const [locationData, setLocationData] = useState<Location | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!tripId) {
            router.back();
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch Trip Data
                const trip = await TripServices.fetchTripDetails(tripId);
                if (!trip || !trip.locationId) {
                    router.back();
                    return;
                }
                setTripData(trip);

                // Fetch Location Data
                const location = await ApiService.fetchLocationById(trip.locationId);
                if (!location) {
                    router.back();
                    return;
                }

                const placeIds = location.placesToVisit || [];
                const places = await ApiService.getPlacesByIds(placeIds as string[]);

                location.placesToVisit = (places || []).map(place => ({
                    ...place,
                    image: place.image?.map(img => decodeURIComponent(img)) || ['https://via.placeholder.com/300x200?text=No+Image']
                }));

                setLocationData(location);
            } catch (err) {
                console.error('Error fetching trip or location data:', err);
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tripId, router]);

    if (loading) return <div>Loading...</div>;
    if (!locationData) return notFound();

    return <LocationPageDetails locationData={locationData} uuid={tripId as string} />;
}
