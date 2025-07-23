import { Events, Location } from "@/types";
import { User } from "@/types/user.types";
export interface GoogleLoginResponse {
    token: string;
    user: User;
}
export interface getLocationResponseSchema {
    locations: Location[];
    hasMore: boolean;
    totalCount: number;
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