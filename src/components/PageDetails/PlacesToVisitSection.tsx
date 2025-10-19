'use client';

import React, { useEffect, useState } from 'react';
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

    const [activePlaceShow, setActivePlaceShow] = useState(places.length);
    const [previousShowMore, setPreviousShowMore] = useState(6);
    const [showMap, setShowMap] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' && window.innerWidth < 768);
    useEffect(() => {
        activePlaceShow > 6 ? setActivePlaceShow(6) : setActivePlaceShow(places.length);
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);
    const toggleShowOnMap = () => {
        setShowMap(!showMap);
    };
    if (isLoading) {
        return (<div className="placesToVisitGrid" style={{ display: "grid", marginBottom: 50 }}>
            {Array.from({ length: 8 }).map((_, i) => (
                <LocationCardSkeleton key={i} />
            ))}
        </div>)
    }
    return (
        <div className="hotels-container" style={{ marginBottom: "50px" }}>
            {places.length !== 0 && (
                <div className="heading-with-map-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className='DescriptionHeading'>
                        <strong>Top {places.length} Places To Visit in {title?.replace(/[0-9.]/g, '')}</strong>
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label className="switch">
                            <input type="checkbox" onChange={toggleShowOnMap} />
                            <span className="slider round"></span>
                        </label>
                        <span style={{ width: "90px" }}>{showMap ? "Hide Map" : "Show Map"}</span>
                    </div>
                </div>
            )}
            {showMap && <PlacesToVisitMap places={places} />}
            {!showMap && (
                <div className="placesToVisitGrid">
                    {places.slice(0, activePlaceShow).map((place, index) => (
                        <LocationCard
                            key={place.id}
                            isWishlisted={place.isWishlisted}
                            placeConnectedwithid={place.locationConnectedWith}
                            name={place.title}
                            rating={place.rating}
                            images={place.image}
                            inlineStyle={{ width: isMobile ? "100%" : "260px" }}
                            imageInlineStyle={{ width: isMobile ? 500 : 260 }}
                            whishlistParentId={parentId}
                            whishlistParentType={parentType}
                            typeOfWhishlistCardEnum={WishlistTypeEnum.placeToVisit}
                            cardId={place.id}
                            typeOfCard={typeOfLocationCardEnum.placestovisit}
                        />
                    ))}
                </div>
            )}
            {!showMap && previousShowMore < places.length && (
                <button
                    className='view-more-btn mt-2'
                    onClick={() => {
                        const nextShowCount = activePlaceShow + 6;
                        setActivePlaceShow(Math.min(nextShowCount, places.length));
                        setPreviousShowMore(Math.min(nextShowCount, places.length));
                    }}
                >
                    Show More
                </button>
            )}
        </div>
    );
};

export default PlacesToVisitSection;
