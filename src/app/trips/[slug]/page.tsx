// pages/trips/[tripId].tsx

import { Location } from '@/types';
import { ApiService, CommonServices, TripsApiService } from '@/utils';
import { TripDetailsResponse } from '@/classes/ApiResponse.classes';
// import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import TripDetailsContentClient from '@/components/Trips/TripDetailsClient';
// import { PageTypeEnum } from '@/constants';


interface Props {
    params: Promise<{ slug: string }>; // Define params as a Promise
}


const TripsDetailsPage = async ({ params }: Props) => {

    const { slug } = await params; // Await params
    const [uuid] = slug.split('_');
    // const cookieStore = await cookies();
    // const tokenCookie = cookieStore.get('userToken');
    const tripsData: TripDetailsResponse = await TripsApiService.fetchTripById(uuid);
    if (!tripsData) return notFound();
    const expectedSlug = CommonServices.generateTripSlug(uuid, tripsData.trip.title || 'Best Trip');
    if (slug !== expectedSlug) {
        redirect(`/trips/${expectedSlug}`);
    }
    const LocationIdConnectedWith = tripsData.trip.locationId;
    const locationData: Location | null = await ApiService.fetchLocationByIdServer(LocationIdConnectedWith);
    if (!locationData) return notFound();
    const otherGoing = tripsData.appliedUsers || [];
    // const placeIds = locationData?.placesToVisit || [];










    // Redirect if slug is outdated or mismatched


    // const [isMobile, setIsMobile] = useState(false);
    // const [otherGoing, setOtherGoing] = useState<User[]>(tripsData.appliedUsers || []);
    // const [hotelIds, setHotelIds] = useState<string[]>(locationData.hotels || []);
    // const [pageType, setPageType] = useState<string>("trip");
    // const [tripStatus, setTripStatus] = useState<string | null>(null);
    // const [user, setUser] = useState<User | null>(
    //     typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
    // );
    // const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
    // const [isLoading, setIsLoading] = useState(!tripsData || !locationData);
    // const joinTripButtonRef = useRef<HTMLDivElement>(null);
    // const router = useRouter();
    // const { tripId } = router.query as { tripId: string };

    // Enroll in trip
    // const enrollInTrip = async (slotId: string) => {
    //     setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    //     const userToken = localStorage.getItem('userToken');
    //     if (!slotId) {
    //         toast.error('Please select a trip date slot');
    //         return;
    //     }
    //     if (alreadyEnrolled) {
    //         toast.success('You are already enrolled in this trip.');
    //         router.push(`/trips/en/${tripId}`);
    //         return;
    //     }
    //     if (user && user.profileCompleted && userToken) {
    //         const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/trips/enroll/${tripId}`;
    //         setIsLoading(true);
    //         try {
    //             const response = await fetch(url, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: `Bearer ${userToken}`,
    //                 },
    //                 body: JSON.stringify({ userId: user.id, slotId: parseInt(slotId) }),
    //             });
    //             const data = await response.json();
    //             if (response.ok) {
    //                 toast.success('You have successfully enrolled in the trip!');
    //                 router.push(`/trips/en/${tripId}`);
    //                 if (typeof window !== 'undefined' && window.fbq) {
    //                     window.fbq('trackCustom', 'JoinTrip');
    //                 }
    //             } else {
    //                 toast.error(data.message || 'Failed to enroll in the trip.');
    //             }
    //         } catch (error) {
    //             toast.error('An error occurred while enrolling. Please try again.');
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     } else {
    //         triggerLogin();
    //     }
    // };

    // Generate random number of reviews
    // const getRandomNumberReviews = () => Math.floor(Math.random() * 100) + 1;

    // Fetch trip details (background update)
    // const fetchTripDetails = async () => {
    //     let fromDate: Date | undefined;
    //     let endDate: Date | undefined;
    //     const trip = tripsData.trip;
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0);

    //     for (const timeline of trip.essentials.timelines) {
    //         const from = timeline.fromDate ? new Date(timeline.fromDate) : new Date();
    //         const till = timeline.tillDate ? new Date(timeline.tillDate) : new Date();
    //         if (!fromDate || from > fromDate) fromDate = from;
    //         if (!endDate || till > endDate) endDate = till;
    //     }
    //     if (!fromDate) fromDate = new Date(trip.essentials.timelines[0]?.fromDate);

    //     setTripStatus(
    //         fromDate < today || trip.requirements?.status === 'completed'
    //             ? 'completed'
    //             : trip.requirements?.status as string
    //     );
    //     // setTripsData({ ...trip, title: extractTextFromHTML(trip.title.replace(/[0-9.]/g, '')) });
    //     // setLocationData({
    //     //     ...initialLocationData,
    //     //     title: extractTextFromHTML(initialLocationData.title.replace(/[0-9.]/g, '')),
    //     // });
    //     if (user?.id) {
    //         setAlreadyEnrolled(otherGoing.some((u) => u.id === user.id));
    //     }
    // };



    // Scroll to join trip button
    // useEffect(() => {
    //     if (!isLoading && joinTripButtonRef.current) {
    //         joinTripButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    //     }
    // }, [isLoading]);



    // if (isLoading || !tripsData || !locationData) {
    //     return <FullScreenLoader isVisible={isLoading} />;
    // }

    // const meta = metaTags.tripDetails(tripsData, locationData);

    return (
        <TripDetailsContentClient
            tripData={tripsData.trip}
            locationData={locationData}
            otherGoing={otherGoing}
        />
    );
};

export default TripsDetailsPage;