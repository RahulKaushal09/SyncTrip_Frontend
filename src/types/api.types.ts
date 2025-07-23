/**
import { is } from './../../.next/static/chunks/main';
 * API-related type definitions
 */

export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

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

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface Trip {
    id: string;
    title: string;
    description?: string;
    destination: string;
    start_date: string;
    end_date: string;
    created_by: string;
    participants?: string[];
    status: 'planning' | 'active' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
}

export interface Location {
    id: string;
    title: string;
    description?: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    placesNumberToVisit?: number;
    best_time?: string;

    address?: string;
    category: string;
    rating?: string;
    images?: string[];
    isWishlisted?: boolean;
}
