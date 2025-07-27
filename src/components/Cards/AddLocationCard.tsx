'use client';

import React, { useState, useEffect } from 'react';
import { FaLeaf, FaBars, FaPlane } from 'react-icons/fa';
import '../../../styles/AddLocationCard.css';
import { PageTypeEnum } from '@/constants';
import { TripTimeline } from '@/types';



interface AddLocationCardProps {
    showBtns: boolean;
    pageType: string | null;
    onLoginClick: () => void;
    EnrollInTrip: (slotId: string) => void;
    btnsStyle?: React.CSSProperties;
    style?: React.CSSProperties;
    ctaAction: () => void;
    title: string;
    address?: string;
    rating?: string;
    reviews: number;
    bestTime?: string;
    placesToVisit: string;
    HotelsToStay: number | string;
    MainImage?: string;
    alreadyEnrolled: boolean;
    btnReference?: React.RefObject<HTMLDivElement>;
    price?: number;
    timelines: TripTimeline[];
}

const AddLocationCard: React.FC<AddLocationCardProps> = ({
    showBtns,
    pageType,
    onLoginClick,
    EnrollInTrip,
    btnsStyle,
    style,
    ctaAction,
    title,
    address,
    rating,
    reviews,
    bestTime,
    placesToVisit,
    HotelsToStay,
    MainImage,
    alreadyEnrolled,
    btnReference,
    price,
    timelines
}) => {
    const [activeIcon, setActiveIcon] = useState(0);
    const [btn2Text, setBtn2Text] = useState('');
    const [btn2CTA, setBtn2CTA] = useState<() => void>(() => ctaAction);
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [currentText, setCurrentText] = useState(0);
    const [customReviews, setCustomReviews] = useState<number | null>(null);

    const getRandomNumberReviews = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    const accommodationTexts = [
        `<strong style='color:black'>${placesToVisit}</strong>+ Places to visit`,
        `<strong style='color:black'>${HotelsToStay}</strong>+ Hotels to stay at`,
        `<strong style='color:black'>${getRandomNumberReviews}</strong>+ Others planning`
    ];
    useEffect(() => {
        const random = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        setCustomReviews(random);
    }, []);
    useEffect(() => {
        if (pageType === PageTypeEnum.LOCATION) {
            setBtn2CTA(() => ctaAction);
        } else if (pageType === PageTypeEnum.TRIP) {
            const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
            if (user?.profileCompleted) {
                setBtn2CTA(() => selectedSlotId ? () => EnrollInTrip(selectedSlotId) : () => { });
            } else {
                setBtn2CTA(() => onLoginClick);
            }
        }
    }, [pageType, ctaAction, selectedSlotId]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIcon((prev) => (prev + 1) % 3);
            setCurrentText((prev) => (prev + 1) % accommodationTexts.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (pageType === PageTypeEnum.TRIP && timelines.length === 1) {
            setSelectedSlotId(timelines[0].slotId);
        }
    }, [timelines]);

    useEffect(() => {
        if (pageType === PageTypeEnum.LOCATION) {
            setBtn2Text('Create a Trip →');
        } else if (pageType === PageTypeEnum.TRIP) {
            setBtn2Text(alreadyEnrolled ? 'Trip Updates' : 'Join Trip');
        }
    }, [pageType, alreadyEnrolled]);

    const formatDateRange = (fromDate: string, tillDate: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        const from = new Date(fromDate).toLocaleDateString('en-US', options);
        const till = new Date(tillDate).toLocaleDateString('en-US', options);
        return `${from} - ${till}`;
    };

    return (
        <div className="travel-card" style={style}>
            <div className="location-card-header">
                <div className=" locationCardFlexParent text-start">
                    <div className="location-card-title text-start">
                        <h2 className="DescriptionHeading">
                            <strong>{title}</strong>
                        </h2>
                        {address && <p className="text-muted" style={{ fontSize: '14px' }}>{address}</p>}
                        <div className=" reviewingBox">
                            <div className="info-box">★ {rating}</div>
                            <div className="info-box">{customReviews} reviews</div>
                        </div>
                        {pageType === PageTypeEnum.LOCATION ? (
                            <p className="trip-info">{bestTime}</p>
                        ) : timelines.length > 1 ? (
                            <select
                                className="form-select trip-info"
                                value={selectedSlotId}
                                onChange={(e) => setSelectedSlotId(e.target.value)}
                                style={{ marginTop: '10px' }}
                                disabled={!timelines || timelines.length === 0}
                            >
                                <option value="" disabled>Select trip date</option>
                                {timelines.map(({ slotId, fromDate, tillDate }) => (
                                    <option key={slotId} value={slotId}>
                                        {formatDateRange(fromDate, tillDate)}
                                    </option>
                                ))}
                            </select>
                        ) : timelines.length === 1 ? (
                            <p className="trip-info">
                                {formatDateRange(timelines[0].fromDate, timelines[0].tillDate)}
                            </p>
                        ) : (
                            <p className="trip-info">No available trip dates</p>
                        )}

                        <div className="location-card-icons">
                            {[FaLeaf, FaBars, FaPlane].map((Icon, index) => (
                                <Icon
                                    key={index}
                                    className="locationIcons"
                                    style={{
                                        backgroundColor: activeIcon === index ? 'black' : 'transparent',
                                        color: activeIcon === index ? 'white' : 'inherit',
                                        padding: '5px',
                                        borderRadius: '50%',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="location-card-accommodation">
                        <p style={{ transition: 'opacity 0.3s ease', opacity: 0.7 }}>
                            <span dangerouslySetInnerHTML={{ __html: accommodationTexts[currentText] }} />
                        </p>
                    </div>
                </div>

                <div className="location-card-image">
                    <img src={MainImage} alt={`${title} best Package Trip`} />
                    {price && (
                        <div className="price-marker">
                            <span>₹ {price}</span>
                        </div>
                    )}
                </div>
            </div>

            {showBtns && (
                <div className="location-card-buttons" ref={btnReference}>
                    {pageType === PageTypeEnum.LOCATION && (
                        <button className="btn btn-white" onClick={ctaAction} style={btnsStyle}>
                            Explore itinerary
                        </button>
                    )}
                    <button className="btn btn-black" onClick={btn2CTA} style={btnsStyle}>
                        {btn2Text}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddLocationCard;
