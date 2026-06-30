import { Suspense } from 'react';
import type { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

// Never statically cache: every checkout is a fresh, per-user, per-order session.
export const dynamic = 'force-dynamic';

// This page is opened inside the app's WebView with a bearer token in the URL —
// it must never be indexed.
export const metadata: Metadata = {
    title: 'SyncTrip Checkout',
    robots: { index: false, follow: false, nocache: true },
};

export default function CheckoutPage() {
    // useSearchParams() inside the client component requires a Suspense boundary (Next 15).
    return (
        <Suspense fallback={null}>
            <CheckoutClient />
        </Suspense>
    );
}
