'use client';

import { useEffect, useState } from 'react';
import MainSearchBar from '../SearchPanel/MainSearchBar';
// import Loader from '../Loader/loader';
// import { FullScreenLoader } from '../Loader/MainLoader';
import TripCard from './TripCard';
import '../../../styles/trips/tripSection.css';
import { Trip } from '@/types';
import { WishlistTypeEnum } from '@/constants';
import Cookies from 'js-cookie';
import { TripsApiService } from '@/utils';

interface TripSectionProps {
    trips: Trip[];
}

const TripSection: React.FC<TripSectionProps> = ({ trips }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [ClientIsLoaded, setClientIsLoaded] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [enrolledTrips, setEnrolledTrips] = useState<Trip[]>([]);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'enrolled' | 'history'>('upcoming');
    const updateActiveTab = (activeTabSelection: 'upcoming' | 'enrolled' | 'history') => {
        setActiveTab(activeTabSelection);
    }
    // const cookie = Cookies.get('userToken');
    useEffect(() => {
        const cookie = Cookies.get('userToken');
        setIsLoggedIn(!!cookie);
    }, []);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize(); // Set initial state
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };
    const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
    // const filteredTrips = trips.filter(trip => trip.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const getFilteredTrips = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (activeTab) {
            case 'upcoming':

                const upcomingTrips = trips.filter((trip) => {
                    let fromDate = new Date();
                    for (let i = 0; i < trip.essentials.timelines.length; i++) {
                        if (new Date(trip.essentials.timelines[i].fromDate) > fromDate) {
                            fromDate = new Date(trip.essentials.timelines[i].fromDate);
                            // break;
                        }
                    }
                    // const fromDate = new Date(trip.essentials.timeline.fromDate);
                    return fromDate >= today && ['active', 'scheduled'].includes(trip.requirements?.status as string);
                });
                if (upcomingTrips.length === 0) {
                    setActiveTab('history');
                }
                return upcomingTrips;
            case 'enrolled':
                return enrolledTrips;
            case 'history':

                return trips.filter((trip) => {
                    let fromDate = new Date().getTime() - 1; // Initialize to yesterday (as timestamp)
                    for (let i = 0; i < trip.essentials.timelines.length; i++) {
                        const timelineFromDate = new Date(trip.essentials.timelines[i].fromDate).getTime();
                        if (timelineFromDate > fromDate) {
                            fromDate = timelineFromDate;
                            // break;
                        }
                    }
                    // const fromDate = new Date(trip.essentials.timeline.fromDate);
                    return fromDate < today.getTime() || trip.requirements?.status === 'completed';
                });
            default:
                return trips;
        }
    };
    useEffect(() => {
        setFilteredTrips(getFilteredTrips());
        setClientIsLoaded(true);
    }, [trips, activeTab]);

    const fetchEnrolledTrips = async () => {
        if (isLoggedIn) {
            const token = Cookies.get('userToken');
            const enrolled = await TripsApiService.fetchEnrolledTrips(token);
            setEnrolledTrips(enrolled);
        }
    }
    useEffect(() => {
        fetchEnrolledTrips();
    }, [isLoggedIn]);

    return (
        <>
            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => updateActiveTab('upcoming')}
                >
                    Upcoming {!isMobile ? 'Trips' : ''}
                </button>
                {isLoggedIn && (
                    <button
                        className={`tab-button ${activeTab === 'enrolled' ? 'active' : ''}`}
                        onClick={() => updateActiveTab('enrolled')}
                    >
                        Enrolled {!isMobile ? 'Trips' : ''}
                    </button>
                )}
                <button
                    className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => updateActiveTab('history')}
                >
                    {!isMobile ? 'Trips ' : ''}History
                </button>
            </div>
            <div className="tripSection">
                <div className="tripSection-header">
                    <h1>Discover & Join Exciting Trips Near You!</h1>
                    <p>
                        Ready for your next adventure? Explore upcoming trips, sign up, and connect with fellow travelers before the journey begins!
                    </p>
                </div>
                <MainSearchBar searchTerm={searchTerm} setSearchTerm={handleSearchChange} searchBarPlaceHolder="Search Trips" />
                {/* {error ? (
                <p className={styles.statusMessageError}>{error}</p>
            ) : (
                <>
                    {isLoading ? (
                        <div className={styles.loaderContainer}>
                            <Loader setLoadingState={isLoading} TextToShow="Loading trips" />
                        </div>
                    ) : ( */}
                <div>
                    <div className="tripSection-cards">
                        {((filteredTrips.length > 0 || ClientIsLoaded) ? filteredTrips : trips).map((trip, index) => (
                            <TripCard key={index} trip={trip}
                                activeTab={activeTab}
                                parentId={""}
                                parentType={""}
                                typeOfWhishlistCardEnum={WishlistTypeEnum.trip}
                                cardId={trip.id}
                            />
                        ))}
                    </div>
                    {/* <div className="tripSection-cards">
                        {filteredTrips.length > 0 &&
                            filteredTrips.map((trip, index) => (
                                <TripCard
                                    key={index}
                                    trip={trip}
                                    activeTab={activeTab}
                                    parentId={""}
                                    parentType={""}
                                    typeOfWhishlistCardEnum={WishlistTypeEnum.trip}
                                    cardId={trip.id}
                                />
                            ))}
                    </div> */}
                    {filteredTrips.length === 0 && <p className="status-message">No trips available for this category.</p>}
                </div>
                {/* )}
                </>
            )} */}
            </div>
        </>
    );
};

export default TripSection;