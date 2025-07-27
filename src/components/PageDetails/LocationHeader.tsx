'use client';

import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaStar, FaShare } from 'react-icons/fa';
import "../../../styles/LocationEventsDetails.css"; // Rename if needed to LocationHeader.css

type LocationHeaderProps = {
    type: string;
    location: string;
    rating?: string;
    country?: string | null;
    title: string;
    address?: string;
};

const LocationHeader: React.FC<LocationHeaderProps> = ({ type, location, rating, country, title, address }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: type !== "Explore" ? `Trip to ${title}` : `Explore this Destination`,
                    text: type !== "Explore" ? `Check out this amazing trip: ${title}` : `Check out this amazing destination!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Share failed:', error);
            }
        } else {
            alert('Share is not supported on your device. Please copy the URL manually.');
        }
    };

    return (
        <div className="locationEventsDetails">
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: 'wrap' }}>
                <div>
                    <h2 className="locationEventHeadings">{title}</h2>
                    {address && <p className="text-muted">{address}</p>}
                </div>
                <div className="d-flex m-gap-2 justify-content-between align-items-center">
                    <div className="d-flex">
                        <div className="btn-light-blue circlularButton d-flex align-items-center justify-content-center">
                            <FaStar className="me-2" />
                            {rating}
                        </div>
                        {!isMobile && (
                            <div className="btn-light-blue circlularButton d-flex align-items-center justify-content-center ms-2">
                                <FaMapMarkerAlt className="me-2" />
                                {country ? country : "India"}
                            </div>
                        )}
                    </div>
                    <div className="d-flex align-items-center ms-3" onClick={handleShare} style={{ cursor: "pointer" }}>
                        {!isMobile && <span>Share</span>}
                        <FaShare className="ms-2" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationHeader;
