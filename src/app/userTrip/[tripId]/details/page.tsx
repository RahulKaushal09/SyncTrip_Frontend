'use client';

import { useParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import TripServices from '@/utils/trip.utils';
import { Culture, DayWeather, Festival, groupContextTrip, Hotel, Location, PlacesToVisit, Restaurants, UserTrip } from '@/types';
import LocationHeader from '@/components/PageDetails/LocationHeader';
import LocationImageGallery from '@/components/PageDetails/locationImages';

import CultureFestivalsSection from '@/components/PageDetails/CultureFestivalsSection';
import { LocationFields, PageTypeEnum, typeOfLocationCardEnum, userTripFields } from '@/constants';
import InfoSwitch from '@/components/switch/infoSwitchButtons';
import toast from 'react-hot-toast';
import { LocationServices } from '@/utils/location.utils';
import WeatherServices from '@/utils/WeatherServices.utils';
import { AlertTriangle, Clock, Heart, Lock, MapPin, Shield, Users, Wallet } from 'lucide-react';
import LocationCardShortDescription from '@/components/Cards/locationShortDescriptionCard';
import { SwitchButtons } from '@/components/switch/2SwitchButtons';
import ItinerarySection from '@/components/Trips/ItinearySection';
import WeatherRangeCard from '@/components/Trips/WeatherRangeForTrip';
import HotelsSection from '@/components/Trips/HotelSectionTrip';
import PlacesToVisitSection from '@/components/PageDetails/PlacesToVisitSection';
import FullScreenLoader from '@/components/Loader/FullScreenLoader';
import RestaurantsSection from '@/components/Trips/RestaurantsSection';
import BottomButtonHolder from '@/components/bottomSheets/BottomButtonHolder';



function normalizePlaces(input: Location['placesToVisit']): PlacesToVisit[] {
    if (!input) return [];
    if (Array.isArray(input) && input.length > 0 && typeof (input as PlacesToVisit[])[0] === 'object') {
        return input as PlacesToVisit[];
    }
    // string[] fallback → show nothing (or map to minimal objects if you have a resolver)
    return [];
}
function normalizeHotels(input: Location['hotels']): Hotel[] {
    if (!input) return [];
    if (Array.isArray(input) && input.length > 0 && typeof (input as Hotel[])[0] === 'object') {
        return input as Hotel[];
    }
    return [];
}
function normalizeRestaurants(input: Location['restaurantsandfoods']): Restaurants[] {
    if (!input) return [];
    if (Array.isArray(input) && input.length > 0 && typeof (input as Restaurants[])[0] === 'object') {
        return input as Restaurants[];
    }
    return [];
}


const AboutSections: React.FC<{
    weatherDays?: DayWeather[];
    tripDetails?: UserTrip;
    shortDescription: string;
    longDesc: string;
    cultures?: Culture[];
    festivals?: Festival[];
    aboutTab: 'cultures' | 'festivals';
    setAboutTab: (tab: 'cultures' | 'festivals') => void;
}> = ({ weatherDays, tripDetails, shortDescription, longDesc, aboutTab, setAboutTab, cultures, festivals }) => {
    const [description, setDescription] = useState(shortDescription || '');
    const toggleDescription = () => {
        if (description === shortDescription) {
            setDescription(longDesc || '');
        } else {
            setDescription(shortDescription || '');
        }
    };
    const localsData = aboutTab === 'cultures' ? cultures : festivals;

    return (
        <div>
            {/* --- About Description --- */}
            <div className="descriptionContainer">
                <p className="text-lg font-bold mb-3">Highlights:</p>
                <p className="descriptionText">{description || '—'}</p>

                {longDesc && (
                    <button
                        className="view-more-btn" style={{ marginTop: 10 }}
                        onClick={toggleDescription}
                    >
                        {description === shortDescription ? 'Read More' : 'Show Less'}
                    </button>
                )}
            </div>

            {/* --- Safety Tips Grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <LocationCardShortDescription
                    Icon={Lock}
                    title="Keep Personal Info Private"
                    subtitle="Don't share sensitive details until you build trust"
                    variant="filled"
                />
                <LocationCardShortDescription
                    Icon={MapPin}
                    title="Meet in Public First"
                    subtitle="Always choose public, well-lit places"
                    variant="outlined"
                />
                <LocationCardShortDescription
                    Icon={Users}
                    title="Travel with a Companion"
                    subtitle="Bring a friend when meeting new people"
                    variant="filled"
                />
                <LocationCardShortDescription
                    Icon={AlertTriangle}
                    title="Stay Alert & Prepared"
                    subtitle="Keep belongings safe & emergency contacts handy"
                    variant="outlined"
                />
                <LocationCardShortDescription
                    Icon={Wallet}
                    title="Clarify Costs Upfront"
                    subtitle="Agree on expense sharing before the trip starts"
                    variant="filled"
                />
                <LocationCardShortDescription
                    Icon={Shield}
                    title="Report If Uncomfortable"
                    subtitle="Report or block immediately if unsafe"
                    variant="outlined"
                />
                <LocationCardShortDescription
                    Icon={Heart}
                    title="Respect & Be Kind"
                    subtitle="Respect fellow travelers and follow community rules"
                    variant="filled"
                />
            </div>
            <div style={{ marginTop: 40 }}>
                <h4 style={{ marginBottom: 30 }}>Weather Updates</h4>
                <WeatherRangeCard
                    days={weatherDays as DayWeather[]}
                    startDate={tripDetails?.startDate ?? "2025-01-16"}
                    endDate={tripDetails?.endDate ?? "2025-02-01"}
                    initialSelectedDate={tripDetails?.startDate ?? weatherDays?.[0]?.date}
                />
            </div>
            {/* --- Cultures / Festivals Section --- */}
            <div className="" style={{ marginTop: 30 }}>
                <SwitchButtons
                    options={[
                        { text: 'Cultures', value: 'cultures', onClick: () => setAboutTab('cultures') },
                        { text: 'Festivals', value: 'festivals', onClick: () => setAboutTab('festivals') },
                    ]}
                    selectedValue={aboutTab}
                    setSelectedValue={(value) => setAboutTab(value as 'cultures' | 'festivals')}
                />
                {/*  */}

                {localsData && localsData.length > 0 ? (
                    <CultureFestivalsSection
                        data={localsData}
                        heading={
                            aboutTab === 'cultures'
                                ? `Local Cultures`
                                : `Festivals & Celebrations`
                        }
                        type={aboutTab === 'cultures' ? 'culture' : 'festival'}
                    />
                ) : (
                    <div className="text-gray-500">No data available.</div>
                )}
            </div>
        </div>
    );
};

export default function UserTripDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UserTripDetailsPageContent />
        </Suspense>
    );
}
function UserTripDetailsPageContent() {
    const router = useRouter();
    // const searchParams = useSearchParams();
    const params = useParams();
    const tripId = params.tripId as string;
    // const tripId = searchParams?.get('tripId');
    // const locationId = searchParams?.get('locationId');
    // if (tripId === null) {
    //     toast.error("Trip ID  is missing");
    //     router.back();
    // }
    // if (locationId === null) {
    //     toast.error("Location ID is missing");
    //     router.back();
    // }
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
        LocationFields.FULL_DESCRIPTION
    ];
    // const [tripData, setTripData] = useState<UserTrip | null>(null);
    // const [locationData, setLocationData] = useState<Location | null>(null);
    // const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const [hotelIds, setHotelIds] = useState<string[]>([]);
    const [restaurantIds, setRestaurantIds] = useState<string[]>([]);
    const [location, setLocation] = useState<Location>();
    const [groupContext, setGroupContext] = useState<groupContextTrip>();
    const [isWishlisted, setWishlisted] = useState(false);
    const [tripDetails, setTripDetails] = useState<UserTrip>({} as UserTrip);
    const [weatherDays, setWeatherDays] = useState<DayWeather[]>([]);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [forecastAvailableUntil, setForecastAvailableUntil] = useState<string | null>(null);
    const [tripPrivacy, setTripPrivacy] = useState<'public' | 'private'>('private');

    const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
    const [isLoadingHotels, setIsLoadingHotels] = useState(true);
    const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);
    const [bottomButtons, setBottomButtons] = useState<{ text: string; onClick: () => void; styleClass?: string }[]>([]);


    const navigateToStartMatching = () => {
        router.push(`/userTrip/${tripId}/matching`);
    };

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
                const tripFields = [userTripFields.ID, userTripFields.LOCATION_ID, userTripFields.START_DATE, userTripFields.END_DATE, userTripFields.PRIVACY];
                // fetch location details and trip details in parallel
                // console.log('Fetching location and trip details for', locationId, tripId);

                console.log(locationFields);
                const tripData = await TripServices.fetchTripWithGroupDetails(tripId as string, tripFields);
                const groupContext: groupContextTrip = tripData.groupContext;
                setGroupContext(groupContext);
                if (!tripData.trip) {
                    toast.error("Trip not found");
                    router.back();
                    return;
                }
                const locationId = tripData.trip.locationId;
                const locationDetails = await LocationServices.fetchLocationDetails(locationId as string, locationFields);
                if (!locationDetails) {
                    toast.error("Location not found");
                    router.back();
                    return;
                }
                // const [locationDetails, tripData] = await Promise.all([
                //     LocationServices.fetchLocationDetails(locationId as string, locationFields),
                //     TripServices.fetchTripDetails(tripId as string, tripFields),
                // ]);
                if (groupContext?.isInGroup) {
                    setBottomButtons([{
                        text: "Go to Group Chat", onClick: () => {
                            router.push(`/chats?tripId=${tripId}&chatId=${groupContext.chatId}`);
                        }, styleClass: "btn btn-primary"
                    },
                    {
                        text: "View Group Details", onClick: () => {
                            router.push(`/userTrip/${tripId}/groups/${groupContext.groupId}`);
                        }, styleClass: "btn btn-secondary"
                    },
                    ]);
                }
                else {
                    if (tripData?.trip?.privacy && tripData?.trip?.privacy.toLocaleLowerCase().includes('public') && tripData?.trip?.endDate && tripData.trip.endDate.split('T')[0] >= new Date().toISOString().split('T')[0]) {
                        setTripPrivacy('public');
                        setBottomButtons([{ text: "Find Travel Companions", onClick: navigateToStartMatching, styleClass: "btn btn-matching-color" }]);
                    } else {
                        setTripPrivacy('private');

                    }
                }

                console.log(locationDetails);
                setLocation(locationDetails);
                setHotelIds(locationDetails?.hotels as string[] || []);
                setRestaurantIds(locationDetails?.restaurantsandfoods as string[] || []);
                setWishlisted(locationDetails?.isWishlisted || false);

                setTripDetails({ startDate: tripData.trip.startDate, endDate: tripData.trip.endDate } as UserTrip);

                // fetch weather from your backend
                if (locationDetails?.fullDetails?.coordinates?.lat && locationDetails?.fullDetails?.coordinates?.long && tripData?.trip?.startDate && tripData?.trip?.endDate) {
                    setWeatherLoading(true);
                    const resp = await WeatherServices.getTripWeather(locationDetails.fullDetails.coordinates.lat, locationDetails.fullDetails.coordinates.long, tripData.trip.startDate, tripData.trip.endDate);
                    // expect { days: DayWeather[], forecastAvailableUntil: 'YYYY-MM-DD' }
                    setWeatherDays(resp.days || []);
                    setForecastAvailableUntil(resp.forecastAvailableUntil || null);

                }
            } catch (err) {
                console.error('Failed to load location / trip / weather', err);
            } finally {
                setWeatherLoading(false);
                setIsLoadingPage(false);
            }
        };
        load();
    }, [tripId]);

    useEffect(() => {
        if (!location) {
            document.title = "Trip Details | SyncTrip";
            return;
        }

        let title = `${location.title} Trip | SyncTrip`;

        if (tripDetails?.startDate && tripDetails?.endDate) {
            const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

            const start = new Date(tripDetails.startDate).toLocaleDateString(undefined, options);
            const end = new Date(tripDetails.endDate).toLocaleDateString(undefined, options);

            title = `${location.title} (${start} - ${end}) | SyncTrip`;
        }

        document.title = title;

        return () => {
            document.title = "SyncTrip";
        };
    }, [location, tripDetails]);

    // Top tab (About / Places / Stay / Restaurant)
    const [selectedKey, setSelectedKey] = useState<string>('about');
    const [isLoadingItinerary, setIsLoadingItinerary] = useState(false);
    const [ItineraryTripDetails, setItineraryTripDetails] = useState<UserTrip | null>(null);
    // Sub-toggle inside About: "cultures" vs "festivals"
    const [aboutTab, setAboutTab] = useState<'cultures' | 'festivals'>('cultures');
    const [places, setPlaces] = useState<PlacesToVisit[]>([]);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurants[]>([]);
    const OnChangeActivityFilter = async (key: string) => {
        if (key === "places" && places.length === 0) {
            setIsLoadingPlaces(true);
            // fetch places details from placesIds
            // const firstPlaces = await LocationService.getPaginatedPlaces(placesIds, 0, 10, user?.token);
            // setPlaces(firstPlaces);
            // setPlacesPage(1);
            // setHasMorePlaces(firstPlaces.length === 10);
            // //
            const PlacesToVisit = await LocationServices.getPlacesToVisitByIds(location?.placesToVisit as string[]);
            // console.log("Fetched PlacesToVisit:", PlacesToVisit);
            setPlaces(normalizePlaces(PlacesToVisit));
            setIsLoadingPlaces(false);
            setSelectedKey(key);
            return;
        }
        if (key === "stay" && hotels.length === 0) {
            setIsLoadingHotels(true);

            const Hotels = await LocationServices.getHotelsByIds(hotelIds);
            // console.log("Fetched Hotels:", Hotels);
            setHotels(normalizeHotels(Hotels));
            setIsLoadingHotels(false);
            setSelectedKey(key);
            return;
        }
        if (key === "itinerary" && ItineraryTripDetails === null) {
            setIsLoadingItinerary(true);
            const tripFieldsForItineary = [userTripFields.ID, userTripFields.START_DATE, userTripFields.END_DATE, userTripFields.ACTIVITIES];
            const tripDataForItineary = await TripServices.fetchTripDetails(tripId as string, tripFieldsForItineary);
            const allPlaceIds = [
                ...new Set(tripDataForItineary?.activities?.map((act) => act.placeId)),
            ];
            let placesData: PlacesToVisit[] = [];
            if (places.length > 0) {
                // Keep only places referenced by the itinerary (filter avoids undefined entries)
                placesData = places.filter((place) => allPlaceIds.includes(place.id));
            } else {
                placesData =
                    allPlaceIds.length > 0
                        ? await LocationServices.getPlacesToVisitByIds(allPlaceIds)
                        : [];
            }
            // Map activities to include full place details
            const activitiesWithPlaces = tripDataForItineary.activities?.map((activity) => {
                const placeDetails = placesData.find((place) => place.id === activity.placeId);
                return {
                    ...activity,
                    placeDetails: placeDetails ? placeDetails : undefined,
                };
            }) || [];
            tripDataForItineary.activities = activitiesWithPlaces;
            console.log("Itinerary Trip Data with Places:", tripDataForItineary);
            setIsLoadingItinerary(false);
            setItineraryTripDetails(tripDataForItineary);
            setSelectedKey(key);
            return;
        }
        if (key === "restaurants" && restaurants.length === 0) {

            setIsLoadingRestaurants(true);

            const Restaurants = await LocationServices.getRestaurantsByIds(restaurantIds);
            setRestaurants(normalizeRestaurants(Restaurants));
            setIsLoadingRestaurants(false);
            setSelectedKey(key);
            return;
        }

    }
    // Normalize lists from location
    // const places = useMemo(() => normalizePlaces(location.placesToVisit), [location]);
    // const hotels = useMemo(() => normalizeHotels(location.hotels), [location]);
    if (isLoadingPage) {
        return <FullScreenLoader isVisible={true} />
    }
    if (!location) {
        router.back();
        return null;
    }
    const handleBack = () => {
        // Navigate to MainTabs → Home
        // navigation.navigate("MainTabs", { screen: "Home" });
        router.back();
    };
    const handleShare = () => console.log('Share', location.title);
    // const EditTripButton = () => {
    //     // (navigation as any).navigate('EditTrip', { id: tripId });
    //     router.push(`/userTrip/edit?tripId=${tripId}`);
    // }
    const formatTripDate = (start: string, end: string) => {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        const startDate = new Date(start);
        const endDate = new Date(end);
        return `${startDate.toLocaleDateString(undefined, options)} - ${endDate.toLocaleDateString(undefined, options)}`;
    };






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
            <LocationImageGallery locationImages={location?.images as string[]} locationName={location?.title} />

            <InfoSwitch onTabChange={(tab) => OnChangeActivityFilter(tab)} data={{
                about: <AboutSections
                    tripDetails={tripDetails}
                    weatherDays={weatherDays}
                    shortDescription={location.description as string}
                    longDesc={location.fullDetails?.full_description as string}
                    aboutTab={aboutTab}
                    setAboutTab={setAboutTab}
                    cultures={location.cultures}
                    festivals={location.festivals}
                />,
                itinerary: <ItinerarySection tripId={tripId as string} loading={isLoadingItinerary} tripDetails={ItineraryTripDetails as UserTrip} />,

                stay: <HotelsSection
                    hotels={hotels}
                    totalHotels={hotels.length}
                    locationUUID={location?.id as string}
                    isLoading={isLoadingHotels}
                    selectionHotels={[]}
                />,
                places: <PlacesToVisitSection
                    title={location?.title}
                    places={places}
                    parentId={location?.id}
                    parentType={typeOfLocationCardEnum.location}
                    isLoading={isLoadingPlaces}
                />,
                restaurants: <RestaurantsSection restaurants={restaurants} totalRestaurants={restaurants.length} locationUUID={location?.id as string} isLoading={isLoadingRestaurants} />,
                // restaurants: <BookingHotelsAndStaysSection
                //     hotelIds={location?.restaurantsandfoods || []}
                //     locationName={location?.title}
                //     parentId={location?.id}
                //     parentType="location"
                // />
            }} />
            <BottomButtonHolder buttons={bottomButtons} />
        </div>
    );
}
