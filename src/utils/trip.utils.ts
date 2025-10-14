
import { UserTrip } from "@/types";
import apiClient from "./apiClient";

class TripServices {

    static async fetchTripDetails(tripId: string,fields: string[] = []): Promise<UserTrip> {
        try {
            const res = await apiClient.get(`/app/getUserTripDetails/${tripId}`, { params: { fields } });
            return res.data.trip as UserTrip;
        }
        catch (error) {
            console.error("Error fetching trip details:", error);
            throw error;
        }
    }

    static async saveTripDetails(tripDetails: UserTrip) {
        try {
            const res = await apiClient.post(`/app/createUserTripWithDetails`, tripDetails);
            return res.data.trip;
        }
        catch (error) {
            console.error("Error saving trip details:", error);
            throw error;
        }
    }
    static async saveTripActivities(tripDetails: UserTrip, activities: any[], getClosestHotels?: boolean) {
        try {
            const res = await apiClient.post('/app/saveUserTripActivities', {
                tripId: tripDetails.id,
                activities,
                getClosestHotels: getClosestHotels || false,
                locationId: tripDetails.locationId,
            });
            return res.data;
        } catch (error) {
            console.error("Error saving trip activities:", error);
            throw error;
        }
    }
    static async updateTripPartial(tripId: string, updateFields: Partial<UserTrip>) {
        const response = await apiClient.patch(`/app/updateUserTripDetails/${tripId}`, updateFields);
        if(response.status < 200 || response.status >= 300) {
            const errorMessage = response.data?.message || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }
        return response.data;
    }

    static async fetchUserTrips() {
        try {
            const res = await apiClient.get(`/app/getUserTrips`);
            return res.data.trips as UserTrip[];
        }
        catch (error) {
            console.error("Error fetching user trips:", error);
            throw error;
        }
    }
}

export default TripServices;