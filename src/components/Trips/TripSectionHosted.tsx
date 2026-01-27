'use client';

import { useEffect, useMemo, useState } from 'react';
import '../../../styles/trips/tripSection.css';
import Cookies from 'js-cookie';
import TripCard from './TripCard';
import { HostedTrip } from '@/types';
import { WishlistTypeEnum } from '@/constants';
import HostedTripCard from './HostedTripCard';
import { triggerLogin } from '@/utils';

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
  const onCreateTrip = () => {
    if (isLoggedIn) {
      window.location.href = '/create/trip';
    } else {
      triggerLogin(() => {
        window.location.href = '/create/trip';
      });
    }
  };
  const filteredTrips = useMemo(() => {
    if (activeTab === 'upcoming') {
      return trips.filter(
        t =>
          new Date(t.dates[0]?.startDate) >= today
      );
    }

    return trips.filter(
      t =>
        new Date(t.dates[0]?.startDate) < today
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
            {filteredTrips.map(trip => (
              <HostedTripCard
                key={trip.id}
                trip={trip}
                activeTab={activeTab}
                parentId=""
                parentType=""
                typeOfWhishlistCardEnum={WishlistTypeEnum.trip}
                cardId={trip.id}
              />
            ))}
          </div>

          {filteredTrips.length === 0 && (
            <div style={styles.emptyWrapper}>
              <div style={styles.emptyCard}>

                {activeTab === 'upcoming' ? (
                  <>
                    <h2 style={styles.emptyTitle}>No upcoming hosted trips</h2>
                    <p style={styles.emptyText}>
                      There are no upcoming hosted trips yet. Create your first trip, build an itinerary,
                      and start matching with travelers heading to the same destination.
                    </p>

                    <div style={styles.emptyActions}>
                      <button
                        className="btn btn-primary"
                        onClick={() => onCreateTrip()}
                        aria-label="Create a new trip"
                      >
                        Plan your own trip
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 style={styles.emptyTitle}>No trip history yet</h2>
                    <p style={styles.emptyText}>
                      Hosted Trips History will appear here. Once a hosted trip ends,
                      it automatically moves to this history so you can revisit details and memories.
                    </p>

                    <div style={styles.emptyActions}>
                      <button
                        className="btn btn-primary"
                        onClick={() => onCreateTrip()}
                        aria-label="Create a new trip"
                      >
                        Plan your own trip
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HostedTripSection;


const styles: { [k: string]: React.CSSProperties } = {
  emptyWrapper: {
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "center",
    // padding: "40px 16px",
    zIndex:3,
  },

  emptyCard: {
    maxWidth: 640,
    width: "100%",
    background: "#fff",
    borderRadius: 16,
    padding: "36px 28px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
    textAlign: "center",
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 10,
    color: "#0f172a",
  },

  emptyText: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 1.6,
    marginBottom: 24,
    maxWidth: 520,
    marginInline: "auto",
  },

  emptyActions: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
  },
};