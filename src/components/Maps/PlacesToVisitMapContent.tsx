'use client';

import React, { useEffect, useRef, useState } from 'react';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import {
    FaMapMarkerAlt,
    FaMountain,
    FaPlaceOfWorship,
    FaMonument,
    FaTree,
    FaWater,
    FaStar,
} from 'react-icons/fa';
import { API_CONFIG } from '@/constants';


type Coordinates = {
    lat: number;
    long: number;
};

type Place = {
    id: string;
    title: string;
    rating?: string;
    description?: string;
    image?: string[];
    coordinates: Coordinates;
};

interface PlacesToVisitMapProps {
    places: Place[];
}

// Fix leaflet's default icon URLs for Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const ICON_BASE = API_CONFIG.ICON_BASE_URL || '';

const getCustomIconUrl = (title: string): string => {
    const lower = title.toLowerCase();
    if (/raft|rafting/.test(lower)) return `${ICON_BASE}/raftingIconMap.png`;
    if (/(temple|mandir|church|mosque|gurudwara|shrine)/.test(lower)) return `${ICON_BASE}/templeIconMap.png`;
    if (/(trek|hike|mountain|peak|hill)/.test(lower)) return `${ICON_BASE}/trekkingIconMap.png`;
    if (/(beach|sea|ocean|coast)/.test(lower)) return `${ICON_BASE}/beachIconMap.png`;
    if (/(lake|river|dam)/.test(lower)) return `${ICON_BASE}/waterBodyIconMap.png`;
    if (/waterfall/.test(lower)) return `${ICON_BASE}/waterfallIconMap2.png`;
    if (/(fort|palace|castle|haveli)/.test(lower)) return `${ICON_BASE}/fortIconMap.png`;
    if (/(museum|gallery|monument|memorial)/.test(lower)) return `${ICON_BASE}/monumentIconMap.png`;
    if (/(park|garden|forest)/.test(lower)) return `${ICON_BASE}/forestIconMap.png`;
    if (/wildlife/.test(lower)) return `${ICON_BASE}/wildLifeIconMap.png`;
    return `${ICON_BASE}/monumentIconMap.png`;
};

const getPlaceIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (/(temple|mandir|church|mosque|gurudwara|shrine)/.test(lower)) return <FaPlaceOfWorship className="text-blue-600" />;
    if (/(trek|hike|mountain|peak|hill)/.test(lower)) return <FaMountain className="text-blue-600" />;
    if (/(beach|sea|ocean|coast|lake|river|waterfall|dam)/.test(lower)) return <FaWater className="text-blue-600" />;
    if (/(museum|gallery|monument|memorial|fort|palace|castle|haveli)/.test(lower)) return <FaMonument className="text-blue-600" />;
    if (/(park|garden|forest|wildlife)/.test(lower)) return <FaTree className="text-blue-600" />;
    return <FaMapMarkerAlt className="text-blue-600" />;
};

const getPlaceCategory = (title: string): string => {
    const lower = title.toLowerCase();
    if (/raft|rafting/.test(lower)) return 'rafting';
    if (/(temple|mandir|church|mosque|gurudwara|shrine)/.test(lower)) return 'temple';
    if (/(trek|hike|mountain|peak|hill)/.test(lower)) return 'trekking';
    if (/(beach|sea|ocean|coast)/.test(lower)) return 'beach';
    if (/(lake|river|dam)/.test(lower)) return 'waterbody';
    if (/waterfall/.test(lower)) return 'waterfall';
    if (/(fort|palace|castle|haveli)/.test(lower)) return 'fort';
    if (/(museum|gallery|monument|memorial)/.test(lower)) return 'monument';
    if (/(park|garden|forest)/.test(lower)) return 'forest';
    if (/wildlife/.test(lower)) return 'wildlife';
    return 'monument';
};

