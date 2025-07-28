'use client';

import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import dynamic from 'next/dynamic';
import { PageTypeEnum } from '@/constants';
import type { DatePickerProps as OriginalDatePickerProps } from 'react-datepicker';
type CustomDatePickerProps = Omit<OriginalDatePickerProps, 'customTimeInput'> & {
    customTimeInput?: ReactElement | undefined;
};
const DatePicker = dynamic(
    () =>
        import('react-datepicker').then(
            (mod) => mod.default as unknown as React.ComponentType<CustomDatePickerProps>
        ),
    { ssr: false }
);
import 'react-datepicker/dist/react-datepicker.css';
import '../../../styles/PlanTripDates.css';
import { triggerLogin } from './../../utils/login.utils';

interface PlanTripDatesProps {
    pageType: string;
    EnrollInTrip: (tripId: number) => void;
    ctaAction: () => void;
    startDatePreTrip?: string | null;
    endDatePreTrip?: string | null;
}

const PlanTripDates: React.FC<PlanTripDatesProps> = ({
    pageType,
    EnrollInTrip,
    ctaAction,
    startDatePreTrip,
    endDatePreTrip,
}) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [btn2CTA, setBtn2CTA] = useState<() => void>(() => ctaAction);
    const onLoginClick = useCallback(() => {
        triggerLogin();
    }, []);
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() + 1);

    useEffect(() => {
        if (pageType === PageTypeEnum.LOCATION) {
            setBtn2CTA(() => ctaAction);
        } else if (pageType === PageTypeEnum.TRIP) {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user?.profileCompleted === true) {
                    setBtn2CTA(() => () => EnrollInTrip(1));
                    console.warn('EnrollInTrip is hardcoded to tripId: 1. Consider passing dynamic tripId.');
                } else {
                    setBtn2CTA(() => onLoginClick);
                }
            } catch (err) {
                console.error('Failed to parse user from localStorage:', err);
                setBtn2CTA(() => onLoginClick);
            }
        } else {
            setBtn2CTA(() => ctaAction);
        }
    }, [, pageType, ctaAction, onLoginClick, EnrollInTrip]);

    useEffect(() => {
        if (startDatePreTrip && endDatePreTrip) {
            const start = new Date(startDatePreTrip);
            const end = new Date(endDatePreTrip);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                setStartDate(start);
                setEndDate(end);
            }
        }
    }, [, startDatePreTrip, endDatePreTrip]);

    const handleDateChange = useCallback((dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    }, [,]);

    const clearDates = useCallback(() => {
        setStartDate(null);
        setEndDate(null);
    }, [,]);

    const createTrip = useCallback(() => {
        if (startDate && endDate) {
            console.log(`Trip planned from ${startDate.toDateString()} to ${endDate.toDateString()}`);
            btn2CTA();
        } else {
            alert('Please select both start and end dates.');
        }
    }, [, startDate, endDate, btn2CTA]);

    // const jsonLd = {
    //     '@context': 'https://schema.org',
    //     '@type': 'Event',
    //     name: `Plan Your Trip${pageType === PageTypeEnum.LOCATION ? ' to this Location' : ''}`,
    //     description: `Plan a trip with customizable dates${startDate && endDate
    //         ? ` from ${startDate.toDateString()} to ${endDate.toDateString()}`
    //         : ''
    //         }.`,
    //     eventStatus: 'https://schema.org/EventScheduled',
    //     eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    //     startDate: startDate?.toISOString() || 'Unknown',
    //     endDate: endDate?.toISOString() || 'Unknown',
    // };

    return (
        <div className="trip-planner" role="region" aria-label="Trip Planner">
            {/* <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            /> */}
            <div className="d-flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 className="DescriptionHeading">
                    <strong>Let&apos;s plan your trip</strong>
                </h2>
                {pageType !== PageTypeEnum.TRIP && (
                    <button
                        className="clear-dates"
                        onClick={clearDates}
                        aria-label="Clear selected dates"
                    >
                        Clear Dates
                    </button>
                )}
            </div>
            <div className="date-range" aria-live="polite">
                {startDate && endDate
                    ? `${startDate.toDateString()} - ${endDate.toDateString()}`
                    : 'Select dates'}
            </div>
            <div className="calendar-container">
                <DatePicker
                    selected={startDate}
                    onChange={pageType !== PageTypeEnum.TRIP ? handleDateChange : () => { }}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    minDate={today}
                    maxDate={maxDate}
                    monthsShown={2}
                    onMonthChange={(date) => setSelectedMonth(date)}
                    readOnly={pageType === PageTypeEnum.TRIP}
                    aria-label="Select trip dates"
                />
            </div>
            <div className="button-container row">
                {pageType === PageTypeEnum.LOCATION && (
                    <div className="col-lg-6 col-md-12 col-sm-12 zeroPaddingInMobile-btn-1000">
                        <button
                            className="btn btn-black create-itinerary"
                            style={{ width: '100%' }}
                            onClick={ctaAction}
                            aria-label="Use Synctrip Itinerary"
                        >
                            Use Synctrip Itinerary
                        </button>
                    </div>
                )}
                <div
                    className={`${pageType === PageTypeEnum.TRIP ? 'col-lg-12' : 'col-lg-6'
                        } col-md-12 col-sm-12 zeroPaddingInMobile-btn-1000`}
                >
                    <button
                        className="view-more-btn create-trip"
                        style={{ borderRadius: '9px', width: '100%' }}
                        onClick={createTrip}
                        aria-label={pageType === PageTypeEnum.LOCATION ? 'Create Trip' : 'Join Trip'}
                    >
                        {pageType === PageTypeEnum.LOCATION ? 'Create Trip' : 'Join Trip'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanTripDates;