'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaRupeeSign } from 'react-icons/fa';
import '../../../styles/trips/tripCard.css';

import { Trip } from '@/types';
import HeartIcon from './../smallComponents/HeartIcon';
import { CommonServices } from '@/utils/services.utils';

interface TripCardProps {
    trip: Trip;
    activeTab: 'upcoming' | 'enrolled' | 'history' | 'admin';
    parentId: string | undefined;
    parentType: string | undefined;
    typeOfWhishlistCardEnum: string;
    cardId: string;
}

const TripCard: React.FC<TripCardProps> = ({ trip, activeTab, parentId, parentType, typeOfWhishlistCardEnum, cardId }) => {
    const age = trip.requirements?.age as number;

    const {
        id,
        title,
        MainImageUrl,
        essentials: { availableSeats, duration, timelines, price },
        requirements,
        include: { travel: includeTravel, food: includeFood, hotel: includeHotel },
    } = trip;

    const expectedSlug = CommonServices.generateTripSlug(id, title || 'Best Trip');
    const [urlToTrip, setUrlToTrip] = useState(`/trips/${expectedSlug}`);
    const availableSpots = availableSeats || 5;

    useEffect(() => {
        switch (activeTab) {
            case 'upcoming':
                setUrlToTrip(`/trips/${expectedSlug}`);
                break;
            case 'enrolled':
                setUrlToTrip(`/trips/en/${id}`);
                break;
            case 'history':
                setUrlToTrip(`/trips/${expectedSlug}`);
                break;
            case 'admin':
                setUrlToTrip(`/admin/Trips/${id}`);
                break;
            default:
                setUrlToTrip(`/trips/${expectedSlug}`);
                break;
        }
    }, [activeTab, id]);

    const include = (() => {
        if (includeTravel && includeFood && includeHotel) return 'Hotel, Food & Travel';
        if (includeTravel && includeFood) return 'Hotel & Travel';
        if (includeTravel && includeHotel) return 'Hotel & Food';
        if (includeFood && includeHotel) return 'Food & Travel';
        if (includeTravel) return 'Travel';
        if (includeFood) return 'Food';
        if (includeHotel) return 'Hotel';
        return 'None';
    })();

    const formatDate = (date: string): string => {
        const d = new Date(date);
        const day = d.getDate();
        const year = d.getFullYear();
        const monthName = d.toLocaleString('en-GB', { month: 'long' });
        return `${day} ${monthName}, ${year}`;
    };
    return (
        <div className="trip-card">
            <div className="tripCard-image">
                <div style={{ position: 'relative', width: '100%', height: '100%' }} onClick={() => window.location.href = urlToTrip}>
                    <Image
                        src={MainImageUrl}
                        alt={`Trips To ${title}`}
                        layout="fill"
                        objectFit="cover"
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <HeartIcon
                    id={cardId}
                    parentId={parentId}
                    parentType={parentType}
                    name={title}
                    type={typeOfWhishlistCardEnum}
                    isWishlisted={false}
                />
            </div>
            <div className="card-content" onClick={() => window.location.href = urlToTrip} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className='tripCard-heading-font'>{title}</h3>
                    <div className="price">
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <FaRupeeSign style={{ width: '8px', marginRight: '5px' }} /> {price}
                        </span>
                    </div>
                </div>
                <div className="trip-details">

                    <p className="dayNights-font">{duration}</p>
                    <p className="otherDetails-font">
                        Dates:{' '}
                        {timelines.length > 1
                            ? 'Multiple Dates'
                            : timelines.length === 1
                                ? `${formatDate(timelines[0].fromDate)} - ${formatDate(timelines[0].tillDate)}`
                                : 'N/A'}
                    </p>
                    <p className="otherDetails-font">Price: {price}</p>
                    {activeTab !== 'history' && (
                        <p className="otherDetails-font">
                            Available Spots: <span style={{ color: '#dc3545', fontWeight: 'bold' }}>{availableSpots} Left</span>
                        </p>
                    )}
                    <p className="otherDetails-font">
                        Includes: <span style={{ color: '#28a745' }}>{include} included</span>
                    </p>
                    <p className="otherDetails-font">
                        Age: <span>{age}+</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TripCard;