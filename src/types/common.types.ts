/**
 * Common/shared type definitions
 */

export type PageType = 'home' | 'trips' | 'location' | 'profile';


export type Theme = 'light' | 'dark';

export type Status = 'idle' | 'loading' | 'success' | 'error';

// export interface SelectOption {
//     value: string;
//     label: string;
//     disabled?: boolean;
// }

export interface Coordinates {
    latitude: number;
    longitude: number;
}

// export interface DateRange {
//     start: string;
//     end: string;
// }

// export interface FileUpload {
//     file: File;
//     progress: number;
//     status: 'pending' | 'uploading' | 'completed' | 'error';
//     url?: string;
//     error?: string;
// }

// export type SortOrder = 'asc' | 'desc';

// export interface SortConfig {
//     field: string;
//     order: SortOrder;
// }

// export interface FilterConfig {
//     [key: string]: unknown;
// }

// export interface consoleError {
//     message: string;
//     stack?: string;
//     name?: string;
// }

export interface IndianCity {
    locationName: string;
    locationCode: string;
}
export interface TripTimeline {
    slotId: string;
    fromDate: string;
    tillDate: string;
}
export interface TripDate {
    startDate: string;
    endDate: string;
    availableSeats: number;
    // slotId: string;
}
export interface TripDayItinerary {
    dayTitle: string;
    date?: string;
    htmlDescription: string;
}

export interface Itinerary {
    topSectionHtml?: string;
    bottomSectionHtml?: string;
    days: TripDayItinerary[];
}
export interface HostedTripItinerary {
    topSectionHtml?: string;
    bottomSectionHtml?: string;
    days: [{
        title: string;
        descriptionHtml: string;
        date?: string;
    }];
}

export type UUID = string;

export type GenderPreference = "male" | "female" | "mixed";

export type GroupStatus = "open" | "closed";

export interface RidePlan {
    id: string;
    title: string;
    locationName: string | null;
    scheduleDate: string | null;
    totalDays: number | null;
    rideImage: string;
    membersCount: number | null;
    maxMembers: number | null;
    startLocationName: string | null;
    bikeCC: string | null;
}

export interface MoviePlan {
    id: string;
    title: string;
    movieImage: string;
    locationName: string | null;
    scheduleDate: string | null;
    scheduleTime: string | null;
    maxMembers: number | null;
    membersCount: number | null;
    venueName: string | null;
    distance: number | null;
    genderPreference: GenderPreference | null;
}

export interface SportsPlan {
    id: string;
    sportType: string;
    locationName: string | null;
    scheduleDate: string | null;
    scheduleTime: string | null;
    maxMembers: number | null;
    membersCount: number | null;
    venueName: string | null;
    genderPreference: GenderPreference | null;
}

export interface HangoutPlan {
    id: string;
    outingType: string;
    locationName: string | null;
    scheduleDate: string | null;
    scheduleTime: string | null;
    maxMembers: number | null;
    membersCount: number | null;
    venueName: string | null;
    isLocationFlexible: boolean;
}

export const LOCATIONS = [
  "Chandigarh", "Delhi", "Bangalore", "Mumbai", "Pune", 
  "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Jaipur"
];