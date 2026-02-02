'use client';

import { use, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { CreateGroupPayload } from '@/utils/group/group.types';
import { GroupApiServices } from '@/utils/group/group.api';
import TripServices from '@/utils/trip.utils';
import { TagOptionGroupTrip, userTripFields } from '@/constants';
import { useLogin } from '@/components/providers/LoginProvider';
import { set } from 'lodash';
import { useLoader } from '@/components/providers/LoaderContext';


export default function CreateGroupPage() {
    const { tripId } = useParams() as { tripId: string };
    const router = useRouter();
    const { user } = useLogin();

    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [maxMembers, setMaxMembers] = useState(6);
    const [genderPreference, setGenderPreference] =
        useState<'mixed' | 'male' | 'female'>('mixed');
    const [typeOfGenderPreferenceJson, setTypeOfGenderPreferenceJson] = useState([
        { value: 'mixed', label: 'Mixed' },
        { value: 'female', label: 'Women only' },
        { value: 'male', label: 'Men only' },
    ]);
    const {showLoader,hideLoader} = useLoader();
    const [tags, setTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleTag = (tag: string) => {
        if (tags.includes(tag)) {
            setTags(tags.filter(t => t !== tag));
        } else if (tags.length < 3) {
            setTags([...tags, tag]);
        }
    };

    const canSubmit = groupName.trim().length >= 3 && maxMembers >= 5;

    const handleCreate = async () => {
        if (!canSubmit || loading) return;

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
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || 'Failed to create group'
            );
        } finally {
            setLoading(false);
            hideLoader();
        }
    };
    useEffect(() => {
        const LoadSuggestions = async () => {
            try {
                const tripFields = [userTripFields.ID, userTripFields.LOCATION_ID, userTripFields.LOCATION_NAME, userTripFields.START_DATE,userTripFields.BUDGET];
                const tripDetails = await TripServices.fetchTripDetails(tripId, tripFields);
                const monthString = new Date(tripDetails.startDate).toLocaleString('default', { month: 'long' });

                const locationName = tripDetails.locationName || 'the destination';
                setGroupName(`${tripDetails.budget ? `$${tripDetails.budget} trip` : 'Trip'} to ${locationName} – ${monthString}`);
                setDescription(`Group for travelers going to ${locationName} in ${monthString}. Join to connect, plan, and share the experience!`);
                user?.travelStyles?.forEach(style => {
                    if (TagOptionGroupTrip.includes(style) && tags.length < 3) {
                        setTags(prevTags => [...prevTags, style]);
                    }
                });
                if (user?.sex === 'Female') {
                    setTypeOfGenderPreferenceJson(prev => prev.filter(t => t.value !== 'male'));
                }
                else if (user?.sex === 'Male') {
                    setTypeOfGenderPreferenceJson(prev => prev.filter(t => t.value !== 'female'));
                }
            } catch (error) {

            }
        };
        LoadSuggestions();
    }, []);
    if (!user) {
        return <div className="container-custom max-w-xl mx-auto">
            Please login to create a group.
        </div>;
    }

    return (
        <div className="container-custom max-w-xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-secondary-1">
                    Create a Group
                </h1>
                <p className="text-neutral-2 mt-1">
                    Set up a group for travelers going on this trip.
                </p>
            </div>

            {/* Group Name */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                    Group name
                </label>
                <input
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    placeholder="e.g. Manali trip – mid May"
                    className="w-full border rounded-md px-3 py-2"
                />
            </div>

            {/* Description */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                    Short description (optional)
                </label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Who this group is for, pace, expectations…"
                    className="w-full border rounded-md px-3 py-2"
                    rows={3}
                />
            </div>

            {/* Max Members */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                    Maximum members
                </label>
                <select
                    value={maxMembers}
                    onChange={e => setMaxMembers(Number(e.target.value))}
                    className="w-full border rounded-md px-3 py-2"
                >
                    {[5, 6, 7, 8, 9].map(n => (
                        <option key={n} value={n}>
                            {n} people
                        </option>
                    ))}
                </select>
                <p className="text-xs text-neutral-2 mt-1">
                    Smaller groups work better for coordination.
                </p>
            </div>

            {/* Gender Preference */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                    Group preference
                </label>
                <div className="flex gap-2">
                    {typeOfGenderPreferenceJson.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() =>
                                setGenderPreference(opt.value as any)
                            }
                            className={`px-4 py-2 rounded border ${genderPreference === opt.value
                                ? 'bg-primary-4 border-primary-1'
                                : ''
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
                <label className="block text-sm font-medium mb-2">
                    Tags (up to 3)
                </label>
                <div className="flex flex-wrap gap-2">
                    {TagOptionGroupTrip.map(tag => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1 rounded-full text-sm border ${tags.includes(tag)
                                ? 'bg-primary-5 text-primary-1 border-primary-1'
                                : ''
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={handleCreate}
                disabled={!canSubmit || loading}
                className={`w-full btn ${canSubmit ? 'btn-primary' : 'opacity-50'
                    }`}
            >
                {loading ? 'Creating…' : 'Create Group'}
            </button>
        </div>
    );
}
