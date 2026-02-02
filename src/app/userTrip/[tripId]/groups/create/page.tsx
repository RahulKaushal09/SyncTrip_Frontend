'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Users, Tag, Users2, ArrowLeft, Sparkles, AlignLeft, UserCircle2, Info } from 'lucide-react';
import { CreateGroupPayload } from '@/utils/group/group.types';
import { GroupApiServices } from '@/utils/group/group.api';
import TripServices from '@/utils/trip.utils';
import { TagOptionGroupTrip, userTripFields } from '@/constants';
import { useLogin } from '@/components/providers/LoginProvider';
import { useLoader } from '@/components/providers/LoaderContext';

export default function CreateGroupPage() {
    const { tripId } = useParams() as { tripId: string };
    const router = useRouter();
    const { user } = useLogin();
    const { showLoader, hideLoader } = useLoader();

    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [maxMembers, setMaxMembers] = useState(6);
    const [genderPreference, setGenderPreference] = useState<'mixed' | 'male' | 'female'>('mixed');
    const [typeOfGenderPreferenceJson, setTypeOfGenderPreferenceJson] = useState([
        { value: 'mixed', label: 'Mixed' },
        { value: 'female', label: 'Women only' },
        { value: 'male', label: 'Men only' },
    ]);
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleTag = (tag: string) => {
        if (tags.includes(tag)) {
            setTags(tags.filter(t => t !== tag));
        } else {
            if (tags.length >= 3) {
                toast.error('You can only select up to 3 tags');
                return;
            }
            setTags([...tags, tag]);
        }
    };

    const canSubmit = groupName.trim().length >= 3 && maxMembers >= 5 && tags.length >= 1;

    const handleCreate = async () => {
        if (!canSubmit || loading) return;
        if (tags.length < 1) {
            toast.error('You must select at least one tag');
            return;
        }
        setLoading(true);
        showLoader();
        try {
            const payload: CreateGroupPayload = {
                tripId,
                groupName: groupName.trim(),
                maxMembers,
                genderPreference,
                tags,
                description: description.trim() || undefined,
            };
            await GroupApiServices.createGroupTrip(payload);
            toast.success('Group created successfully');
            router.replace(`/userTrip/${tripId}/groups`);
        } catch (err: unknown) {
            toast.error('Failed to create group. Please try again.');
        } finally {
            setLoading(false);
            hideLoader();
        }
    };

    useEffect(() => {
        const LoadSuggestions = async () => {
            try {
                const tripFields = [userTripFields.ID, userTripFields.LOCATION_ID, userTripFields.LOCATION_NAME, userTripFields.START_DATE, userTripFields.BUDGET];
                const tripDetails = await TripServices.fetchTripDetails(tripId, tripFields);
                const monthString = new Date(tripDetails.startDate).toLocaleString('default', { month: 'long' });
                const locationName = tripDetails.locationName || 'the destination';

                setGroupName(`${tripDetails.budget ? `$${tripDetails.budget} trip` : 'Trip'} to ${locationName} – ${monthString}`);
                setDescription(`Looking for awesome people to join me in ${locationName} this ${monthString}!`);

                if (user?.travelStyles) {
                    const userStyles = user.travelStyles.filter(style => TagOptionGroupTrip.includes(style)).slice(0, 3);
                    setTags(userStyles);
                }

                if (user?.sex === 'Female') {
                    setTypeOfGenderPreferenceJson(prev => prev.filter(t => t.value !== 'male'));
                } else if (user?.sex === 'Male') {
                    setTypeOfGenderPreferenceJson(prev => prev.filter(t => t.value !== 'female'));
                }
            } catch (error) { }
        };
        LoadSuggestions();
    }, [tripId, user]);

    if (!user) return <div className="paddingTopAndSide r2 text-center mt-20">Please login to create a group.</div>;

    return (
        <div style={{
            width: '56rem'
        }} className="paddingTopAndSide !pb-24 mx-auto">
            {/* Custom Range Slider Styles */}
            <style jsx>{`
                input[type='range']::-webkit-slider-runnable-track {
                    height: 8px;
                    background: #E8E8EC; /* var(--neutral-5) */
                    border-radius: 10px;
                }
                input[type='range']::-webkit-slider-thumb {
                    margin-top: -6px; /* Centers thumb on track */
                }
            `}</style>

            {/* Header */}
            <div className="mb-8 m-animate play m-slide-up">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-neutral-2 hover:text-secondary-1 transition-colors b3 uppercase mb-4"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
                <h1 className="h3 text-secondary-1 mb-1 font-bold">Create Group</h1>
                <p className="r2 text-neutral-1">Build the perfect circle for your journey.</p>
                <p className="r2 text-neutral-2">P.S.: We helped you fill some details based on your trip!</p>
            </div>

            <div className="m-stagger play flex flex-col gap-5">

                {/* 1. Identity Card */}
                <div className="bg-white rounded-[28px] border border-neutral-5 p-6 shadow-sm m-animate play m-slide-up">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary-5 p-2 rounded-xl text-primary-1">
                            <AlignLeft size={18} />
                        </div>
                        <h2 className="b1 text-secondary-1 mb-0">Identity</h2>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="s1 text-neutral-1 font-bold uppercase tracking-wide block mb-2">Group Name <span className="required-star">*</span></label>
                            <input
                                value={groupName}
                                onChange={e => setGroupName(e.target.value)}
                                className="w-full border border-neutral-4 rounded-xl px-4 py-3 focus:border-primary-1 outline-none r2 bg-white"
                            />
                        </div>
                        <div>
                            <label className="s1 text-neutral-1 font-bold uppercase tracking-wide block mb-2">Description <span className="required-star">*</span></label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full border border-neutral-4 rounded-xl px-4 py-3 focus:border-primary-1 outline-none r2 resize-none"
                                rows={2}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Group Dynamics Card */}
                <div className="bg-white rounded-[28px] border border-neutral-5 p-6 shadow-sm m-animate play m-slide-up" style={{ '--i': 1 } as React.CSSProperties}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-secondary-5 p-2 rounded-xl text-secondary-1">
                            <Users2 size={18} />
                        </div>
                        <h2 className="b1 text-secondary-1 mb-0">Dynamics</h2>
                    </div>

                    <div className="space-y-8">
                        {/* Size Slider */}
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <label className="s1 text-neutral-1 font-bold uppercase tracking-wide">Capacity</label>
                                <span className="b2 text-primary-1 font-bold">{maxMembers} travelers</span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="10"
                                step="1"
                                value={maxMembers}
                                onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                                className="w-full h-2 bg-neutral-5 rounded-lg appearance-none cursor-pointer accent-primary-1"
                            />
                            <div className="flex justify-between mt-2 s2 text-neutral-3 px-1">
                                <span>5</span>
                                <span>10</span>
                            </div>
                        </div>

                        {/* Gender Preference Chips */}
                        <div>
                            <label className="s1 text-neutral-1 font-bold uppercase tracking-wide block mb-3">Gender Preference</label>
                            <div className="flex flex-wrap gap-2">
                                {typeOfGenderPreferenceJson.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setGenderPreference(opt.value as React.SetStateAction<"male" | "female" | "mixed">)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all s1 font-bold ${genderPreference === opt.value
                                            ? 'bg-secondary-1 border-secondary-1 text-white shadow-md'
                                            : 'bg-white border-neutral-4 text-neutral-1 hover:border-secondary-1 hover:text-secondary-1'
                                            }`}
                                    >
                                        <UserCircle2 size={14} />
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            <p className="r2 mt-3 text-neutral-1">{genderPreference && genderPreference === 'mixed' ? 'Everyone can join your travel group!' : genderPreference === 'male' ? 'Only male travelers can join your group!' : 'Only female travelers can join your group!'}</p>
                        </div>
                    </div>
                </div>

                {/* 3. Vibe Tags Card */}
                <div className="bg-white rounded-[28px] border border-neutral-5 p-6 shadow-sm m-animate play m-slide-up" style={{ '--i': 2 } as React.CSSProperties}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary-5 p-2 rounded-xl text-primary-1">
                            <Tag size={18} />
                        </div>
                        <h2 className="b1 text-secondary-1 mb-0">Atmosphere <span className="required-star">*</span></h2>
                    </div>
                    <p className="s2 text-neutral-1 mb-4 flex items-center gap-1.5">
                        <Info size={14} /> Select up to 3 tags that describe your trip vibe.
                    </p>

                    <div className="chipsBox">
                        {TagOptionGroupTrip.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`chip hov-lift !text-[12px] !py-2 !px-4 ${tags.includes(tag) ? 'selected' : ''
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Section */}
                <div className="mt-4 m-animate play m-slide-up" style={{ '--i': 3 } as React.CSSProperties}>
                    <button
                        onClick={handleCreate}
                        disabled={!canSubmit || loading}
                        className={`btn w-full h-[56px] !rounded-full shadow-lg flexbtn transition-all ${canSubmit ? 'btn-primary' : 'btn-primary !opacity-40 cursor-not-allowed'
                            }`}
                    >
                        <span className="b1 font-bold">{loading ? 'Creating...' : 'Launch Group Trip'}</span>
                        {!loading && <Sparkles size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}