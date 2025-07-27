import { Events, Location, Trip } from "@/types";
import { User, UserWishList } from "@/types/user.types";
export interface GoogleLoginResponse {
    token: string;
    user: User;
}
export interface getLocationResponseSchema {
    locations: Location[];
    hasMore: boolean;
    totalCount: number;
}
export interface getAllTripsResponseSchema {
    totalTrips: number;
    trips: Trip[];
}
export interface appliedUsers {
    id: string;
    name: string;
    profilePicture: string;
    age: number | null;
    rating: number;
    persona: string;
}
export interface TripDetailsResponse {
    trip: Trip;
    appliedUsers: appliedUsers[];
}
export interface EventsResponse {
    message: string;
    events: Events[];
}
export interface CompleteProfileApiResponse {
    success: boolean;
    message: string;
    user: User;
    token?: string;
    error?: string;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    error?: string;
}

export interface userWishlistResponse {
    wishlist: UserWishList[];
}