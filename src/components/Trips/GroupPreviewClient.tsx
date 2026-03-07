'use client';

import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { Users, ArrowLeft, ShieldCheck, MapPin, Calendar, Smartphone, Globe, X, MessageCircle, Info } from 'lucide-react';
import GumletImage from '@/components/common/GumletImage';
import Link from 'next/link';
import { GroupApiServices } from '@/utils/group/group.api';
import { GroupCard } from '@/utils/group/group.types';
import { useLogin } from '@/components/providers/LoginProvider';
import { triggerLogin } from '@/utils';
import Image from 'next/image';
import PlayStoreWhite from '@/assets/icons/PlayStoreWhite.png'

export default function GroupPreviewPage({ group }: { group: GroupCard }) {
    const router = useRouter();
    const { isLoggedIn, user } = useLogin();
    const [isAdmin, setIsAdmin] = useState(group.createdBy === user?.id);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        setIsAdmin(group.createdBy === user?.id);
    }, [user, group]);

    // Helper to format "2026-03" into "March 2026"
    const formatMonth = (monthStr: string) => {
        if (!monthStr) return '';
        const [year, month] = monthStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };
    const isFull = group.membersCount >= group.maxMembers;

    const remainingCount = Math.max(0, group.maxMembers - group.membersCount);
    console.log(remainingCount);
    if (!group) {
        return <div className="paddingTopAndSide text-center py-20 r1">Group preview not found</div>;
    }


    return (
        <div style={{ width: "56rem" }} className="paddingTopAndSide mx-auto !pb-32 relative">
            {/* Navigation */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-neutral-2 hover:text-secondary-1 mb-6 transition-colors b3 uppercase tracking-wider"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            {/* Hero Header Section */}
            <div className="m-animate play m-slide-up relative aspect-[16/9] w-full rounded-[32px] overflow-hidden mb-8 shadow-md border border-neutral-5">
                {group.groupImageUrl ? (
                    <GumletImage
                        containerClassName='h-full'
                        src={group.groupImageUrl}
                        alt={group.groupName}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-primary-5 flex items-center justify-center">
                        <Users size={60} className="text-primary-2" />
                    </div>
                )}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full s1 font-bold text-secondary-1 flex items-center gap-2 shadow-sm">
                    <ShieldCheck size={16} className="text-success-1" />
                    Verified Plan
                </div>
            </div>

            {/* Group Title & Details */}
            <div className="m-animate play m-slide-up mb-8">
                <h1 className="h2 text-secondary-1 mb-3 font-bold">{group.groupName}</h1>

                <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex border border-neutral-5 py-1.5 px-3 rounded-full items-center gap-2 text-secondary-1 s1 font-bold bg-white">
                        <Users size={16} className="text-primary-1" />
                        {group.membersCount} / {group.maxMembers} Members
                    </div>

                    {/* Added Location Name */}
                    {group.locationName && (
                        <div className="flex border border-neutral-5 py-1.5 px-3 rounded-full items-center gap-2 text-secondary-1 s1 font-bold bg-white capitalize">
                            <MapPin size={16} className="text-primary-1" />
                            {group.locationName}
                        </div>
                    )}

                    <div className="flex border border-neutral-5 py-1.5 px-3 rounded-full items-center gap-2 text-secondary-1 s1 font-bold bg-white capitalize">
                        <Info size={16} className="text-primary-1" />
                        {group.genderPreference} Group
                    </div>

                    <div className="flex border border-neutral-5 py-1.5 px-3 rounded-full items-center gap-2 text-secondary-1 s1 font-bold bg-white">
                        <Calendar size={16} className="text-primary-1" />
                        {/* Uncommented formatMonth */}
                        {formatMonth(group?.month as string)}
                    </div>
                </div>

                {/* Tags */}
                <div className="chipsBox flex flex-wrap gap-2 mb-6">
                    {group.tags?.map(tag => (
                        <span key={tag} className="chip !py-1.5 !px-4 s2 font-bold bg-neutral-6 text-neutral-2 rounded-full border border-neutral-5">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Group Description */}
            {group.description && (
                <div className="m-animate play m-slide-up mb-10 bg-secondary-5 p-6 rounded-[24px] border border-secondary-4">
                    <p className="r2 text-secondary-1 leading-relaxed opacity-90">{group.description}</p>
                </div>
            )}

            {/* Visual Slots Indicator (replaces detailed roster for preview) */}
            <div className="m-animate play m-slide-up mb-8 bg-white p-6 rounded-[24px] border border-neutral-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="b1 text-secondary-1 mb-0 uppercase tracking-widest text-[12px] font-black">Group Members</h3>
                    <span className="s2 text-primary-1 font-bold uppercase">{remainingCount > 0 ? `${remainingCount} slots remaining` : 'Group Full'}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                    {/* Render joined members as anonymous avatars */}
                    {[...Array(group.membersCount)].map((_, i) => (
                        <div key={`joined-${i}`} className="h-12 w-12 rounded-full bg-primary-5 border-2 border-primary-2 flex items-center justify-center text-primary-1 shadow-sm relative group cursor-help">
                            <Users size={20} />
                            <div className="absolute -top-8 bg-neutral-1 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                Joined Traveler
                            </div>
                        </div>
                    ))}
                    {/* Render empty slots */}
                    {[...Array(remainingCount)].map((_, i) => (
                        <div key={`empty-${i}`} className="h-12 w-12 rounded-full bg-neutral-6 border-2 border-dashed border-neutral-4 flex items-center justify-center text-neutral-3 relative group cursor-help">
                            <span className="text-lg font-light">+</span>
                            <div className="absolute -top-8 bg-neutral-1 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                Available Slot
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="m-animate play m-slide-up mb-16 bg-white p-6 rounded-[24px] border border-neutral-5 shadow-sm">
                <h3 className="b1 text-secondary-1 mb-4 uppercase tracking-widest text-[12px] font-black">
                    How to Join This Group
                </h3>

                <div className="space-y-4">

                    {/* Android App */}
                    <div className="p-4 bg-primary-5 rounded-xl border border-primary-4 flex items-start gap-4 relative">

                        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-primary-4 flex-shrink-0 mt-0.5">
                            <Image
                                src={PlayStoreWhite}
                                alt="SyncTrip App"
                                width={20}
                                height={20}
                            />
                        </div>

                        <div className="text-left">
                            <h4 className="b2 text-secondary-1 font-bold mb-1.5">
                                Join via the SyncTrip App
                            </h4>

                            <p className="s1 text-neutral-1 leading-relaxed">
                                Open the SyncTrip app and join the group directly. <strong>No hustle required.</strong>
                            </p>
                        </div>
                    </div>


                    {/* Website */}
                    <div className="p-4 bg-secondary-5 rounded-xl border border-secondary-4 flex items-start gap-4">

                        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-secondary-4 flex-shrink-0 mt-0.5">
                            <Globe size={20} className="text-secondary-1" />
                        </div>

                        <div className="text-left">
                            <h4 className="b2 text-secondary-1 font-bold mb-1.5">
                                Join via the Website
                            </h4>

                            <p className="s1 text-neutral-1 leading-relaxed">
                                First create your trip on SyncTrip. <br/> During the travel mode selection step, open the <span className="font-semibold">Groups</span> section, find this group, and join the discussion.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-neutral-5 z-40">
                <div className="max-w-2xl mx-auto">
                    {isAdmin ? (
                        <button onClick={() => router.push('/chats')} className="btn btn-secondary opacity-100 w-full !h-14 !rounded-full shadow-lg flexbtn">
                            <MessageCircle />
                            <span className="b1 font-bold tracking-tight">Open Chats</span>
                        </button>
                    ) : isFull ? (
                        <button disabled className="btn btn-secondary opacity-60 w-full !h-14 !rounded-full shadow-lg flexbtn">
                            <span className="b1 font-bold tracking-tight">Group is Full</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowPopup(true)}
                            className="btn btn-primary w-full !h-14 !rounded-full shadow-lg flexbtn transition-transform active:scale-95 bg-primary-1 text-white hover:bg-primary-2"
                        >
                            <span className="b1 font-bold tracking-tight">Join Group</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Action Popup Modal */}
            {showPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
                        {/* Close button */}
                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute top-4 right-4 text-neutral-3 hover:text-secondary-1 bg-neutral-6 hover:bg-neutral-5 p-2 rounded-full transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        {/* Content */}
                        <div className="p-8 text-center pt-10">
                            <div className="w-16 h-16 bg-primary-5 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                                <MapPin size={32} className="text-primary-1 -rotate-3" />
                            </div>

                            <h3 className="h3 text-secondary-1 font-bold mb-3">Ready to join?</h3>
                            <p className="r2 text-neutral-2 mb-8 leading-relaxed">
                                To secure your spot in <strong className="text-secondary-1">{group.groupName}</strong>, you need to set up your trip profile first. Choose how you want to proceed:
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setShowPopup(false);
                                        window.open('https://play.google.com/store/apps/details?id=com.synctrip', '_blank'); // changed to window.open for external links
                                    }}
                                    className="w-full flex items-center justify-center gap-3 py-3 px-3 bg-secondary-1 text-white rounded-xl font-bold hover:bg-secondary-2 transition-colors group"
                                >
                                    <Smartphone size={20} className="text-primary-4 group-hover:scale-110 transition-transform" />
                                    Download the App
                                </button>

                                <button
                                    onClick={() => {
                                        setShowPopup(false);
                                        triggerLogin(() => router.push('/create/trip'));
                                    }}
                                    className="w-full flex items-center justify-center gap-3 py-3 px-3 bg-white border-2 border-neutral-5 text-secondary-1 rounded-xl font-bold hover:border-primary-1 hover:text-primary-1 transition-colors"
                                >
                                    <Globe size={20} />
                                    Create Trip on Website
                                </button>
                            </div>

                            {!isLoggedIn && <p className="s3 text-neutral-3 mt-6">
                                Already have a trip? <Link href="/login" className="text-primary-1 font-bold hover:underline">Log in</Link>
                            </p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}