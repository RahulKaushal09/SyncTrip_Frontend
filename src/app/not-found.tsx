"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const NotFound = () => {
    const router = useRouter();

    return (
        <div className="App flex flex-col items-center justify-center text-center container-custom" style={{ minHeight: '70vh' }}>
            <div className="m-animate m-slide-up">

                <h2 className="h2 text-secondary-1">Oops! Page Not Found</h2>

                <p className="r1 text-neutral-1" style={{ maxWidth: '500px', margin: '10px auto 40px auto' }}>
                    The page you're looking for doesn't exist or has been moved.
                    Don't worry, we can help you find your way back!
                </p>

                <div className="flexbtn" style={{ flexDirection: 'column', gap: '16px' }}>
                    <button
                        onClick={() => router.push(`/explore`)}
                        className="btn btn-primary homebtnprimary"
                        style={{ width: '220px' }}
                    >
                        Explore Locations
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="btn btn-secondary-border"
                        style={{ width: '220px' }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;