/**
 * Global login manager for handling authentication across the app
 */

import { User } from '../types';

type LoginCallback = (user: User, requiresPhone?: boolean) => void;
type LoginHandler = (callback: LoginCallback, options?: LoginOptions) => void;

export interface LoginOptions {
    skipCompleteProfile?: boolean;
}

let openLoginPopup: LoginHandler | null = null;

export const setLoginHandler = (handler: LoginHandler): void => {
    openLoginPopup = handler;
};

export const triggerLogin = (onLoginCallback?: LoginCallback, options: LoginOptions = {}): void => {
    if (openLoginPopup) {
        openLoginPopup(onLoginCallback || (() => { }), options);
    } else {
        console.warn("Login handler not initialized");
    }
};

export const isUserLoggedIn = (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('userToken');
    return !!token;
};

export const getCurrentUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
};

