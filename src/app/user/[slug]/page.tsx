'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin, Calendar, Edit2, Globe, User as UserIcon,
  X, Instagram, Plus, Briefcase, Lock, LogIn, CheckCircle,
  ArrowRight, Users, Heart, Facebook, Twitter, Star, Compass, Luggage,
  SquarePen, MapPinned, MailIcon,
  Check,
  Phone,
  ChevronDown,
  Camera,
  UploadCloud,
  PencilIcon
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLogin } from '@/components/providers/LoginProvider';
import TripServices from '@/utils/trip.utils';
import { UserApiService } from '@/utils/user.api.utils';
import { User, UserTrip } from '@/types';
import { CommonServices, triggerLogin } from '@/utils';
import { TravelGoals as TRAVEL_GOALS, CommonLanguages as COMMON_LANGUAGES, TripPreferences as TRIP_PREFERENCES, ROUTES } from '@/constants';
import apiClient from '@/utils/apiClient';
import { useLoader } from '@/components/providers/LoaderContext';

// --- Types & Interfaces ---

export interface ExtendedUser extends User {
  persona?: string[]; // Maps to travelerType/travelStyles in UI
  viewCount?: number;
  rating?: number;
  socialMedias?: {
    instagram?: string;
  };
}

const DUMMY_USER: Partial<ExtendedUser> = {
  id: 'hidden-user',
  name: 'Hidden Profile',
  profile_picture: [],
  travelGoal: 'Login to view',
  rating: 0,
  persona: ['Hidden', 'Locked'],
  languages: 'Hidden',
  viewCount: 0
};

/**
 * FAKE_TRIPS extended to satisfy the UserTrip interface 
 * (adding activitiesCount and source)
 */
const FAKE_TRIPS: UserTrip[] = [1, 2, 3, 4, 5, 6].map((i) => ({
  id: `fake-${i}`,
  locationName: 'Hidden Paradise',
  tripName: 'Secret Adventure',
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  budget: '$$$',
  image: `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop&sig=${i}`,
  interests: ['Adventure', 'Hidden Gems'],
  privacy: 'Public',
  locationId: 'fake-loc',
  activitiesCount: 0,
  source: { type: 'manual' }
}));

// used in edit profile
interface MultiSelectProps {
  label: string;
  options?: string[];
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
}

