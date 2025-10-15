import apiClient from "./apiClient";

class WeatherServices {
    // Weather-related methods would go here
    static async getTripWeather(locationLatitude: number, locationLongitude: number, startDate: string, endDate: string) {
        const q = `lat=${encodeURIComponent(locationLatitude)}&lon=${encodeURIComponent(locationLongitude)}&start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
        const resp = await apiClient.get(`app/weather/forecast?${q}`);
        if (!resp) throw new Error('Failed to fetch weather');
        return resp.data.weather;
    }
}

export default WeatherServices;