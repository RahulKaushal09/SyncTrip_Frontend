"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ApiService } from '../../utils/api.utils';
import { User, Location } from '../../types';
import '../../../styles/popups/FullProfilePopup.css';
import { CommonLanguages, LocationFields } from '@/constants';
import { DOBSelects } from './DOBSelects';
import { useLoader } from '../providers/LoaderContext';
import toast from 'react-hot-toast';
import AvatarUploader from './AvatarUploader';
import { LocationServices } from '@/utils/location.utils';
import { styles } from '../Trips/ItinearySection';
import { MultiSelect } from '../Profile/EditProfileModal';
import { UserApiService } from '@/utils/user.api.utils';
import Image from 'next/image';
import { useLogin } from '../providers/LoginProvider';

interface FullProfilePopupProps {
    user: User;
    onClose: () => void;
    onProfileComplete: (user: User) => void;
}

export default function FullProfilePopup({ user, onClose, onProfileComplete }: FullProfilePopupProps) {
    const [step, setStep] = useState(1);
    const totalSteps = 4;
    const { updateUserProfilePicture } = useLogin();
    const { showLoader, hideLoader } = useLoader();
    const [form, setForm] = useState({
        bio: user.bio || '',
        pincode: user.pincode || '',
        travelStyles: user.travelStyles || [],
        travelerType: user.travelerType || [],
        matchGender: user.matchGender || 'Any',
        ageGroup: user.ageGroup || '',
        showProfile: user.showProfile !== undefined ? user.showProfile : true,
        wishlist: user.wishlist?.map(item => item.refId) || [],
        profilePicture: null as File | string | null,
        instagram: user.instagram || '',
        travelGoal: user.travelGoal || '',
        languages: '',
        dateOfBirth: user.dateOfBirth || '',
        sex: user.sex || '',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    // const { showLoader, hideLoader } = useLoader();

    const getLocations = async (searchTerm) => {
        try {
            const response = await LocationServices.fetchLocationsBySearch(searchTerm, [LocationFields.ID, LocationFields.TITLE]);
            setLocations(response || []);
        } catch (err) {
            console.error("Failed to fetch locations", err);
            setLocations([]);
        }
    };
    useEffect(() => {
        if (searchTerm.trim().length < 2) {
            return;
        }
        const timeoutId = setTimeout(() => {
            getLocations(searchTerm); // your backend API
        }, 1000); // debounce delay
        // getLocations();
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);
    const uploadProfilePhotoInBackground = async () => {
        try {
            setIsUploadingPhoto(true);

            const res = await UserApiService.updateProfilePhoto(
                form.profilePicture as File
            );

            if (res?.success && res.url) {
                setForm(prev => ({
                    ...prev,
                    profilePicture: res.url as string,
                }));
                updateUserProfilePicture(res.url as string);
            }
        } catch (err) {
            console.error("Background image upload failed", err);
        } finally {
            setIsUploadingPhoto(false);
        }
    };
    useEffect(() => {
        // console.log(form);
        if (
            step === 3 &&
            form.profilePicture &&
            typeof form.profilePicture !== "string" && form.profilePicture instanceof File
        ) {
            uploadProfilePhotoInBackground();
        }
    }, [step]);

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
            } else if (name == 'pincode') {
                setForm((prev) => ({ ...prev, [name]: String(inputValue) }))
            } else {
                setForm((prev) => ({ ...prev, [name]: inputValue }));
            }
        } else if (field && value) {
            setForm((prev) => ({
                ...prev,
                [field]: (prev[field as keyof typeof prev] as string[]).includes(value)
                    ? (prev[field as keyof typeof prev] as string[]).filter((item) => item !== value)
                    : [...(prev[field as keyof typeof prev] as string[]), value],
            }));
        }
    };

    const handleDestinationSelect = (dest: Location) => {
        setSelectedLocations((prev) => {
            const isAlreadySelected = prev.some(loc => loc.id === dest.id);
            if (isAlreadySelected) return prev.filter((loc) => loc.id !== dest.id);
            return [...prev, dest];
        });
    };

    const validateStep = () => {
        setError('');
        if (step === 1) {
            if (!form.dateOfBirth) return "Date of birth is required";
            const dob = new Date(form.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
            if (age < 18) return "You must be 18 or older to continue.";
            if (!form.bio) return "User Bio is required";
            if (user.sex === undefined && !form.sex) return "Gender is required";
            if (!form.pincode) return "PIN Code is required";
            if (!form.travelGoal) return "Please select your travel goal";
            if (form.languages.length === 0) return "Please select minimum one language you understand and speak";
        } else if (step === 2) {
            if (!form.profilePicture && user.profile_picture?.length === 0) return "Profile picture is required";
        }
        else if (step === 3) {
            if (!form.travelStyles || form.travelStyles.length === 0) return "Please select at least one travel style.";
            if (!form.travelerType || form.travelerType.length === 0) return "Please select at least one traveler type.";
        } else if (step === 4) {
            if (selectedLocations.length === 0) return "Please select at least one favorite travel destination.";
        }
        return null;
    };

    const isFormValid = () => {
        const stepError = validateStep();
        return stepError ? false : true;
    };

    const nextStep = (e) => {
        e.preventDefault();
        const stepError = validateStep();
        if (stepError) {
            setError(stepError);
            toast.error(stepError);
            return;
        }
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure we only submit on the last step
        if (step !== totalSteps) return;

        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('userId', user.id);

        Object.keys(form).forEach(async (key) => {
            const value = form[key as keyof typeof form];
            if (key === 'profilePicture' && value instanceof File && typeof value !== 'string') {
                const responseImg = await UserApiService.updateProfilePhoto(value);
                formData.append(key, responseImg.url as string);
            } else if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else if (value !== null) {
                if(key === "profilePicture" && typeof value === "string") {
                    if(value.startsWith("http") || !value.startsWith("/compressed")) {
                        let relativeImagePath = value.split("/compressed")[1] + "/compressed";
                        formData.append(key, relativeImagePath);
                    } else {
                        formData.append(key, value);
                    }
                }
                else{
                    formData.append(key, String(value));
                }
            }
        });

        const idsToSend = selectedLocations.map(loc => loc.id);
        formData.append('preferredDestinations', JSON.stringify(idsToSend));

        try {
            showLoader();
            const response = await ApiService.completeProfile(formData);
            if (response.success) {
                if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'conversion', {
                        'send_to': 'AW-17836239160/ziUVCP3Zw9kbELjS_bhC',
                        'value': 1.0,
                        'currency': 'INR'
                    });
                }
                onProfileComplete(response.user);
                onClose();
                toast.success('Profile completed successfully!');
            } else {
                setError(response.message || 'Profile completion failed');
                toast.error(response.message || 'Profile completion failed');
            }
        } catch (error: any) {
            setError(error.message || 'An error occurred.');
            toast.error(error.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
            hideLoader();
        }
    };

    const filteredLocations = locations.filter((dest) =>
        dest.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedTitles = selectedLocations.map((loc) => loc.title);

    return (
        <div className="full-profile-overlay">
            <div className="full-profile-container">
                <button className="full-profile-close-btn" onClick={onClose} disabled={isLoading}>×</button>

                <div className="profile-progress-wrapper">
                    <div className="profile-progress-bar-container">
                        <div
                            className="profile-progress-bar-fill"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                    <p className="profile-step-text">Step {step} of {totalSteps}</p>
                </div>

                <h2 className="full-profile-title">Complete Your Travel Profile</h2>

                <form onSubmit={handleSubmit} className="full-profile-form">

                    {step === 1 && (
                        <div className="step-content">
                            {/* DOB */}
                            <div className="full-profile-section dob-section">
                                <DOBSelects
                                    value={form.dateOfBirth || null}
                                    onChange={(v) => setForm((p) => ({ ...p, dateOfBirth: v }))}
                                    required
                                    label="Date of birth"
                                    showAge
                                />
                            </div>
                            {/* Bio */}
                            <div className="full-profile-section">
                                <label>User Bio <span className="required-star">*</span></label>
                                <input
                                    name="bio"
                                    className="full-profile-input"
                                    value={form.bio}
                                    onChange={handleChange}
                                    placeholder="Tell something about yourself!"
                                />
                            </div>

                            {/* Gender */}
                            {user.sex === undefined && (
                                <div className="full-profile-section gender-section">
                                    <label>Gender <span className="required-star">*</span></label>
                                    <select name="sex" className="full-profile-input" onChange={handleChange} value={form.sex} disabled={isLoading}>
                                        <option value="" disabled>Please select your gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            )}
                            {/* Pincode */}
                            <div className="full-profile-section">
                                <label>PIN Code <span className="required-star">*</span></label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    name="pincode"
                                    className="full-profile-input"
                                    value={form.pincode || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your area PINCODE"
                                />
                            </div>
                            {/* Instagram */}
                            <div className="full-profile-section">
                                <label>Instagram handle (optional):</label>
                                <input type="text" name="instagram" className="full-profile-input" onChange={handleChange} placeholder="@yourusername" value={form.instagram} />
                            </div>
                            {/* Travel Goal */}
                            <div className="full-profile-section">
                                <label>Your travel goal:</label>
                                <select name="travelGoal" className="full-profile-input" onChange={handleChange} value={form.travelGoal}>
                                    <option value="">Select a goal</option>
                                    <option value="Explore India">Explore India</option>
                                    <option value="Make friends">Make friends</option>
                                    <option value="Relax">Relax</option>
                                    <option value="Spiritual journey">Spiritual journey</option>
                                </select>
                            </div>
                            {/* Languages */}
                            <div className="full-profile-section">
                                {/* <label>Languages you speak:</label> */}
                                <MultiSelect
                                    label="Languages I Speak: *"
                                    options={CommonLanguages}
                                    value={form.languages ? form.languages.split(",").map((lang) => lang.trim()) : []}
                                    onChange={(newVal) => setForm({ ...form, languages: newVal.join(",") })}
                                    placeholder="Select languages..."
                                    allowCustom={true}
                                    className="full-profile-input"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step-content">
                            <div className="full-profile-section">
                                <label>Upload a profile picture <span className="required-star">*</span></label>
                                <div style={{ marginTop: '10px' }}>
                                    {(form.profilePicture instanceof File || !form.profilePicture) && <AvatarUploader
                                        value={form.profilePicture as File}
                                        existingImageUrl={user.profile_picture && user.profile_picture?.length > 0 ? user.profile_picture?.[0] : null}
                                        onChange={(file) => setForm((prev) => ({ ...prev, profilePicture: file }))}
                                        required={!user.profile_picture || user.profile_picture.length === 0}
                                        size={110}
                                    />}
                                    {typeof form.profilePicture === 'string' && <Image src={form.profilePicture} alt="Profile" className="full-profile-preview-image" width={110} height={110} />}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="step-content">
                            <div className="full-profile-section">
                                <label>How do you like to travel? <span className="required-star">*</span></label>
                                <div className="bubble-btn-container">
                                    {['Backpacking', 'Beach vacations', 'Hill stations & adventure', 'City tours', 'Food & culture', 'Pilgrimage', 'Luxury getaways'].map((style) => (
                                        <button key={style} type="button" className={`bubble-btn ${form.travelStyles.includes(style) ? 'selected' : ''}`} onClick={() => handleChange(undefined, 'travelStyles', style)}>
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="full-profile-section">
                                <label>What kind of traveler are you? <span className="required-star">*</span></label>
                                <div className="bubble-btn-container">
                                    {['Solo traveler', 'Family & friends', 'Planner', 'Spontaneous', 'Foodie', 'Nature lover'].map((type) => (
                                        <button key={type} type="button" className={`bubble-btn ${form.travelerType.includes(type) ? 'selected' : ''}`} onClick={() => handleChange(undefined, 'travelerType', type)}>
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="step-content">
                            <div className="full-profile-section">
                                <label>Favorite travel destinations? <span className="required-star">*</span></label>
                                {selectedTitles.length > 0 && (
                                    <div className="full-profile-selected-destinations">
                                        {selectedTitles.map((title) => (
                                            <span key={title} className="full-profile-selected-tag">
                                                {title.replace(/[0-9.]/g, "")}
                                                <button type="button" className="full-profile-remove-tag" onClick={() => setSelectedLocations(prev => prev.filter(loc => loc.title !== title))}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="full-profile-dropdown-container">
                                    <input type="text" className="full-profile-input full-profile-search" placeholder="Search destinations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => setIsDropdownOpen(true)}
                                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                    />
                                    {isDropdownOpen && (
                                        <div className="full-profile-dropdown">
                                            {filteredLocations.filter(dest => !selectedLocations.some(sel => sel.id === dest.id)).length > 0 ? (
                                                filteredLocations.map((dest) => !selectedLocations.some(sel => sel.id === dest.id) && (
                                                    <div key={dest.id} className="full-profile-dropdown-item" onMouseDown={() => { handleDestinationSelect(dest); setSearchTerm(""); }}>
                                                        {dest.title?.replace(/[0-9.]/g, "") || dest.title}
                                                    </div>
                                                ))
                                            ) : <div className="full-profile-dropdown-item disabled">No matches found</div>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="full-profile-section">
                                <label>Who would you like to travel with?</label>
                                <select name="matchGender" className="full-profile-input" onChange={handleChange} value={form.matchGender}>
                                    <option value="Anyone">Anyone</option>
                                    <option value="Friends">Friends</option>
                                    <option value="Family">Family</option>
                                    <option value="Partner">Partner</option>
                                </select>
                            </div>

                            <div className="full-profile-section">
                                <label>Preferred age group?</label>
                                <select name="ageGroup" className="full-profile-input" onChange={handleChange} value={form.ageGroup}>
                                    <option value="">Any age group</option>
                                    <option value="18-25">18-25</option>
                                    <option value="25-35">25-35</option>
                                    <option value="35-45">35-45</option>
                                    <option value="45+">45+</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {error && <div className="full-profile-error-container">{error}</div>}

                    <div className="profile-footer-btns">
                        {step > 1 && (
                            <button type="button" className="btn btn-primary-border" onClick={prevStep} disabled={isLoading} style={{ flex: 1 }}>
                                Back
                            </button>
                        )}

                        {step < totalSteps ? (
                            <button disabled={isLoading || !isFormValid} type="button" className="btn btn-primary" onClick={(e) => nextStep(e)} style={{ flex: 2 }}>
                                Next Step
                            </button>
                        ) : (
                            <button disabled={isLoading || !isFormValid} type="submit" className="btn btn-black" style={{ flex: 2 }}>
                                {isLoading ? 'Saving...' : 'Save Profile'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}