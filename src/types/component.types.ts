/**
 * Component props type definitions
 */

import { User } from './user.types';

// export interface NavbarProps {
//     ctaAction: () => void;
//     user: User | null;
// }

export interface LoginPopupProps {
    onClose: () => void;
    onLogin: (user: User, requiresPhone?: boolean) => void;
}

export interface FullProfilePopupProps {
    user: User;
    onClose: () => void;
    onProfileComplete: (user: User) => void;
}

export interface PhoneNumberPopupProps {
    user: User;
    onClose: () => void;
    onPhoneSubmit: (user: User) => void;
}

export interface PreRegisterPopupProps {
    onClose: () => void;
}

// export interface ButtonProps {
//     children: React.ReactNode;
//     onClick?: () => void;
//     variant?: 'primary' | 'secondary' | 'danger' | 'success';
//     size?: 'sm' | 'md' | 'lg';
//     disabled?: boolean;
//     loading?: boolean;
// }

// export interface ModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     title?: string;
//     children: React.ReactNode;
//     size?: 'sm' | 'md' | 'lg' | 'xl';
// }

export interface Events {
    title: string;
    price: string;
    Allcategories: string[];
    Bestcategory: string;
    imageLink: string;
    bookingLink: string;
    location: {
        locationName: string;
        locationCode: string;
    };
    eventType: string;
    tags: string[];
    lastUpdatedDate: number;
    eventDateTime: number;
    _id: string;
    id: string;
}

// export interface FormProps {
//     onSubmit: (data: unknown) => void;
//     loading?: boolean;
//     initialValues?: Record<string, unknown>;
// }


export interface TrendingLocationData {
    imgUrl: string;
    Title: string;
    Location: string;
    peopleVisited: string;
}

export interface Culture {
    name: string;
    description: string;
    timings: string;
    village: string;
    images: {
        image_url: string;
        title: string;
    }[];

}
export interface Festival {

    name: string;
    description: string;
    timings: string;
    village: string;
    images: {
        image_url: string;
        title: string;
    }[];

}
export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string; // Full HTML content
    featuredImage: string;
    createdAt: string;
    relatedLocations: string[]; // Array of location IDs
    seo: {
        seo_title: string;
        seo_description: string;
        seo_keywords: string[];
        canonical_url: string;
        seo_image: string;
    };
    tags: string[];
    filterTags: string[];
    author: string;
    readTime: string;
    category: string;
    rating?: string;
    featured?: boolean;
}


export type DayWeather = {
    date: string; // ISO YYYY-MM-DD
    temp: number; // main temperature (°C)
    minTemp?: number;
    maxTemp?: number;
    description?: string; // e.g. 'Snowy'
    cloud?: number; // %
    wind_kmh?: number; // km/h
    sunrise?: string; // '06:03'
    sunset?: string; // '17:30'
    precipitation?: number; // %
    icon?: string; // emoji or className for icon
    available?: boolean; // is data available for this day
};


export interface ChatUser {
    id: string;
    name: string;
    email?: string;
    profile_picture?: string[];
}

export interface LatestMessageSender {
    id: string;
    name: string;
    profile_picture?: string;
}

export interface LatestMessage {
    id: string;
    content: string;
    sender: LatestMessageSender;
    readBy?: string[];
    createdAt: string;
    updatedAt: string;
}


export interface Chat {
    id: string;
    tripMap: {
        userId: string;
        tripId: string;
    }[];
    matchId?: string;
    isMatchChat: boolean;
    isGroupChat: boolean;
    groupTripId?: string;
    users: ChatUser[] | string[];
    latestMessage?: LatestMessage;
    latestMessageText?: string;
    latestMessageAt?: string;
    latestMessageSender?: string;
    groupAdmin?: ChatUser;
    chatName: string;
    createdAt: string;
    updatedAt: string;
    unreadCount?: number;
}

export interface Message {
    id: string;
    chat: string;
    sender: string;
    content: string;
    readBy: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ChatWithMessages extends Chat {
    messages: Message[];
}