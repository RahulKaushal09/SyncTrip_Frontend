/**
 * Enum constants for the application
 */

import { rest } from "lodash";

export const PageTypeEnum = Object.freeze({
    LOCATION: "location",
    TRIP: "trips",
    HOSTED_TRIPS: "hostedTrips",
    HOME: "home",
    PROFILE: "profile",
    USER_TRIP: "userTrip",
} as const);

export const typeOfLocationCardEnum = Object.freeze({
    location: 'location',
    trip: 'trip',
    placestovisit: 'placestovisit',
} as const);
export const ProfileCardEnum = Object.freeze({
    ReceivedRequests: "recievedReq",
    AllGoing: "allgoing",
    Connection: "matched",
} as const);

export const WishlistTypeEnum = Object.freeze({
    location: 'location',
    hotel: 'hotel',
    placeToVisit: 'placeToVisit',
    trip: 'trip',
    activity: 'activity',
    restaurant: 'restaurant',
    transport: 'transport',
    other: 'other',
} as const);

export const TripStatusEnum = Object.freeze({
    PLANNING: 'planning',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const);

export const tripPrivacyOptions = Object.freeze({
    PUBLIC: 'public trip',
    PRIVATE: 'invite only',
});

export const NotificationTypeEnum = Object.freeze({
    TRIP_INVITATION: 'trip_invitation',
    TRIP_UPDATE: 'trip_update',
    MESSAGE: 'message',
    FRIEND_REQUEST: 'friend_request',
    SYSTEM: 'system',
} as const);
export const LocationFields = Object.freeze({
    ID: 'id',
    TITLE: 'title',
    DESCRIPTION: 'description',
    RATING: 'rating',
    HREF: 'href',
    COUNTRY: 'country',
    STATE: 'state',
    BEST_TIME: 'best_time',
    COORDINATES: 'fullDetails.coordinates',
    PLACE_IMAGE_LINK: 'PlaceImageLink',
    PLACES_TO_VISIT_LINK: 'PlacesToVisitLink',
    HOTELS_LINK: 'HotelsLink',
    PLACES_NUMBER_TO_VISIT: 'placesNumberToVisit',
    PHOTOS: 'photos',
    IMAGES: 'images',
    HOTELS: 'hotels',
    RESTAURANTS_AND_FOODS: 'restaurantsandfoods',
    PLACES_TO_VISIT: 'placesToVisit',
    FULL_DESCRIPTION: 'fullDetails.full_description',
    FULL_DETAILS: 'fullDetails',
    CULTURES: 'cultures',
    FESTIVALS: 'festivals',
    FILTER_TAGS: 'filterTags',
    FEATURED: 'featured',
    SEO: 'seo',
});
export const TripFields = Object.freeze({
    TRIP_ID: 'id',
    TITLE: 'title',
    MAIN_IMAGE_URL: 'MainImageUrl',
    LOCATION_ID: 'locationId',

    // Essentials (nested)
    ESSENTIALS_REGION: 'essentials.region',
    AVAILABLE_SEATS: 'essentials.availableSeats',
    DURATION: 'essentials.duration',
    BEST_TIME: 'essentials.bestTime',
    TIMELINE: 'essentials.timeline',
    START_DATE: 'essentials.timeline.fromDate',
    END_DATE: 'essentials.timeline.tillDate',
    TIMELINES: 'essentials.timelines',
    ALTITUDE: 'essentials.altitude',
    TYPE_OF_TRIP: 'essentials.typeOfTrip',
    PRICE: 'essentials.price',
    SEASON: 'essentials.season',
    PICKUP_NAME: 'essentials.pickup.name',
    PICKUP_LOCATION: 'essentials.pickup.mapLocation',
    DROPPOINT_NAME: 'essentials.dropPoint.name',
    DROPPOINT_LOCATION: 'essentials.dropPoint.mapLocation',

    // Itinerary
    ITINERARY_TOP_HTML: 'itinerary.topSectionHtml',
    ITINERARY_DAYS: 'itinerary.days',
    ITINERARY_BOTTOM_HTML: 'itinerary.bottomSectionHtml',

    // Requirements
    REQUIREMENTS_AGE: 'requirements.age',
    FITNESS_CRITERIA: 'requirements.fitnessCriteria',
    STATUS: 'requirements.status',
    PREVIOUS_EXP: 'requirements.previousExp',

    // Includes
    INCLUDE_TRAVEL: 'include.travel',
    INCLUDE_FOOD: 'include.food',
    INCLUDE_HOTEL: 'include.hotel',

    // Other
    NUMBER_OF_PEOPLE_APPLIED: 'numberOfPeopleApplied',
    PEOPLE_APPLIED: 'peopleApplied',
    SELECTED_HOTEL_IDS: 'selectedHotelId',
    TRIP_RATING: 'tripRating',
    REMARK: 'remark'
});
export const blogfields = Object.freeze({
    ID: 'id',
    TITLE: 'title',
    CONTENT: 'content',
    FEATURED_IMAGE: 'featuredImage',
    RELATED_LOCATIONS: 'relatedLocations',
    CREATED_AT: 'createdAt',
    SLUG: 'slug',
    UPDATED_AT: 'updatedAt',

    SEO: 'seo',
    AUTHOR: 'author',
    READ_TIME: 'readTime',
    RATING: 'rating',
    FEATURED: 'featured',
    FILTER_TAGS: 'filterTags',
});
export const UserFields = Object.freeze({
    ID: 'id',
    NAME: 'name',
    EMAIL: 'email',
    PHONE: 'phone',
    RATING: 'rating',
    SEX: 'sex',
    DATE_OF_BIRTH: 'dateOfBirth',
    PROFILE_PICTURE: 'profile_picture',
    INTERESTED_AGE_GROUPS: 'interestedAgeGroups',
    INTERESTED_SEX: 'interestedSex',
    LANGUAGES: 'languages',
    PERSONA: 'persona',
    PREFERRED_DESTINATIONS: 'preferred_destinations',
    WISHLIST: 'wishlist',
    TRIPS: 'trips',
    SOCIAL_MEDIAS: 'socialMedias',
    TRAVEL_GOAL: 'travelGoal',
    PROFILE_COMPLETED: 'profileCompleted',
    VIEW_COUNT: 'viewCount'
});


export const userTripFields = Object.freeze({
    ID: 'id',
    USER_ID: 'userId',
    LOCATION_ID: 'locationId',
    LOCATION_NAME: 'locationName',
    TRIP_NAME: 'tripName',
    START_DATE: 'startDate',
    END_DATE: 'endDate',
    BUDGET: 'budget',
    INTERESTS: 'interests',
    PRIVACY: 'privacy',
    ACTIVITIES: 'activities'
});

// Type exports for TypeScript
export type PageType = typeof PageTypeEnum[keyof typeof PageTypeEnum];
export type ProfileCardType = typeof ProfileCardEnum[keyof typeof ProfileCardEnum];
export type WishlistType = typeof WishlistTypeEnum[keyof typeof WishlistTypeEnum];
export type TripStatus = typeof TripStatusEnum[keyof typeof TripStatusEnum];
export type NotificationType = typeof NotificationTypeEnum[keyof typeof NotificationTypeEnum];
export type LocationField = typeof LocationFields[keyof typeof LocationFields];
export type UserField = typeof UserFields[keyof typeof UserFields];
export type userTripFields = typeof userTripFields[keyof typeof userTripFields];

