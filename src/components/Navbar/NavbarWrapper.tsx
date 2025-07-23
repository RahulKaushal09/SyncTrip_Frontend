"use client";

import NavbarNew from './NavbarNew';
import { useRouter } from 'next/navigation';

export default function NavbarWrapper() {
  const router = useRouter();

  const handleCtaAction = () => {
    // Handle CTA action - redirect to create trip page
    console.log('CTA clicked');
    router.push('/trips/create'); // or wherever you want to redirect
  };

  return <NavbarNew ctaAction={handleCtaAction} />;
}
