import { API_CONFIG } from '../constants';
import { getAllTripsResponseSchema, TripDetailsResponse } from '@/classes/ApiResponse.classes';
import { Trip } from '@/types';
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