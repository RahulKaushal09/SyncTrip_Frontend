"use client";

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ApiService } from '../../utils/api.utils';
import { User } from '../../types';
import { Location } from '../../types';
import '../../../styles/popups/FullProfilePopup.css';
import { LocationFields } from '@/constants';
import { DOBSelects } from './DOBSelects';
import { useLoader } from '../providers/LoaderContext';
import toast from 'react-hot-toast';
import AvatarUploader from './AvatarUploader';

interface FullProfilePopupProps {
    user: User;
    onClose: () => void;
    onProfileComplete: (user: User) => void;
}

export default function FullProfilePopup({ user, onClose, onProfileComplete }: FullProfilePopupProps) {
    const [form, setForm] = useState({
        travelStyles: [] as string[],
        travelerType: [] as string[],
        // dreamDestinations: '',
        matchGender: 'Any',
        ageGroup: '',
        showProfile: true,
        // allowInvites: true,
        wishlist: [] as string[],
        profilePicture: null as File | null,
        instagram: '',
        travelGoal: '',
        languages: '',
        dateOfBirth: '',
        sex: '',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { showLoader, hideLoader } = useLoader();
    const LocationFieldsToFetch = [
        LocationFields.ID,
        LocationFields.TITLE
    ];
    useEffect(() => {
        const getLocations = async () => {
            try {
                // For profile popup, we want locations without wishlist data (simpler)
                const response = await ApiService.fetchLocations(0, 1000, LocationFieldsToFetch);
                if (response && response.locations) {
                    setLocations(response.locations);
                } else {
                    setLocations([]);
                }
            } catch (err) {
                console.error("Failed to fetch locations", err);
                setLocations([]);
            }
        };
        getLocations();
    }, []);
    useEffect(() => {
        // Disable background scroll
        document.body.style.overflow = "hidden";

        return () => {
            // Re-enable scroll when popup closes
            document.body.style.overflow = "";
        };
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | undefined, field?: string, value?: string) => {
        if (e) {
            const { name, value: inputValue, type } = e.target;
            const target = e.target as HTMLInputElement;

            if (type === 'checkbox') {
                setForm((prev) => ({
                    ...prev,
                    [name]: target.checked
                        ? [...(prev[name as keyof typeof prev] as string[]), inputValue]
                        : (prev[name as keyof typeof prev] as string[]).filter((item) => item !== inputValue),
                }));
            } else if (type === 'file') {
                setForm((prev) => ({ ...prev, [name]: target.files?.[0] || null }));
            } else {
                setForm((prev) => ({ ...prev, [name]: inputValue }));
            }
        } else if (field && value) {
            // Handle button toggle for travelStyles and travelerType
            setForm((prev) => ({
                ...prev,
                [field]: (prev[field as keyof typeof prev] as string[]).includes(value)
                    ? (prev[field as keyof typeof prev] as string[]).filter((item) => item !== value)
                    : [...(prev[field as keyof typeof prev] as string[]), value],
            }));
        }
    };

    const handleDestinationSelect = (dest: Location) => {
        setSelectedLocationIds((prev) => {
            if (prev.includes(dest.id)) {
                return prev.filter((id) => id !== dest.id);
            } else {
                return [...prev, dest.id];
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setError('');
        e.preventDefault();

        if (!form.dateOfBirth) {
            setError('Date of birth is required');
            return;
        }
        else {
            // Minimum age validation (18+)
            const dob = new Date(form.dateOfBirth);
            const today = new Date();

            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }

            if (age < 18) {
                setError("You must be 18 or older to continue.");
                return; // STOP submit
            }

        }

        if (!form.profilePicture) {
            setError('Profile picture is required');
            toast.error('Profile picture is required');
            return;
        }

        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('userId', user.id);

        Object.keys(form).forEach((key) => {
            const value = form[key as keyof typeof form];
            if (key === 'profilePicture' && value) {
                formData.append(key, value as File);
            } else if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else if (value !== null) {
                formData.append(key, String(value));
            }
        });

        formData.append('preferredDestinations', JSON.stringify(selectedLocationIds));

        try {
            showLoader();
            const response = await ApiService.completeProfile(formData);

            if (response.success) {
                if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'conversion', {
                        'send_to': 'AW-17836239160/ziUVCP3Zw9kbELjS_bhC',
                        'value': 1.0,        // Optional – keep if you set a value in Google Ads; remove if not
                        'currency': 'INR'    // Optional – keep if using value; remove if not
                        // No event_callback needed since there's no redirect URL
                    });
                }
                onProfileComplete(response.user);
                onClose();
                hideLoader();
                toast.success('Profile completed successfully!');
            } else {
                setError(response.message || 'Profile completion failed');
                toast.error(response.message || 'Profile completion failed');
                hideLoader();
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || 'An error occurred. Please try again.');
                toast.error(error.message || 'An error occurred. Please try again.');
            } else {
                setError('An unknown error occurred. Please try again.');

            }
        } finally {
            setIsLoading(false);
            hideLoader();
        }
    };

    const filteredLocations = locations.filter((dest) =>
        dest.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedTitles = locations
        .filter((loc) => selectedLocationIds.includes(loc.id))
        .map((loc) => loc.title);

    return (
        <div className="full-profile-overlay">
            <div className="full-profile-container">
                <button className="full-profile-close-btn" onClick={onClose} disabled={isLoading}>
                    ×
                </button>
                <h2 className="full-profile-title">Complete Your Travel Profile</h2>
                <form onSubmit={handleSubmit} className="full-profile-form">
                    {/* Travel Style */}
                    <div className="full-profile-section">
                        <label>How do you like to travel?</label>
                        <div className="bubble-btn-container">
                            {[
                                'Backpacking',
                                'Beach vacations',
                                'Hill stations & adventure',
                                'City tours',
                                'Food & culture',
                                'Pilgrimage',
                                'Luxury getaways',
                            ].map((style) => (
                                <button
                                    key={style}
                                    type="button"
                                    className={`bubble-btn ${form.travelStyles.includes(style) ? 'selected' : ''}`}
                                    onClick={() => handleChange(undefined, 'travelStyles', style)}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Traveler Type */}
                    <div className="full-profile-section">
                        <label>What kind of traveler are you?</label>
                        <div className="bubble-btn-container">
                            {[
                                'Solo traveler',
                                'Family & friends',
                                'Planner',
                                'Spontaneous',
                                'Foodie',
                                'Nature lover',
                            ].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`bubble-btn ${form.travelerType.includes(type) ? 'selected' : ''}`}
                                    onClick={() => handleChange(undefined, 'travelerType', type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="full-profile-section dob-section">
                        {/* <label htmlFor="dateOfBirth">
                            Date of Birth <span className="required-star">*</span>
                        </label> */}

                        <DOBSelects
                            value={form.dateOfBirth || null}
                            onChange={(v) => setForm((p) => ({ ...p, dateOfBirth: v }))}
                            required
                            label="Date of birth"
                            showAge
                        />
                        {/* <DatePicker
                            id="dateOfBirth"
                            selected={form.dateOfBirth ? new Date(form.dateOfBirth) : null}
                            onChange={(date) =>
                                setForm((prev) => ({
                                    ...prev,
                                    dateOfBirth: date ? date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) : ''
                                }))
                            }
                            className="full-profile-input dob-input"
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Select your date of birth"
                            maxDate={new Date()}
                            showYearDropdown
                            yearDropdownItemNumber={100}
                            scrollableYearDropdown
                            required
                        /> */}
                    </div>
                    {user.sex === undefined && (
                        // Gender selection
                        <div className="full-profile-section gender-section">
                            <label htmlFor="dateOfBirth">
                                Gender <span className="required-star">*</span>
                            </label>
                            <select
                                name="sex"
                                className="full-profile-input"
                                onChange={handleChange}
                                value={form.sex}
                                disabled={isLoading}
                            >
                                <option value="" disabled>Please select your gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    )}
                    {/* Preferred Destinations */}
                    <div className="full-profile-section">
                        <label>Favorite travel destinations?</label>
                        {selectedTitles.length > 0 &&
                            <div className="full-profile-selected-destinations">
                                {selectedTitles.map((title) => (
                                    <span key={title} className="full-profile-selected-tag">
                                        {title.replace(/[0-9.]/g, "")}
                                        <button
                                            type="button"
                                            className="full-profile-remove-tag"
                                            onClick={() => {
                                                const destId = locations.find((loc) => loc.title === title)?.id;
                                                if (destId) {
                                                    setSelectedLocationIds((prev) => prev.filter((id) => id !== destId));
                                                }
                                            }}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        }
                        <div className="full-profile-dropdown-container">
                            <input
                                type="text"
                                className="full-profile-input full-profile-search"
                                placeholder="Search destinations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsDropdownOpen(true)}
                                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                            />
                            {isDropdownOpen && (
                                <div className="full-profile-dropdown">
                                    {filteredLocations.filter(dest => !selectedLocationIds.includes(dest.id)).length > 0 ? (
                                        filteredLocations.map((dest) =>
                                            !selectedLocationIds.includes(dest.id) && (
                                                <div
                                                    key={dest.id}
                                                    className="full-profile-dropdown-item"
                                                    onMouseDown={() => {
                                                        handleDestinationSelect(dest)
                                                        setSearchTerm("");
                                                    }
                                                    }
                                                >
                                                    {dest.title?.replace(/[0-9.]/g, "") || dest.title}
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div className="full-profile-dropdown-item disabled">No matches found</div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Dream Destinations */}
                    {/* <div className="full-profile-section">
                        <label>Your dream travel spots?</label>
                        <input
                            type="text"
                            name="dreamDestinations"
                            className="full-profile-input"
                            onChange={handleChange}
                            placeholder="e.g., Leh-Ladakh, Maldives"
                            value={form.dreamDestinations}
                        />
                    </div> */}

                    {/* Match Gender */}
                    <div className="full-profile-section">
                        <label>Who would you like to travel with?</label>
                        <select
                            name="matchGender"
                            className="full-profile-input"
                            onChange={handleChange}
                            value={form.matchGender}
                        >
                            <option value="Anyone">Anyone</option>
                            <option value="Friends">Friends</option>
                            <option value="Family">Family</option>
                            <option value="Partner">Partner</option>
                        </select>
                    </div>

                    {/* Age Group */}
                    <div className="full-profile-section">
                        <label>Preferred age group for travel buddies?</label>
                        <select
                            name="ageGroup"
                            className="full-profile-input"
                            onChange={handleChange}
                            value={form.ageGroup}
                        >
                            <option value="">Any age group</option>
                            <option value="18-25">18-25</option>
                            <option value="25-35">25-35</option>
                            <option value="35-45">35-45</option>
                            <option value="45+">45+</option>
                        </select>
                    </div>

                    {/* Visibility & Invites */}
                    {/* <div className="full-profile-section">
                        <label>Profile settings:</label>
                        <label className="full-profile-checkbox">
                            <input
                                type="checkbox"
                                name="showProfile"
                                checked={form.showProfile}
                                onChange={(e) => setForm((prev) => ({ ...prev, showProfile: e.target.checked }))}
                            />
                            Show my profile to others
                        </label>
                        <label className="full-profile-checkbox">
                            <input
                                type="checkbox"
                                name="allowInvites"
                                checked={form.allowInvites}
                                onChange={(e) => setForm((prev) => ({ ...prev, allowInvites: e.target.checked }))}
                            />
                            Allow trip invites
                        </label>
                    </div> */}

                    {/* Profile Picture */}

                    <div className="full-profile-section">
                        <label>
                            Upload a profile picture *{' '}
                            {/* <span className="full-profile-optional">
        
      {user.profile_picture && user.profile_picture.length > 0 ? '(Optional)' : '(Required)'}
    </span> */}
                        </label>

                        <AvatarUploader
                            value={form.profilePicture}
                            existingImageUrl={null}
                            onChange={(file) => setForm((prev) => ({ ...prev, profilePicture: file }))}
                            required={!user.profile_picture || user.profile_picture.length === 0}
                            size={110} // adjust if you want bigger/smaller avatar
                        />
                    </div>


                    {/* <div className="full-profile-section">
                        <label>
                            Upload a profile picture{' '}
                            <span className="full-profile-optional">
                                {user.profile_picture && user.profile_picture.length > 0 ? '(Optional)' : '(Required)'}
                            </span>
                        </label>
                        <input
                            type="file"
                            name="profilePicture"
                            className="full-profile-input"
                            onChange={handleChange}
                            accept="image/*"
                            required={!user.profile_picture || user.profile_picture.length === 0}
                        />
                    </div> */}

                    {/* Optional Extras */}
                    <div className="full-profile-section">
                        <label>Instagram handle (optional):</label>
                        <input
                            type="text"
                            name="instagram"
                            className="full-profile-input"
                            onChange={handleChange}
                            placeholder="@yourhandle"
                            value={form.instagram}
                        />
                        <label>Your travel goal:</label>
                        <select
                            name="travelGoal"
                            className="full-profile-input"
                            onChange={handleChange}
                            value={form.travelGoal}
                        >
                            <option value="">Select a goal</option>
                            <option value="Explore India">Explore India</option>
                            <option value="Make friends">Make friends</option>
                            <option value="Relax">Relax</option>
                            <option value="Spiritual journey">Spiritual journey</option>
                        </select>
                        <label>Languages you speak:</label>
                        <input
                            type="text"
                            name="languages"
                            className="full-profile-input"
                            onChange={handleChange}
                            placeholder="e.g., Hindi, English, Tamil"
                            value={form.languages}
                        />
                    </div>

                    {error && <div className="full-profile-error" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

                    <button type="submit" className="btn btn-black" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}
