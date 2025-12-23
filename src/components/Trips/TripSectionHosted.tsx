'use client';

import { useEffect, useMemo, useState } from 'react';
import '../../../styles/trips/tripSection.css';
import Cookies from 'js-cookie';
import TripCard from './TripCard';
import { HostedTrip } from '@/types';
import { WishlistTypeEnum } from '@/constants';

interface Props {
  trips: HostedTrip[];
}

const HostedTripSection: React.FC<Props> = ({ trips }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get('userToken'));
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const filteredTrips = useMemo(() => {
    if (activeTab === 'upcoming') {
      return trips.filter(
        t =>
          new Date(t.startDate) >= today &&
          t.status === 'published'
      );
    }

    return trips.filter(
      t =>
        new Date(t.startDate) < today ||
        t.status === 'completed'
    );
  }, [activeTab, trips, today]);

  return (
    <>
      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming {!isMobile && 'Trips'}
        </button>

        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          {!isMobile && 'Trip '}History
        </button>
      </div>

      {/* Header */}
      <div className="tripSection">
        <div className="tripSection-header">
          <h1>Hosted Group Trips</h1>
          <p>
            Fixed dates. Limited seats. Real people.  
            Join a trip and start matching instantly.
          </p>
        </div>

        {/* Cards */}
        <div className="paddingSectionLeftRight">
          <div className="tripSection-cards">
            {/* {filteredTrips.map(trip => (
              <TripCard
                key={trip.id}
                trip={trip}
                activeTab={activeTab}
                parentId=""
                parentType=""
                typeOfWhishlistCardEnum={WishlistTypeEnum.trip}
                cardId={trip.id}
                isHosted
              />
            ))} */}
          </div>

          {filteredTrips.length === 0 && (
            <p className="status-message">
              No trips available in this category.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default HostedTripSection;
