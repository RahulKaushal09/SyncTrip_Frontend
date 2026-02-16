'use client';

import React, { useState } from 'react';
import { 
    Thermometer, 
    Clock, 
    CalendarHeart, 
    CloudSun, 
    Sun, 
    Cloud, 
    Map, 
    Info, 
    ChevronDown, 
    ChevronUp 
} from "lucide-react";

import { PageTypeEnum } from '@/constants';
import '../../../styles/Description.css'; 

interface DescriptionProps {
    pageType: string | null;
    shortDescription?: string;
    fullDescription?: string;
    bestTime?: string;
    showEssentials?: boolean;
}

const Description = ({ pageType, shortDescription, fullDescription, bestTime, showEssentials = true }: DescriptionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        /* UI CHANGE: Wrapped the entire container in your global entrance animation */
        <div className="travel-info-container m-animate m-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '20px' }}>
            
            {pageType !== PageTypeEnum.TRIP && showEssentials && (
                <div className="m-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* =========================================
                        🌟 ESSENTIALS SECTION (Bento Grid Layout)
                        ========================================= */}
                    <div>
                        <h2 className="h3 text-secondary-1" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Info size={22} color="var(--primary-1)" /> 
                            Trip Essentials
                        </h2>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                            gap: '16px' 
                        }}>
                            {/* Essential Card 1 */}
                            <div className="hov-lift" style={{ backgroundColor: 'var(--primary-5)', border: '1px solid var(--primary-3)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ backgroundColor: 'var(--white)', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                    <Thermometer size={20} color="var(--primary-1)" />
                                </div>
                                <div>
                                    <div className="s1 text-neutral-1 text-uppercase">Avg Weather</div>
                                    <div className="b2 text-secondary-1">32°C</div>
                                </div>
                            </div>

                            {/* Essential Card 2 */}
                            <div className="hov-lift" style={{ backgroundColor: 'var(--primary-5)', border: '1px solid var(--primary-3)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ backgroundColor: 'var(--white)', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                    <Clock size={20} color="var(--primary-1)" />
                                </div>
                                <div>
                                    <div className="s1 text-neutral-1 text-uppercase">Ideal Duration</div>
                                    <div className="b2 text-secondary-1">5 days</div>
                                </div>
                            </div>

                            {/* Essential Card 3 */}
                            <div className="hov-lift" style={{ backgroundColor: 'var(--primary-5)', border: '1px solid var(--primary-3)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ backgroundColor: 'var(--white)', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                    <CalendarHeart size={20} color="var(--primary-1)" />
                                </div>
                                <div>
                                    <div className="s1 text-neutral-1 text-uppercase">Best Time</div>
                                    <div className="b2 text-secondary-1">{bestTime || 'Year round'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =========================================
                        ⛅ WEATHER FORECAST SECTION
                        ========================================= */}
                    <div>
                        <h2 className="h4 text-secondary-1" style={{ marginBottom: '16px' }}>Upcoming Forecast</h2>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            
                            {/* Weather Pill 1 */}
                            <div className="chip" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', cursor: 'default' }}>
                                <Sun size={18} color="var(--warning-1)" fill="var(--warning-1)" />
                                <span className="b3 text-secondary-1">Mon: 32°C</span>
                            </div>
                            
                            {/* Weather Pill 2 */}
                            <div className="chip" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', cursor: 'default' }}>
                                <CloudSun size={18} color="var(--warning-1)" />
                                <span className="b3 text-secondary-1">Tue: 31°C</span>
                            </div>

                            {/* Weather Pill 3 */}
                            <div className="chip" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', cursor: 'default' }}>
                                <Cloud size={18} color="var(--neutral-2)" fill="var(--neutral-4)" />
                                <span className="b3 text-secondary-1">Wed: 29°C</span>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* =========================================
                📝 DESCRIPTION / ITINERARY SECTION
                ========================================= */}
            <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--neutral-4)', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                
                <h2 className="h4 text-secondary-1" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    {pageType === PageTypeEnum.TRIP ? (
                        <><Map size={24} color="var(--primary-1)" /> Your Itinerary</>
                    ) : (
                        <><Info size={24} color="var(--primary-1)" /> About this Destination</>
                    )}
                </h2>

                {/* UI CHANGE: Removed the dangerous JS `.slice()` and replaced it with your global CSS `.clamp-4`. 
                    This perfectly truncates text natively without breaking raw HTML tags! */}
                <div 
                    className={`r2 text-justify text-neutral-1 ${!isExpanded ? 'clamp-4' : ''}`}
                    style={{ lineHeight: '1.8', transition: 'all 0.3s ease' }}
                    dangerouslySetInnerHTML={{
                        __html: fullDescription || shortDescription || 'No description available.'
                    }}
                />

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-start' }}>
                    <button
                        className="btn-secondary-outline hov-lift"
                        onClick={toggleDescription}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            padding: '10px 24px', 
                            borderRadius: '20px', 
                            fontWeight: 600,
                            backgroundColor: 'transparent'
                        }}
                    >
                        {isExpanded ? 'Read Less' : 'Read More'}
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Description;