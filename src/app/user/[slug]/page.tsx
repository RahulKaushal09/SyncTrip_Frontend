'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin, Calendar, Edit2, Globe, User as UserIcon,
  X, Instagram, Plus, Lock, LogIn, Star, Compass, MailIcon, Phone, Camera, PencilIcon
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLogin } from '@/components/providers/LoginProvider';
import TripServices from '@/utils/trip.utils';
import { UserApiService } from '@/utils/user.api.utils';
import { ExtendedUser, User, UserTrip } from '@/types';
import { CommonServices, triggerLogin } from '@/utils';
import { useLoader } from '@/components/providers/LoaderContext';
import TripCard from '@/components/Profile/TripCard';
import EditProfileModal from '@/components/Profile/EditProfileModal';
import ImageUploadModal from '@/components/Profile/ImageUpload';
import { ROUTES } from '@/constants';
import { apiErrorType } from '@/classes/ApiResponse.classes';
import GumletImage from '@/components/common/GumletImage';

// DUMMY DATA FOR BLURRED PROFILE
const DUMMY_USER: Partial<ExtendedUser> = {
  id: 'synctrip-user',
  name: 'SyncTrip User Profile',
  profile_picture: [],
  travelGoal: 'Login to View',
  rating: 5,
  persona: ['Hidden', 'Locked'],
  languages: 'Hidden',
  viewCount: 100
};

