/**
 * API service utilities for common API operations
 */

import { API_CONFIG, LocationField, STORAGE_KEYS } from '../constants';
import { StorageUtils } from './storage.utils';
import { ApiResponse, Location } from '../types';
import { triggerLogin } from './login.utils';
import GoogleLoginResponse, { CompleteProfileApiResponse } from '@/types/ApiResponse.types';
import { wishlistRequestSchema } from '@/types/ApiRequest.types';

export class ApiService {
  private static getAuthHeaders(): HeadersInit {
    const token = StorageUtils.getToken();
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


  // For server-side rendering and SEO - no auth required
  static async fetchLocations(skip: number = 0, limit: number = 1000, fields: LocationField[]): Promise<{ locations: Location[] }> {
    try {
      const response = await fetch(
        `${API_CONFIG.BACKEND_BASE_URL}/api/locations/getAllLocationsDynamicByFields`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
  static async fetchLocationsWithWishlist(skip: number = 0, limit: number = 1000, fields: LocationField[]): Promise<{ locations: Location[] }> {
    if (localStorage.getItem(STORAGE_KEYS.TOKEN) === null) {
      return { locations: [] }; // No token, return empty
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
      return this.handleResponse<{ locations: Location[] }>(response);
    } catch (error) {
      console.error('Failed to fetch locations with wishlist:', error);
      return { locations: [] };
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
}
