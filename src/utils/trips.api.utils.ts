import { API_CONFIG } from '../constants';
import { getAllTripsResponseSchema, HostedTripDetailsResponse, TripDetailsResponse } from '@/classes/ApiResponse.classes';
import { HostedTrip, Trip } from '@/types';
import apiClient from './apiClient';
// import { cookies } from 'next/headers';

export class TripsApiService {
    static async fetchAllTrips(token: string = ""): Promise<getAllTripsResponseSchema> {
        const allTripsResponse = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/trips/getAllTripsDynamicFields`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ limit: 100 }),
        });
        if (allTripsResponse.status === 404) {
            throw new Error('No trips found. Please check back later.');
            return {
                trips: [],
                totalTrips: 0,
            };
        }
        const allTripsData: getAllTripsResponseSchema = await allTripsResponse.json();
        return allTripsData;
    }
    static async fetchAllHostedTrips(): Promise<HostedTrip[]> {
        console.log('Fetching all hosted trips from API...');
        const allTripsResponse = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/hostedTrips`,{
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Response status:', allTripsResponse.status);
        console.log('Response :', allTripsResponse);
        if (allTripsResponse.status === 404) {
            throw new Error('No trips found. Please check back later.');
            return [];
        }
        const allTripsData: HostedTrip[] = await allTripsResponse.json();
        return allTripsData;
    }
    static async fetchTripById(tripId: string, token: string = ""): Promise<TripDetailsResponse> {
        const tripResponse = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/trips/${tripId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!tripResponse.ok) {
            throw new Error('Failed to fetch trip details');
        }
        const tripDetailsResponse: TripDetailsResponse = await tripResponse.json();
        return tripDetailsResponse;
    }
    static async fetchHostedTripById(tripId: string, token: string = ""): Promise<HostedTrip> {
        const tripResponse = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/hostedTrips/${tripId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!tripResponse.ok) {
            throw new Error('Failed to fetch trip details');
        }
        const tripDetailsResponse: HostedTrip = await tripResponse.json();
        return tripDetailsResponse;
    }
    static async joinHostedTrip(tripId: string): Promise<{ success: boolean; message: string }> {
        // const cookieStore = cookies();
        const tripResponse = await apiClient.post(`${API_CONFIG.BACKEND_BASE_URL}/api/hostedTrips/${tripId}/join`);
        if (!tripResponse) {
            throw new Error('Failed to join the hosted trip');
        }
        const responseData: { success: boolean; message: string } = ( tripResponse).data;
        return responseData;
    }
    static async fetchEnrolledTrips(token: string = ""): Promise<Trip[]> {
        if (!token) return [];
        console.log('Fetching enrolled trips...', token);
        const enrolledTripsResponse = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/trips/en/enrolled`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!enrolledTripsResponse.ok) {
            throw new Error('Failed to fetch enrolled trips');
        }
        const enrolledTripsData: Trip[] = await enrolledTripsResponse.json();
        console.log('Enrolled Trips:', enrolledTripsData);
        return enrolledTripsData;
    }


}