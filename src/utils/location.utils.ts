import { Location } from "@/types";
import apiClient from "./apiClient";
import { LocationFields } from "@/constants/enums";

export class LocationServices {

    static async fetchLocationsBySearch(query: string): Promise<Location[]> {
        const locationFieldsRequiredForSearch = [
            LocationFields.ID,
            LocationFields.TITLE,
            LocationFields.STATE,
            LocationFields.COUNTRY,
            LocationFields.PHOTOS,
            LocationFields.BEST_TIME,
            LocationFields.RATING,
            LocationFields.PLACES_NUMBER_TO_VISIT,
        ];
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
};