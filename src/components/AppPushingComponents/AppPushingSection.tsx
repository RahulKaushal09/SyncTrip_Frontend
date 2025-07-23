'use client';

import React, { useEffect, useState } from 'react';
import { BsBoundingBoxCircles, BsTaxiFrontFill } from 'react-icons/bs';
import { GrSwim } from 'react-icons/gr';

import peopleTravelling from '../../assets/images/peopleTravelling.svg';
import syncTripApp from '../../assets/images/syncTripMobile.png';
import '../../../styles/appPushing.css';

interface SyncTripAppPushingSectionProps {
    showWork?: boolean;
}

const SyncTripAppPushingSection = ({ showWork }: SyncTripAppPushingSectionProps) => {
    const [mobileView, setMobileView] = useState(false);

    useEffect(() => {
        setMobileView(window.innerWidth <= 768);
        const handleResize = () => setMobileView(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const features = [
        {
            Icon: BsBoundingBoxCircles,
            title: 'Explore Destinations',
            description:
                'Discover destinations with filters like budget, activities, and travel preferences.',
        },
        {
            Icon: GrSwim,
            title: 'Plan Collaboratively',
            description:
                'Create trips, invite friends, and build shared itineraries like Pinterest boards.',
        },
        {
            Icon: BsTaxiFrontFill,
            title: 'Finalize Effortlessly',
            description:
                'Pick dates, finalize plans with your group, and enjoy a well-organized trip.',
        },
    ];

    return (
        <div className="container py-5 bg-white">
            {showWork && (
                <h2 className="fw-bold text-primary mb-5">How SyncTrip works?</h2>
            )}

            {showWork && (
                <div className="row align-items-center mb-5">
                    <div className="col-md-6 col-lg-5">
                        {features.map(({ Icon, title, description }, index) => (
                            <div className="d-flex mb-4" key={index}>
                                <div
                                    className="d-flex align-items-center justify-content-center me-3"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        borderRadius: '5px',
                                    }}
                                >
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h5 className="mb-1 fw-bold">{title}</h5>
                                    <p className="mb-0 text-muted">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-md-6 col-lg-7 text-center">
                        <img
                            src={peopleTravelling}
                            alt="Woman using SyncTrip app"
                            className="img-fluid rounded shadow"
                            style={{ maxHeight: '400px', objectFit: 'contain' }}
                        />
                    </div>
                </div>
            )}

            <div className="row align-items-center">
                {!mobileView && (
                    <div className="col-md-4 mb-4 mb-md-0 text-center">
                        <img
                            src={syncTripApp.src}
                            alt="SyncTrip app screenshot"
                            className="img-fluid rounded shadow"
                            style={{ maxHeight: '500px', objectFit: 'contain' }}
                        />
                    </div>
                )}

                <div className="col-md-8">
                    <h2 className="fw-bold mb-3">Sync, plan, and explore – the way YOU want.</h2>
                    <p className="text-muted mb-3">
                        Your perfect trip planner is <strong>coming soon!</strong> Stay ahead by joining the travel revolution.
                    </p>
                    <button className="btn btn-dark" onClick={() => alert('CTA clicked')}>
                        Click here
                    </button>
                    <p className="text-muted mt-3">and register for early access.</p>
                </div>
            </div>
        </div>
    );
};

export default SyncTripAppPushingSection;
