'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import '../../../styles/LocationImageGallery.css'; 

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

    // Auto-scroll for mobile carousel (One image at a time)
    useEffect(() => {
        if (!isMobile || !carouselRef.current || isUserInteracting || locationImages.length <= 1) return;

        const carousel = carouselRef.current;
        
        const interval = setInterval(() => {
            const width = carousel.offsetWidth; // Width of exactly one image container
            
            // If we are at the last image, snap back to the beginning
            if (carousel.scrollLeft + width >= carousel.scrollWidth - 10) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                // Otherwise scroll exactly one image width to the right
                carousel.scrollBy({ left: width, behavior: 'smooth' });
            }
        }, 3000); 

        return () => clearInterval(interval);
    }, [isMobile, isUserInteracting, locationImages]);

    const handleInteractionStart = () => setIsUserInteracting(true);
    const handleInteractionEnd = () => {
        setTimeout(() => setIsUserInteracting(false), 3000);
    };

    const handleMoreImagesClick = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    // Fallback if no images are provided
    if (!locationImages || locationImages.length === 0) return null;

    return (
        /* UI CHANGE: Wrapped the return in a React Fragment `<>...</>` to decouple the popup from the animated wrapper */
        <>
            <div className="location-gallery m-animate m-slide-up" style={{ animationDelay: '0.1s', marginBottom: '30px' }}>
                {isMobile ? (
                    /* =========================================
                       📱 MOBILE LAYOUT: Full-Width Auto Scroll
                       ========================================= */
                    <div
                        ref={carouselRef}
                        onTouchStart={handleInteractionStart}
                        onTouchEnd={handleInteractionEnd}
                        onMouseDown={handleInteractionStart}
                        onMouseUp={handleInteractionEnd}
                        onScroll={handleInteractionStart}
                        style={{
                            display: 'flex',
                            overflowX: 'auto',
                            scrollSnapType: 'x mandatory', 
                            scrollbarWidth: 'none', 
                            WebkitOverflowScrolling: 'touch',
                            borderRadius: '16px',
                            // Hide scrollbar for Chrome/Safari
                            msOverflowStyle: 'none' 
                        }}
                    >
                        {locationImages.map((image, index) => (
                            <div 
                                key={index} 
                                style={{ 
                                    position: 'relative', 
                                    flex: '0 0 100%', 
                                    height: '260px',  
                                    scrollSnapAlign: 'start', 
                                    overflow: 'hidden'
                                }}
                            >
                                <Image
                                    src={image}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    alt={`Attraction in ${locationName}`}
                                    loading={index === 0 ? "eager" : "lazy"}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* =========================================
                       💻 DESKTOP LAYOUT: Compact Bento Grid
                       ========================================= */
                    <div 
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gridTemplateRows: 'repeat(2, 170px)', 
                            gap: '12px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        {/* Main Large Image */}
                        <div 
                            className="hov-lift" 
                            style={{ gridColumn: 'span 2', gridRow: 'span 2', position: 'relative', cursor: 'pointer' }}
                            onClick={() => setIsPopupOpen(true)}
                        >
                            <Image src={locationImages[0]} fill style={{ objectFit: 'cover' }} alt={locationName} priority />
                        </div>

                        {/* Small Sub Images (Indexes 1, 2, 3) */}
                        {locationImages.slice(1, 4).map((image, index) => (
                            <div 
                                key={index} 
                                className="hov-lift" 
                                style={{ position: 'relative', cursor: 'pointer' }}
                                onClick={() => setIsPopupOpen(true)}
                            >
                                <Image src={image} fill style={{ objectFit: 'cover' }} alt={`${locationName} view ${index + 1}`} />
                            </div>
                        ))}

                        {/* 5th Image with Classic +X Overlay */}
                        {locationImages.length > 4 && (
                            <div 
                                className="hov-lift"
                                style={{ position: 'relative', cursor: 'pointer' }} 
                                onClick={handleMoreImagesClick}
                            >
                                <Image src={locationImages[4]} fill style={{ objectFit: 'cover' }} alt={`${locationName} view 5`} />
                                
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background-color 0.3s'
                                }}>
                                    <span className="h2 text-white" style={{ margin: 0, fontWeight: 600 }}>
                                        +{locationImages.length - 5}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* =========================================
               🎥 ORIGINAL FULL-SCREEN GRID POPUP 
               ========================================= */}
            {/* UI CHANGE: Moved outside the main animated div so `position: fixed` works perfectly */}
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
                                    // Added objectFit: 'cover' here so the 200x200 squares don't distort the image
                                    style={{ height: '200px', width: '200px', objectFit: 'cover' }} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LocationImageGallery;