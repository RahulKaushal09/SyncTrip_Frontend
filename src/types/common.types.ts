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