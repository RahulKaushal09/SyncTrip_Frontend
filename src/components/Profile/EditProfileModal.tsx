"use client";
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { X, Check, ChevronDown, Plus } from 'lucide-react';
import { ExtendedUser } from '@/types';
import { TravelGoals as TRAVEL_GOALS, CommonLanguages as COMMON_LANGUAGES, TripPreferences as TRIP_PREFERENCES, ROUTES } from '@/constants';

export interface MultiSelectProps {
    label: string;
    options?: string[];
    value: string[];
    onChange: (val: string[]) => void;
    placeholder?: string;
    allowCustom?: boolean;
    className?: string | undefined;
}

export const MultiSelect = ({ label, options = [], value = [], onChange, placeholder, allowCustom = false, className }: MultiSelectProps) => {
    const [inputValue, setInputValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAdd = (item: string) => {
        if (item && !value.includes(item)) {
            onChange([...value, item]);
        }
        setInputValue('');
    };

    const handleRemove = (itemToRemove: string) => {
        onChange(value.filter(item => item !== itemToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && allowCustom && inputValue.trim()) {
            e.preventDefault();
            handleAdd(inputValue.trim());
        }
    };

    const availableOptions = options.filter(opt => !value.includes(opt));

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-[var(--secondary-1)] mb-2">{label}</label>
            <div
                className={className ? `${className} flex gap-2 flex-wrap` : "min-h-[42px] w-full px-3 py-2 border border-[var(--neutral-4)] rounded-xl bg-white focus-within:ring-2 focus-within:ring-[var(--primary-1)] focus-within:border-transparent transition-all flex flex-wrap gap-2 items-center cursor-text"}
                onClick={() => setIsDropdownOpen(true)}
            >
                {value.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--primary-5)] text-[var(--primary-hover)] text-xs font-semibold border border-[var(--primary-3)]">
                        {item}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemove(item); }}
                            className="hover:bg-[var(--primary-2)] rounded-full p-0.5 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder={value.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-[var(--neutral-2)]"
                />
            </div>
            {isDropdownOpen && availableOptions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--neutral-5)] rounded-xl shadow-lg max-h-48 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                    {availableOptions
                        .filter(opt => opt.toLowerCase().includes(inputValue.toLowerCase()))
                        .map((option, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleAdd(option)}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--primary-5)] text-[var(--secondary-1)] hover:text-[var(--primary-hover)] transition-colors flex items-center justify-between group"
                            >
                                {option}
                                <Plus size={14} className="opacity-0 group-hover:opacity-100 text-[var(--primary-1)]" />
                            </button>
                        ))}
                    {allowCustom && inputValue && !availableOptions.some(o => o.toLowerCase() === inputValue.toLowerCase()) && (
                        <button
                            type="button"
                            onClick={() => handleAdd(inputValue)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--primary-5)] text-[var(--primary-hover)] font-medium border-t border-[var(--neutral-5)]"
                        >
                            Add &quot;{inputValue}&quot;
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default function EditProfileModal({
    isOpen, onClose, user, onSave
}: {
    isOpen: boolean; onClose: () => void; user: ExtendedUser; onSave: (updatedUser: ExtendedUser) => void;
}) {
    const [formData, setFormData] = useState<Partial<ExtendedUser>>({});

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                ...user,
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                persona: user.persona || [],
                languages_array: Array.isArray(user.languages)
                    ? user.languages
                    : (user.languages ? (user.languages as string).split(',').map(s => s.trim()) : []),
                showProfile: user.showProfile ? true : false,
                socialMedias: {
                    instagram: user.instagram || user.socialMedias?.instagram || ''
                },
                bio: user.bio
            });
        }
    }, [user, isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as ExtendedUser);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--secondary-1)]/60 backdrop-blur-sm transition-all">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
                style={{ overscrollBehavior: 'contain' }}
            >
                <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-6 py-4 border-b border-[var(--neutral-5)] flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[var(--secondary-1)]">Edit Profile</h3>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--primary-5)] rounded-full text-[var(--neutral-1)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* --- Read Only Fields --- */}
                    <div className="md:col-span-2 grid grid-cols-1 bg-gray-100 md:grid-cols-2 gap-6 p-4 bg-[var(--neutral-5)]/30 rounded-xl border border-[var(--neutral-5)]">
                        <div className="md:col-span-2">
                            <span className="text-xs font-bold text-[var(--primary-hover)] uppercase tracking-wider mb-2 block">Identity Details (Locked)</span>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[var(--neutral-1)] mb-1">Full Name</label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                disabled
                                className="w-full px-3 py-2 border border-[var(--neutral-4)] rounded-lg bg-[var(--neutral-5)]/50 text-[var(--secondary-1)] font-medium cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-1)] mb-1">Date of Birth</label>
                            <input
                                type="date"
                                value={formData.dateOfBirth || ''}
                                disabled
                                className="w-full px-3 py-2 border border-[var(--neutral-4)] rounded-lg bg-[var(--neutral-5)]/50 text-[var(--secondary-1)] cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--neutral-1)] mb-1">Gender</label>
                            <select
                                value={formData.sex?.toLowerCase() || ''}
                                disabled
                                className="w-full px-3 py-2 border border-[var(--neutral-4)] rounded-lg bg-[var(--neutral-5)]/50 text-[var(--secondary-1)] cursor-not-allowed appearance-none"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* --- Editable Fields --- */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[var(--secondary-1)] mb-1">Instagram Username</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neutral-1)] select-none">@</span>
                            <input
                                type="text"
                                value={formData.socialMedias?.instagram || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    socialMedias: { ...formData.socialMedias, instagram: e.target.value }
                                })}
                                className="w-full pl-8 pr-4 py-2 border border-[var(--neutral-4)] rounded-xl focus:ring-2 focus:ring-[var(--primary-1)] outline-none transition-all"
                                placeholder="username"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[var(--secondary-1)] mb-1">User Bio</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.bio || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    bio: e.target.value
                                })}
                                className="w-full !px-4 py-2 border border-[var(--neutral-4)] rounded-xl focus:ring-2 focus:ring-[var(--primary-1)] outline-none transition-all"
                                placeholder="username"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <MultiSelect
                            label="My Vibe / Persona"
                            options={TRIP_PREFERENCES}
                            value={formData.persona || []}
                            onChange={(newVal) => setFormData({ ...formData, persona: newVal })}
                            placeholder="Select what defines your travel style..."
                        />
                    </div>

                    <div className="md:col-span-2">
                        <MultiSelect
                            label="Languages I Speak"
                            options={COMMON_LANGUAGES}
                            value={formData.languages_array || []}
                            onChange={(newVal) => setFormData({ ...formData, languages_array: newVal })}
                            placeholder="Select languages..."
                            allowCustom={true}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[var(--secondary-1)] mb-1">
                            Primary Travel Goal
                        </label>
                        <div className="relative">
                            <select
                                value={formData.travelGoal || ''}
                                onChange={(e) => setFormData({ ...formData, travelGoal: e.target.value })}
                                className="w-full px-3 py-2 border border-[var(--neutral-4)] rounded-xl bg-white text-[var(--secondary-1)] focus:ring-2 focus:ring-[var(--primary-1)] outline-none appearance-none cursor-pointer"
                            >
                                <option value="" disabled className="text-[var(--neutral-2)]">
                                    Select your main reason to travel...
                                </option>
                                {TRAVEL_GOALS.map((goal, idx) => (
                                    <option key={idx} value={goal}>
                                        {goal}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--neutral-1)]">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[var(--secondary-1)] mb-2">
                            Profile Visibility
                        </label>

                        <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--neutral-4)] bg-[var(--neutral-5)]/20">
                            <div>
                                <p className="font-medium text-[var(--secondary-1)]">
                                    {formData.showProfile ? "Public Profile" : "Private Profile"}
                                </p>
                                <p className="text-sm text-[var(--neutral-2)]">
                                    {formData.showProfile
                                        ? "Anyone can view your profile."
                                        : "Your profile will be hidden."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        showProfile: !formData.showProfile,
                                    })
                                }
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors
        ${formData.showProfile
                                        ? "bg-[var(--primary-1)]"
                                        : "bg-[var(--neutral-4)]"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform
          ${formData.showProfile
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                </form>

                <div className="sticky bottom-0 bg-white border-t border-[var(--neutral-5)] p-4 flex justify-end gap-3 z-10">
                    <button type="button" onClick={onClose} className="px-3 py-2.5 text-[var(--secondary-1)] hover:bg-[var(--neutral-5)] rounded-xl font-medium transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="px-3 py-2.5 bg-[var(--primary-1)] hover:bg-[var(--primary-hover)] text-white rounded-xl font-medium shadow-lg shadow-[var(--primary-background)] hover:shadow-xl transition-all flex items-center gap-2">
                        <Check size={18} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};