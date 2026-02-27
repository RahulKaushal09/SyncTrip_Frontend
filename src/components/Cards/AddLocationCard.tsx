'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, Menu, Plane, Star } from "lucide-react";

import '../../../styles/AddLocationCard.css';
import { PageTypeEnum } from '@/constants';
import { TripDate, TripTimeline } from '@/types';
import { triggerLogin } from '@/utils';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useLoader } from '../providers/LoaderContext';
import GumletImage from '../common/GumletImage';

interface AddLocationCardProps {
    locationId?: string;
    showBtns: boolean;
    pageType: string | null;
    onLoginClick: () => void;
    EnrollInTrip: () => void;
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
    timelines: TripTimeline[] | TripDate[];
    featuredLocation?: boolean;
    numberOfPeoplePlanningTrips?: number;
}

const AddLocationCard: React.FC<AddLocationCardProps> = ({
    locationId,
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
    timelines,
    featuredLocation = false,
    numberOfPeoplePlanningTrips
}) => {
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();

    const [activeIcon, setActiveIcon] = useState(0);
    const [btn2Text, setBtn2Text] = useState('');
    const [btn2CTA, setBtn2CTA] = useState<() => void>(() => ctaAction);
    const [currentText, setCurrentText] = useState(0);
    const [customReviews, setCustomReviews] = useState<number | null>(null);

    // Dynamic Text for Animation
    const getRandomNumberReviews = numberOfPeoplePlanningTrips;
    const accommodationTexts = [
        `<strong class="text-secondary-1" style="font-weight: 700;">${placesToVisit}</strong>+ Places to visit`,
        `<strong class="text-secondary-1" style="font-weight: 700;">${HotelsToStay}</strong>+ Hotels to stay at`,
        getRandomNumberReviews ? `<strong class="text-secondary-1" style="font-weight: 700;">${getRandomNumberReviews}</strong>+ Others planning` : ''
    ];

    useEffect(() => {
        const random = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        setCustomReviews(random);
    }, []);

    const createTrip = (locationId: string, featured: boolean) => {
        showLoader();
        if (featured) {
            router.push(`/create/trip?locationId=${locationId}`);
            return;
        } else {
            toast.error("We’re launching city by city to ensure you meet real travellers. For now, Manali, Goa & Rishikesh have active communities.");
            router.push("/explore");
            hideLoader();
            return;
        }
    };

    const loginThenNavigate = () => {
        triggerLogin(createTrip.bind(null, locationId || '', featuredLocation));
    };

    useEffect(() => {
        if (pageType === PageTypeEnum.LOCATION) {
            setBtn2CTA(() => loginThenNavigate);
        } else if (pageType === PageTypeEnum.HOSTED_TRIPS || pageType === PageTypeEnum.TRIP) {
            const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
            if (user?.profileCompleted) {
                setBtn2CTA(() => EnrollInTrip);
            } else {
                setBtn2CTA(() => onLoginClick);
            }
        }
    }, [pageType, ctaAction, featuredLocation]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIcon((prev) => (prev + 1) % 3);
            setCurrentText((prev) => (prev + 1) % accommodationTexts.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [accommodationTexts.length]);

    useEffect(() => {
        if (pageType === PageTypeEnum.LOCATION) {
            setBtn2Text('Create a Trip');
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
        <div
            className="travel-card mt-4 m-animate m-fade-in"
            style={{
                ...style,
                backgroundColor: 'var(--white)',
                borderRadius: '16px',
                border: '1px solid var(--neutral-4)',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
        >
            <div className="location-card-header" style={{ display: 'flex', gap: '16px', justifyContent: 'space-between' }}>

                {/* =========================================
                    TEXT CONTENT SIDE
                    ========================================= */}
                <div
                    className="locationCardFlexParent text-start"
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        minWidth: 0 // CRITICAL CSS FIX: Allows text to wrap without pushing the image out of the card
                    }}
                >
                    <div className="location-card-title text-start">

                        <h2 className="h3 text-secondary-1" style={{ margin: '0 0 4px 0', lineHeight: 1.2 }}>
                            {title}
                        </h2>

                        {address && <p className="r2 text-neutral-1" style={{ margin: '0 0 12px 0' }}>{address}</p>}

                        <div className="flex gap-3 items-center">
                            <div className="flex items-center gap-1">
                                <Star size={14} fill="var(--warning-1)" color="var(--warning-1)" />
                                <span style={{ fontWeight: 600 }}>{rating || '4.0'}</span>
                            </div>
                            <div className="text-secondary-1 border border-[var(--secondary-1)] select-none rounded-full px-1.5 py-0.5" style={{ fontSize: '12px' }}>
                                {customReviews} reviews
                            </div>
                        </div>

                        {/* Date info */}
                        {pageType === PageTypeEnum.LOCATION ? (
                            <p className="s1 text-secondary-1" style={{ margin: '0 0 12px 0' }}>{bestTime}</p>
                        ) : timelines.length > 1 ? (
                            <></>
                        ) : timelines.length === 1 ? (
                            <p className="s1 text-secondary-1" style={{ margin: '0 0 12px 0' }}>
                                {formatDateRange((timelines[0] as TripDate).startDate, (timelines[0] as TripDate).endDate)}
                            </p>
                        ) : (
                            <p className="s1 text-neutral-2" style={{ margin: '0 0 12px 0' }}>No available trip dates</p>
                        )}

                        {/* Animated Icons */}
                        <div className="location-card-icons" style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                            {[Leaf, Menu, Plane].map((Icon, index) => (
                                numberOfPeoplePlanningTrips === 0 && index === 2 ? null : (
                                    <div
                                        key={index}
                                        style={{
                                            backgroundColor: activeIcon === index ? 'var(--secondary-1)' : 'var(--secondary-5)',
                                            padding: '8px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <Icon size={16} color={activeIcon === index ? 'white' : 'var(--secondary-1)'} />
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Animated Text */}
                    <div className="location-card-accommodation">
                        <p className="r2 text-neutral-1" style={{ transition: 'opacity 0.3s ease', margin: 0 }}>
                            <span dangerouslySetInnerHTML={{ __html: accommodationTexts[currentText] }} />
                        </p>
                    </div>
                </div>

                {/* =========================================
                    IMAGE SIDE (Fluid Width Fix)
                    ========================================= */}
                <div
                    className="location-card-image"
                    style={{
                        position: 'relative',
                        width: '35%',           // Takes exactly 35% of the card's width dynamically
                        minWidth: '100px',      // Minimum safe width for tiny screens
                        maxWidth: '130px',      // Maximum width on large screens
                        aspectRatio: '3/4',     // Automatically calculates height based on the width perfectly
                        borderRadius: '12px',
                        overflow: 'hidden',
                        flexShrink: 0           // Prevents Flexbox from squishing the container
                    }}
                >
                    <GumletImage
                        containerClassName='h-full w-full'
                        src={MainImage}
                        alt={`${title} best Package Trip`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Premium Frosted Price Badge */}
                    {price && (
                        <div
                            className="price-marker"
                            style={{
                                position: 'absolute',
                                bottom: '6px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(4px)',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                width: 'max-content',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            <span className="s2 text-secondary-1" style={{ fontWeight: 700 }}>₹ {price}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Buttons */}
            {showBtns && (
                <div className="location-card-buttons" ref={btnReference} style={{ marginTop: '16px' }}>
                    <button
                        className="btn !flex justify-center items-center gap-1 btn-primary hov-lift"
                        onClick={btn2CTA}
                        style={{ width: '100%', ...btnsStyle }}
                    >
                        {btn2Text} <ArrowRight />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddLocationCard;