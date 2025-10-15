'use client';

import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiService } from '@/utils/api.utils';
import LocationPageDetails from '@/components/PageDetails/LocationPageDetails';
import TripServices from '@/utils/trip.utils';
import { Culture, DayWeather, Festival, Hotel, Location, PlacesToVisit, Restaurants, UserTrip } from '@/types';
import LocationHeader from '@/components/PageDetails/LocationHeader';
import LocationImageGallery from '@/components/PageDetails/locationImages';
import AddLocationCard from '@/components/Cards/AddLocationCard';
import Description from '@/components/PageDetails/Description';
import PlacesToVisitSection from '@/components/PageDetails/PlacesToVisitSection';
import HotelsAndStaysSection from '@/components/PageDetails/HotelsAndStaysSection';
import CultureFestivalsSection from '@/components/PageDetails/CultureFestivalsSection';
import PlanTripDates from '@/components/PageDetails/PlanTripDates';
import { LocationFields, PageTypeEnum, userTripFields } from '@/constants';
import BookingHotelsAndStaysSection from '@/components/Cards/bookingHotelCard';
import InfoSwitch from '@/components/switch/infoSwitchButtons';
import toast from 'react-hot-toast';
import { LocationServices } from '@/utils/location.utils';
import WeatherServices from '@/utils/WeatherServices.utils';



function normalizePlaces(input: Location['placesToVisit']): PlacesToVisit[] {
    if (!input) return [];
    if (Array.isArray(input) && input.length > 0 && typeof (input as any)[0] === 'object') {
        return input as PlacesToVisit[];
    }
    // string[] fallback → show nothing (or map to minimal objects if you have a resolver)
    return [];
}
function normalizeHotels(input: Location['hotels']): Hotel[] {
    if (!input) return [];
    if (Array.isArray(input) && input.length > 0 && typeof (input as any)[0] === 'object') {
        return input as any as Hotel[];
    }
    return [];
}
function normalizeRestaurants(input: Location['restaurantsandfoods']): Restaurants[] {
    if (!input) return [];
    if (Array.isArray(input) && input.length > 0 && typeof (input as any)[0] === 'object') {
        return input as any as Restaurants[];
    }
    return [];
}



export default function UserTripDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tripId = searchParams?.get('tripId');
    const locationId = searchParams?.get('locationId');
    if (tripId === null) {
        toast.error("Trip ID  is missing");
        router.back();
    }
    if (locationId === null) {
        toast.error("Location ID is missing");
        router.back();
    }
    const locationFields = [
        LocationFields.ID,
        LocationFields.TITLE,
        LocationFields.DESCRIPTION,
        LocationFields.STATE,
        LocationFields.FILTER_TAGS,
        LocationFields.COUNTRY,
        LocationFields.RATING,
        LocationFields.IMAGES,
        LocationFields.PLACES_TO_VISIT,
        LocationFields.CULTURES,
        LocationFields.FESTIVALS,
        LocationFields.HOTELS,
        LocationFields.RESTAURANTS_AND_FOODS,
        LocationFields.COORDINATES,
        LocationFields.FULL_DETAILS
    ];
    // const [tripData, setTripData] = useState<UserTrip | null>(null);
    // const [locationData, setLocationData] = useState<Location | null>(null);
    // const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);


    const [hotelIds, setHotelIds] = useState<string[]>([]);
    const [restaurantIds, setRestaurantIds] = useState<string[]>([]);
    const [location, setLocation] = useState<Location | null>(null);
    const [isWishlisted, setWishlisted] = useState(false);
    const [tripDetails, setTripDetails] = useState<UserTrip>({} as UserTrip);
    const [weatherDays, setWeatherDays] = useState<DayWeather[]>([]);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [forecastAvailableUntil, setForecastAvailableUntil] = useState<string | null>(null);


    const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
    const [isLoadingHotels, setIsLoadingHotels] = useState(true);
    const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);

    // @ts-ignore
useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        const load = async () => {
            try {
                const tripFields = [userTripFields.ID, userTripFields.START_DATE, userTripFields.END_DATE];
                // fetch location details and trip details in parallel
                const [locationDetails, tripData] = await Promise.all([
                    LocationServices.fetchLocationDetails(locationId as string, locationFields),
                    TripServices.fetchTripDetails(tripId as string, tripFields),
                ]);
                console.log(locationDetails);
                setLocation(locationDetails);
                setHotelIds(locationDetails?.hotels || []);
                setRestaurantIds(locationDetails?.restaurantsandfoods || []);
                setWishlisted(locationDetails?.isWishlisted || false);

                setTripDetails({ startDate: tripData.startDate, endDate: tripData.endDate } as UserTrip);

                // fetch weather from your backend
                if (locationDetails?.fullDetails?.coordinates?.lat && locationDetails?.fullDetails?.coordinates?.long && tripData?.startDate && tripData?.endDate) {
                    setWeatherLoading(true);
                    const resp = await WeatherServices.getTripWeather(locationDetails.fullDetails.coordinates.lat, locationDetails.fullDetails.coordinates.long, tripData.startDate, tripData.endDate);
                    // expect { days: DayWeather[], forecastAvailableUntil: 'YYYY-MM-DD' }
                    setWeatherDays(resp.days || []);
                    setForecastAvailableUntil(resp.forecastAvailableUntil || null);
                }
            } catch (err) {
                console.error('Failed to load location / trip / weather', err);
            } finally {
                setWeatherLoading(false);
            }
        };
        load();
    }, [locationId, tripId]);
    // Top tab (About / Places / Stay / Restaurant)
    const [selectedKey, setSelectedKey] = useState<string>('about');
    // Sub-toggle inside About: "cultures" vs "festivals"
    const [aboutTab, setAboutTab] = useState<'cultures' | 'festivals'>('cultures');
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurants[]>([]);
    const OnChangeActivityFilter = async (key: string) => {
        // if (key === "places" && places.length === 0) {
        //   setIsLoadingPlaces(true);
        //   // fetch places details from placesIds
        //   // const firstPlaces = await LocationService.getPaginatedPlaces(placesIds, 0, 10, user?.token);
        //   // setPlaces(firstPlaces);
        //   // setPlacesPage(1);
        //   // setHasMorePlaces(firstPlaces.length === 10);
        //   // //
        //   const PlacesToVisit = await LocationService.getPlacesToVisitByIds(placesIds, user?.token);
        //   // console.log("Fetched PlacesToVisit:", PlacesToVisit);
        //   setPlaces(normalizePlaces(PlacesToVisit));
        //   setIsLoadingPlaces(false);
        // }
        if (key === "stay" && hotels.length === 0) {
            setIsLoadingHotels(true);

            const Hotels = await LocationServices.getHotelsByIds(hotelIds);
            // console.log("Fetched Hotels:", Hotels);
            setHotels(normalizeHotels(Hotels));
            setIsLoadingHotels(false);
        }
        if (key === "eat" && restaurants.length === 0) {
            setIsLoadingRestaurants(true);

            const Restaurants = await LocationServices.getRestaurantsByIds(restaurantIds);
            setRestaurants(normalizeRestaurants(Restaurants));
            setIsLoadingRestaurants(false);
        }
        setSelectedKey(key);
    }
    // Normalize lists from location
    // const places = useMemo(() => normalizePlaces(location.placesToVisit), [location]);
    // const hotels = useMemo(() => normalizeHotels(location.hotels), [location]);
    if (location === null) {
        return <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    }
    const handleBack = () => {
        // Navigate to MainTabs → Home
        // navigation.navigate("MainTabs", { screen: "Home" });
        router.back();
    };
    const handleShare = () => console.log('Share', location.title);
    const EditTripButton = () => {
        // (navigation as any).navigate('EditTrip', { id: tripId });
        router.push(`/userTrip/edit?tripId=${tripId}&locationId=${locationId}`);
    }
    const formatTripDate = (start: string, end: string) => {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        const startDate = new Date(start);
        const endDate = new Date(end);
        return `${startDate.toLocaleDateString(undefined, options)} - ${endDate.toLocaleDateString(undefined, options)}`;
    };






    
    // useEffect(() => {
    //     if (!tripId) {
    //         router.back();
    //         return;
    //     }

    //     const fetchData = async () => {
    //         try {
    //             // Fetch Trip Data
    //             const trip = await TripServices.fetchTripDetails(tripId);
    //             if (!trip || !trip.locationId) {
    //                 router.back();
    //                 return;
    //             }
    //             setTripData(trip);

    //             // Fetch Location Data
    //             const location = await ApiService.fetchLocationById(trip.locationId);
    //             if (!location) {
    //                 router.back();
    //                 return;
    //             }

    //             const placeIds = location.placesToVisit || [];
    //             const places = await ApiService.getPlacesByIds(placeIds as string[]);

    //             location.placesToVisit = (places || []).map(place => ({
    //                 ...place,
    //                 image: place.image?.map(img => decodeURIComponent(img)) || ['https://via.placeholder.com/300x200?text=No+Image']
    //             }));

    //             setLocationData(location);
    //         } catch (err) {
    //             console.error('Error fetching trip or location data:', err);
    //             router.back();
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [tripId, router]);

    // if (loading) return <div>Loading...</div>;
    // if (!locationData) return notFound();

    const pageType = PageTypeEnum.USER_TRIP;
    // return <LocationPageDetails locationData={locationData} uuid={tripId as string} />;
    return (
        <div className="DestinationPage paddingSectionLeftRight">

            {/* Main Sections */}
            <LocationHeader
                type="Explore"
                location={location?.title}
                // name={locationData?.title}
                title={location?.title}
                rating={location?.rating}
                country={location?.country}
            />

            <LocationImageGallery locationImages={location?.images} locationName={location?.title} />
            <InfoSwitch data={{}} />

            {isMobile && (
                <></>
                // <AddLocationCard
                //     locationId={locationData?.id}
                //     showBtns
                //     pageType={pageType}
                //     btnsStyle={{ width: '45%' }}
                //     style={{ marginBottom: '50px', marginLeft: '0px' }}
                //     ctaAction={() => }
                //     title={locationData?.title}
                //     rating={locationData?.rating}
                //     reviews={getRandomNumberReviews()}
                //     bestTime={locationData?.best_time}
                //     placesToVisit={locationData?.placesNumberToVisit || '10'}
                //     HotelsToStay={locationData?.hotels?.length || '10'}
                //     MainImage={locationData?.images?.[0]}
                //     onLoginClick={ctaAction}
                //     EnrollInTrip={() => { }}
                //     alreadyEnrolled={false}
                //     timelines={[]}
                // />
            )}

            <div className="row" style={{ position: 'relative' }}>
                <div className={!isMobile ? 'col-lg-8' : 'col-lg-12'}>
                    {!isMobile && (
                        <Description
                            pageType={pageType}
                            shortDescription={location?.description}
                            fullDescription={location?.fullDetails?.full_description}
                            bestTime={location?.best_time}
                            showEssentials={false}
                        />
                    )}
                    {/* <PlacesToVisitSection
                        title={locationData?.title}
                        places={locationData?.placesToVisit as PlacesToVisit[]}
                        parentId={locationData?.id}
                        parentType="location"
                    /> */}
                    {/* <BookingHotelsAndStaysSection
                        hotelIds={locationData?.hotels || []}
                        locationName={locationData?.title}
                        parentId={locationData?.id}
                        parentType="location"
                    /> */}
                    <CultureFestivalsSection data={location?.cultures as Culture[]} heading={`Local Cultures of ${location?.title}`} type="culture" />

                    <CultureFestivalsSection data={location?.festivals as Festival[]} heading={`Festivals of ${location?.title}`} type="festival" />
                    {/* <LocationMapSection
                        latitude={locationData?.fullDetails?.coordinates?.lat as number}
                        longitude={locationData?.fullDetails?.coordinates?.long as number}
                    /> */}
                </div>

                {!isMobile && (
                    <div className="col-lg-4" style={{ marginBottom: '17px' }}>
                        <div style={{ position: 'sticky', top: '80px', zIndex: 50 }}>
                            {/* <AddLocationCard
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
                            /> */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
