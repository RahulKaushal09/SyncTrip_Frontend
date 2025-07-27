'use client';

import { useState } from 'react';
import '../../../styles/trips/Itinerary.css';

import { Itinerary } from '@/types';

interface ItineraryComponentProps {
    itinerary: Itinerary;
}

const TripItinerary: React.FC<ItineraryComponentProps> = ({ itinerary }) => {
    const [selectedDay, setSelectedDay] = useState<string>(itinerary.days[0]?.dayTitle || '');

    const handleDayClick = (dayTitle: string) => {
        setSelectedDay(dayTitle);
    };

    const selectedDayData = itinerary.days.find(day => day.dayTitle === selectedDay);

    return (
        <div className="itinerary-container">
            {/* Top Section */}
            {itinerary.topSectionHtml && (
                <div
                    className="top-section"
                    dangerouslySetInnerHTML={{ __html: itinerary.topSectionHtml }}
                />
            )}
            <hr />

            <h2>Day-Wise Itinerary</h2>

            {/* Day Filters */}
            <div className="day-filters">
                <div className="day-filters-child">
                    {itinerary.days.map((day, index) => (
                        <button
                            key={index}
                            className={`day-button ${selectedDay === day.dayTitle ? 'active' : ''}`}
                            onClick={() => handleDayClick(day.dayTitle)}
                        >
                            {day.dayTitle}
                        </button>
                    ))}
                </div>
            </div>

            {/* Day Content */}
            <div
                className="day-content"
                dangerouslySetInnerHTML={{
                    __html: selectedDayData ? selectedDayData.htmlDescription : '<p>No data available for this day.</p>',
                }}
            />
            <hr />

            {/* Bottom Section */}
            {itinerary.bottomSectionHtml && (
                <div
                    className="bottom-section"
                    dangerouslySetInnerHTML={{ __html: itinerary.bottomSectionHtml }}
                />
            )}
            <hr />
        </div>
    );
};

export default TripItinerary;
