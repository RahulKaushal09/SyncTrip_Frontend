/**
 * Enum constants for the application
 */

export const PageTypeEnum = Object.freeze({
    LOCATION: "location",
    TRIP: "trips",
    HOME: "home",
    PROFILE: "profile",
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
    food: 'food',
    transport: 'transport',
    other: 'other',
} as const);

export const TripStatusEnum = Object.freeze({
    PLANNING: 'planning',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const);

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
    BEST_TIME: 'best_time',
    PLACE_IMAGE_LINK: 'PlaceImageLink',
    PLACES_TO_VISIT_LINK: 'PlacesToVisitLink',
    HOTELS_LINK: 'HotelsLink',
    PLACES_NUMBER_TO_VISIT: 'placesNumberToVisit',
    PHOTOS: 'photos',
    IMAGES: 'images',
    HOTELS: 'hotels',
    RESTAURANTS_AND_FOODS: 'restaurantsandfoods',
    PLACES_TO_VISIT: 'placesToVisit',
    FULL_DETAILS: 'fullDetails',
    CULTURES: 'cultures',
    FESTIVALS: 'festivals'
});

// Type exports for TypeScript
export type PageType = typeof PageTypeEnum[keyof typeof PageTypeEnum];
export type ProfileCardType = typeof ProfileCardEnum[keyof typeof ProfileCardEnum];
export type WishlistType = typeof WishlistTypeEnum[keyof typeof WishlistTypeEnum];
export type TripStatus = typeof TripStatusEnum[keyof typeof TripStatusEnum];
export type NotificationType = typeof NotificationTypeEnum[keyof typeof NotificationTypeEnum];
export type LocationField = typeof LocationFields[keyof typeof LocationFields];
