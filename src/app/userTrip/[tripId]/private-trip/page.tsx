'use client';

import { useRouter, useParams } from 'next/navigation';
import {
    Map as MapIcon,
    Lock,
    Users,
    Sparkles,
    ArrowRight,
    AlertTriangle,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import TripServices from '@/utils/trip.utils';
import { tripPrivacyOptions, userTripFields } from '@/constants';
import toast from 'react-hot-toast';
import { UserTrip } from '@/types';
import { useLoader } from '@/components/providers/LoaderContext';
import Image from 'next/image';
import InvitePageMapView from '../../../../assets/images/InviteOnlyScreenMapView.png';

export default function PrivateTripPage() {
    const router = useRouter();
    const params = useParams();
    const tripId = params.tripId as string;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const { showLoader } = useLoader();

    useEffect(() => {
        const checkPrivacy = async () => {
            try {
                const tripDetails = await TripServices.fetchTripDetails(tripId, [userTripFields.ID, userTripFields.PRIVACY]);

                if (!tripDetails.id) {
                    router.replace('/');
                    return;
                }

                if (tripDetails.privacy?.toLowerCase() === tripPrivacyOptions.PUBLIC) {
                    router.replace(`/userTrip/${tripId}/travel-mode`);
                    return;
                }
                setIsChecking(false);
            } catch (err) {
                router.replace('/');
            }
        };

        checkPrivacy();
    }, [tripId, router]);

    // If we are still checking, don't show ANYTHING
    if (isChecking) {
        showLoader();
        return <></>;
    }

    const handleSwitchToPublic = async () => {
        if (isUpdating) return;

        setIsUpdating(true);

        try {
            const updatePrivacy: Partial<UserTrip> = { privacy: tripPrivacyOptions.PUBLIC };
            const res = await TripServices.updateTripPartial(tripId, updatePrivacy);

            if (res.userTrip) router.replace(`/userTrip/${tripId}/travel-mode`);
            else {
                toast.error("Something went wrong while updating trip privacy.");
            }
        } catch (error: any) {
            console.error("Failed to update privacy", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="paddingTopAndSide !pb-20 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-[1200px] mx-auto">

                {/* LEFT SIDE: MAP PHOTO */}
                <div className="lg:col-span-6 m-animate play m-slide-up">
                    <div className="relative rounded-[32px] lg:rounded-[40px] overflow-hidden border-4 border-white shadow-2xl aspect-[16/10] sm:aspect-[16/9] md:aspect-[4/3] lg:aspect-auto lg:h-[600px] max-h-[420px] sm:max-h-[480px] md:max-h-[520px] lg:max-h-none">

                        <Image alt='Map Image' src={InvitePageMapView} className='w-full h-full object-cover' />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                        {/* Status Badge */}
                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                            <Lock size={16} className="text-secondary-1" />
                            <span className="s2 font-bold text-secondary-1 uppercase tracking-wider">Private Trip</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: CONTENT */}
                <div className="lg:col-span-6 flex flex-col m-stagger play">
                    <div className="m-animate play m-slide-up">
                        <h1 className="h2 text-secondary-1 mb-4">Start planning your journey.</h1>
                        <p className="r1 text-neutral-1 mb-10">
                            Your trip is currently <strong>Private</strong>. Only you can see and manage this itinerary.
                            To unlock social features and cost-sharing, you can switch to Public mode.
                        </p>
                    </div>

                    <div className="space-y-4 m-animate play m-slide-up" style={{ '--i': 1 } as React.CSSProperties}>
                        {/* ACTIVE PRIMARY ACTION */}
                        <button
                            onClick={() => router.push(`/userTrip/${tripId}/planner`)}
                            className="btn btn-primary w-full h-[64px] !flex items-center transition-all justify-center gap-2 px-8 group"
                        >
                            <span className="b1">Go to Trip Planner</span>
                            <ArrowRight className='group-hover:translate-x-1 transition-transform' size={20} />
                        </button>

                        <div className="relative group">
                            {/* DISABLED ACTIONS (Trigger Modal) */}
                            <div className="space-y-4 opacity-60">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full h-[64px] rounded-2xl border-2 border-dashed border-neutral-3 flex items-center gap-4 px-8 text-neutral-2 cursor-pointer hover:bg-neutral-5 transition-colors"
                                >
                                    <Users size={20} />
                                    <span className="b2 font-semibold">Join Travel Groups</span>
                                    <Lock size={16} className="ml-auto" />
                                </button>

                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full h-[64px] rounded-2xl border-2 border-dashed border-neutral-3 flex items-center gap-4 px-8 text-neutral-2 cursor-pointer hover:bg-neutral-5 transition-colors"
                                >
                                    <Sparkles size={20} />
                                    <span className="b2 font-semibold">Find Travel Matches</span>
                                    <Lock size={16} className="ml-auto" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-primary-5 rounded-2xl border border-primary-3 m-animate play m-slide-up" style={{ '--i': 2 } as React.CSSProperties}>
                        <h4 className="s1 text-secondary-1 mb-2 italic">Why go public?</h4>
                        <p className="r2 text-secondary-1/80">
                            Public trips allow you to split costs, discover verified companions, and join groups made by others!
                        </p>
                    </div>
                </div>
            </div>

            {/* CONFIRMATION MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-secondary-1/60 backdrop-blur-sm"
                        onClick={() => !isUpdating && setIsModalOpen(false)}
                    />

                    {/* Modal Card */}
                    <div className="relative bg-white rounded-[32px] p-8 max-w-[500px] w-full shadow-2xl m-animate play m-slide-up">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-neutral-3 hover:text-secondary-1"
                        >
                            <X size={24} />
                        </button>

                        <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                            <AlertTriangle size={32} className="text-orange-600" />
                        </div>

                        <h3 className="h3 text-secondary-1 mb-4">Change Privacy Settings?</h3>
                        <p className="r2 text-neutral-1 mb-8">
                            To access Groups and Matching, your trip must be <strong>Public</strong>.
                            <br /><br />
                            <span className="text-red-500 font-bold underline">Warning:</span> This action is irreversible. Once a trip is made public, it cannot be made private again.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleSwitchToPublic}
                                disabled={isUpdating}
                                className="btn btn-primary w-full h-[56px]"
                            >
                                {isUpdating ? 'Updating...' : 'Yes, Make Trip Public'}
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={isUpdating}
                                className="w-full py-3 text-secondary-1 font-bold hover:underline"
                            >
                                Keep it Private
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}