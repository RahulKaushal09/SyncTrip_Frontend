/**
 * Date utility functions
 */

export class DateUtils {
    static formatDate(date: string | Date, format: 'short' | 'long' | 'medium' = 'medium'): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
            short: { year: 'numeric', month: 'short', day: 'numeric' },
            medium: { year: 'numeric', month: 'long', day: 'numeric' },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            }
        };

        return dateObj.toLocaleDateString('en-US', formatOptions[format]);
    }

    static formatDateTime(date: string | Date): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static getRelativeTime(date: string | Date): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffMs = now.getTime() - dateObj.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }

    static isToday(date: string | Date): boolean {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const today = new Date();
        return dateObj.toDateString() === today.toDateString();
    }

    static isFuture(date: string | Date): boolean {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj > new Date();
    }

    static addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    static getDaysDifference(date1: Date, date2: Date): number {
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}
