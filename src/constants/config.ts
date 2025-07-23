/**
 * Application configuration constants
 */

export const API_CONFIG = {
    BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
} as const;

export const GOOGLE_CONFIG = {
    CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
} as const;

export const STORAGE_KEYS = {
    USER: 'user',
    TOKEN: 'userToken',
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    THEME: 'theme',
    LANGUAGE: 'language',
} as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    TRIPS: '/trips',
    PROFILE: '/profile',
    LOCATIONS: '/locations',
} as const;

export const BREAKPOINTS = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
} as const;

export const VALIDATION_RULES = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    PHONE_LENGTH: 10,
} as const;

export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_FILES: 10,
} as const;