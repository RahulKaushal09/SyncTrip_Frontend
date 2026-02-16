'use client';

import React, { useEffect, useState } from 'react';
import { Map, LayoutGrid, ChevronDown, MapPin } from "lucide-react";

import '../../../styles/HotelSection.css';
import '../../../styles/PlacesToVisitSection.css';
import LocationCard from '../LocationCard/LocationCard';
import PlacesToVisitMap from './../Maps/PlacesToVisitMap';
import { typeOfLocationCardEnum, WishlistTypeEnum } from '@/constants';
import { PlacesToVisit } from '@/types';
import LocationCardSkeleton from '../LocationCard/LocationCardSkeleton';

interface Coordinates {
    lat: number;
    long: number;
}

interface Props {
    title: string;
    places: PlacesToVisit[];
    parentId: string;
    parentType: string;
    isLoading?: boolean;
}

const PlacesToVisitSection: React.FC<Props> = ({ title, places, parentId, parentType, isLoading }) => {
    
    // UI CHANGE: Simplified the initialization to start at 6 natively, 
    // removing the need for an awkward useEffect to clamp it on mount.
    const [activePlaceShow, setActivePlaceShow] = useState(6);
    const [showMap, setShowMap] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); // Set immediately on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleShowOnMap = () => {
        setShowMap(!showMap);
    };

    if (isLoading) {
        return (
            <div className="m-animate m-fade-in" style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
                gap: "24px", 
                marginBottom: "50px" 
            }}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <LocationCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!places || places.length === 0) return null;

    return (
        <div className="hotels-container m-animate m-slide-up" style={{ marginBottom: "60px", marginTop: "20px" }}>
            
            {/* =========================================
                HEADER & TOGGLE SECTION
                ========================================= */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '16px', 
                marginBottom: '24px' 
            }}>
                <h2 className="h4 text-secondary-1" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <MapPin size={24} color="var(--primary-1)" />
                    Top {places.length} Places To Visit in {title?.replace(/[0-9.]/g, '')}
                </h2>

                {/* UI CHANGE: Replaced the old native HTML slider switch with a premium, 
                    app-like pill toggle using Lucide icons and your global theme colors. */}
                <button
                    onClick={toggleShowOnMap}
                    className="chip hov-lift"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        border: '1px solid var(--neutral-3)',
                        // Dynamic styling based on state
                        backgroundColor: showMap ? 'var(--primary-1)' : 'var(--white)',
                        color: showMap ? 'var(--white)' : 'var(--secondary-1)',
                        transition: 'all 0.3s ease'
                    }}
                    aria-label={showMap ? "Switch to grid view" : "Switch to map view"}
                >
                    {showMap ? <LayoutGrid size={18} /> : <Map size={18} />}
                    <span style={{ fontWeight: 600 }}>{showMap ? "Show Grid" : "Show Map"}</span>
                </button>
            </div>

            {/* =========================================
                MAP VIEW
                ========================================= */}
            {showMap && (
                <div className="m-animate m-fade-in" style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--neutral-4)' }}>
                    <PlacesToVisitMap places={places} />
                </div>
            )}

            {/* =========================================
                GRID VIEW
                ========================================= */}
            {!showMap && (
                <div className="m-stagger">
                    {/* UI CHANGE: Switched to a robust native CSS Grid. 
                        This eliminates the need for manual JS width calculations inside the LocationCard. */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                        gap: '24px' 
                    }}>
                        {places.slice(0, activePlaceShow).map((place) => (
                            <LocationCard
                                key={place.id}
                                isWishlisted={place.isWishlisted}
                                placeConnectedwithid={place.locationConnectedWith}
                                name={place.title}
                                rating={place.rating}
                                images={place.image}
                                // UI CHANGE: Because we use CSS grid parent, we force width 100% so it perfectly fills its grid cell
                                inlineStyle={{ width: "100%" }}
                                imageInlineStyle={{ width: "100%" }}
                                whishlistParentId={parentId}
                                whishlistParentType={parentType}
                                typeOfWhishlistCardEnum={WishlistTypeEnum.placeToVisit}
                                cardId={place.id}
                                typeOfCard={typeOfLocationCardEnum.placestovisit}
                            />
                        ))}
                    </div>

                    {/* =========================================
                        PAGINATION BUTTON
                        ========================================= */}
                    {activePlaceShow < places.length && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                            {/* UI CHANGE: Upgraded to the premium outline button format from the global CSS */}
                            <button
                                className="btn-secondary-outline hov-lift"
                                onClick={() => setActivePlaceShow(Math.min(activePlaceShow + 6, places.length))}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 32px',
                                    borderRadius: '24px',
                                    backgroundColor: 'transparent'
                                }}
                            >
                                Show More <ChevronDown size={18} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlacesToVisitSection;