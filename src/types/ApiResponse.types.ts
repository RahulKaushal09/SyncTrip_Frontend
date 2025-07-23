import { User } from "./user.types";
export default interface GoogleLoginResponse {
    token: string;
    user: User;
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