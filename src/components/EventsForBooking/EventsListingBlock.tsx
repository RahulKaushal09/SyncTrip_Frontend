'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Events } from '../../types';
import '../../../styles/events/events.css'; // Custom styles
import EventCard from './EventsCard';

interface EventListProps {
  initialEvents: Events[];
}

export default function EventList({ initialEvents }: EventListProps) {
  const [visibleCount, setVisibleCount] = useState(
    typeof window !== 'undefined' && window.innerWidth < 550 ? 6 : 12
  );

  const handleShowMore = () => {
    setVisibleCount(initialEvents.length);
  };

  return (
    <>
      <div className="row mt-4">
        {initialEvents.slice(0, visibleCount).map((event) => (
          <div key={event._id} className="col-lg-2 col-6 col-sm-3 col-md-3 mb-4">
            <Link href={event.bookingLink} target="_blank" rel="noopener noreferrer">
              <EventCard event={event} />
            </Link>
          </div>
        ))}
      </div>

      {visibleCount < initialEvents.length && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button className="btn btn-black" onClick={handleShowMore} aria-label="Show more events">
            Show More
          </button>
        </div>
      )}
    </>
  );
}
