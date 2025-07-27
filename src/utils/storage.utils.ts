/**
 * Utility classes for common operations
 */

import { User } from '@/types';
import { STORAGE_KEYS } from '../constants';
import Cookies from 'js-cookie';

export class StorageUtils {
    static setItem<T>(key: string, value: T): void {
        try {
            // Check if we're in a browser environment
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }

    static getItem<T>(key: string): T | null {
        try {
            // Check if we're in a browser environment
            if (typeof window !== 'undefined' && window.localStorage) {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            }
            return null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    static removeItem(key: string): void {
        try {
            // Check if we're in a browser environment
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    static clear(): void {
        try {
            // Check if we're in a browser environment
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.clear();
            }
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }

    // User-specific storage methods
    static setUser(user: User): void {
        this.setItem(STORAGE_KEYS.USER, user);
    }

    static getUser(): User | null {
        return this.getItem(STORAGE_KEYS.USER);
    }

    static setToken(token: string): void {
        this.setItem(STORAGE_KEYS.TOKEN, token);
    }

    static getToken(): string | null {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token) {
            // console.warn("No token found in localStorage");
        }

        return token;
    }

    static clearUserData(): void {
        this.removeItem(STORAGE_KEYS.USER);
        this.removeItem(STORAGE_KEYS.TOKEN);
        this.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        Cookies.remove(STORAGE_KEYS.TOKEN);
        Cookies.remove(STORAGE_KEYS.USER_INFO);
    }
}
