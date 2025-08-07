'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../../../styles/LocationImageGallery.css'; // Adjust if you're using a different folder structure
import Image from 'next/image';

interface Props {
    locationImages: string[];
    locationName: string;
}

const LocationImageGallery: React.FC<Props> = ({ locationImages, locationName }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    // Set initial mobile state and handle resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-scroll for mobile carousel
    useEffect(() => {
        if (!isMobile || !carouselRef.current) return;

        const carousel = carouselRef.current;
        const imageWidth = carousel.offsetWidth;
        const totalImages = locationImages.length;
        let currentIndex = 0;

        const scrollToNextImage = () => {
            currentIndex = (currentIndex + 1) % totalImages;
            carousel.scrollTo({
                left: currentIndex * imageWidth,
                behavior: 'smooth',
            });
        };

        const interval = setInterval(scrollToNextImage, 2000);
        return () => clearInterval(interval);
    }, [isMobile, isUserInteracting, locationImages]);

    const handleInteractionStart = () => setIsUserInteracting(true);
    const handleInteractionEnd = () => {
        setTimeout(() => setIsUserInteracting(false), 2000);
    };

    const handleMoreImagesClick = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    return (
        <div className="location-gallery">
            {isMobile ? (
                <div
                    className="carousel-container"
                    ref={carouselRef}
                    onTouchStart={handleInteractionStart}
                    onTouchEnd={handleInteractionEnd}
                    onMouseDown={handleInteractionStart}
                    onMouseUp={handleInteractionEnd}
                    onScroll={handleInteractionStart}
                >
                    {locationImages.map((image, index) => (
                        <Image
                            key={index}
                            src={image}
                            width={400}
                            height={300}
                            alt={`Attraction in ${locationName} - SyncTrip`}
                            className="carousel-image"
                            loading="lazy"
                        />
                    ))}
                </div>
            ) : (
                <div className="image-grid">
                    <Image
                        src={locationImages[0]}
                        width={800}
                        height={500}
                        alt={`Attraction in ${locationName} - SyncTrip`}
                        className="main-image"
                    />
                    <div className="right-grid">
                        {locationImages.slice(1, 4).map((image, index) => (
                            <Image
                                key={index}
                                src={image}
                                width={400}
                                height={250}
                                alt={`Attraction in ${locationName} - SyncTrip`}
                                className={`right-image right-image-${index + 1}`}
                            />
                        ))}
                        <div className="last-image-container">
                            <Image
                                src={locationImages[4]}
                                width={400}
                                height={250}
                                alt={`Attraction in ${locationName} - SyncTrip`}
                                className="right-image right-image-4"
                            />
                            <div className="more-images-button" onClick={handleMoreImagesClick}>
                                <p>+{locationImages.length - 5}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!isMobile && isPopupOpen && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closePopup}>
                            ×
                        </button>
                        <div className="popup-images">
                            {locationImages.map((image, index) => (
                                <Image
                                    key={index}
                                    src={image}
                                    width={200}
                                    height={200}
                                    alt={`Attraction in ${locationName} - SyncTrip`}
                                    className="popup-image"
                                    style={{ height: '200px', width: '200px' }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationImageGallery;
