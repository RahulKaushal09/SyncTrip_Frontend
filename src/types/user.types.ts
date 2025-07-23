/**
 * User-related type definitions
 */

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
    wishlist?: unknown[];
    instagram?: string;
    travelGoal?: string;
    languages?: string;
    preferredDestinations?: string[];
}

export interface UserProfile extends User {
    bio?: string;
    location?: string;
    preferences?: UserPreferences;
}

export interface UserPreferences {
    theme?: 'light' | 'dark';
    language?: string;
    notifications?: NotificationSettings;
}

export interface NotificationSettings {
    email: boolean;
    push: boolean;
    sms: boolean;
}

// export interface Location {
//     id: string;
//     title: string;
//     description?: string;
//     coordinates?: {
//         latitude: number;
//         longitude: number;
//     };
// }
