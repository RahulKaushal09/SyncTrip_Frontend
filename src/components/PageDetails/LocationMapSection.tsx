'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import { ArrowUpRight } from "lucide-react";

// TypeScript props
interface LocationMapSectionProps {
    latitude: number;
    longitude: number;
}

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
    ssr: false,
    loading: () => <p>Loading map...</p>,
});
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
// Popup can be used if needed, keeping it out for now

// Custom Leaflet marker icon
const customIcon = new L.Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
import 'leaflet/dist/leaflet.css';
import '../../../styles/LocationMap.css';

const LocationMapSection: React.FC<LocationMapSectionProps> = ({ latitude, longitude }) => {
    const [position, setPosition] = useState<[number, number]>([latitude, longitude]);

    useEffect(() => {
        if (latitude && longitude) {
            setPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

    return (
        <div className="location-map" aria-label="Location map showing the destination">
            <div className="d-flex" style={{ justifyContent: 'space-between', alignItems: 'start' }}>
                <h2 className="DescriptionHeading"><strong>Location</strong></h2>
                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="get-direction DescriptionHighlightText"
                >
                    Get Direction <span><ArrowUpRight size={18} /></span>
                </a>
            </div>

            <div className="map-container" style={{ height: '300px', width: '100%' }}>
                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={position} icon={customIcon} />
                </MapContainer>
            </div>
        </div>
    );
};

export default LocationMapSection;
