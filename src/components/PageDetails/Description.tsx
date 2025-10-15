'use client';

import React, { useState } from 'react';

import { Sun, Clock,Smile } from "lucide-react";

import { PageTypeEnum } from '@/constants';
import '../../../styles/Description.css'; // Adjust this based on your Next.js style loader
interface DescriptionProps {
    pageType: string | null;
    shortDescription?: string;
    fullDescription?: string;
    bestTime?: string;
    showEssentials?: boolean;
}

const Description = ({ pageType, shortDescription, fullDescription, bestTime,showEssentials = true }: DescriptionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="travel-info-container">
            {pageType !== PageTypeEnum.TRIP && showEssentials && (
                <div className="info-grid">
                    <div className="essentials-section">
                        <h2 className='DescriptionHeading'><strong>Essentials</strong></h2>
                        <div className="essentials-item">
                            <Sun size={18} className="icon" /> Weather: 32°C
                        </div>
                        <div className="essentials-item">
                            <Clock size={18} className="icon" /> Ideal duration: 5 days
                        </div>
                        <div className="essentials-item">
                            <Smile  size={18} className="icon" /> Best time: {bestTime}
                        </div>
                    </div>

                    <div className="weather-section">
                        <h2 className='DescriptionHeading'><strong>Upcoming weather</strong></h2>
                        <div className="weather-item">
                            <Sun size={18} className="day-icon" /> Monday: 32°C
                        </div>
                        <div className="weather-item">
                            <Sun size={18} className="day-icon" /> Tuesday: 31°C
                        </div>
                        <div className="weather-item">
                            <Sun size={18} className="day-icon" /> Wednesday: 29°C
                        </div>
                    </div>
                </div>
            )}

            <div className="description-section">
                <h2 className='DescriptionHeading'>
                    <strong>{pageType === PageTypeEnum.TRIP ? "Itinerary" : "Description"}</strong>
                </h2>
                <p
                    className="description-text"
                    dangerouslySetInnerHTML={{
                        __html: isExpanded
                            ? (fullDescription ?? '')
                            : `${(shortDescription ?? '').slice(0, 400)}...`
                    }}
                />
                <button
                    className="view-more-btn"
                    onClick={toggleDescription}
                >
                    {isExpanded ? 'View Less' : 'View More'} →
                </button>
            </div>

            {/* <hr /> */}
        </div>
    );
};

export default Description;
