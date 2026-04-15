'use client';

import React, { useEffect, useState } from 'react';


import peopleTravelling from '../../assets/images/peopleTravelling.svg';
import syncTripApp from '../../assets/images/syncTripMobile.png';
import '../../../styles/appPushing.css';
import { triggerLogin } from '@/utils';
import { Apple, Download } from 'lucide-react';
import { redirectToStore } from '@/utils/redirectToStore';

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

    // const features = [
    //     {
    //         Icon: BsBoundingBoxCircles,
    //         title: 'Explore Destinations',
    //         description:
    //             'Discover destinations with filters like budget, activities, and travel preferences.',
    //     },
    //     {
    //         Icon: GrSwim,
    //         title: 'Plan Collaboratively',
    //         description:
    //             'Create trips, invite friends, and build shared itineraries like Pinterest boards.',
    //     },
    //     {
    //         Icon: BsTaxiFrontFill,
    //         title: 'Finalize Effortlessly',
    //         description:
    //             'Pick dates, finalize plans with your group, and enjoy a well-organized trip.',
    //     },
    // ];

    return (
        <div className="container-appPushing mx-auto  py-8 bg-white" style={{ paddingBottom: "0px" }}>
            {/* {showWork && (
                <h2 className="fw-bold text-primary mb-5">How SyncTrip works?</h2>
            )}

            {showWork && (
                <div className="row  mb-5 ">
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
            )} */}
            <div className="AppPushingBlock" style={{ textAlign: "left" }}>
                <div className="row appPushingSection2">
                    {!mobileView && (
                        <div className="col-md-3 mb-3 mb-md-0 text-center" style={{ marginRight: "50px" }}>
                            <img
                                src={syncTripApp.src}
                                alt="SyncTrip app screenshot"
                                className="w-full max-w-sm  mb-6 img-appPushing"
                            />
                        </div>
                    )}

                    <div className="col-md-7">
                        <h2 className="mb-4" style={{ fontWeight: "600", fontSize: "48px", fontFamily: "Inter, sans-serif" }}>Sync, Plan, and Explore – the way YOU want.</h2>
                        <p className="text-muted mb-1">
                            Your next trip starts here!
                            <strong> Synctrip</strong> is already helping travelers
                            <br />
                            connect and plan better.
                        </p>
                        <p className="text-muted mb-6">Download the App today and get early access to our app!</p>
                        <div className='flex gap-3 items-center mb-5'>
                            <button onClick={redirectToStore} className='btn !flex gap-2 items-center btn-dark'>
                                <Download />
                                Download the App
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SyncTripAppPushingSection;