const filterMajorityRegion = (places: Place[]): Place[] => {
    const coords = places.map(p => [p.coordinates.lat, p.coordinates.long]);

    const median = (arr: number[]): number => {
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    const latMedian = median(coords.map(c => c[0]));
    const lngMedian = median(coords.map(c => c[1]));

    const distance = (lat: number, lng: number) =>
        Math.sqrt((lat - latMedian) ** 2 + (lng - lngMedian) ** 2);

    const distances = coords.map(([lat, lng]) => distance(lat, lng));
    const cutoff = [...distances].sort((a, b) => a - b)[Math.floor(distances.length * 0.8)];

    return places.filter((p, i) => distance(p.coordinates.lat, p.coordinates.long) <= cutoff);
};

const FitMajorityBounds: React.FC<{ places: Place[] }> = ({ places }) => {
    const map = useMap();

    useEffect(() => {
        if (!places || places.length === 0) return;
        const core = filterMajorityRegion(places);
        const bounds = L.latLngBounds(core.map(p => [p.coordinates.lat, p.coordinates.long]));
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [places, map]);

    return null;
};

const PlacesToVisitMap: React.FC<PlacesToVisitMapProps> = ({ places }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const filterRef = useRef<HTMLDivElement>(null);
    const [filterWidth, setFilterWidth] = useState<number>(0);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [shouldRenderFilter, setShouldRenderFilter] = useState<boolean>(true);

    useEffect(() => {
        if (showFilter && filterRef.current) {
            setFilterWidth(filterRef.current.offsetWidth);
        }
    }, [showFilter]);

    const availableCategories = Array.from(
        new Set(places.map(place => getPlaceCategory(place.title)))
    );

    const filteredPlaces =
        selectedCategory === 'all'
            ? places
            : places.filter(p => getPlaceCategory(p.title) === selectedCategory);

    const defaultCenter: LatLngExpression = [20.5937, 78.9629]; // Center of India

    return (
        <div className="places-to-visit-map-container">
            {/* Filter toggle button */}
            <div
                className="filter-toggle-button"
                onClick={() => setShowFilter(!showFilter)}
                style={{
                    transform: showFilter ? `translateX(-${filterWidth}px)` : 'translateX(0)',
                    transition: 'transform 0.1s ease-in-out',
                }}
            >
                <span className="arrow-icon">{showFilter ? '➤' : '◀'}</span> {showFilter ? '' : 'Show Filters'}
            </div>

            {/* Filters */}
            {shouldRenderFilter && (
                <div
                    ref={filterRef}
                    className={`places-filter-container-slide ${showFilter ? 'show' : 'hide'} ${!showFilter ? 'display-none' : ''
                        }`}
                >
                    <div className="places-filter-scroll">
                        <div className="places-filter-scroll-flex-box">
                            <div
                                className={`places-filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setSelectedCategory('all')}
                            >
                                <span className="places-filter-label">All</span>
                                <span className="places-filter-count">{places.length}</span>
                            </div>

                            {availableCategories.map(cat => {
                                const count = places.filter(p => getPlaceCategory(p.title) === cat).length;
                                return (
                                    <div
                                        key={cat}
                                        className={`places-filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        <span className="places-filter-label">{cat}</span>
                                        <span className="places-filter-count">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Map */}
            <MapContainer
                center={defaultCenter}
                zoom={5}
                zoomControl={false}
                style={{ height: '70vh', width: '100%', borderRadius: '20px' }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitMajorityBounds places={filteredPlaces} />
                {filteredPlaces.map(place => (
                    <Marker
                        key={place.id}
                        position={[place.coordinates.lat, place.coordinates.long]}
                        icon={L.icon({ iconUrl: getCustomIconUrl(place.title) })}
                    >
                        <Popup>
                            <div className="text-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <Image
                                        src={getCustomIconUrl(place.title)}
                                        alt={place.title}
                                        width={24}
                                        height={24}
                                        className="inline-block"
                                    />
                                    {/* <FontAwesomeIcon icon={getPlaceIcon(place.title)} className="text-blue-600" /> */}
                                    <strong>{place.title}</strong>
                                </div>
                                {place.rating && (
                                    <div className="flex items-center text-yellow-500 text-xs">
                                        {/* <FontAwesomeIcon icon={faStar} className="mr-1" /> */}
                                        <FaStar className="mr-1" />
                                        Rating: {place.rating}
                                    </div>
                                )}
                                {place.description && (
                                    <p className="mt-1 text-gray-600">{place.description}</p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default PlacesToVisitMap;
