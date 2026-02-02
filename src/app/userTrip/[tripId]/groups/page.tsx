'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Users, Plus, Calendar, Flame, Clock, Sparkles, User, Globe, ChevronRight } from 'lucide-react';
import { GroupApiServices } from '@/utils/group/group.api';
import { GroupCard as GroupCardType } from '@/utils/group/group.types';
import TripServices from '@/utils/trip.utils';
import { userTripFields } from '@/constants';
import { useLogin } from '@/components/providers/LoginProvider';
import Image from 'next/image';

export default function GroupsPage() {
    const { tripId } = useParams() as { tripId: string };
    const router = useRouter();
    const { user } = useLogin();
    const [groups, setGroups] = useState<GroupCardType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const tripFields = [userTripFields.ID, userTripFields.LOCATION_ID, userTripFields.START_DATE];
                const tripDetails = await TripServices.fetchTripDetails(tripId, tripFields);
                const month = new Date(tripDetails.startDate).toISOString().slice(0, 7);
                const res = await GroupApiServices.getGroupsByLocationAndMonth(tripDetails.locationId, month);
                setGroups(res);
            } catch {
                setGroups([]);
            } finally {
                setLoading(false);
            }
        };
        loadGroups();
    }, [tripId]);

    const getGroupStatus = (count: number, max: number) => {
        const ratio = count / max;
        if (ratio >= 0.8) return { label: 'Almost Full', icon: <Flame size={14} /> };
        if (ratio >= 0.5) return { label: 'Filling Fast', icon: <Sparkles size={14} /> };
        if (count <= 2) return { label: 'Newly Added', icon: <Clock size={14} /> };
        return { label: 'Joining Open', icon: <Globe size={14} /> };
    };

    const getGenderLabel = (pref: string) => {
        switch (pref?.toLowerCase()) {
            case 'male': return { label: 'Male Only', icon: <User size={14} /> };
            case 'female': return { label: 'Female Only', icon: <User size={14} /> };
            default: return { label: 'Mixed Gender', icon: <Users size={14} /> };
        }
    };

    return (
        <div className="paddingTopAndSide bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 m-animate play m-slide-up">
                <div>
                    <h1 className="h3 text-secondary-1 mb-0 !font-bold" style={{ fontSize: '25px' }}>Groups for your trip</h1>
                    <p className="r3 italic text-neutral-1">Choose a group that matches your vibe!</p>
                </div>
                <button
                    onClick={() => router.push(`/userTrip/${tripId}/groups/create`)}
                    className="btn btn-secondary flexbtn !h-9 !px-5 !rounded-full shadow-sm"
                >
                    <Plus size={18} />
                    <span className="b2">Create Group</span>
                </button>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 m-stagger play">
                {!loading && groups.map(group => {
                    const status = getGroupStatus(group.membersCount, group.maxMembers);
                    const gender = getGenderLabel(group.genderPreference);
                    const isOwner = group.createdBy === user?.id;

                    return (
                        <div
                            key={group.id}
                            className={`group flex flex-col bg-white rounded-[28px] overflow-hidden border transition-all hov-lift cursor-pointer ${isOwner ? 'border-primary-1 shadow-md' : 'border-neutral-5 shadow-sm'}`}
                            onClick={() => router.push(`/userTrip/${tripId}/groups/${group.id}`)}
                        >
                            {/* Image Section */}
                            <div className="relative overflow-hidden aspect-[16/10] w-full">
                                {group.groupImageUrl ? (
                                    <Image
                                        src={group.groupImageUrl}
                                        alt={group.groupName}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-secondary-5 flex items-center justify-center">
                                        <Users className="text-secondary-2" size={40} />
                                    </div>
                                )}

                                {/* Status Tag (e.g. Filling Fast) with background */}
                                <div className={`absolute bg-white top-4 left-4 px-3 py-1.5 rounded-full text-primary-1 !font-semibold s2 flex items-center gap-1.5 shadow-sm`}>
                                    {status.icon}
                                    {status.label}
                                </div>

                                {isOwner && (
                                    <div className="absolute top-4 right-4 bg-secondary-1 border text-white px-3 py-1.5 rounded-full s2 font-bold shadow-sm">
                                        Created by You
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-3 flex flex-col flex-1">
                                <h3 className="b1 text-secondary-1 truncate !font-bold mb-3" style={{ fontSize: '18px' }}>
                                    {group.groupName}
                                </h3>

                                {/* Metadata Row */}
                                <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4">
                                    <div className="flex items-center gap-1.5 text-neutral-1 s1">
                                        <div className="text-secondary-1">{gender.icon}</div>
                                        <span>{gender.label}</span>
                                    </div>
                                    {/* <div className="flex items-center gap-1.5 text-neutral-1 s1">
                                        <Calendar size={14} className="text-neutral-2" />
                                        <span>Feb 2026</span>
                                    </div> */}
                                    <div className="flex items-center gap-1.5 text-secondary-1 s1 font-bold">
                                        <Users size={14} className="text-neutral-1" />
                                        <span>{group.membersCount} / {group.maxMembers}</span>
                                    </div>
                                </div>

                                {/* Activity Tags - Compact chipsBox */}
                                <div className="chipsBox mb-3">
                                    {group.tags?.map(tag => (
                                        <span key={tag} className="chip !text-[11px] !py-1 !px-2">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Bottom Button Row */}
                                <div className="pt-2 border-t border-neutral-5 flex items-center justify-between">
                                    <span className="s2 text-neutral-2 uppercase tracking-wider font-bold">View Details</span>
                                    <div className="w-8 h-8 rounded-full bg-secondary-5 flex items-center justify-center text-secondary-1 group-hover:bg-secondary-1 transition-colors">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {!loading && groups.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center m-animate play m-fade-in">
                    <div className="bg-primary-5 p-8 rounded-full mb-6">
                        <Users size={48} className="text-primary-1" />
                    </div>
                    <h2 className="h3 text-secondary-1 font-bold">No groups found</h2>
                    <p className="r2 text-neutral-1 max-w-sm mb-8">Nobody has started a group for this trip yet. Be the first to lead the way!</p>
                    <button
                        onClick={() => router.push(`/userTrip/${tripId}/groups/create`)}
                        className="btn btn-primary flexbtn !rounded-full !px-8 h-12 shadow-lg"
                    >
                        <Plus size={20} />
                        <span className="b1">Create First Group</span>
                    </button>
                </div>
            )}
        </div>
    );
}