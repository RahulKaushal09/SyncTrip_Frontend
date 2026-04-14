'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

import '../../../styles/LocationImageGallery.css';
import GumletImage from '../common/GumletImage';

interface Props {
    locationImages: string[];
    locationName: string;
}

// ─── Preload helper ──────────────────────────────────────────────────────────
// Store the actual HTMLImageElement objects, not just URLs.
// If we only store the URL string the browser garbage-collects the Image()
// before the network request completes and the "preload" does nothing.
const preloadCache = new Map<string, HTMLImageElement>();

function preloadImage(src: string) {
    if (!src || preloadCache.has(src)) return;
    const img = new window.Image();
    img.src = src;
    preloadCache.set(src, img); // strong reference keeps it alive in memory
}

function useAdjacentPreloader(images: string[], currentIndex: number) {
    useEffect(() => {
        if (!images.length) return;
        // Aggressively preload: current ±2 so fast clickers never wait
        [-2, -1, 0, 1, 2].forEach((offset) => {
            const i = (currentIndex + offset + images.length) % images.length;
            preloadImage(images[i]);
        });
    }, [images, currentIndex]);
}
// ────────────────────────────────────────────────────────────────────────────

const LocationImageGallery: React.FC<Props> = ({ locationImages, locationName }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPopupIndex, setSelectedPopupIndex] = useState(0);

    const [isMobile, setIsMobile] = useState(false);
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const thumbnailsRowRef = useRef<HTMLDivElement | null>(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    // Preload neighbours whenever the selected index changes
    useAdjacentPreloader(locationImages, selectedPopupIndex);

    // Preload all visible grid images on mount
    useEffect(() => {
        locationImages.slice(0, 5).forEach(preloadImage);
    }, [locationImages]);

    // Auto-scroll thumbnail strip so active thumb is always visible
    useEffect(() => {
        if (!thumbnailsRowRef.current) return;
        const strip = thumbnailsRowRef.current;
        const activeThumb = strip.children[selectedPopupIndex] as HTMLElement;
        if (!activeThumb) return;

        const stripLeft = strip.scrollLeft;
        const stripRight = stripLeft + strip.offsetWidth;
        const thumbLeft = activeThumb.offsetLeft;
        const thumbRight = thumbLeft + activeThumb.offsetWidth;

        if (thumbLeft < stripLeft) {
            strip.scrollTo({ left: thumbLeft - 12, behavior: 'smooth' });
        } else if (thumbRight > stripRight) {
            strip.scrollTo({ left: thumbRight - strip.offsetWidth + 12, behavior: 'smooth' });
        }
    }, [selectedPopupIndex]);

    // Lock background scrolling when the popup is open
    useEffect(() => {
        document.body.style.overflow = isPopupOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isPopupOpen]);

    // Keyboard navigation
    const handleNextImage = useCallback(() => {
        setSelectedPopupIndex((prev) => (prev + 1) % locationImages.length);
    }, [locationImages.length]);

    const handlePrevImage = useCallback(() => {
        setSelectedPopupIndex((prev) =>
            prev === 0 ? locationImages.length - 1 : prev - 1
        );
    }, [locationImages.length]);

    const closePopup = useCallback(() => setIsPopupOpen(false), []);

    useEffect(() => {
        if (!isPopupOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closePopup();
            else if (e.key === 'ArrowRight') handleNextImage();
            else if (e.key === 'ArrowLeft') handlePrevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPopupOpen, handleNextImage, handlePrevImage, closePopup]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!isMobile || !carouselRef.current || isUserInteracting || locationImages.length <= 1) return;
        const carousel = carouselRef.current;
        const interval = setInterval(() => {
            const width = carousel.offsetWidth;
            if (carousel.scrollLeft + width >= carousel.scrollWidth - 10) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: width, behavior: 'smooth' });
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [isMobile, isUserInteracting, locationImages]);

    const handleInteractionStart = () => setIsUserInteracting(true);
    const handleInteractionEnd = () => setTimeout(() => setIsUserInteracting(false), 3000);

    const openPopupWithImage = (index: number) => {
        setSelectedPopupIndex(index);
        setIsPopupOpen(true);
    };

    if (!locationImages || locationImages.length === 0) return null;

    const nextIdx = (selectedPopupIndex + 1) % locationImages.length;
    const prevIdx = (selectedPopupIndex - 1 + locationImages.length) % locationImages.length;

    return (
        <>
            <div
                className="location-gallery m-animate m-slide-up"
                style={{ animationDelay: '0.1s', marginBottom: '30px' }}
            >
                {isMobile ? (
                    /* ── Mobile carousel ───────────────────────────────── */
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
                            msOverflowStyle: 'none',
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
                                    overflow: 'hidden',
                                }}
                            >
                                <GumletImage
                                    containerClassName="h-full"
                                    src={image}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    alt={`Attraction in ${locationName}`}
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* ── Desktop grid ──────────────────────────────────── */
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gridTemplateRows: 'repeat(2, 170px)',
                            gap: '12px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        <div
                            className="hov-lift"
                            style={{ gridColumn: 'span 2', gridRow: 'span 2', position: 'relative', cursor: 'pointer' }}
                            onClick={() => openPopupWithImage(0)}
                        >
                            <div className="w-full h-full">
                                <GumletImage
                                    containerClassName="h-full"
                                    src={locationImages[0]}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    alt={locationName}
                                    priority
                                />
                            </div>
                        </div>

                        {locationImages.slice(1, 4).map((image, index) => (
                            <div
                                key={index}
                                className="hov-lift"
                                style={{ position: 'relative', cursor: 'pointer' }}
                                onClick={() => openPopupWithImage(index + 1)}
                            >
                                <GumletImage
                                    containerClassName="h-full"
                                    src={image}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    alt={`${locationName} view ${index + 1}`}
                                />
                            </div>
                        ))}

                        {locationImages.length > 4 && (
                            <div
                                className="hov-lift"
                                style={{ position: 'relative', cursor: 'pointer' }}
                                onClick={() => openPopupWithImage(4)}
                            >
                                <GumletImage
                                    containerClassName="h-full"
                                    src={locationImages[4]}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    alt={`${locationName} view 5`}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background-color 0.3s',
                                    }}
                                >
                                    <span className="h2 text-white" style={{ margin: 0, fontWeight: 600 }}>
                                        +{locationImages.length - 5}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Popup ────────────────────────────────────────────────── */}
            {!isMobile && isPopupOpen && (
                <div className="popup-overlay" onClick={closePopup}>
                    <link rel="preload" as="image" href={locationImages[nextIdx]} />
                    <link rel="preload" as="image" href={locationImages[prevIdx]} />

                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closePopup}>×</button>

                        <div className="popup-main-image">
                            <button
                                className="popup-nav-button left"
                                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                                aria-label="Previous Image"
                            >
                                ‹
                            </button>

                            <GumletImage
                                containerClassName="h-full w-full relative"
                                src={locationImages[selectedPopupIndex]}
                                fill
                                style={{ objectFit: 'contain' }}
                                alt={`Main view of ${locationName}`}
                                priority
                            />

                            <button
                                className="popup-nav-button right"
                                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                                aria-label="Next Image"
                            >
                                ›
                            </button>
                        </div>

                        <div className="popup-thumbnails-row" ref={thumbnailsRowRef}>
                            {locationImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`popup-thumbnail ${index === selectedPopupIndex ? 'active' : ''}`}
                                    onClick={() => setSelectedPopupIndex(index)}
                                    onMouseEnter={() => preloadImage(image)}
                                >
                                    <GumletImage
                                        containerClassName="h-full w-full relative"
                                        src={image}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        alt={`Thumbnail ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LocationImageGallery;