import { apiErrorType, userWishlistResponse } from '@/classes/ApiResponse.classes';
import { API_CONFIG } from '../constants';
import { getUserWishlistRequestSchema } from '@/classes/ApiRequest.classes';
import { User, UserWishList } from '@/types';
import Cookies from 'js-cookie';
import apiClient from './apiClient';
// import { cookies } from 'next/headers';

export class UserApiService {
    static async getUserTripViewActivityCount(): Promise<{ tripCount: number, viewCount: number }> {
        try {
            const res = await apiClient.get('/users/getUserTripViewActivityCount');
            return res.data || { tripCount: 0, viewCount: 0 };
        } catch (error) {
            console.error("Error fetching user view and trip count:", error);
            return { tripCount: 0, viewCount: 0 };
        }
    }

    static async fetchUserWishlist(wishlistType: string): Promise<UserWishList[]> {
        const getWishlistBody: getUserWishlistRequestSchema = {
            wishlistType: wishlistType
        }
        const token = Cookies.get('userToken') || '';
        if (!token) {
            return [];
        }
        const wishlistResponse = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/users/getWishlist`, {
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
    static async logoutUser(): Promise<void> {
        try {
            await apiClient.post('/users/logout');
        } catch (error) {
            console.error("Error logging out user:", error);
            throw error;
        }
    }

    static async updateUser(payload: Partial<User>): Promise<{ success: boolean; message?: string }> {
        try {
            await apiClient.post("/users/updateuser", payload);
            return { success: true };
        } catch (error: unknown) {
            return {
                success: false,
                message:
                    // error?.response?.data?.message || 
                    "Something went wrong",
            };
        }
    }
    static async updateProfilePhoto(file: File): Promise<{ success: boolean; url?: string; message?: string; }> {
        try {
            const formData = new FormData();
            formData.append("profilePhoto", file);

            const response = await apiClient.post("/users/update-profile-photo-web",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return response.data;
        } catch (error: unknown) {
            return {
                success: false,
                // code: error?.code,
                message: "Failed to upload profile picture. Please try again later.",
            };
        }
    }

    static UpdateProfileImageOfUser = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('profilePhoto', file);
            // debugger;
            const response = await UserApiService.updateProfilePhoto(file);
    
            const newImageUrl = response.url;
    
            if (newImageUrl) {
                // toast.success("Profile picture updated!");
                return {
                    success: true,
                    url: newImageUrl
                }
            }
        } catch (error: unknown) {
            // Check if the backend sent a specific error message
            const errorMessage = (error as apiErrorType)?.message || "Failed to upload image";
            console.error("Upload Error:", error);
            // toast.error(errorMessage);
        }
    };
    
    static async submitAssessment(formData: string): Promise<{ success: boolean; message?: string }> {
        try {
            const res = await apiClient.post("/users/career/user-submission", formData);
            return { success: true, message: res?.data?.message };
        } catch (err) {
            console.error("Error submitting assessment:", err);
            return {
                success: false,
                message: "Failed to submit assessment. Please try again later.",
            };
        }
    };
}



