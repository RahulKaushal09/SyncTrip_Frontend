/**
 * Application configuration constants
 */

export const API_CONFIG = {
    DOMAIN_BASE_URL: process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || 'http://localhost:3000',
    SOCKET_URL: process.env.NEXT_PUBLIC_DOMAIN_BASE_URL || 'http://localhost:5001',
    BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3001',
    ICON_BASE_URL: (process.env.NODE_ENV == "development" ? "http://localhost:3000" : process.env.NEXT_PUBLIC_BACKEND_BASE_URL) + '/icons',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
} as const;

export const GOOGLE_CONFIG = {
    CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
} as const;

export const STORAGE_KEYS = {
    USER: 'user',
    TOKEN: 'userToken',
    USER_INFO: 'userInfo',
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    THEME: 'theme',
    LANGUAGE: 'language',
} as const;

export const ROUTES = {
    HOME: '/',
    // LOGIN: '/login',
    // REGISTER: '/register',
    TRIPS: '/trips',
    GROUP_TRIPS: '/groupTrips',
    HOSTED_TRIPS: '/hostedTrips',
    USER_TRIPS: '/userTrips',
    // USER_TRIP_PLANNER: '/userTrip/planner',
    // USER_TRIP_DETAILS: '/userTrip/details',
    CREATE_TRIP:'/create/trip',
    BLOGS:'/blogs',
    EXPLORE:'/explore',
    PROFILE: '/profile',
    LOCATIONS: '/locations',
    HOW_IT_WORKS: '/how-it-works',
    TERMS_OF_SERVICE: '/terms-of-service',
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

export const GROUP_LIMITS = {
  NAME_MIN: 3,
  NAME_MAX: 50,
  MAX_MEMBERS_MIN: 5,
  MAX_MEMBERS_MAX: 9,
  TAGS_MAX: 3
};