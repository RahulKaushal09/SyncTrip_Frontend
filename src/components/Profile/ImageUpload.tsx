import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImageCropper } from "./ImageCropper";
import { Camera, Check, Edit2, X } from "lucide-react";

export default function ImageUploadModal({
    isOpen, onClose, currentImage, onSave
}: {
    isOpen: boolean; onClose: () => void; currentImage: string | null; onSave: (file: File) => Promise<void>;
}) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [rotateLevel, setRotateLevel] = useState<number>(0);
    const [finalBlob, setFinalBlob] = useState<Blob | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            setCroppedPreview(null);
            setFinalBlob(null);
            setIsCropping(false);
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        // Check max size (5MB)
        if (file && file.size > 5 * 1024 * 1024) {
            toast.error("Image size should not exceed 5 MB");
            return;
        }
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                setSelectedFile(result);
                setCroppedPreview(result); // raw image first
                setFinalBlob(file); // Set original as final until cropped
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFinalSave = async () => {
        // 1. Guard clause: Ensure we actually have image data to save
        if (!finalBlob) {
            toast.error("Please select an image first");
            return;
        }

        try {
            setIsUploading(true);

            // 2. Convert Blob to File
            // We give it a filename and type so the backend Multer handles it correctly
            const file = new File([finalBlob], "profile_photo.jpg", {
                type: "image/jpeg",
                lastModified: Date.now()
            });

            // 3. Trigger the parent's upload function
            // This calls onUpdateProfileImage in your UserProfilePage
            await onSave(file);

            // 4. Success cleanup
            setIsUploading(false);
            onClose();
        } catch (error) {
            console.error("Save Error:", error);
            setIsUploading(false);
            // Note: Parent onSave usually handles the toast, 
            // but we catch here to stop the loading state.
        }
    };

    const onCropFinished = async (blob: Blob, zoom: number, rotate: number) => {
        const previewUrl = URL.createObjectURL(blob);
        setCroppedPreview(previewUrl);
        setZoomLevel(zoom);
        setRotateLevel(rotate);
        setFinalBlob(blob);
        setIsCropping(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[var(--secondary-1)]/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">

                {isCropping && selectedFile ? (
                    <ImageCropper
                        presetRotation={rotateLevel}
                        presetZoom={zoomLevel}
                        image={selectedFile}
                        onCancel={() => setIsCropping(false)}
                        onCropComplete={onCropFinished}
                    />
                ) : (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[var(--secondary-1)]">
                                {selectedFile ? "Adjust Photo" : "Update Profile Picture"}
                            </h3>
                            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center gap-6">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[var(--primary-5)] shadow-inner bg-neutral-100 relative">
                                    <img
                                        src={croppedPreview || currentImage || '/default-avatar.png'}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={32} className="text-white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-[var(--primary-1)] text-white p-2.5 rounded-full shadow-lg border-2 border-white">
                                    <Camera size={18} />
                                </div>
                            </div>

                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

                            <div className="w-full space-y-3">
                                {/* Logic: If a file is selected, show "Crop" and "Change" options */}
                                {selectedFile && (
                                    <div className="flex w-full items-center justify-center">
                                        <button
                                            onClick={() => setIsCropping(true)}
                                            className="py-1 px-3 bg-[var(--primary-5)] text-[var(--primary-hover)] font-semibold rounded-full border-2 border-[var(--primary-3)] hover:bg-[var(--primary-4)] transition-all flex items-center justify-center gap-2"
                                        >
                                            <Edit2 size={14} /> Edit Image
                                        </button>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4 border-t border-neutral-100">
                                    <button onClick={onClose} className="flex-1 py-2 text-neutral-500 font-medium hover:bg-neutral-50 border rounded-xl">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleFinalSave}
                                        disabled={!selectedFile || isUploading}
                                        className={`flex-1 py-2 bg-[var(--primary-1)] text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${(!selectedFile || isUploading) && 'opacity-50 cursor-not-allowed'}`}
                                    >
                                        {isUploading ? "Uploading..." : <><Check size={20} /> Save Photo</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};