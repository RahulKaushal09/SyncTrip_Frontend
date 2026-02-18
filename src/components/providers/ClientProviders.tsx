"use client";

import { LoaderProvider } from '@/components/providers/LoaderContext';
import { LoginProvider } from '@/components/providers/LoginProvider';
import { Toaster } from 'react-hot-toast';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LoaderProvider>
      <LoginProvider>
        {children}
        <Toaster position="top-right" />
      </LoginProvider>
    </LoaderProvider>
  );
}
