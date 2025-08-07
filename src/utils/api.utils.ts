/**
 * API service utilities for common API operations
 */

import { API_CONFIG, LocationField, STORAGE_KEYS, UserField } from '../constants';
import { StorageUtils } from './storage.utils';
import { ApiResponse, IndianCity, Location, PlacesToVisit, User } from '../types';
import { triggerLogin } from './login.utils';
import { GoogleLoginResponse, CompleteProfileApiResponse, getLocationResponseSchema, exploreNearByApiResponse } from '@/classes/ApiResponse.classes';
import { wishlistRequestSchema } from '@/classes/ApiRequest.classes';
// import { indianCitiesPageData } from '@/data/indianCitiesPageData';
import { Events } from '@/types';
// import { cookies } from 'next/headers';

export class ApiService {
  private static getAuthHeaders(): HeadersInit {
    const token = StorageUtils.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',

    };
  }
  private static async getAuthHeadersServer(token: string = ""): Promise<HeadersInit> {
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getClientUser(fields: UserField[]): Promise<User | null> {
    const token = localStorage.getItem("userToken") || document.cookie.split('; ').find(row => row.startsWith('userToken='))?.split('=')[1];

    if (!token) return null;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/users/getUserWithSpecificFields`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ fields }),
      });
      if (!res.ok) return null;

      const user: User = await res.json();
      return user;
    } catch (err) {
      console.error("Auth fetch error:", err);
      return null;
    }
  }
  static async getServerSidePropsForEvents() {
    const defaultCityName = 'Delhi-NCR';
    let events: Events[] = [];
    // const indianCities = indianCitiesPageData;
    const indianCities = await this.getAllLocationsForEventsFromBackend();

    try {
      const cityObj = indianCities.find(city => city.locationName === defaultCityName);
      if (cityObj) {
        const response = await fetch(
          `${API_CONFIG.BACKEND_BASE_URL}/api/events/getEventsForLocation`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              locationName: cityObj.locationName.split('-')[0],
              locationCode: cityObj.locationCode || '',
            }),
          }
        );
        const data = response.ok ? await response.json() : { events: [] };
        if (data.events) {
          events = data.events || [];
        }
        else {
          console.error('No events found for the default city:', defaultCityName);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      return {
        initialEvents: [],
        initialLocation: defaultCityName,
      };
    }
    return {
      initialEvents: events,
      // indianCities,
      initialLocation: defaultCityName,
    };
  }

  static async getAllLocationsForEventsFromBackend(serverSide: boolean = true): Promise<IndianCity[]> {
    const CACHE_KEY = 'event_locations';
    const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
    try {
      if (!serverSide) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const now = Date.now();

          if (now - parsed.timestamp < CACHE_TTL_MS) {
            // ✅ Return cached data if it's still valid
            return parsed.data;
          }
        }
      }

      const response = await fetch(
        `${API_CONFIG.BACKEND_BASE_URL}/api/events/getAllLocationsWithCode`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch locations for events');
      }
      const data = await response.json();
      if (!serverSide) {

        // Step 3: Cache the fresh data with timestamp
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data, timestamp: Date.now() })
        );
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching locations for events:', error);
      return [];
    }
  }

  static async fetchEvents(city: IndianCity): Promise<Events[]> {
    if (city) {
      try {
        const res = await fetch(
          `${API_CONFIG.BACKEND_BASE_URL}/api/events/getEventsForLocation`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              locationName: city.locationName.split('-')[0],
              locationCode: city.locationCode || '',
            }),
          }
        );
        const data = await res.json();
        return data.events || [];
      } catch (error) {
        console.error('Error fetching events:', error);
        return [];
      }
    }
    return [];
  }



  // For server-side rendering and SEO - no auth required
  static async fetchLocations(skip: number = 0, limit: number = 1000, fields: LocationField[], token: string = ""): Promise<{ locations: Location[] }> {
    try {
      const response = await fetch(
        `${API_CONFIG.BACKEND_BASE_URL}/api/locations/getAllLocationsDynamicByFields`,
        {
          method: 'POST',
          headers: await this.getAuthHeadersServer(token),
          body: JSON.stringify({ skip, limit, fields })
        }
      );
      return this.handleResponse<{ locations: Location[] }>(response);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      return { locations: [] };
    }
  }

  // For client-side - fetches locations with wishlist status
  static async fetchLocationsWithWishlist(skip: number = 0, limit: number = 1000, fields: LocationField[]): Promise<getLocationResponseSchema> {
    let result: getLocationResponseSchema = {} as getLocationResponseSchema;
    if (localStorage.getItem(STORAGE_KEYS.TOKEN) === null) {
      return result; // No token, return empty
    }
    try {
      const response = await fetch(
        `${API_CONFIG.BACKEND_BASE_URL}/api/locations/getAllLocationsDynamicByFields`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ skip, limit, fields })
        }
      );
      result = await this.handleResponse<getLocationResponseSchema>(response);
      return result;

    } catch (error) {
      console.error('Failed to fetch locations with wishlist:', error);
      // return { locations: [] };
      return result;
    }
  }
  static async fetchLocationsUnified(
    skip: number = 0,
    limit: number = 1000,
    fields: LocationField[]
  ): Promise<getLocationResponseSchema> {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const headers = token
      ? this.getAuthHeaders()
      : { 'Content-Type': 'application/json' };

    try {
      const response = await fetch(
        `${API_CONFIG.BACKEND_BASE_URL}/api/locations/getAllLocationsDynamicByFields`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ skip, limit, fields }),
        }
      );

      const result = await this.handleResponse<getLocationResponseSchema>(response);
      return result;
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      return {} as getLocationResponseSchema;
    }
  }

  // Utility to merge server locations with client wishlist data
  static mergeLocationsWithWishlist(serverLocations: Location[], clientLocations: Location[]): Location[] {
    const wishlistMap = new Map();

    // Create a map of client locations with wishlist data
    clientLocations.forEach(location => {
      wishlistMap.set(location.id, location);
    });

    // Merge server locations with wishlist data
    return serverLocations.map(serverLocation => {
      const clientLocation = wishlistMap.get(serverLocation.id);
      return {
        ...serverLocation,
        isWishlisted: clientLocation?.isWishlisted || false,
        // Merge any other user-specific fields here
      };
    });
  }

  static async login(credentials: { email: string; password: string }): Promise<CompleteProfileApiResponse> {
    const response = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(response);
  }

  static async register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    sex: string;
  }): Promise<CompleteProfileApiResponse> {
    const response = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/users/basicRegistration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  static async googleLogin(token: string): Promise<GoogleLoginResponse> {
    const response = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/auth/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return this.handleResponse(response);
  }

  static async completeProfile(formData: FormData): Promise<CompleteProfileApiResponse> {
    const response = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/auth/complete-profile`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${StorageUtils.getItem(STORAGE_KEYS.TOKEN)}`,
      },
    });
    return this.handleResponse(response);
  }

  static async addPhoneNumber(userId: string, phone: string): Promise<CompleteProfileApiResponse> {
    const response = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/auth/google-complete`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ userId, phone }),
    });
    return this.handleResponse(response);
  }

  static async toggleWishlist(data: { type: string; refId: string; parentType?: string; parentId?: string; name?: string }): Promise<ApiResponse | void> {
    const body: wishlistRequestSchema = {
      type: data.type,
      refId: data.refId,
      name: data.name,
    };

    if (data.parentType) {
      body.parentType = data.parentType;
    }

    if (data.parentId) {
      body.parentId = data.parentId;
    }

    try {
      const response = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/miscellanous/wishlist`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(body),
      });

      if (response.status === 403) {
        // Retry after login
        triggerLogin(() => this.toggleWishlist(data));
        return;
      }

      return this.handleResponse<ApiResponse>(response);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      return;
    }
  }
  static async fetchLocationById(id: string): Promise<Location | null> {
    try {
      const response = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/locations/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error fetching location: ${response.statusText}`);
      }

      const data: Location = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch location by ID:', error);
      return null;
    }
  }
  static async fetchLocationByIdServer(id: string, token: string = ""): Promise<Location | null> {
    try {
      const response = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/locations/${id}`, {
        method: 'GET',
        headers: await this.getAuthHeadersServer(token),
      });
      const data: Location = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch location by ID:', error);
      return null;
    }
  }
  static async getPlacesByIds(ids: string[], token: string = ""): Promise<PlacesToVisit[]> {
    if (!ids || ids.length === 0) return [];
    try {
      const response = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/places/getPlacesByIds`, {
        method: 'POST',
        headers: await this.getAuthHeadersServer(token),
        body: JSON.stringify({ placeIds: ids }),
      });
      const PlacesToVisitRes: PlacesToVisit[] = await response.json();
      if (!response.ok) {
        throw new Error(`Error fetching places`);
      }
      return PlacesToVisitRes;
    } catch (error) {
      console.error('Failed to fetch places by IDs:', error);
      return [];
    }
  }

  static async fetchNearbyEntities(latitude: number, longitude: number, radius: number): Promise<exploreNearByApiResponse> {
    const userToken = localStorage.getItem('userToken');
    const res = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/nearby/getNearbyEntities`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          lat: latitude,
          long: longitude,
          radius
        })
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch nearby entities");
    }
    const response: exploreNearByApiResponse = await res.json();

    return response;
  };
}
