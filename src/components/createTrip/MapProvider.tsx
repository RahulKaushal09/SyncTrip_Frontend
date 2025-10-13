// components/MapProvider.tsx
'use client';

import { Libraries, useJsApiLoader } from '@react-google-maps/api';
import { ReactNode } from 'react';

const libraries: Libraries = ['places'];

export function MapProvider({ children }: { children: ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  if (loadError) return <div>Error loading Google Maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return <>{children}</>;
}