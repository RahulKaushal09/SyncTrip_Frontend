import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { RotateCw, ZoomIn, Scissors, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCroppedImg } from '@/utils/crop.utils';
import { Area, Point } from "react-easy-crop";

interface ImageCropperProps {
    image: string;
    onCropComplete: (
        blob: Blob,
        zoom: number,
        rotation: number,
        crop: Point
    ) => void;
    onCancel: () => void;
    presetRotation?: number;
    presetZoom?: number;
    presetCrop?: Point;
}


export const ImageCropper = ({
    image,
    onCropComplete,
    onCancel,
    presetRotation = 0,
    presetZoom = 1,
    presetCrop = { x: 0, y: 0 },
}: ImageCropperProps) => {
    const [crop, setCrop] = useState<Point>(presetCrop);
    const [zoom, setZoom] = useState<number>(presetZoom);
    const [rotation, setRotation] = useState<number>(presetRotation);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const handleDone = async () => {
        if (!croppedAreaPixels) return;

        try {
            const blob = await getCroppedImg(image, croppedAreaPixels, rotation);
            onCropComplete(blob, zoom, rotation, crop);
        } catch {
            toast.error("Error cropping image");
        }
    };

    const rotate90 = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const rotateNeg90 = () => {
        setRotation((prev) => (prev - 90) % 360);
    };

    return (
        <div className="flex flex-col h-full bg-white max-h-[90vh]">
            <div className="relative flex-1 bg-[#1a1a1a] min-h-[380px]">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={9 / 16}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                    onZoomChange={setZoom}
                    showGrid
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="w-[48%] aspect-square border-2 border-white rounded-full shadow-2xl"></div>
                </div>
                <button
                    onClick={rotateNeg90}
                    className="absolute bottom-4 left-4 z-10 p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all active:scale-90 shadow-2xl"
                    title="Rotate 90°"
                >
                    <RotateCcw size={22} strokeWidth={2.5} />
                </button>

                <button
                    onClick={rotate90}
                    className="absolute bottom-4 right-4 z-10 p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all active:scale-90 shadow-2xl"
                    title="Rotate 90°"
                >
                    <RotateCw size={22} strokeWidth={2.5} />
                </button>
                <button
                    onClick={onCancel}
                    className="absolute px-2 top-4 left-4 py-1.5 text-sm font-semibold text-white hover:bg-neutral-50 rounded-2xl transition-colors hover:!text-black"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDone}
                    className="absolute top-4 right-4 py-1.5 text-[var(--primary-1)] bg-white hover:!bg-[var(--primary-1)] border-[var(--primary-1)] hover:text-white border-[1px] font-bold rounded-2xl px-3 shadow-lg shadow-[var(--primary-2)] flex items-center justify-center gap-2 transition-all"
                >
                    <Scissors size={18} /> Apply Crop
                </button>
            </div>

            <div className="p-6 bg-white space-y-6">

                {/* Zoom Control */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-neutral-400 uppercase flex items-center gap-2">
                            <ZoomIn size={14} /> Zoom Level
                        </label>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-[var(--primary-1)]">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                onClick={() => setZoom(1)}
                                className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-[var(--primary-1)] transition-colors"
                                title="Reset to 1 zoom"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-[var(--primary-1)]"
                    />
                </div>

                {/* Fine Rotation Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-neutral-400 uppercase flex items-center gap-2">
                            <RotateCw size={14} /> Fine Adjustment
                        </label>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-[var(--primary-1)]">
                                {rotation}°
                            </span>
                            <button
                                onClick={() => setRotation(0)}
                                className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-[var(--primary-1)] transition-colors"
                                title="Reset to 0°"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                    <input
                        type="range"
                        value={rotation}
                        min={-180}
                        max={180}
                        step={1}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-[var(--primary-1)]"
                    />
                </div>
            </div>
        </div>
    );
};
