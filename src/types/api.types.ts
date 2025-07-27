/**
import { is } from './../../.next/static/chunks/main';
 * API-related type definitions
 */

import { Culture, Festival, Itinerary, TripTimeline } from "@/types";

export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: {
        id: string;
        name: string;
        email: string;
        profile_picture?: string[];
    };
    token: string;
    refreshToken: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}


export interface Location {
    id: string;
    title: string;
    description?: string;
    best_time?: string;
    href?: string;
    objective?: string;
    rating?: string;
    PlaceImageLink?: string;
    PlacesToVisitLink?: string;
    HotelsLink?: string;
    placesNumberToVisit?: string;
    state?: string | null;
    country?: string | null;
    fullDetails?: {
        full_description?: string;
        additional_info?: string[];
        top_places_to_visit?: {
            name: string;
            link: string;
            image: string;
        }[];
        coordinates?: {
            lat: number;
            long: number;
        };
    };
    geo?: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    photos: string[];
    images?: string[];
    photos_old?: string[];
    images_old?: string[];
    hotels?: string[];
    restaurantsandfoods?: string[];
    placesToVisit?: PlacesToVisit[] | string[];
    cultures?: Culture[];
    festivals?: Festival[];
    isWishlisted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
export interface PlacesToVisit {
    id: string;
    title: string;
    link: string;
    rating: string;
    description: string;
    highlights: string;
    image: string[];
    image_old: string[];
    coordinates: {
        lat: number;
        long: number;
    };
    geo: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    isWishlisted?: boolean;
    location: string;
    locationConnectedWith: string;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface Hotel {
    id: string;
    hotel_name: string;
    hotel_link: string;
    hotel_images: string[];
    hotel_location: {
        neighbourhood: string;
        rating: {
            score: number;
            review_count?: number;
        };
    };
    isWishlisted?: boolean;
}

export interface Trip {
    id: string;
    title: string;
    MainImageUrl: string;
    locationId: string;

    essentials: {
        region?: string;
        availableSeats: number;
        duration: string;
        bestTime?: string;
        timeline?: {
            fromDate: string;
            tillDate: string;
        };
        timelines: TripTimeline[];
        altitude?: number;
        typeOfTrip?: string;
        price: number;
        season?: string;
        pickup?: {
            name: string;
            mapLocation: {
                lat: number;
                long: number;
            };
        };
        dropPoint?: {
            name: string;
            mapLocation: {
                lat: number;
                long: number;
            };
        };
        nearbyPoints?: {
            railway?: string;
            airport?: string;
            busStand?: string;
        };
    };

    numberOfPeopleApplied?: number;

    itinerary?: Itinerary;

    tripRating?: number;

    requirements?: {
        age: number;
        fitnessCriteria?: string;
        status: 'active' | 'scheduled' | 'completed';
        previousExp?: string;
    };

    include: {
        travel: boolean;
        food: boolean;
        hotel: boolean;
    };

    peopleApplied: string[];
    selectedHotelId: string[];
}

