// src/components/Trips/TripDetailsClient.tsx
'use client';

import React, { use, useEffect, useState } from 'react';
import { HostedTrip, HostedTripItinerary, Itinerary, Location, PlacesToVisit, Trip } from '@/types';
import LocationHeader from '../PageDetails/LocationHeader';
import LocationImageGallery from '../PageDetails/locationImages';
import { PageTypeEnum, ProfileCardEnum } from '@/constants';
import AddLocationCard from '../Cards/AddLocationCard';
import TripItinerary from './TripItinerary';
import PlacesToVisitSection from '../PageDetails/PlacesToVisitSection';
import { ApiService, triggerLogin, TripsApiService } from '@/utils';
import Cookies from 'js-cookie';
import HotelsAndStaysSection from '../PageDetails/HotelsAndStaysSection';
import { appliedUsers } from '@/classes/ApiResponse.classes';
import TripsProfileCardUi from '../User/ProfileTripCards';
import dynamic from 'next/dynamic';
import SyncTripAppPushingSection from '../AppPushingComponents/AppPushingSection';
import "../../../styles/trips/TripDetailsPage.css"
// Dynamically import LocationMapSection to avoid SSR issues
// const LocationMapSection = dynamic(() => import('../PageDetails/LocationMapSection'), {
//     ssr: false,
// });

interface TripDetailsContentClientProps {
    tripData: HostedTrip;
    locationData: Location;
}

