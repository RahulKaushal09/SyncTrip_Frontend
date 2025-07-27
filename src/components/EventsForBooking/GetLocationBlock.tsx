// components/GetLocationBlock.tsx ("use client")
'use client';
import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import toast from 'react-hot-toast';
import { Events, IndianCity } from '@/types';
import { indianCitiesPageData } from '@/data/indianCitiesPageData';
import { ApiService } from '@/utils/api.utils';

interface GetLocationBlockProps {
    initialLocation: string;
    setEvents: React.Dispatch<React.SetStateAction<Events[]>>;
    // indianCities: IndianCity[];
}

const findClosestCity = (city: string, indianCities: IndianCity[]): string => {
    const cityWords = city
        .split(' ')
        .filter(word => word.length > 2)
        .map(word =>
            word
                .replace(/[^a-zA-Z]/g, '')
                .replace(/_/g, ' ')
                .replace(/-/g, ' ')
                .replace(/\s+/g, ' ')
                .replace(/,/g, ' ')
                .charAt(0)
                .toUpperCase() + word.slice(1).trim()
        );

    const indianCityNames = indianCities.map(city => city.locationName);
    const fuse = new Fuse(indianCityNames, { threshold: 0.1 });
    for (const word of cityWords) {
        const result = fuse.search(word);
        if (result.length > 0) {
            return result[0].item;
        }
    }
    return city;
};

export default function GetLocationBlock({ initialLocation, setEvents }: GetLocationBlockProps) {
    const [location, setLocation] = useState(initialLocation);
    const [customLocation, setCustomLocation] = useState('');
    const [suggestions, setSuggestions] = useState<IndianCity[]>([]);
    // const [events, setEvents] = useState<Event[]>([]);
    let indianCities: IndianCity[] = []; // Replace with actual data or prop
    indianCities = indianCitiesPageData;
    const fetchEvents = async (city: IndianCity, defaultCity: string) => {
        if (city) {
            try {
                const res = await ApiService.fetchEvents(city);
                if (res.length === 0) {
                    // toast.error(`No events found for ${defaultCity}`);
                }
                else {
                    setEvents(res as Events[]);
                    setLocation(defaultCity);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
                toast.error('Failed to fetch events.');
            }
        }
    };


    useEffect(() => {
        if (!location) {
            const defaultCity = findClosestCity('Delhi-NCR', indianCities);
            const cityObj = indianCities.find(city => city.locationName === defaultCity);

            if (cityObj) fetchEvents(cityObj, defaultCity);
        }
    }, [location, indianCities]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
                        );
                        const data = await res.json();

                        if (!data || !data.address) {
                            console.error("No address found:", data); // ← LOG HERE

                            setLocation('Location unavailable1');
                            return;
                        }
                        const city = data.address.state_district || data.address.state || data.address.county || 'Unknown City';
                        const matchedCity = findClosestCity(city, indianCities);
                        const cityObj = indianCities.find(city => city.locationName === matchedCity);
                        // setLocation(matchedCity);

                        if (matchedCity !== location && cityObj) {
                            fetchEvents(cityObj, matchedCity);
                        }
                    } catch {
                        setLocation('Location unavailable2');
                    }
                },
                () => {
                    const defaultCity = findClosestCity('Delhi-NCR', indianCities);
                    const cityObj = indianCities.find(city => city.locationName === defaultCity);
                    // setLocation(defaultCity);
                    if (cityObj) fetchEvents(cityObj, defaultCity);
                    toast.error('Location permission is required to fetch events.');
                }
            );
        } else {
            setLocation('Geolocation not supported');
        }
    }, [indianCities]);

    const fetchLocations = (query: string) => {
        if (query.length > 1) {
            const lowerQuery = query.toLowerCase();
            const startsWith: IndianCity[] = [];
            const includes: IndianCity[] = [];

            indianCities.forEach(city => {
                const name = city.locationName.toLowerCase();
                if (name.startsWith(lowerQuery)) {
                    startsWith.push(city);
                } else if (name.includes(lowerQuery)) {
                    includes.push(city);
                }
            });

            setSuggestions([...startsWith, ...includes]);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div className="d-flex flex-column align-items-end gap-2">
            <div className="d-flex align-items-center gap-2">
                {/* <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" /> */}
                <span className="text-muted">{location}</span>
            </div>
            <div className="position-relative">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter location"
                    value={customLocation}
                    onChange={(e) => {
                        setCustomLocation(e.target.value);
                        fetchLocations(e.target.value);
                    }}
                    style={{ borderRadius: suggestions.length > 0 ? "4px 4px 0 0" : "4px" }}
                    aria-label="Search for a location"
                />
                {suggestions.length > 0 && (
                    <ul className="list-group position-absolute w-100 " style={{ zIndex: 10 }}>
                        {suggestions.map((city, index) => (
                            <li
                                key={index}
                                className="list-group-item list-group-item-action"
                                onClick={() => {
                                    // setLocation(city.locationName);
                                    fetchEvents(city, city.locationName);
                                    setCustomLocation('');
                                    setSuggestions([]);
                                }}
                                role="button"
                                aria-label={`Select ${city.locationName}`}
                            >
                                {city.locationName}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}