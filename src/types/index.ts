/**
 * Type definitions index file
 * Export all types for easy importing
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set' | 'js',
      targetId?: string,
      config?: Record<string, unknown>
    ) => void;

    dataLayer?: Array<Record<string, unknown>>;
  }
}

// User types
export * from './user.types';

// Component types  
export * from './component.types';

// API types
export * from './api.types';

// Common types
export * from './common.types';

// Clubs, club events and mega events (public share pages)
export * from './club.types';

