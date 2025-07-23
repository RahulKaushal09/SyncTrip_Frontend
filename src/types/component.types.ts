/**
 * Component props type definitions
 */

import { User } from './user.types';

export interface NavbarProps {
    ctaAction: () => void;
    user: User | null;
}

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

export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

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

export interface FormProps {
    onSubmit: (data: unknown) => void;
    loading?: boolean;
    initialValues?: Record<string, unknown>;
}


export interface TrendingLocationData {
    imgUrl: string;
    Title: string;
    Location: string;
    peopleVisited: string;
}