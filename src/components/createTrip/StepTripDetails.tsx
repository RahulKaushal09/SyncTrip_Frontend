"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { ApiService } from '@/utils';

interface StepTripDetailsProps {
    locationName: string | undefined;
    locationId: string | undefined;
    tripName: string;
    setTripName: (name: string) => void;
    tripImage: string | File | null;
    setTripImage: (image: string | File | null) => void;
}

export default function StepTripDetails({
    locationName,
    locationId,
    tripName,
    setTripName,
    tripImage,
    setTripImage,
}: StepTripDetailsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [presetPhotos, setPresetPhotos] = useState<string[]>([]);
    
    // NEW: Added loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Create a preview URL for uploaded files to show them in the UI
    const uploadedPreviewUrl = useMemo(() => {
        if (tripImage instanceof File) {
            return URL.createObjectURL(tripImage);
        }
        return null;
    }, [tripImage]);

    useEffect(() => {
        // Only auto-set if the tripName is currently empty so we don't overwrite user edits
        if (locationName && !tripName) {
            setTripName(locationName);
        }
    }, [locationName, locationId]);

    const getLocationPhotos = async (locationId: string | null) => {
        if (!locationId) return;
        
        setIsLoading(true); // NEW: Start loader
        
        try {
            const res = await ApiService.getBestLocationsForTrip();
            const locationData = res.find((loc: { id: string, photos: string[] }) => loc.id === locationId);
            setPresetPhotos(locationData?.photos || []);
        } catch (error) {
            console.error("Failed to fetch location photos", error);
        } finally {
            setIsLoading(false); // NEW: Stop loader whether it succeeds or fails
        }
    };

    useEffect(() => {
        if (locationId) {
            getLocationPhotos(locationId);
        }
    }, [locationId]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setTripImage(e.target.files[0]);
        }
    };

    // Helper to check if a preset image is currently selected
    const isPresetSelected = (url: string) => tripImage === url;

    // Helper to check if a custom file is currently selected
    const isCustomFileSelected = tripImage instanceof File;

    return (
        <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Give your trip a vibe</h2>

            {/* Trip Name Input */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trip Name
                </label>
                <input
                    type="text"
                    value={tripName || locationName || ''}
                    onChange={(e) => setTripName(e.target.value || '')}
                    placeholder="e.g. Summer in Paris, Weekend Getaway..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-1 focus:border-primary-1 outline-none transition-all"
                />
            </div>

            {/* Trip Image Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose a Cover Image
                </label>

                {/* Grid Layout (Scrollable for 100s of images) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[280px] overflow-y-auto p-1 pr-2 custom-scrollbar">

                    {/* 1. Upload Button (Always First) */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative aspect-video flex flex-col items-center justify-center rounded-xl cursor-pointer border-2 border-dashed transition-all overflow-hidden ${isCustomFileSelected
                                ? 'border-primary-1 ring-4 ring-primary-1/20'
                                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                            }`}
                    >
                        {isCustomFileSelected && uploadedPreviewUrl ? (
                            <>
                                <img src={uploadedPreviewUrl} alt="Uploaded preview" className="object-cover w-full h-full" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <CheckCircle2 className="text-white w-10 h-10 drop-shadow-md" />
                                </div>
                                {/* Change photo banner */}
                                <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-center">
                                    <span className="text-xs text-white font-medium">Change Photo</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <Upload className="text-gray-400 mb-2 group-hover:text-primary-1 transition-colors" size={28} />
                                <span className="text-sm font-medium text-gray-600">Upload Own</span>
                            </>
                        )}
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                    />

                    {/* 2. Loading State OR Preset Photos */}
                    {isLoading ? (
                        /* NEW: Skeleton loaders while fetching */
                        [1, 2, 3, 4].map((n) => (
                            <div key={n} className="aspect-video rounded-xl bg-gray-200 animate-pulse flex items-center justify-center">
                                <ImageIcon className="text-gray-400 opacity-50 w-8 h-8" />
                            </div>
                        ))
                    ) : (
                        /* Existing Preset Photos */
                        presetPhotos?.map((imgUrl, idx) => {
                            const selected = isPresetSelected(imgUrl);
                            return (
                                <div
                                    key={idx}
                                    onClick={() => setTripImage(imgUrl)}
                                    className={`relative aspect-video rounded-xl cursor-pointer overflow-hidden transition-all duration-200 group ${selected
                                            ? 'ring-4 ring-primary-1 scale-[0.98]'
                                            : 'hover:opacity-90 hover:scale-[1.02]'
                                        }`}
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`Location vibe ${idx}`}
                                        className="object-cover w-full h-full"
                                        loading="lazy"
                                    />

                                    {/* Selected Overlay */}
                                    {selected && (
                                        <div className="absolute inset-0 bg-primary-1/20 flex items-center justify-center animate-in fade-in zoom-in duration-200">
                                            <div className="bg-white rounded-full p-1 shadow-lg">
                                                <CheckCircle2 className="text-primary-1 w-6 h-6" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}