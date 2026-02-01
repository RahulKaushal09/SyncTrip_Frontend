"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./AvatarUploader.module.css";
import toast from "react-hot-toast";
import { Pencil, Camera, Check, X as CloseIcon } from "lucide-react";
import { ImageCropper } from "../Profile/ImageCropper";

interface AvatarUploaderProps {
  value?: File | null;
  existingImageUrl?: string | null;
  onChange: (file: File | null) => void;
  size?: number;
  required?: boolean;
  id?: string;
}

export default function AvatarUploader({
  value = null,
  existingImageUrl = null,
  onChange,
  size = 110,
  required = false,
  id = "avatar-uploader",
}: AvatarUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Cropping States
  const [isCropping, setIsCropping] = useState(false);
  
  // This always holds the high-res, original source
  const [originalFileSource, setOriginalFileSource] = useState<string | null>(null);
  
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotateLevel, setRotateLevel] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastObjectUrlRef = useRef<string | null>(null);

  const revokeLastObjectUrl = () => {
    if (lastObjectUrlRef.current) {
      try {
        URL.revokeObjectURL(lastObjectUrlRef.current);
      } catch (err) { }
      lastObjectUrlRef.current = null;
    }
  };

  useEffect(() => {
    if (value instanceof File) {
      revokeLastObjectUrl();
      const url = URL.createObjectURL(value);
      lastObjectUrlRef.current = url;
      setPreviewUrl(url);
      return () => revokeLastObjectUrl();
    }
    if (!value && !existingImageUrl) {
      revokeLastObjectUrl();
      setPreviewUrl(null);
      setOriginalFileSource(null);
    }
    if (!value && existingImageUrl) {
      revokeLastObjectUrl();
      setPreviewUrl(existingImageUrl);
      // Also treat the existing image as the "original" source for editing
      setOriginalFileSource(existingImageUrl);
    }
  }, [value, existingImageUrl]);

  const openFilePicker = () => inputRef.current?.click();

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should not exceed 5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Store the RAW file here
      setOriginalFileSource(result);
      // Reset zoom/rotate for a new file
      setZoomLevel(1);
      setRotateLevel(0);
      setIsCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropFinished = async (blob: Blob, zoom: number, rotate: number) => {
    const file = new File([blob], "profile_photo.jpg", { type: "image/jpeg" });

    revokeLastObjectUrl();
    const url = URL.createObjectURL(file);
    lastObjectUrlRef.current = url;

    setPreviewUrl(url);
    setZoomLevel(zoom);
    setRotateLevel(rotate);
    setIsCropping(false);

    onChange(file);
  };

  const clear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    revokeLastObjectUrl();
    setPreviewUrl(null);
    setOriginalFileSource(null);
    if (inputRef.current) inputRef.current.value = "";
    onChange(null);
  };

  return (
    <div className={styles["uploader-root"]}>
      {isCropping && originalFileSource && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <ImageCropper
              presetRotation={rotateLevel}
              presetZoom={zoomLevel}
              image={originalFileSource} // Pass the RAW original, not the preview
              onCancel={() => setIsCropping(false)}
              onCropComplete={onCropFinished}
            />
          </div>
        </div>
      )}

      <div
        className={`${styles["avatar-wrap"]} ${isDragging ? styles["dragging"] : ""}`}
        style={{ width: size, height: size }}
        onClick={openFilePicker}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        role="button"
        tabIndex={0}
      >
        <div className={styles["avatar-inner"]}>
          {previewUrl ? (
            <img src={previewUrl} alt="Profile preview" className={styles["avatar-img"]} />
          ) : (
            <svg className={styles["avatar-icon"]} viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="3.2" fill="none" stroke="var(--icon-color,#09a8ff)" strokeWidth="1.2" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="var(--icon-color,#09a8ff)" strokeWidth="1.2" />
            </svg>
          )}
        </div>

        <span className={styles["outer-ring"]} />

        <button type="button" className={styles["add-badge"]} onClick={(e) => { e.stopPropagation(); openFilePicker(); }}>
          <Camera size={14} color="#fff" />
        </button>

        <input
          id={id}
          ref={inputRef}
          className={styles["hidden-input"]}
          type="file"
          accept="image/*"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />

        {!required && previewUrl && (
          <button type="button" className={styles["remove-btn"]} onClick={clear}>
            <CloseIcon size={12} />
          </button>
        )}
      </div>

      <div className={styles["uploader-meta"]}>
        <div className={styles["uploader-title"]}>Upload photo</div>
        <div className={styles["uploader-sub"]}>Image • max 5MB</div>

        {previewUrl && originalFileSource && (
          <button
            type="button"
            className={styles["edit-image"]}
            onClick={(e) => {
              e.preventDefault();
              // Re-open with the ORIGINAL file source
              setIsCropping(true);
            }}
          >
            <Pencil size={12} />
            Edit
          </button>
        )}
      </div>
    </div>
  );
}