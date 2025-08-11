'use client';

import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import '../../../styles/nearbyExplore.css';
import { ApiService } from '@/utils';
import { triggerLogin, isUserLoggedIn } from './../../utils/login.utils';
import { exploreNearByApiResponse } from '@/classes/ApiResponse.classes';
import { Location, PlacesToVisit, Restaurants } from '@/types';
import { Compass } from "lucide-react";

interface Coordinates {
    lat: number;
    long: number;
}




const ExploreNearby: React.FC = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRadiusPopup, setShowRadiusPopup] = useState(false);
    const [showResultPopup, setShowResultPopup] = useState(false);
    const [radius, setRadius] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [locationPermission, setLocationPermission] = useState<string | null>(null);
    const [results, setResults] = useState<exploreNearByApiResponse | null>(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'locations' | 'placesToVisit' | 'restaurants'>('locations');
    const [searchQuery, setSearchQuery] = useState('');
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    // Check geolocation permission
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                setLocationPermission(result.state);
            });
        }
    }, []);

    const filteredResults = {
        locations: results?.locations?.filter(item =>
            item.title?.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [],
        placesToVisit: results?.placesToVisit?.filter(item =>
            item.title?.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [],
        restaurants: results?.restaurants?.filter(item =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [],
    };

    const handleExploreClick = () => {
        setShowRadiusPopup(true);
    };

    const handleDiscoverNearby = async () => {
        if (!isUserLoggedIn()) {
            setShowRadiusPopup(false);
            triggerLogin(handleDiscoverNearby, { skipCompleteProfile: true });
            return;
        }

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser');
            return;
        }

        setShowRadiusPopup(false);
        setIsLoading(true);
        setError('');
        setResults(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                console.log('User Location:', latitude, longitude);

                try {
                    const data = await ApiService.fetchNearbyEntities(latitude, longitude, radius);
                    setResults(data);
                    setIsLoading(false);
                    setShowResultPopup(true);
                } catch (err) {
                    setError("Failed to fetch nearby places. Please try again.");
                    setIsLoading(false);
                }
            },
            (error) => {
                setError('Location access denied. Please allow location access to continue.');
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleGetDirections = (coordinates: Coordinates) => {
        if (coordinates.lat && coordinates.long) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.long}`;
            window.open(url, '_blank');
        } else {
            alert('Coordinates not available for this location.');
        }
    };

    // function isLocation(item: Location): item is Location {
    //     return 'type' in item && item.type?.toLowerCase() == "location";
    // }

    // function isPlacesToVisit(item: PlacesToVisit): item is PlacesToVisit {
    //     return 'type' in item && item.type?.toLowerCase() == "placestovisit";
    // }

    // function isRestaurant(item: Restaurants): item is Restaurants {
    //     return 'type' in item && item.type?.toLowerCase() == "restaurant";
    // }
    const renderLocationCard = (location: Location) => {
        const title = location.title || 'Untitled Location';
        const description = location.description || 'No description available';
        const rating = location.rating || '3';
        const distance = 'distance' in location && location.distance
            ? (location.distance as number / 1000).toFixed(1) + ' km' as string
            : null;
        const coordinates = location.fullDetails?.coordinates;
        const images = location.images || location.photos || [];
        return renderResultCard(location.id, title, description, parseInt(rating), distance as string, coordinates as Coordinates, images);
    }
    const renderPlacesToVisitCard = (place: PlacesToVisit) => {
        const title = place.title || 'Untitled Place';
        const description = place.description || 'No description available';
        const rating = place.rating || '3';
        const distance = 'distance' in place && place.distance
            ? (place.distance as number / 1000).toFixed(1) + ' km' as string
            : null;
        const coordinates = place.coordinates;
        const images = place.images || [];
        return renderResultCard(place.id, title, description, parseInt(rating), distance as string, coordinates as Coordinates, images);
    }
    const renderRestaurantCard = (restaurant: Restaurants) => {
        const title = restaurant.name || 'Untitled Restaurant';
        const description = restaurant.description || 'No description available';
        const rating = restaurant.rating || 3;
        const distance = 'distance' in restaurant && restaurant.distance
            ? (restaurant.distance as number / 1000).toFixed(1) + ' km' as string
            : null;
        const coordinates = restaurant.coordinates;
        const images = restaurant.images || [];
        return renderResultCard(restaurant.id, title, description, rating, distance as string, coordinates as Coordinates, images);
    }

    const renderResultCard = (id: string, title: string, description: string, rating: number, distance: string, coordinates: Coordinates, images: string[]) => {
        // let title: string;

        // if (isLocation(item)) {
        //     title = item.title;
        // } else if (isPlacesToVisit(item)) {
        //     title = item.title;
        // } else if (isRestaurant(item)) {
        //     title = item.name;
        // } else {
        //     title = 'Untitled';
        // }

        // const description = item.description || 'No description available';

        // const rating = (isLocation(item as Location) && item.rating)
        //     || (isPlacesToVisit(item as PlacesToVisit) && item.rating)
        //     || (isRestaurant(item as Restaurants) && (item.rating));

        // const distance = 'distance' in item && item.distance
        //     ? (item.distance as number / 1000).toFixed(1) + ' km' as string
        //     : null;

        // const coordinates =
        //     (isLocation(item) && (item?.fullDetails?.coordinates || item.fullDetails?.coordinates)) ||
        //     (isPlacesToVisit(item) && item.coordinates) ||
        //     (isRestaurant(item) && item.coordinates) || undefined;

        // const images = [
        //     ...(isLocation(item) ? item.images || item.photos || [] :
        //         isPlacesToVisit(item) ? item.images || [] :
        //             isRestaurant(item) ? item.images || [] : [])
        // ].filter(Boolean);

        const fallbackImage = 'https://via.placeholder.com/300x200?text=No+Image';

        return (
            <div key={id} className="col-md-4 col-lg-3 mb-3">
                <div className="card h-100 shadow result-card border-0">
                    <div className='item-coordinates'>
                        {coordinates?.lat && coordinates?.long && (
                            <span className="coordinates" onClick={() => handleGetDirections(coordinates)}>Get directions</span>
                        )}
                    </div>

                    {images.length > 1 ? (
                        <Carousel interval={null} indicators={false} style={{ borderRadius: '8px' }}>
                            {images.map((imgUrl, idx) => (
                                <Carousel.Item key={idx}>
                                    <img
                                        src={imgUrl}
                                        className="d-block w-100"
                                        alt={`Slide ${idx + 1}`}
                                        style={{ height: '300px', objectFit: 'cover' }}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    ) : (
                        <img
                            src={images[0] || fallbackImage}
                            className="card-img-top"
                            alt={title}
                            style={{ height: '300px', objectFit: 'cover' }}
                        />
                    )}

                    <div className="card-body cardTitle-nearby d-flex flex-column">
                        <h5 className="card-title-nearby">{title}</h5>
                        <p className="card-text-nearby">{description.substring(0, 120)}...</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            {rating && (
                                <div className="mb-2">
                                    <span className="badge bg-success">
                                        ⭐ {typeof rating === 'number' ? rating.toFixed(1) : rating}
                                    </span>
                                </div>
                            )}
                            {distance && (
                                <small className="text-muted">
                                    <i className="fas fa-location-arrow me-1"></i>
                                    {distance}
                                </small>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // const renderResults = () => {
    //     if (!results) return null;

    //     return (
    //         <div className="results-container mt-5">
    //             <div className="container">
    //                 <div className="results-header text-center mb-4">
    //                     <h2 style={{ color: '#61dafb', fontWeight: 700 }}>
    //                         <i className="fas fa-map-marked-alt me-2"></i>
    //                         Nearby Discoveries
    //                     </h2>
    //                     <p className="text-muted">Within {radius} km of your location</p>
    //                 </div>

    //                 <div className="section mb-5">
    //                     <h3 className="section-title">
    //                         <span className="section-icon">📍</span> Locations
    //                     </h3>
    //                     <div className="row">
    //                         {results.locations.map(renderLocationCard)}
    //                     </div>
    //                 </div>

    //                 <div className="section mb-5">
    //                     <h3 className="section-title">
    //                         <span className="section-icon">🗺️</span> Places to Visit
    //                     </h3>
    //                     <div className="row">
    //                         {results.placesToVisit.map(renderPlacesToVisitCard)}
    //                     </div>
    //                 </div>

    //                 <div className="section mb-5">
    //                     <h3 className="section-title">
    //                         <span className="section-icon">🍽️</span> Restaurants
    //                     </h3>
    //                     <div className="row">
    //                         {results.restaurants.map(renderRestaurantCard)}
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // };

    return (
        <div className="nearby-component">
            <style jsx>{`
        .modal {
          display: ${showLoginModal ? 'block' : 'none'};
          position: fixed;
          z-index: 4000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          backdrop-filter: blur(5px);
        }
      `}</style>


            <button
                className="floating-explore-btn"
                onClick={handleExploreClick}
            >
                {/* <i className="fas fa-compass"></i> */}
                <Compass/>
                Explore Nearby
            </button>

            {showRadiusPopup && (
                <div className="popup-overlay-nearby">
                    <div className="popup-content-nearby">
                        <button
                            className="close-btn"
                            onClick={() => setShowRadiusPopup(false)}
                        >
                            ×
                        </button>

                        <div className="popup-header">
                            <h3>
                                <i className="fas fa-search-location me-2"></i>
                                Set Search Radius
                            </h3>
                            <p>Choose how far you&apos;d like to explore</p>
                        </div>

                        <div className="radius-control">
                            <label className="radius-label">Search Distance</label>
                            <div className="radius-display">
                                <div className="radius-value">{radius} km</div>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="150"
                                value={radius}
                                onChange={(e) => setRadius(parseInt(e.target.value))}
                                className="radius-slider"
                            />
                            <div className="slider-labels">
                                <span>1 km</span>
                                <span>150 km</span>
                            </div>
                        </div>

                        <button
                            className="discover-btn"
                            onClick={handleDiscoverNearby}
                            disabled={isLoading}
                        >
                            <i className="fas fa-rocket me-2"></i>
                            Start Exploring
                        </button>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <div className="loading-text">Discovering Amazing Places</div>
                        <div className="loading-subtext">Finding the best spots within {radius} km...</div>
                    </div>
                </div>
            )}

            {error && (
                <div className="container mt-3">
                    <div className="error-message">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                </div>
            )}

            {results && showResultPopup && (
                <div className="popup-overlay-nearby">
                    <div className="popup-content-nearby large-popup">
                        <button className="close-btn" onClick={() => setShowResultPopup(false)}>×</button>
                        <div className="popup-header text-center">
                            <h3><i className="fas fa-map-marked-alt me-2"></i> Nearby Discoveries</h3>
                            <p>Within {radius} km of your location</p>
                        </div>
                        <div className="filter-tabs d-flex justify-content-around mb-3">
                            {(['locations', 'placesToVisit', 'restaurants'] as const).map(tab => (
                                <button
                                    key={tab}
                                    className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === 'locations' && 'Locations'}
                                    {tab === 'placesToVisit' && 'Places to Visit'}
                                    {tab === 'restaurants' && 'Restaurants'}
                                </button>
                            ))}
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={`Search ${activeTab}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="results-scroll">
                            <div className="row">
                                {activeTab === 'locations' && filteredResults[activeTab]?.map(renderLocationCard)}
                                {activeTab === 'placesToVisit' && filteredResults[activeTab]?.map(renderPlacesToVisitCard)}
                                {activeTab === 'restaurants' && filteredResults[activeTab]?.map(renderRestaurantCard)}
                                {!filteredResults[activeTab]?.length && (
                                    <p className="text-center text-muted">No results found</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showLoginModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>
                            <i className="fas fa-sign-in-alt me-2"></i>
                            Login Required
                        </h3>
                        <p>Please log in to discover nearby places and start exploring!</p>
                        <div>
                            <button className="modal-btn" onClick={() => triggerLogin(handleDiscoverNearby)}>
                                <i className="fas fa-user me-2"></i>
                                Login
                            </button>
                            <button
                                className="modal-btn secondary"
                                onClick={() => setShowLoginModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExploreNearby;