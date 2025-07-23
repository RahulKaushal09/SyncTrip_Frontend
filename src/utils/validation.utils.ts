/**
 * Validation utility classes and functions
 */

import { VALIDATION_RULES } from '../constants';

export class ValidationUtils {
    static isValidEmail(email: string): boolean {
        return VALIDATION_RULES.EMAIL_REGEX.test(email);
    }

    static isValidPassword(password: string): boolean {
        return password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH;
    }

    static isValidName(name: string): boolean {
        return name.length >= VALIDATION_RULES.NAME_MIN_LENGTH &&
            name.length <= VALIDATION_RULES.NAME_MAX_LENGTH;
    }

    // static validateRequired(value: any, fieldName: string): string | null {
    //     if (!value || (typeof value === 'string' && value.trim() === '')) {
    //         return `${fieldName} is required`;
    //     }
    //     return null;
    // }

    static validateEmail(email: string): string | null {
        if (!email) return 'Email is required';
        if (!this.isValidEmail(email)) return 'Please enter a valid email address';
        return null;
    }

    static validatePassword(password: string): string | null {
        if (!password) return 'Password is required';
        if (!this.isValidPassword(password)) {
            return `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`;
        }
        return null;
    }

    static validateConfirmPassword(password: string, confirmPassword: string): string | null {
        if (!confirmPassword) return 'Please confirm your password';
        if (password !== confirmPassword) return 'Passwords do not match';
        return null;
    }

    static validateName(name: string): string | null {
        if (!name) return 'Name is required';
        if (!this.isValidName(name)) {
            return `Name must be between ${VALIDATION_RULES.NAME_MIN_LENGTH} and ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`;
        }
        return null;
    }
}
