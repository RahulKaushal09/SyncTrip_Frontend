'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import SyncTripLogo from "../../assets/images/logoWeb.png";
import Image from 'next/image';
import Link from 'next/link';
// Skeleton loader for logo, login/register button, and user image/name
const NavbarSkeleton = () => (
    <nav className="navbar navbar-expand-lg navbar-light ">
        <div className="container-fluid d-flex justify-content-between align-items-center">
            <Link href="/" className="navbar-brand" style={{ width: "100px" }}>
                <Image src={SyncTripLogo} alt="SyncTrip" style={{ width: "100%" }} />
            </Link>

            {/* Login/Register button or User profile skeleton */}
            <div className="navbar-nav ms-auto d-flex align-items-center gap-2">
                {/* User profile image skeleton */}
                <div
                    className="skeleton skeleton-profile"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'skeleton-loading 1.5s infinite'
                    }}
                />
                {/* User name or login/register button skeleton */}
                <div
                    className="skeleton skeleton-button"
                    style={{
                        width: '120px',
                        height: '24px',
                        borderRadius: '4px',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'skeleton-loading 1.5s infinite'
                    }}
                />
            </div>
        </div>

        {/* Skeleton animation styles */}
        <style jsx>{`
            @keyframes skeleton-loading {
                0% {
                    background-position: 200% 0;
                }
                100% {
                    background-position: -200% 0;
                }
            }
            .skeleton {
                display: inline-block;
            }
            .skeleton-logo, .skeleton-button, .skeleton-profile {
                background-size: 200% 100%;
            }
        `}</style>
    </nav>
);

const NavbarClient = dynamic(() => import('./NavbarClient'), {
    ssr: false,
    loading: () => <NavbarSkeleton />
});

export default function NavbarWrapper() {
    return (
        <Suspense fallback={<NavbarSkeleton />}>
            <NavbarClient />
        </Suspense>
    );
}