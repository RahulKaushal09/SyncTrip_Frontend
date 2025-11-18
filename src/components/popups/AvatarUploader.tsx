"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./AvatarUploader.module.css";

interface AvatarUploaderProps {
  value?: File | null;                    // current file (optional)
  existingImageUrl?: string | null;       // e.g. user.profile_picture?.[0]
  onChange: (file: File | null) => void;  // called when user selects/clears
  size?: number;                          // diameter in px
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Create preview from incoming file value
  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  // If no file but existingImageUrl provided, show that
  useEffect(() => {
    if (!value && existingImageUrl) {
      setPreviewUrl(existingImageUrl);
    }
  }, [existingImageUrl, value]);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    onChange(file);
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    handleFiles(e.target.files);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const clear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange(null);
    setPreviewUrl(null);
  };

  return (
    <div className={styles["uploader-root"]}>
      <div
        className={`${styles["avatar-wrap"]} ${isDragging ? styles["dragging"] : ""}`}
        style={{ width: size, height: size }}
        onClick={openFilePicker}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openFilePicker();
          if ((e.key === "Backspace" || e.key === "Delete") && !required) clear();
        }}
        aria-label="Upload profile picture"
        aria-required={required}
      >
        <div className={styles["avatar-inner"]}>
          {previewUrl ? (
            // preview image
            <img src={previewUrl} alt="Profile preview" className={styles["avatar-img"]} />
          ) : (
            // placeholder SVG (person icon)
            <svg className={styles["avatar-icon"]} viewBox="0 0 24 24" aria-hidden focusable="false">
              <circle cx="12" cy="8" r="3.2" fill="none" stroke="var(--icon-color,#09a8ff)" strokeWidth="1.2"/>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="var(--icon-color,#09a8ff)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          )}
        </div>

        {/* dashed outer ring */}
        <span className={styles["outer-ring"]} />

        {/* add badge */}
        <button
          type="button"
          className={styles["add-badge"]}
          onClick={(e) => {
            e.stopPropagation();
            openFilePicker();
          }}
          aria-label="Add or change profile picture"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* hidden file input (accept camera on mobile) */}
        <input
          id={id}
          ref={inputRef}
          className={styles["hidden-input"]}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onInputChange}
          aria-hidden="true"
        />

        {/* clear / remove (only show if preview present and not required) */}
        {!required && previewUrl && (
          <button
            type="button"
            className={styles["remove-btn"]}
            onClick={(e) => {
              e.stopPropagation();
              clear(e);
            }}
            aria-label="Remove profile picture"
            title="Remove"
          >
            ✕
          </button>
        )}
      </div>

      <div className={styles["uploader-meta"]}>
        <div className={styles["uploader-title"]}>Upload photo</div>
        <div className={styles["uploader-sub"]}>Square image • max 5MB</div>
      </div>
    </div>
  );
}
