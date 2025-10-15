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
import { AlertTriangle, Clock, Heart, Lock, MapPin, Shield, Users, Wallet } from 'lucide-react';
import LocationCardShortDescription from '@/components/Cards/locationShortDescriptionCard';
import { SwitchButtons } from '@/components/switch/2SwitchButtons';
import ItinerarySection from '@/components/Trips/ItinearySection';



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


// const AboutSection: React.FC<{ location: Location; aboutTab: 'cultures' | 'festivals'; setAboutTab: (tab: 'cultures' | 'festivals') => void }> = ({ location, aboutTab, setAboutTab }) => {
//   const localsData = aboutTab === 'cultures' ? (location.cultures || []) : (location.festivals || []);
//   return (
//     <View>
//       <View style={styles.descriptionContainer}>
//         <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>Highlights: </Text>
//         <Text style={styles.descriptionText}>{location.description || '—'}</Text>
//       </View>
//       <View style={{ paddingHorizontal: 20, marginTop: 25, display: 'flex', flexDirection: 'column', gap: 15 }}>
//         <LocationCardShortDescription
//           icon="clock"
//           title="Ideal Duration 5 days"
//           subtitle="Check availability to see starting time"
//           variant="filled"
//         />
//         <LocationCardShortDescription
//           icon="users"
//           title="Group Tour"
//           subtitle="Find your buddies and forge lifelong friendship"
//           variant="outlined"
//         />
//       </View>
//       <View style={{ paddingHorizontal: 20, marginTop: 25 }}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
//           <Text style={[styles.headingText]}>About Local</Text>
//           <View style={{ flex: 1 }} />
//           <View style={locals.segmentWrap}>
//             <TouchableOpacity
//               onPress={() => setAboutTab('cultures')}
//               style={[locals.segment, aboutTab === 'cultures' && locals.segmentActive]}
//             >
//               <Text style={[locals.segmentText, aboutTab === 'cultures' && locals.segmentTextActive]}>Cultures</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => setAboutTab('festivals')}
//               style={[locals.segment, aboutTab === 'festivals' && locals.segmentActive]}
//             >
//               <Text style={[locals.segmentText, aboutTab === 'festivals' && locals.segmentTextActive]}>Festivals</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         {localsData.map((item, idx) => (
//           <View key={idx} style={{ paddingTop: 8 }}>
//             <CultureFestivalsCard
//               title={item.name}
//               desc={item.description}
//               img={first(item.images)?.image_url}
//               // tag={aboutTab === 'cultures' ? 'Culture' : 'Festival'}
//               timings={item.timings}
//               village={item.village}
//             />
//           </View>
//         ))}
//         {localsData.length === 0 && <ListEmpty />}
//       </View>
//     </View>
//   );
// };


const AboutSections: React.FC<{
    shortDescription: string;
    longDesc: string;
    cultures?: Culture[];
    festivals?: Festival[];
    aboutTab: 'cultures' | 'festivals';
    setAboutTab: (tab: 'cultures' | 'festivals') => void;
}> = ({ shortDescription, longDesc, aboutTab, setAboutTab, cultures, festivals }) => {
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
            className="view-more-btn" style={{marginTop:10}}
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

      {/* --- Cultures / Festivals Section --- */}
      <div className="" style={{marginTop:30}}>
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
        LocationFields.FULL_DESCRIPTION
    ];
    // const [tripData, setTripData] = useState<UserTrip | null>(null);
    // const [locationData, setLocationData] = useState<Location | null>(null);
    // const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);


    const [hotelIds, setHotelIds] = useState<string[]>([]);
    const [restaurantIds, setRestaurantIds] = useState<string[]>([]);
    const [location, setLocation] = useState<Location>();
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
                console.log('Fetching location and trip details for', locationId, tripId);

                console.log(locationFields);
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
    if (location == null) {
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

            <InfoSwitch data={{
                about: <AboutSections
                    shortDescription={location.description as string}
                    longDesc={location.fullDetails?.full_description as string}
                    aboutTab={aboutTab}
                    setAboutTab={setAboutTab}
                    cultures={location.cultures}
                    festivals={location.festivals}
                />,
                itinerary:<ItinerarySection tripId={tripId as string} />  
            }} />
            

            <div className="row" style={{ position: 'relative' }}>
                <div className={!isMobile ? 'col-lg-8' : 'col-lg-12'}>
                   
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
                    
                </div>

                
            </div>
        </div>
    );
}
