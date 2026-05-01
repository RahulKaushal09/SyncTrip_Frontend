/**
import { is } from './../../.next/static/chunks/main';
 * API-related type definitions
 */

import { Chat, Culture, Festival, HostedTripItinerary, Itinerary, Message, TripTimeline } from "@/types";
import { includes } from "lodash";

export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

// export interface PaginatedResponse<T> extends ApiResponse<T[]> {
//     pagination: {
//         page: number;
//         limit: number;
//         total: number;
//         totalPages: number;
//     };
// }

// export interface LoginRequest {
//     email: string;
//     password: string;
// }

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

// export interface RegisterRequest {
//     name: string;
//     email: string;
//     password: string;
//     confirmPassword: string;
// }
export interface UserTripActivity {
    dayId: string;
    dayLabel: string;
    dayDate: string; // or Date if you parse it
    placeId: string;
    placeDetails?: PlacesToVisit;
    order: number;
    distanceKm?: number;
    routeSignature?: string;
    polyline?: string;
}

export interface UserTrip {
    id?: string;     // Unique identifier for the trip
    userId?: string; // ID of the user who created the trip
    locationId: string; // ID of the trip destination (e.g., location ID)
    locationName?: string; // Name of the destination (for display purposes)
    tripName?: string; // Name or title of the trip
    source?: {
        type: 'manual' | 'hosted'
    }
    //   destination: string; // Location or destination of the trip
    startDate: string;   // Start date of the trip
    endDate: string;     // End date of the trip
    budget: string;      // Budget preference ("Affordable", "Economic", "Luxury", etc.)
    interests?: string[];   // Interests (e.g., "Cultural Exploration", "Beach", etc.)
    //   interests?: string;   // Interests (e.g., "Cultural Exploration", "Beach", etc.)
    privacy?: string;    // Privacy setting ("Public", "Friends", "Only Me", etc.)
    // activities?: TripActivity[]; // List of activities planned for the trip
    image?: string;    // URL of the main image for the trip
    tripImage?: string; // URL of the main image for the trip (new field, to replace 'image')
    tripImageUrl?: string; // this is used in create trip flow to handle both preset and custom images without breaking existing code
    rating?: number;   // Average rating (e.g., 4.5)
    avatars?: string[]; // URLs of user avatars who joined the trip
    activities?: UserTripActivity[]; // List of activities planned for the trip
    activitiesCount?: number;
    groupContext?: groupContextTrip;
    isGroupTrip?: boolean;
    createdAt?: string; // ISO date string for when the trip was created
    updatedAt?: string; // ISO date string for when the trip was last updated
    // Additional fields can be added as needed
    tripDescription?: string; // A brief description of the trip
    placeName?: string; // Specific place within the location (e.g., "Eiffel Tower" in "Paris")
    maxParticipants?: number; // Maximum number of participants allowed
    currentParticipants?: number; // Current number of participants
};

// ─── Core trip shape (flat — matches API response directly) ──────────────────

export interface UserTripPreview {
    _id: string;
    id: string;
    locationId: string;
    locationName: string;
    tripName: string;
    tripImage: string;
    startDate: string;   // ISO 8601
    endDate: string;   // ISO 8601
    interests: string[];
    privacy: string;
    tripType: string;
    placeName: string;
    tripDescription: string;
    maxParticipants: number;
    currentParticipants: number;
    genderPreference: string;
    tripStatus: string;

    // Optional SEO block — may or may not be returned by the API
    seo?: {
        seo_title?: string;
        seo_description?: string;
        seo_keywords?: string[];
    };
}


export type groupContextTrip = {
    isInGroup: boolean,
    groupId?: string,
    role?: string,
    groupStatus?: string,
    chatId?: string | null
    maxMembers?: number,
    membersCount?: number
}


export interface Notification {
    id: string;
    recipientId: string;
    actor: {
        id: string;
        name: string;
        avatar?: string;
    };
    type: 'MATCH' | 'MESSAGE' | 'LIKE' | 'TRIP_JOIN' | 'TRIP_UPDATE' | 'SYSTEM' | 'MILESTONE' | 'GROUP_JOIN';
    title: string;
    message: string;
    clickAction: {
        type: 'OPEN_PROFILE' | 'OPEN_CHAT' | 'OPEN_TRIP' | 'OPEN_MATCH' | 'GROUP_DETAILS' | 'NONE';
        payload: Record<string, unknown>;
    };
    related: {
        matchId?: string;
        conversationId?: string;
        tripId?: string;
    };
    isRead: boolean;
    readAt?: string; // ISO date string
    createdAt: string; // ISO date string
}

type FAQSchema = {
    question: string;
    answer: string;
};

type SEOSectionSchema = {
    key: string;
    title: string;
    body: string;
};


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
    hotels?: Hotel[] | string[];
    restaurantsandfoods?: Restaurants[] | string[];
    placesToVisit?: PlacesToVisit[] | string[];
    locationConnectedWith?: string;
    cultures?: Culture[];
    festivals?: Festival[];
    isWishlisted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    type?: string;
    filterTags?: string[];
    featured?: boolean;

    slug?: string;
    seo?: {
        title?: string;
        metaDescription?: string;
        h1?: string;
        keywords?: string[];
        semanticKeywords?: string[];

        og?: {
            title?: string;
            description?: string;
            image?: string;
        };

        twitter?: {
            title?: string;
            description?: string;
            image?: string;
        };

        faq?: FAQSchema[];

        schema?: {
            jsonld?: Record<string, unknown>; // ONLY static parts
            // url/image/geo added dynamically in SSR
        };

        sections?: SEOSectionSchema[];

        createdBy?: string;
        lastUpdatedBy?: string;
        lastUpdatedAt?: Date;
    };
    // seo: {
    //     title: { type: String, default: null },
    //     metaDescription: { type: String, default: null },
    //     h1: { type: String, default: null },
    //     keywords: [String],
    //     semanticKeywords: [String],

    //     og: {
    //         title: String,
    //         description: String
    //         // IMAGE + URL generated from frontend SSR
    //     },

    //     twitter: {
    //         title: String,
    //         description: String
    //         // IMAGE generated from SSR
    //     },

    //     faq: [FAQSchema],

    //     schema: {
    //         jsonld: mongoose.Schema.Types.Mixed // ONLY static parts
    //         // url/image/geo added dynamically in SSR
    //     },

    //     sections: [SEOSectionSchema],

    //     createdBy: { type: String, default: null },
    //     lastUpdatedBy: { type: String, default: null },
    //     lastUpdatedAt: { type: Date }
    // }


}
export interface PlacesToVisit {
    id: string;
    title: string;
    link: string;
    rating: string;
    description: string;
    highlights: string;
    image: string[];
    images: string[];
    // image_old: string[];
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
    type?: string;
    filterTags?: string[];
    tag?: string; // Adventure, Cultural, Historical, Nature, Religious, etc.
}

export type HostedTrip = {
    id: string;
    title: string;
    slug: string;
    mainImageUrl: string;
    locationName: string;
    locationId: string;
    dates: [{
        startDate: string;
        endDate: string;
        availableSeats: number;
    }],
    itineraryTemplate: HostedTripItinerary;
    price: number;
    status: 'published' | 'completed';
    inclusions: {
        travel: boolean;
        food: boolean;
        hotel: boolean;
    };
    createdAt: string;
    updatedAt: string;
}





export interface Restaurants {
    id: string;
    name: string;
    address: string;
    phone: string;
    website: string;
    googlePlaceId: string;
    locationId?: string; // Optional, if linked to a location
    coordinates: {
        lat: number;
        long: number;
    };
    geo: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    openingHours: {
        day: string; // eg: Monday
        open: string; // eg: 11:00 AM
        close: string; // eg: 10:30 PM
    }[];
    rating: number;
    userRatingsTotal: number;
    priceLevel: number; // 0=Free, 1=Cheap, 4=Expensive
    types: string[]; // eg: restaurant, food, bar, etc.
    photos: {
        url: string;
        attribution?: string;
        isMenu?: boolean; // optional: if image looks like a menu
    }[];
    images?: [];
    cuisineType?: string; // eg: Italian, Indian
    features?: string[]; // eg: ['live music', 'outdoor seating']
    description?: string; // admin/manual
    tags?: string[]; // keywords, searchable
    type?: string;
    filterTags?: string[];
    isWishlisted?: boolean;

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
    price?: number;
    hotelLinks?: string[];
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


export type FetchChatsParams = {
    tripId?: string;
};
export type FetchChatsResponse = Chat[];

export interface FetchChatByIdResponse extends Chat {
    tripId: string; // only in GET /chats/:chatId
    Chat: Chat,
    messages: Message[]; // only in GET /chats/:chatId
}

export type FetchMessagesResponse = Message[];

export type SendMessageResponse = Message;


export interface UnreadCountResponse {
    count: number;                                // total unread chats across ALL trips
    byTrip: Record<string, number>;               // tripId -> unread chats count
}
export type UnreadByTrip = Record<string, number>;
