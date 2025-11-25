'use client';

import React, { use, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LocationImageGallery from './locationImages';
import AddLocationCard from '../Cards/AddLocationCard';
import CultureFestivalsSection from './CultureFestivalsSection';
import { Culture, Festival, Location, PlacesToVisit } from '@/types';
import { PageTypeEnum, WishlistTypeEnum } from '@/constants';
import { triggerLogin } from '@/utils';
import LocationHeader from './LocationHeader';
import Description from './Description';
import PlacesToVisitSection from './PlacesToVisitSection';
import HotelsAndStaysSection from './HotelsAndStaysSection';
import PlanTripDates from './PlanTripDates';
import SyncTripAppPushingSection from '../AppPushingComponents/AppPushingSection';
// import LocationMapSection from './LocationMapSection';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { UserApiService } from '@/utils/user.api.utils';
// const LocationMapSection = dynamic(() => import('./LocationMapSection'), {
//     ssr: false, // This prevents SSR for import { is } from './../../../.next/server/vendor-chunks/next';
//     loading: () => (
//         <div className="map-skeleton" style={{
//             height: '400px',
//             background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
//             borderRadius: '8px',
//             animation: 'loading 1.5s infinite'
//         }}>
//             <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 height: '100%',
//                 color: '#666'
//             }}>
//                 Loading Map...
//             </div>
//         </div>
//     )
// });
const LocationPageDetails = ({ uuid, locationData }: { uuid: string; locationData: Location }) => {
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [isWishlistedLocation, setIsWishlistedLocation] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [pageType, setPageType] = useState<string | null>(null);
    const [placesToVisit, setPlacesToVisit] = useState<PlacesToVisit[]>(locationData?.placesToVisit as PlacesToVisit[] || []);
    // const [hotelIds, setHotelIds] = useState<string[]>([]);
    const ctaAction = () => triggerLogin(); // arrow function assigned to ctaAction

    useEffect(() => {
        if (pathname?.includes('/trips/')) setPageType(PageTypeEnum.TRIP);
        else if (pathname?.includes('/location/')) setPageType(PageTypeEnum.LOCATION);
    }, [pathname]);

    useEffect(() => {

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);



    const stripHTML = (html: string) => {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };

    const getRandomNumberReviews = () => Math.floor(Math.random() * 100) + 1;

    const fetchUserWishlist = async () => {
        if (isWishlistedLocation) return; // Avoid re-fetching if already loaded
        const token = Cookies.get('userToken');
        if (!token) return;

        try {
            const wishlist = await UserApiService.fetchUserWishlist('');
            const updatedPlaces = (locationData?.placesToVisit ?? [])
                .filter((place): place is PlacesToVisit => typeof place === 'object' && 'id' in place)
                .map((place) => ({
                    ...place,
                    isWishlisted: wishlist.some((item) => item.refId === place.id),
                })) as PlacesToVisit[];
            setPlacesToVisit(updatedPlaces || []);
            setIsWishlistedLocation(true);
        } catch (error) {
            console.error('Error fetching user wishlist:', error);
        }
    }
    useEffect(() => {
        fetchUserWishlist();
    }, []);

    // if (loading) return <FullScreenLoader isVisible={loading} />;

    return (
        <div className="DestinationPage paddingSectionLeftRight">

            {/* Main Sections */}
            <LocationHeader
                type="Explore"
                location={locationData?.title}
                // name={locationData?.title}
                title={locationData?.title}
                rating={locationData?.rating}
                country={locationData?.country}
            />

            <LocationImageGallery locationImages={locationData?.photos} locationName={locationData?.title} />

            {isMobile && (
                <AddLocationCard
                    locationId={locationData?.id}
                    showBtns
                    pageType={pageType}
                    btnsStyle={{ width: '45%' }}
                    style={{ marginBottom: '50px', marginLeft: '0px' }}
                    ctaAction={ctaAction}
                    title={locationData?.title}
                    rating={locationData?.rating}
                    reviews={getRandomNumberReviews()}
                    bestTime={locationData?.best_time}
                    placesToVisit={locationData?.placesNumberToVisit || '10'}
                    HotelsToStay={locationData?.hotels?.length || '10'}
                    MainImage={locationData?.images?.[0]}
                    onLoginClick={ctaAction}
                    EnrollInTrip={() => { }}
                    alreadyEnrolled={false}
                    timelines={[]}
                    featuredLocation={locationData?.featured || false}
                />
            )}

            <div className="row" style={{ position: 'relative' }}>
                <div className={!isMobile ? 'col-lg-8' : 'col-lg-12'}>
                    {!isMobile && (
                        <Description
                            pageType={pageType}
                            shortDescription={locationData?.description}
                            fullDescription={locationData?.fullDetails?.full_description}
                            bestTime={locationData?.best_time}
                            showEssentials={false}
                        />
                    )}
                    <PlacesToVisitSection
                        title={locationData?.title}
                        places={placesToVisit}
                        parentId={locationData?.id}
                        parentType="location"
                    />
                    <HotelsAndStaysSection
                        hotelIds={locationData?.hotels as string[]|| []}
                        locationName={locationData?.title}
                        parentId={uuid}
                        parentType="location"
                    />
                    <CultureFestivalsSection data={locationData?.cultures as Culture[]} heading={`Local Cultures of ${locationData?.title}`} type="culture" />
                    <PlanTripDates pageType={pageType as string} ctaAction={ctaAction}
                        EnrollInTrip={() => { }} locationId={locationData?.id} />
                    <CultureFestivalsSection data={locationData?.festivals as Festival[]} heading={`Festivals of ${locationData?.title}`} type="festival" />
                    {/* <LocationMapSection
                        latitude={locationData?.fullDetails?.coordinates?.lat as number}
                        longitude={locationData?.fullDetails?.coordinates?.long as number}
                    /> */}
                </div>

                {!isMobile && (
                    <div className="col-lg-4" style={{ marginBottom: '17px' }}>
                        <div style={{ position: 'sticky', top: '80px', zIndex: 50 }}>
                            <AddLocationCard
                    locationId={locationData?.id}

                                showBtns
                                pageType={pageType}
                                ctaAction={ctaAction}
                                title={locationData?.title}
                                rating={locationData?.rating}
                                reviews={getRandomNumberReviews()}
                                bestTime={locationData?.best_time}
                                placesToVisit={locationData?.placesNumberToVisit || '10'}
                                HotelsToStay={locationData?.hotels?.length || '10'}
                                MainImage={locationData?.images?.[0]}
                                onLoginClick={ctaAction}
                                EnrollInTrip={() => { }}
                                alreadyEnrolled={false}
                                timelines={[]}
                                featuredLocation={locationData?.featured || false}

                            />
                        </div>
                    </div>
                )}
            </div>

            <SyncTripAppPushingSection showWork={false} />
        </div>
    );
};

export default LocationPageDetails;
