import { ExplorePageData, Hotel, Location } from "@/types";
import apiClient from "./apiClient";
import { LocationFields } from "@/constants/enums";

export class LocationServices {

    static async fetchLocationsBySearch(query: string, fields: string[]): Promise<Location[]> {
        let locationFieldsRequiredForSearch;
        if (fields.length > 0) {
            locationFieldsRequiredForSearch = fields;
        }
        else {
            locationFieldsRequiredForSearch = [LocationFields.ID,
            LocationFields.TITLE,
            LocationFields.STATE,
            LocationFields.COUNTRY,
            LocationFields.PHOTOS,
            LocationFields.BEST_TIME,
            LocationFields.RATING,
            LocationFields.PLACES_NUMBER_TO_VISIT];
        }
        try {
            const controller = new AbortController();
            const res = await apiClient.get("/app/getLocationsBySearch", {
                params: {
                    search: query,
                    limit: 20,
                    fields: locationFieldsRequiredForSearch.join(","),
                },
                signal: controller.signal,
            });

            if (!res.data) throw new Error("Failed to fetch locations");
            return res.data || [];
        } catch (err) {
            console.error("Error fetching locations:", err);
            return [];
        }
    }
    static async fetchLocationDetails(locationId: string, fields?: string[]) {
        try {
            const res = await apiClient.get(`/app/getLocationDetails/${locationId}`, {
                params: {
                    fields: fields?.join(",")
                }
            });
            return res.data.location as Location;
        } catch (error) {
            console.error("Error fetching location details:", error);
            throw error;
        }
    }

    static async getPlacesToVisitByIds(placeIds: string[], token?: string) {
        try {
            const res = await apiClient.post(`/places/getPlacesByIds`, { placeIds });
            return res.data;
        } catch (error) {
            console.error("Error fetching places by IDs:", error);
            throw error;
        }
    }
    static async getHotelsByIds(hotelIds: string[], token?: string) {
        try {
            const res = await apiClient.post(`/hotels/getHotelsByIds`, { hotelIds });
            // clean hotel_name for nay number wiht . ex 76. 67. etc 
            if (res.data && Array.isArray(res.data)) {
                res.data = res.data.map((h: Hotel) => {
                    if (h.hotel_name) {
                        h.hotel_name = h.hotel_name.replace(/^\d+(\.\s*)?/, '').trim();
                    }
                    return h;
                });
            }
            return res.data;
        }
        catch (error) {
            console.error("Error fetching hotels by IDs:", error);
            throw error;
        }
    }
    static async getRestaurantsByIds(restaurantIds: string[], token?: string) {
        try {
            const res = await apiClient.post(`/locations/getRestaurantsByRestaurantIds`, { restaurantIds });
            return res.data.restaurants;
        }
        catch (error) {
            console.error("Error fetching restaurants by IDs:", error);
            throw error;
        }
    }
    static async getUsersPlanningTripsToLocation(locationId: string) {
        try {
            const res = await apiClient.get(`/locations/enrolledUsers/${locationId}`);
            console.log('API response for users planning trips to location:', res);
            return res.data;
        } catch (error) {
            console.error("Error fetching users planning trips to location:", error);
            throw error;
        }
    }
    static async getEnrolledUsersForEveryLocation() {
        try {
            const res = await apiClient.get(`/locations/enrolledUsersForEveryLocation`);
            return res.data;
        } catch (error) {
            console.error("Error fetching enrolled users for every location:", error);
            throw error;
        }
    }
    static async searchLocationsForExplore(
        query: { term: string; state: string },
        page = 1
    ): Promise<{ data: Location[]; total: number; page: number; hasMore: boolean }> {
        try {
            const res = await apiClient.post(`/locations/home/search`, { ...query, page });
            return res.data || { data: [], total: 0, page: 1, hasMore: false };
        } catch (err) {
            console.error("Error searching locations for explore page:", err);
            throw err;
        }
    }

    static async getDataForExplorePage(): Promise<ExplorePageData> {
        try {
            const res = await apiClient.get(`/locations/getExploreDataForHomePage`);
            return res.data;
        } catch (error) {
            console.error("Error fetching locations for explore page:", error);
            throw error;
        }
    }
};