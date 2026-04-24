'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import '../../../styles/trips/hostedTripCard.css';
import { HostedTrip } from '@/types';
import HeartIcon from '../smallComponents/HeartIcon';
import { CommonServices } from '@/utils/CommonServices.utils';

interface HostedTripCardProps {
  trip: HostedTrip;
  activeTab: 'upcoming' | 'history' | 'admin';
  parentId?: string;
  parentType?: string;
  typeOfWhishlistCardEnum: string;
  cardId: string;
}

const HostedTripCard: React.FC<HostedTripCardProps> = ({
  trip,
  activeTab,
  parentId,
  parentType,
  typeOfWhishlistCardEnum,
  cardId,
}) => {
  const {
    id,
    title,
    mainImageUrl,
    locationName,


    price,
    status,
  } = trip;
  const { startDate, endDate, availableSeats } = trip.dates[0];

  const slug = CommonServices.generateTripSlug(id, title);
  const urlToTrip =
    activeTab === 'admin'
      ? `/admin/hosted-trips/${id}`
      : `/hostedTrips/${slug}`;

  const formatDate = (date: string | Date) => {
    // if (!date) return '';
    if (date instanceof Date) return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  // console.log(trip);
  const dateLabel = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  const isCompleted = status === 'completed' || activeTab === 'history';

  const seatLabel = useMemo(() => {
    if (isCompleted) return null;
    if (availableSeats <= 0) return 'Sold Out';
    if (availableSeats <= 5) return `${availableSeats} seats left`;
    return `${availableSeats} seats available`;
  }, [availableSeats, isCompleted]);

  return (
    <div className="trip-card">
      {/* IMAGE */}
      <div className="tripCard-image">
        <div
          style={{ position: 'relative', width: '100%', height: '100%' }}
          onClick={() => (window.location.href = urlToTrip)}
        >
          <Image
            src={mainImageUrl}
            alt={`Trip to ${title}`}
            fill
            style={{ objectFit: 'cover', cursor: 'pointer' }}
            priority={false}
          />
        </div>

        {/* COMPLETED BADGE */}
        {isCompleted && (
          <span className="trip-status-badge completed">
            Completed
          </span>
        )}

        <HeartIcon
          id={cardId}
          parentId={parentId}
          parentType={parentType}
          name={title}
          type={typeOfWhishlistCardEnum}
          isWishlisted={false}
        />
      </div>

      {/* CONTENT */}
      <div
        className="card-content"
        onClick={() => (window.location.href = urlToTrip)}
        style={{ cursor: 'pointer' }}
      >
        <div className="card-header">
          <h3 className="tripCard-heading-font">{title}</h3>
          <div className="price">₹ {price}</div>
        </div>

        <div className="trip-details">
          <p className="otherDetails-font">{locationName}</p>
          <p className="otherDetails-font">Dates: {dateLabel}</p>

          {!isCompleted && (
            <p className="otherDetails-font">
              Availability:{' '}
              <span
                style={{
                  fontWeight: 600,
                  color:
                    availableSeats <= 5 ? '#dc3545' : '#28a745',
                }}
              >
                {seatLabel}
              </span>
            </p>
          )}
        </div>

        {/* CTA */}
        {!isCompleted && (
          <button
            className="join-trip-btn"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = urlToTrip;
            }}
          >
            Join Trip
          </button>
        )}

        {isCompleted && (
          <button
            className="view-trip-btn"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = urlToTrip;
            }}
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default HostedTripCard;