// FAKE TRIPS FOR BLURRED PROFILE
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
  const userLanguages = React.useMemo(() => {
    if (!profileUser?.languages) return [];

    return Array.isArray(profileUser.languages)
      ? profileUser.languages
      : profileUser.languages.split(",").map(l => l.trim());
  }, [profileUser?.languages]);
  const [displayTrips, setTrips] = useState<UserTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageEditModalOpen, setIsImageEditModalOpen] = useState(false);
  const { user: loggedInUser, isLoggedIn, openLogin, updateUserProfilePicture, updateUserFields } = useLogin();
  const [isNotFound, setIsNotFound] = useState(false);

  // fetch profile data conditionally for logged in user and someone else
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
        let userData;
        if (loggedInUser != null && loggedInUser.id == profileId) {
          userData = loggedInUser;
        }
        else {
          userData = await UserApiService.fetchUserWithIdForAnyone(profileId);
        }

        if (!userData) {
          if (mounted) setIsNotFound(true);
          return;
        }

        // if (userData && userData.languages) {
        //   if (Array.isArray(userData.languages)) {
        //     setUserLanguages(userData.languages);
        //   } else {
        //     const langs = userData.languages.split(",");
        //     setUserLanguages(langs);
        //   }
        // }

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

  useEffect(() => {
    if (!profileId || !isLoggedIn) return;

    const fetchCounts = async () => {
      try {
        const { viewCount, tripCount } =
          await UserApiService.getUserTripViewActivityCount();

        setProfileUser(prev =>
          prev
            ? {
              ...prev,
              viewCount,
              tripCount
            }
            : prev
        );

      } catch (err) {
        console.error("Failed to fetch counts", err);
      }
    };

    fetchCounts();
  }, [profileId, isLoggedIn]);


  // for any changes in loggedinUser (at time of update), sync them
  useEffect(() => {
    if (!loggedInUser) return;

    setProfileUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        ...loggedInUser,
      };
    });
  }, [loggedInUser]);

  const isOwner = loggedInUser?.id === profileId;
  const age = profileUser?.dateOfBirth ? CommonServices.computeAge(profileUser.dateOfBirth) : null;

  // Inside UserProfilePage component

  const onUpdateProfile = async (updatedFormData: ExtendedUser) => {
    try {
      const payload: Partial<ExtendedUser> = {};

      // Social medias
      if (updatedFormData?.name !== undefined) {
        payload.name = updatedFormData.name;
      }

      if (updatedFormData.socialMedias?.instagram !== undefined) {
        payload.socialMedias = {
          instagram: updatedFormData.socialMedias.instagram,
        };
      }

      // Travel goal
      if (updatedFormData.travelGoal !== undefined) {
        payload.travelGoal = updatedFormData.travelGoal;
      }

      // Languages
      if (Array.isArray(updatedFormData.languages_array)) {
        payload.languages = updatedFormData.languages_array.join(',');
      }

      // Persona
      if (Array.isArray(updatedFormData.persona)) {
        payload.persona = updatedFormData.persona;
      }

      // Profile visibility
      if (typeof updatedFormData.showProfile === "boolean") {
        payload.showProfile = updatedFormData.showProfile;
      }

      if (updatedFormData.bio !== undefined) {
        payload.bio = updatedFormData.bio;
      }

      if (Object.keys(payload).length === 0) {
        toast("Nothing to update");
        return;
      }
      try {
        const res = await UserApiService.updateUser(payload);
        if (res.success) {
          updateUserFields(payload as Partial<ExtendedUser>);
          toast.success("Profile updated!");
        }
      }
      catch (error) {
        toast.error("Something went wrong!!");
      }

    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update profile");
    }
  };

  const onUpdateProfileImage = async (file: File) => {  
    try {
      const res = await UserApiService.UpdateProfileImageOfUser(file);
      if (res?.success && res.url) {
        updateUserProfilePicture(res.url);
        toast.success("Profile picture updated!");
      }
    } catch (error: unknown) {
      const errorMessage = (error as apiErrorType)?.message || "Failed to upload image";
      console.error("Upload Error:", error);
      toast.error(errorMessage);
    }
  };

  // const onUpdateProfileImage = async (file: File) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('profilePhoto', file);

  //     const response = await UserApiService.updateProfilePhoto(file);

  //     // console.log("Upload res: ", response);

  //     // The backend now returns { success: true, url: "..." }
  //     const newImageUrl = response.url;

  //     if (newImageUrl) {
  //       updateUserProfilePicture(newImageUrl);
  //       toast.success("Profile picture updated!");
  //     }
  //   } catch (error: unknown) {
  //     // Check if the backend sent a specific error message
  //     const errorMessage = (error as apiErrorType)?.message || "Failed to upload image";
  //     console.error("Upload Error:", error);
  //     toast.error(errorMessage);
  //   }
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--primary-5)]">
        <div className='h-[40px] w-[40px] border-4 border-[#f3f4f6] border-t-[#00bcd4] rounded-full animate-spin' />
      </div>
    );
  }

  if (!profileUser) return null;

  if (isNotFound) {
    return (
      <div className="min-h-screen  flex items-center justify-center px-4">
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
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8 font-sans">
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
                  <div className="relative group"> {/* Added group for hover effects */}
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white overflow-hidden flex items-center justify-center">
                      {profileUser.profile_picture?.[0] ? (
                        <GumletImage
                          containerClassName='h-full'
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

                    {/* Pencil / Camera Icon Overlay */}
                    {/* {isOwner && profileUser.profileCompleted && (
                      <button
                        onClick={() => setIsImageEditModalOpen(true)}
                        className="absolute bottom-0 right-0 p-1.5 bg-[var(--primary-1)] hover:bg-[var(--primary-hover)] text-white rounded-full border-2 border-white shadow-lg transition-all transform hover:scale-110 active:scale-95 z-10"
                        title="Update profile picture"
                      >
                        <Camera size={14} strokeWidth={2.5} />
                      </button>
                    )} */}
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
                  {profileUser.bio && (<p className="text-[var(--secondary-1)] mb-2 text-sm">{profileUser.bio}</p>)}
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
                  {profileUser?.socialMedias?.instagram && isOwner && <p className="flex mt-1 items-center gap-2 text-[var(--neutral-1)] text-sm">
                    <Instagram size={16} />
                    {profileUser?.socialMedias?.instagram}
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
                    {userLanguages.length > 0 && <div className="flex items-start justify-between text-sm">
                      <span className="text-[var(--neutral-1)] flex items-center gap-2"><Globe size={14} /> Languages</span>
                      <div className="flex flex-wrap gap-1.5 justify-end max-w-[60%]">
                        {userLanguages.map((lang, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[var(--primary-5)] text-[var(--primary-hover)] rounded-md text-xs font-semibold border border-[var(--primary-3)] whitespace-nowrap">
                            {lang}
                          </span>
                        ))}
                        {Array(profileUser.languages).length > 4 ? "More..." : ""}
                      </div>
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
            <div className="hidden absolute inset-0 z-10 lg:flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg text-[var(--neutral-2)] mb-3">
                <Lock size={32} />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - TRIPS */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="flex items-center justify-between mb-6">
            {isLoggedIn && <div>
              <h2 className="text-2xl font-bold text-[var(--secondary-1)]">Trips</h2>
              <p className="text-sm text-[var(--neutral-1)]">Upcoming and past adventures</p>
            </div>}
            {isOwner && isLoggedIn && (
              <button
                onClick={() => triggerLogin(() => redirectToUrl(ROUTES.CREATE_TRIP))}
                className="flex items-center gap-2 bg-[var(--primary-1)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-xl font-medium shadow-md shadow-[var(--primary-background)] transition-all text-sm"
              >
                <Plus size={16} /> Plan New Trip
              </button>
            )}
          </div>

          {!isLoggedIn ? (
            <div className="relative">
              <div className="lg:grid hidden grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 filter blur-md select-none pointer-events-none opacity-60">
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
              {/* {isOwner && (
                <div onClick={() => router.push('/create/trip')} className="sm:hidden flex items-center justify-center p-6 border-2 border-dashed border-[var(--primary-2)] bg-[var(--primary-5)] rounded-2xl text-[var(--primary-hover)] font-medium cursor-pointer aspect-[4/2]">
                  <Plus size={20} className="mr-2" /> Plan a New Trip
                </div>
              )} */}
              {displayTrips.length > 0 ? displayTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} isOwner={isOwner} onClick={() => router.push(`/userTrip/${encodeURIComponent(trip.id || '')}/details?locationId=${encodeURIComponent(trip.locationId || '')}`)} />
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