const MultiSelect = ({ label, options = [], value = [], onChange, placeholder, allowCustom = false }: MultiSelectProps) => {
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
        className="min-h-[42px] w-full px-3 py-2 border border-[var(--neutral-4)] rounded-xl bg-white focus-within:ring-2 focus-within:ring-[var(--primary-1)] focus-within:border-transparent transition-all flex flex-wrap gap-2 items-center cursor-text"
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

// --- Image Upload Modal ---
const ImageUploadModal = ({
  isOpen, onClose, currentImage, onSave
}: {
  isOpen: boolean; onClose: () => void; currentImage: string | null; onSave: (file: File) => Promise<void>;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentImage);
      setSelectedFile(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, currentImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    await onSave(selectedFile);
    setIsUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[var(--secondary-1)]/60 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[var(--secondary-1)]">Update Profile Picture</h3>
          <button onClick={onClose} className="p-2 hover:bg-[var(--neutral-5)] rounded-full text-[var(--neutral-1)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[var(--primary-5)] shadow-inner bg-[var(--neutral-5)] relative">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--neutral-1)]">
                  <UserIcon size={48} />
                </div>
              )}
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={32} className="text-white drop-shadow-md" />
              </div>
            </div>

            <div className="absolute bottom-2 right-2 bg-[var(--primary-1)] text-white p-2 rounded-full shadow-lg pointer-events-none">
              <UploadCloud size={16} />
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <p className="text-sm text-[var(--neutral-1)] text-center">
            Click the image to select a new photo.<br />JPG, PNG or WEBP (Max 5MB)
          </p>

          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-[var(--secondary-1)] hover:bg-[var(--neutral-5)] rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedFile || isUploading}
              className={`flex-1 py-2.5 bg-[var(--primary-1)] hover:bg-[var(--primary-hover)] text-white rounded-xl font-medium shadow-md transition-all flex items-center justify-center gap-2 ${(!selectedFile || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? (
                <>Updating...</>
              ) : (
                <><Check size={18} /> Save Photo</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Edit Profile Modal Component ---
const EditProfileModal = ({
  isOpen, onClose, user, onSave
}: {
  isOpen: boolean; onClose: () => void; user: ExtendedUser; onSave: (updatedUser: ExtendedUser) => void;
}) => {
  const [formData, setFormData] = useState<Partial<ExtendedUser>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        persona: user.persona || [],
        // Base user interface has languages as string, UI needs array
        languages: Array.isArray(user.languages) ? user.languages.join(",") : (user.languages ? user.languages:''),
        showProfile: user.showProfile ?? true,
        socialMedias: {
          instagram: user.instagram || ''
        }
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
              value={Array.isArray(formData.languages) ? formData.languages : []}
              onChange={(newVal) => setFormData({ ...formData, languages: newVal.join(',') as string })}
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

          {/* --- Profile Visibility --- */}
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

              {/* Toggle */}
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
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-[var(--secondary-1)] hover:bg-[var(--neutral-5)] rounded-xl font-medium transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 bg-[var(--primary-1)] hover:bg-[var(--primary-hover)] text-white rounded-xl font-medium shadow-lg shadow-[var(--primary-background)] hover:shadow-xl transition-all flex items-center gap-2">
            <Check size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Unified Trip Card Component ---
const TripCard = ({ trip, isOwner, onClick }: { trip: UserTrip, isOwner: boolean, onClick: () => void }) => {
  const privacyLabel = trip.privacy?.toLowerCase().includes('public') ? 'Public' : 'Private';
  const isPublic = privacyLabel === 'Public';
  const currentYear = new Date().getFullYear();
  const tripYear = new Date(trip.startDate).getFullYear();
  const showYear = tripYear !== currentYear;

  return (
    <div
      onClick={isOwner ? onClick : () => { }}
      className="aspect-[4/3] rounded-2xl overflow-hidden relative group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-md"
    >
      <img
        src={trip.image}
        alt={trip.tripName}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300" />
      {isOwner && (
        <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/20 backdrop-blur-md border border-white/40 p-3.5 rounded-full text-white shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <SquarePen size={32} strokeWidth={2} />
          </div>
        </div>
      )}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 items-start">
        {trip.budget && (
          <span className="bg-white/90 backdrop-blur-md text-[var(--secondary-1)] text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
            {trip.budget}
          </span>
        )}
        {trip.source?.type === 'hosted' && (
          <span className="bg-[var(--primary-hover)]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
            <Briefcase size={10} /> Hosted
          </span>
        )}
      </div>
      {isOwner && (
        <div className="absolute top-3 right-3 z-20">
          <span className={`backdrop-blur-md border border-white/30 text-white text-[10px] uppercase tracking-wide font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 bg-[var(--secondary-1)] bg-opacity-80`}>
            {isPublic ? <Globe size={10} /> : <Lock size={10} />}
            {privacyLabel}
          </span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <h3 className="font-bold text-white text-2xl leading-tight drop-shadow-md mb-1.5 line-clamp-2">
          {trip.tripName || trip.locationName}
        </h3>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
            <Calendar size={12} className="text-white/80" />
            <span>
              {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              &mdash;
              {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {showYear && `, ${tripYear}`}
            </span>
          </div>
          {trip.locationName && trip.tripName && (
            <div className="flex items-center gap-2 text-white/80 text-xs">
              <MapPin size={12} />
              <span className="truncate">{trip.locationName}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <MapPinned size={12} />
            <span className="truncate">{trip.activitiesCount as number > 0 ? trip.activitiesCount : "No"} activities planned</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UserProfilePage() {
  const params = useParams();
  const { showLoader } = useLoader();
  const router = useRouter();
  const profileId = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const redirectToUrl = (redirectUrl: string) => {
    showLoader();
    router.push(redirectUrl);
  };

  const [profileUser, setProfileUser] = useState<ExtendedUser | null>(null);
  const [displayTrips, setTrips] = useState<UserTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageEditModalOpen, setIsImageEditModalOpen] = useState(false);
  const { user: loggedInUser, isLoggedIn, openLogin } = useLogin();
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (!profileId) {
        setIsLoading(false);
        return;
      }

      if (!isLoggedIn) {
        if (mounted) {
          setProfileUser(DUMMY_USER as ExtendedUser);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setIsNotFound(false);

        const userData = await UserApiService.fetchUserWithIdForAnyone(profileId);

        if (!userData) {
          if (mounted) setIsNotFound(true);
          return;
        }

        const userTrips = await TripServices.getTripsOfUserOnRequest(profileId) || [];

        if (mounted) {
          setProfileUser(userData);
          const sortedTrips = userTrips.sort((a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
          setTrips(sortedTrips);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setIsNotFound(true);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [profileId, isLoggedIn]);

  const isOwner = loggedInUser?.id === profileId;
  const age = profileUser?.dateOfBirth ? CommonServices.computeAge(profileUser.dateOfBirth) : null;

  const onUpdateProfile = async (updatedFormData: ExtendedUser) => {
    try {
      const payload = {
        instagram: updatedFormData.socialMedias?.instagram, // Mapping back to flat structure
        travelGoal: updatedFormData.travelGoal,
        languages: Array.isArray(updatedFormData.languages) ? updatedFormData.languages.join(', ') : updatedFormData.languages,
        travelerType: updatedFormData.persona, // Mapping persona back to travelerType
        showProfile: updatedFormData.showProfile
      };
      const response = await apiClient.post('/users/updateuser', payload);
      setProfileUser(response.data.user);
      toast.success("Profile updated!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  const onUpdateProfileImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      const response = await apiClient.post('/users/update-profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfileUser(response.data.user);
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--primary-5)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary-1)]"></div>
      </div>
    );
  }

  if (!profileUser) return null;

  if (isNotFound) {
    return (
      <div className="min-h-screen bg-[var(--primary-5)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-[var(--neutral-5)]">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <UserIcon size={40} strokeWidth={1.5} />
            <X size={20} className="absolute mt-10 ml-10 bg-white rounded-full border-2 border-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--secondary-1)] mb-2">User Not Found</h1>
          <p className="text-[var(--neutral-1)] mb-8">
            The traveler profile you&apos;re looking for doesn&apos;t exist or may have been set to private.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3.5 bg-[var(--primary-1)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-2xl shadow-lg shadow-[var(--primary-background)] flex items-center justify-center gap-2 transition-all"
          >
            <Compass size={20} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-5)] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <Toaster position="bottom-right" />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={profileUser}
        onSave={(data) => onUpdateProfile(data)}
      />

      <ImageUploadModal
        isOpen={isImageEditModalOpen}
        onClose={() => setIsImageEditModalOpen(false)}
        currentImage={profileUser.profile_picture?.[0] || null}
        onSave={onUpdateProfileImage}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN - USER IDENTITY */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6 relative">

          <div className={`transition-all duration-300 ${!isLoggedIn ? 'filter blur-md pointer-events-none select-none opacity-80' : ''}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--secondary-3)] overflow-hidden">
              <div className="h-28 bg-gradient-to-r from-[var(--primary-3)] to-[var(--primary-1)] relative" />
              <div className="px-6 pb-6 relative">
                <div className="relative -mt-12 mb-3 flex justify-between items-end">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white overflow-hidden flex items-center justify-center">
                      {profileUser.profile_picture?.[0] ? (
                        <img
                          src={profileUser.profile_picture[0]}
                          alt={profileUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[var(--secondary-1)] flex items-center justify-center text-white text-3xl font-semibold">
                          {profileUser.name?.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {isOwner && profileUser.profileCompleted && (
                    <button onClick={() => setIsEditModalOpen(true)} className="mb-2 px-2 py-1.5 bg-[var(--primary-5)] text-[var(--secondary-1)] text-sm font-medium rounded-full border border-[var(--primary-3)] flex items-center gap-1.5 hover:bg-[var(--primary-4)] transition-colors">
                      <Edit2 size={14} /> Edit Profile
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <h1 className="text-xl font-sans font-semibold flex items-center gap-1 text-[var(--secondary-1)]">
                    {profileUser.showProfile ? "" : <Lock size={16} />}
                    {profileUser.name}
                    {profileUser.rating ? <span className="flex items-center text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 ml-1 rounded-full"><Star size={10} className="fill-yellow-700 mr-1" /> {profileUser.rating}</span> : null}
                  </h1>
                  {profileUser.travelGoal && (
                    <div className="mt-2 mb-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary-5)] border border-[var(--primary-2)]/30 text-[var(--secondary-1)] text-xs font-medium">
                      <Compass size={14} className="text-[var(--primary-hover)]" />
                      <span className="opacity-70 uppercase tracking-wider text-[10px] font-bold">Goal:</span>
                      <span>{profileUser.travelGoal}</span>
                    </div>
                  )}
                  {profileUser.email && isOwner && <p className="flex mt-1 items-center gap-2 text-[var(--neutral-1)] text-sm">
                    <MailIcon size={16} />
                    {profileUser.email}
                  </p>}
                  {profileUser.instagram && isOwner && <p className="flex mt-1 items-center gap-2 text-[var(--neutral-1)] text-sm">
                    <Instagram size={16} />
                    {profileUser.instagram}
                  </p>}
                  {isOwner && profileUser.phone &&
                    <p className="flex mt-1 items-center gap-2 text-[var(--neutral-1)] text-sm">
                      <Phone size={16} />
                      {profileUser.phone}
                    </p>
                  }
                </div>

                {profileUser.profileCompleted ?
                  <div className={`space-y-4 ${isOwner ? 'border-t pt-4 border-[var(--neutral-5)]' : ''}`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--neutral-1)] flex items-center gap-2"><Calendar size={14} /> Age</span>
                      <span className="font-medium text-[var(--secondary-1)]">{age || 'N/A'}</span>
                    </div>
                    {profileUser.sex && <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--neutral-1)] flex items-center gap-2"><UserIcon size={14} /> Gender</span>
                      <span className="font-medium capitalize text-[var(--secondary-1)]">{profileUser.sex || 'Not Specified'}</span>
                    </div>}
                    {profileUser.languages && <div className="flex items-start justify-between text-sm">
                      <span className="text-[var(--neutral-1)] flex items-center gap-2"><Globe size={14} /> Languages</span>
                      <span className="font-medium text-right max-w-[60%] text-[var(--secondary-1)]">
                        {profileUser.languages}
                      </span>
                    </div>}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--neutral-1)] flex items-center gap-2"><Compass size={14} /> Views</span>
                      <span className="font-medium text-[var(--secondary-1)]">{profileUser.viewCount || 0}</span>
                    </div>
                  </div> :
                  (isOwner && <button onClick={() => triggerLogin()} className="mb-2 px-2 py-1.5 bg-[var(--primary-1)] hover:bg-[var(--primary-hover)] text-white text-sm font-medium rounded-full border border-[var(--primary-3)] flex items-center gap-1.5 transition-colors">
                    <PencilIcon size={14} />
                    Complete Profile
                  </button>)
                }

                {profileUser.persona && profileUser.persona.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-[10px] font-bold text-[var(--neutral-1)] uppercase tracking-wider mb-2">Vibe & Style</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileUser.persona.map((p, i) => (
                        <span key={i} className="px-3 py-1 bg-[var(--primary-5)] text-[var(--primary-hover)] rounded-lg text-xs font-semibold border border-[var(--primary-3)]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isLoggedIn && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg text-[var(--neutral-2)] mb-3">
                <Lock size={32} />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - TRIPS */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--secondary-1)]">Trips</h2>
              <p className="text-sm text-[var(--neutral-1)]">Upcoming and past adventures</p>
            </div>
            {isOwner && isLoggedIn && (
              <button
                onClick={() => triggerLogin(() => redirectToUrl(ROUTES.CREATE_TRIP))}
                className="hidden sm:flex items-center gap-2 bg-[var(--primary-1)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-xl font-medium shadow-md shadow-[var(--primary-background)] transition-all text-sm"
              >
                <Plus size={16} /> Plan New Trip
              </button>
            )}
          </div>

          {!isLoggedIn ? (
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 filter blur-md select-none pointer-events-none opacity-60">
                {FAKE_TRIPS.map((fakeTrip) => (
                  <div key={fakeTrip.id} className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                    <img src={fakeTrip.image} alt={fakeTrip.tripName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-white text-lg leading-tight drop-shadow-lg">{fakeTrip.tripName}</h3>
                      <div className="flex items-center gap-2 text-white/80 text-xs font-medium mt-1">
                        <Calendar size={12} /><span>Hidden Dates</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 z-50 flex items-center justify-center">
                <div onClick={() => openLogin()} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-[var(--white)] text-center max-w-sm mx-4 transform transition-all hover:scale-105 cursor-pointer">
                  <div className="w-16 h-16 bg-[var(--primary-5)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--primary-1)]"><Lock size={32} /></div>
                  <h3 className="text-xl font-bold text-[var(--secondary-1)] mb-2">Unlock {profileUser.name}&apos;s Trips</h3>
                  <p className="text-[var(--neutral-1)] text-sm mb-6">Log in to view trip details, itineraries, and costs.</p>
                  <div className="w-full py-3 bg-[var(--primary-1)] hover:bg-[var(--primary-hover)] text-white font-bold rounded-xl shadow-lg shadow-[var(--primary-background)] flex items-center justify-center gap-2 transition-all"><LogIn size={18} /> Login to View</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isOwner && (
                <div onClick={() => router.push('/create/trip')} className="sm:hidden flex items-center justify-center p-6 border-2 border-dashed border-[var(--primary-2)] bg-[var(--primary-5)] rounded-2xl text-[var(--primary-hover)] font-medium cursor-pointer aspect-[4/2]">
                  <Plus size={20} className="mr-2" /> Plan a New Trip
                </div>
              )}
              {displayTrips.length > 0 ? displayTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} isOwner={isOwner} onClick={() => router.push(`/userTrip/details?tripId=${encodeURIComponent(trip.id || '')}&locationId=${encodeURIComponent(trip.locationId || '')}`)} />
              )) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-[var(--neutral-3)]">
                  <div className="w-16 h-16 bg-[var(--primary-5)] rounded-full flex items-center justify-center mb-4 text-[var(--primary-1)]"><MapPin size={24} /></div>
                  <h3 className="text-[var(--secondary-1)] font-bold text-lg">No trips found</h3>
                  <p className="text-[var(--neutral-1)] text-sm max-w-xs text-center mt-1">{isOwner ? "You haven't planned any trips yet. Start your journey today!" : "This user hasn't planned any public trips yet."}</p>
                  {isOwner && (
                    <button onClick={() => triggerLogin(() => redirectToUrl(ROUTES.CREATE_TRIP))} className="mt-6 px-6 py-2 bg-[var(--primary-1)] text-white rounded-xl font-medium shadow-lg shadow-[var(--primary-background)] hover:bg-[var(--primary-hover)] transition-all">Plan First Trip</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}