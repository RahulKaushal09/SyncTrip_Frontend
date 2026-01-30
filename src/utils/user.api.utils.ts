import { userWishlistResponse } from '@/classes/ApiResponse.classes';
import { API_CONFIG } from '../constants';
import { getUserWishlistRequestSchema } from '@/classes/ApiRequest.classes';
import { User, UserWishList } from '@/types';
import Cookies from 'js-cookie';
import apiClient from './apiClient';
// import { cookies } from 'next/headers';

export class UserApiService {

    static async fetchUserWishlist(wishlistType: string): Promise<UserWishList[]> {
        const getWishlistBody: getUserWishlistRequestSchema = {
            wishlistType: wishlistType
        }
        const token = Cookies.get('userToken') || '';
        if (!token) {
            return [];
        }
        const wishlistResponse = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/users/getWishlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(getWishlistBody),
        });
        if (!wishlistResponse.ok) {
            throw new Error('Failed to fetch enrolled trips');
        }
        const userWishlistRes: userWishlistResponse = await wishlistResponse.json();
        return userWishlistRes?.wishlist;
    }

    static async fetchUserWithId(profileId: string): Promise<User | null> {
        try {
            const userRes = await apiClient.get(`/users/${profileId}`);
            return userRes.data?.user || null;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    }

    static async fetchUserWithIdForAnyone(profileId: string): Promise<User | null> {
        try {
            const userRes = await apiClient.get(`/users/profile/${profileId}`, {
                params: {
                    updateViewCount: true
                }
            });

            return userRes.data?.user || null;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    }
}

