/**
 * User-related type definitions
 */
export interface UserWishList {

    type: 'location' | 'placeToVisit' | 'activity' | 'food' | 'hotel' | 'transport' | 'other' | 'trip';
    refId: string; // ID of the item (e.g., place ID, hotel ID)
    parentId?: string; // e.g., locationId for a place/hotel, tripId for transport/activity
    parentType?: 'location' | 'trip'; // e.g., "location" or "trip" (optional but useful for clarity)
}
export interface User {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    profile_picture?: string[];
    profileCompleted?: boolean;
    created_at?: string;
    updated_at?: string;
    sex?: 'Male' | 'Female' | 'Other';
    dateOfBirth?: string;
    travelStyles?: string[];
    travelerType?: string[];
    dreamDestinations?: string;
    matchGender?: 'Same' | 'Any' | 'Custom';
    ageGroup?: string;
    showProfile?: boolean;
    allowInvites?: boolean;
    wishlist?: UserWishList[];
    instagram?: string;
    travelGoal?: string;
    languages?: string;
    preferredDestinations?: string[];
}
// below is used in profile page
export interface ExtendedUser extends User {
  persona?: string[]; // Maps to travelerType/travelStyles in UI
  viewCount?: number;
  rating?: number;
  socialMedias?: {
    instagram?: string;
  };
  languages_array?: string[];
}

// export interface UserProfile extends User {
//     bio?: string;
//     location?: string;
//     preferences?: UserPreferences;
// }

// export interface UserPreferences {
//     theme?: 'light' | 'dark';
//     language?: string;
//     notifications?: NotificationSettings;
// }

// export interface NotificationSettings {
//     email: boolean;
//     push: boolean;
//     sms: boolean;
// }

// export interface Location {
//     id: string;
//     title: string;
//     description?: string;
//     coordinates?: {
//         latitude: number;
//         longitude: number;
//     };
// }