export default function TripDetailsContentClient({
    tripData,
    locationData,
}: TripDetailsContentClientProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [tripStatus, setTripStatus] = useState<string | null>(null);
    const [placesToVisit, setPlacesToVisit] = useState<PlacesToVisit[]>([]);
    const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);
    const [errorPlaces, setErrorPlaces] = useState<string | null>(null);
    const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
    // const [showBtnsOfJoin, setShowBtnsOfJoin] = useState(true);
    // Handle mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let fromDate;
        let endDate;
        for (let i = 0; i < tripData.dates.length; i++) {
            const timeline = tripData.dates[i];

            const from = timeline.startDate ? new Date(timeline.startDate) : new Date();
            const till = timeline.endDate ? new Date(timeline.endDate) : new Date();
            if (fromDate === undefined) fromDate = from;
            if (endDate === undefined) endDate = till;
            if (from > fromDate) fromDate = from;
            if (till > endDate) endDate = till;
        }
        if (fromDate === null || fromDate === undefined) {
            fromDate = new Date(tripData.dates?.[0]?.startDate as string);
        }
        // }
        // const fromDate = Trip.essentials.timelines?.[0]?.fromDate ? new Date(Trip.essentials.timelines[0].fromDate) : new Date();
        // Set trip status

        setTripStatus(fromDate < today || tripData?.status === 'completed'
            ? 'completed'
            : tripData?.status as string
        );
    }, [tripData]);

    // Fetch placesToVisit client-side
    useEffect(() => {
        const fetchPlacesToVisit = async () => {
            try {
                setIsLoadingPlaces(true);
                setErrorPlaces(null);
                const token = Cookies.get('userToken') || '';
                const placeIds = locationData.placesToVisit as string[];
                if (!placeIds || placeIds.length === 0) {
                    setPlacesToVisit([]);
                    return;
                }
                // else{
                //     placeIds = placeIds.slice(0,8);
                // }
                const fetchedPlaces = await ApiService.getPlacesByIds(placeIds, token);
                const mappedPlaces = fetchedPlaces.map(place => ({
                    ...place,
                    image: place.image
                        ? place.image.map(img => decodeURIComponent(img))
                        : ['https://via.placeholder.com/300x200?text=No+Image'],
                })) as PlacesToVisit[];
                setPlacesToVisit(mappedPlaces);
            } catch (error) {
                console.error('Error fetching places:', error);
                setErrorPlaces('Failed to load places to visit. Please try again.');
            } finally {
                setIsLoadingPlaces(false);
            }
        };

        fetchPlacesToVisit();
    }, [locationData.placesToVisit]);


    const onLoginClick = () => {
        // Handle login click
        triggerLogin(enrollInTrip);
    };
    
    const enrollInTrip = () => {
        // Handle trip enrollment
        console.log('Join Trip clicked for trip ID:', tripData.id);
        triggerLogin(() => TripsApiService.joinHostedTrip(tripData.id))
    };

    const getRandomNumberReviews = () => Math.floor(Math.random() * 100) + 10;

    const hotelIds = locationData.hotels || [];

    // Create a new locationData object with updated placesToVisit
    const updatedLocationData: Location = {
        ...locationData,
        placesToVisit,
    };

    return (
        <div className="DestinationPage paddingSectionLeftRight">
            <LocationHeader
                type="Trip"
                location={tripData.title || 'Best Trip'}
                title={tripData.title || 'Destination'}
                rating={updatedLocationData.rating || 'N/A'}
                country={updatedLocationData.country || 'India'}
            />
            <LocationImageGallery
                locationImages={updatedLocationData.photos}
                locationName={updatedLocationData.title}
            />
            {isMobile && (
                <AddLocationCard
                    locationId={locationData?.id}

                    btnReference={undefined}
                    showBtns={tripStatus !== 'completed'}
                    pageType={PageTypeEnum.TRIP}
                    onLoginClick={onLoginClick}
                    EnrollInTrip={enrollInTrip}
                    btnsStyle={{ width: '100%' }}
                    style={{ marginBottom: '50px', marginLeft: '0px' }}
                    title={tripData.title}
                    rating={updatedLocationData.rating}
                    reviews={getRandomNumberReviews()}
                    timelines={tripData.dates}
                    placesToVisit={updatedLocationData.placesNumberToVisit || '10'}
                    HotelsToStay={updatedLocationData.hotels?.length.toString() || '10'}
                    MainImage={updatedLocationData.images?.[0]}
                    alreadyEnrolled={alreadyEnrolled}
                    price={tripData.price}
                    ctaAction={() => { }}
                />
            )}
            <div className="row" style={{ position: 'relative' }}>
                <div className={!isMobile ? 'col-lg-8' : 'col-lg-12'}>
                    <TripItinerary itinerary={tripData.itineraryTemplate as HostedTripItinerary} />
                    {isLoadingPlaces ? (
                        <div className="text-center my-4">
                            <div className="loader" />
                            <span>Loading places to visit...</span>
                        </div>
                    ) : errorPlaces ? (
                        <div className="text-center my-4 text-danger">{errorPlaces}</div>
                    ) : placesToVisit.length > 0 ? (
                        <PlacesToVisitSection
                            title={tripData.title}
                            places={updatedLocationData.placesToVisit as PlacesToVisit[]}
                            parentId={updatedLocationData.id}
                            parentType="location"
                        />
                    ) : (
                        <div className="text-center my-4">No places to visit available.</div>
                    )}
                    {/* {(tripData.selectedHotelId.length > 0 || hotelIds.length > 0) && (
                        <HotelsAndStaysSection
                            hotelIds={tripData.selectedHotelId.length > 0 ? tripData.selectedHotelId : hotelIds as string[]}
                            locationName={tripData.title}
                            parentId={updatedLocationData.id}
                            parentType="location"
                        />
                    )} */}
                    {/* {otherGoing.length > 0 && (
                        <div>
                            <h2 className="section-title">All Other Going</h2>
                            <div className="user-list-detailsContainer">
                                {otherGoing.map((user) => (
                                    <TripsProfileCardUi
                                        profileCardInlineStyle={{ display: 'block' }}
                                        key={user.id}
                                        user={user}
                                        type={ProfileCardEnum.AllGoing}
                                        showviewProfile={false}
                                        onViewProfile={() => { }}
                                    />
                                ))}
                            </div>
                        </div>
                    )} */}
                    {/* <LocationMapSection
                        latitude={updatedLocationData?.fullDetails?.coordinates?.lat ?? 0}
                        longitude={updatedLocationData?.fullDetails?.coordinates?.long ?? 0}
                    /> */}
                </div>
                {!isMobile && (
                    <div className="col-lg-4" style={{ marginBottom: '17px' }}>
                        <div style={{ position: 'sticky', top: '80px', zIndex: 50 }}>
                            <AddLocationCard
                                locationId={locationData?.id}

                                btnReference={undefined}
                                showBtns={tripStatus !== 'completed'}
                                pageType={PageTypeEnum.TRIP}
                                onLoginClick={onLoginClick}
                                EnrollInTrip={enrollInTrip}
                                btnsStyle={{ width: '100%' }}
                                style={{ marginBottom: '50px', marginLeft: '0px' }}
                                title={tripData.title}
                                rating={updatedLocationData.rating}
                                reviews={getRandomNumberReviews()}
                                timelines={tripData.dates}
                                placesToVisit={updatedLocationData.placesNumberToVisit || '10'}
                                HotelsToStay={updatedLocationData.hotels?.length.toString() || '10'}
                                MainImage={updatedLocationData.images?.[0]}
                                alreadyEnrolled={alreadyEnrolled}
                                price={tripData.price}
                                ctaAction={() => { }}
                            />
                        </div>
                    </div>
                )}
            </div>
            {/* <SyncTripAppPushingSection /> */}
        </div>
    );
}