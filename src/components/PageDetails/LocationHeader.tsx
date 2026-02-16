'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Star, Share2, Compass } from "lucide-react";

import "../../../styles/LocationEventsDetails.css"; 

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
        <div 
            className="locationEventsDetails m-animate m-fade-in" 
            style={{ 
                position: 'relative', 
                background: 'linear-gradient(135deg, var(--secondary-5) 0%, var(--white) 100%)', 
                borderRadius: '16px', 
                padding: isMobile ? '16px 20px' : '20px 32px', 
                border: '0.5px solid var(--secondary-3)', 
                overflow: 'hidden', 
                boxShadow: '0 4px 20px -5px rgba(22, 50, 79, 0.08)',
                marginBottom: '24px'
            }}
        >
            <div style={{ position: 'absolute', top: '-20px', right: '-10px', opacity: 0.03, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>
               <Compass size={140} color="var(--secondary-1)" />
            </div>

            {isMobile ? (
                /* =========================================
                   📱 MOBILE LAYOUT (Ultra Compact)
                   ========================================= */
                <div className="m-stagger" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    {/* Top Row: Meta info (Left) & Share Icon (Right) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        
                        {/* Meta: Country • Type • Rating inline */}
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
                            <span className="s1" style={{ color: 'var(--primary-hover)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={12} strokeWidth={2.5} /> {country || "India"}
                            </span>
                            <span style={{ color: 'var(--neutral-3)' }}>•</span>
                            <span className="s1 text-secondary-1" style={{ textTransform: 'uppercase', opacity: 0.7 }}>
                                {type || "Destination"}
                            </span>
                            <span style={{ color: 'var(--neutral-3)' }}>•</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Star size={12} fill="var(--warning-1)" color="var(--warning-1)" />
                                <span className="s1 text-secondary-1" style={{ fontWeight: 700 }}>{rating || "New"}</span>
                            </div>
                        </div>

                        {/* Share: Compact Icon Button */}
                        <button
                            onClick={handleShare}
                            className="btn-secondary-outline hov-lift"
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                padding: '6px 10px', 
                                borderRadius: '8px', 
                                height: 'auto',
                                flexShrink: 0
                            }}
                            aria-label="Share this destination"
                        >
                            <Share2 size={16} />
                        </button>
                    </div>

                    {/* Bottom Column: Title & Address */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <h1 className="h2 !text-sans text-secondary-1" style={{ margin: 0, lineHeight: 1.2 }}>
                            {title}
                        </h1>
                        {address && (
                            <p className="r3 text-neutral-1" style={{ margin: 0, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                {/* flexShrink: 0 ensures the dot doesn't get squished if the address wraps */}
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-1)', marginTop: '5px', flexShrink: 0 }}></span>
                                {address}
                            </p>
                        )}
                    </div>

                </div>
            ) : (
                /* =========================================
                   💻 DESKTOP LAYOUT (Sleek Banner)
                   ========================================= */
                <div className="m-stagger" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '1 1 min-content' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span className="s1" style={{ color: 'var(--primary-hover)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={12} strokeWidth={2.5} /> {country || "India"}
                            </span>
                            <span style={{ color: 'var(--neutral-3)' }}>•</span>
                            <span className="s1 text-secondary-1" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.7 }}>
                                {type || "Destination"}
                            </span>
                        </div>

                        <h1 className="h2 !text-sans text-secondary-1" style={{ margin: 0, lineHeight: 1.2 }}>
                            {title}
                        </h1>
                        
                        {address && (
                            <p className="r3 text-neutral-1" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-1)' }}></span>
                                {address}
                            </p>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className="hov-lift" style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--white)', padding: '8px 16px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid var(--neutral-4)' }}>
                            <Star size={16} fill="var(--warning-1)" color="var(--warning-1)" />
                            <span className="b2 text-secondary-1">{rating || "New"}</span>
                        </div>

                        <button
                            onClick={handleShare}
                            className="btn-secondary hov-lift"
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                padding: '8px 16px', 
                                borderRadius: '12px', 
                                border: 'none',
                                height: 'auto' 
                            }}
                        >
                            <Share2 size={16} />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationHeader;