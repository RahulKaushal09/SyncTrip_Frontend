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
    COMPLETE_PROFILE_STEP: 'completeProfileStep',
    EMAIL_VERIFIED: 'isEmailVerified',
    GUEST_STRIKES: 'guest_strikes',
    LOGGED_IN_STRIKES: 'logged_in_strikes',
    POPUP_CYCLE_COMPLETED: 'popup_cycle_completed'
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
    PLANS:'/explore/plans',
    PROFILE: '/profile',
    LOCATIONS: '/locations',
    HOW_IT_WORKS: '/how-it-works',
    TERMS_OF_SERVICE: '/terms-of-service',
} as const;

export const APP_LINKS = {
    PLAY_STORE: 'https://play.google.com/store/apps/details?id=com.synctrip',
    APP_STORE: 'https://apps.apple.com/in/app/synctrip-plan-meet-explore/id6761762665',
    WEB_HOME: 'https://synctrip.in',
}

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

export const TRIPS_HOME = [
  {
    id: "1",
    locationName: "Rishikesh",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Rishikesh/photos/24_dest_wiki_13641.jpg",
      tripName: "Epic Weekend Chandrashila Trek",
      startDate: "2026-05-01T00:00:00.000Z",
      endDate: "2026-05-03T00:00:00.000Z",
      budget: "Economic",
      interests: ["Adventure Travel", "Nature Escapes", "City Breaks", "Solo Travel"],
    },
    userSnapshot: { name: "Rahul G.", age: 27 },
  },
  {
    id: "2",
    locationName: "Manali",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Manali/photos/51_shutterstock_633164246_20190904103856_20190904103926.jpg",
      tripName: "Into the Wild: Spiti Valley",
      startDate: "2026-05-25T00:00:00.000Z",
      endDate: "2026-05-31T00:00:00.000Z",
      budget: "Flexible",
      interests: ["Adventure Travel", "Road Trips", "Group Tours"],
    },
    userSnapshot: { name: "Karan J.", age: 24 },
  },
  {
    id: "3",
    locationName: "Goa",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Goa/photos/28_dest_wiki_5241.jpg",
      tripName: "Sun, Sand & Sea Escape",
      startDate: "2026-04-14T00:00:00.000Z",
      endDate: "2026-04-16T00:00:00.000Z",
      budget: "Flexible",
      interests: ["Adventure Travel", "Spontaneous", "Food Tourism", "Beach Vacations"],
    },
    userSnapshot: { name: "Mihir", age: 26 },
  },
  {
    id: "4",
    locationName: "Rishikesh",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Rishikesh/photos/0_RISHIKESH.jpg",
      tripName: "River Rafting & Yoga Retreat",
      startDate: "2026-05-03T00:00:00.000Z",
      endDate: "2026-05-05T00:00:00.000Z",
      budget: "Affordable",
      interests: ["Solo Travel", "Food Tourism", "Cultural Exploration"],
    },
    userSnapshot: { name: "Sahil S.", age: 19 },
  },
  {
    id: "5",
    locationName: "Goa",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Goa/photos/3_shutterstock_1122030473_20191021122828.jpg",
      tripName: "Tropical Escape & Chill",
      startDate: "2026-04-26T00:00:00.000Z",
      endDate: "2026-04-30T00:00:00.000Z",
      budget: "Affordable",
      interests: ["Adventure Travel", "Spontaneous", "Nature Escapes"],
    },
    userSnapshot: { name: "Kunal", age: 26 },
  },
  {
    id: "6",
    locationName: "Manali",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Manali/photos/45_10479609393_1c882d0f36_b_20190207103501.jpg",
      tripName: "Snowy Retreat in Manali",
      startDate: "2026-05-01T00:00:00.000Z",
      endDate: "2026-05-04T00:00:00.000Z",
      budget: "Affordable",
      interests: ["Solo Travel", "Adventure Travel"],
    },
    userSnapshot: { name: "Sneha", age: 27 },
  },
  {
    id: "7",
    locationName: "Goa",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Goa/photos/46_3195.jpg",
      tripName: "Discovering the Secrets of the Sea",
      startDate: "2026-06-05T00:00:00.000Z",
      endDate: "2026-06-09T00:00:00.000Z",
      budget: "Affordable",
      interests: ["Spontaneous", "Solo Travel", "Planner", "Beach Vacations", "Group Tours"],
    },
    userSnapshot: { name: "Pranav", age: 19 },
  },
  {
    id: "8",
    locationName: "Rishikesh",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Rishikesh/photos/23_3755.jpg",
      tripName: "Spiritual Awakening Backpacking",
      startDate: "2026-05-02T00:00:00.000Z",
      endDate: "2026-05-03T00:00:00.000Z",
      budget: "Affordable",
      interests: ["Adventure Travel", "Solo Travel"],
    },
    userSnapshot: { name: "Uday S.", age: 22 },
  },
  {
    id: "9",
    locationName: "Goa",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Goa/photos/14_5679.jpg",
      tripName: "Luxury North Goa Experience",
      startDate: "2026-04-17T00:00:00.000Z",
      endDate: "2026-04-20T00:00:00.000Z",
      budget: "Luxury",
      interests: ["Adventure Travel", "Spontaneous", "Planner", "Beach Vacations", "City Breaks"],
    },
    userSnapshot: { name: "Manish", age: 26 },
  },
  {
    id: "10",
    locationName: "Goa",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Goa/photos/30_3202.jpg",
      tripName: "Finding Peace by the Beach",
      startDate: "2026-04-30T00:00:00.000Z",
      endDate: "2026-05-05T00:00:00.000Z",
      budget: "Economic",
      interests: ["Adventure Travel", "Cultural Exploration", "Beach Vacations", "Road Trips"],
    },
    userSnapshot: { name: "Aman K.", age: 30 },
  },
  {
    id: "11",
    locationName: "Manali",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Manali/photos/9_28022192021_b8e82eb874_b_20190320141704.jpg",
      tripName: "High Altitude Adventures",
      startDate: "2026-04-24T00:00:00.000Z",
      endDate: "2026-04-30T00:00:00.000Z",
      budget: "Affordable",
      interests: ["Adventure Travel", "Spontaneous", "Solo Travel", "Cultural Exploration", "Road Trips"],
    },
    userSnapshot: { name: "Prateek", age: 34 },
  },
  {
    id: "12",
    locationName: "Goa",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Goa/photos/9_3201.jpg",
      tripName: "Cross-Country Road Trip",
      startDate: "2026-05-07T00:00:00.000Z",
      endDate: "2026-05-12T00:00:00.000Z",
      budget: "Economic",
      interests: ["Adventure Travel", "Road Trips", "Nature Escapes"],
    },
    userSnapshot: { name: "Sameer", age: 26 },
  },
  {
    id: "13",
    locationName: "Rishikesh",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Rishikesh/photos/7_541954932_d9a3b67806_o_20190408175523_20190408175539_20190803125513.jpg",
      tripName: "Mystic Himalayan Journey",
      startDate: "2026-04-13T00:00:00.000Z",
      endDate: "2026-04-18T00:00:00.000Z",
      budget: "Affordable",
      interests: ["Group Tours", "Adventure Travel"],
    },
    userSnapshot: { name: "Jatin", age: 33 },
  },
  {
    id: "14",
    locationName: "Goa",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Goa/photos/41_Palolem_sunset_20190312153725.jpg",
      tripName: "Ultimate Goa Sunset Chase",
      startDate: "2026-04-30T00:00:00.000Z",
      endDate: "2026-05-04T00:00:00.000Z",
      budget: "Economic",
      interests: ["Spontaneous", "Solo Travel", "Beach Vacations"],
    },
    userSnapshot: { name: "Nakul", age: 29 },
  },
  {
    id: "15",
    locationName: "Goa",
    tripSnapshot: {
      tripImage: "https://synctrip.gumlet.io/compressed/Location/Goa/photos/30_3202.jpg",
      tripName: "Making Connections at Morjim",
      startDate: "2026-04-11T00:00:00.000Z",
      endDate: "2026-04-15T00:00:00.000Z",
      budget: "Economic",
      interests: ["Solo Travel", "Spontaneous", "Beach Vacations"],
    },
    userSnapshot: { name: "Naman", age: 39 },
  },
];