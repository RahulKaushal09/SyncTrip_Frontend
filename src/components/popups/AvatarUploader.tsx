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

  // Keep track of the last object URL so we can revoke it reliably
  const lastObjectUrlRef = useRef<string | null>(null);

  // Helper: revoke last object URL if any
  const revokeLastObjectUrl = () => {
    if (lastObjectUrlRef.current) {
      try {
        URL.revokeObjectURL(lastObjectUrlRef.current);
      } catch (err) {
        /* ignore revoke errors */
      }
      lastObjectUrlRef.current = null;
    }
  };

  // If parent provides a File `value`, create preview for it.
  // Also if parent clears (value === null) and no local preview, remove preview.
  useEffect(() => {
    // If we have an explicitly provided File from parent, create a preview
    if (value instanceof File) {
      // revoke previous
      revokeLastObjectUrl();
      const url = URL.createObjectURL(value);
      lastObjectUrlRef.current = url;
      setPreviewUrl(url);
      return () => {
        // cleanup when value changes/unmount
        revokeLastObjectUrl();
      };
    }

    // If parent sent null and we are not holding any local preview, clear preview
    if (!value && !existingImageUrl) {
      revokeLastObjectUrl();
      setPreviewUrl(null);
    }

    // If parent cleared value but provided an existingImageUrl (string), use that
    if (!value && existingImageUrl) {
      revokeLastObjectUrl();
      setPreviewUrl(existingImageUrl);
    }

    // Note: intentionally not returning a cleanup that revokes existingImageUrl since that is external URL.
  }, [value, existingImageUrl]);

  // Immediately create preview when user picks a file (don't wait for parent update)
  const createPreviewForFile = (file: File) => {
    revokeLastObjectUrl();
    const url = URL.createObjectURL(file);
    lastObjectUrlRef.current = url;
    setPreviewUrl(url);
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    // set immediate preview for best UX
    createPreviewForFile(file);
    // notify parent
    onChange(file);
    // Do not clear the input value here — leave it so user can change to a different file.
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

  // Clear handler: revoke preview, clear input value, notify parent
  const clear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    revokeLastObjectUrl();
    setPreviewUrl(null);

    // clear native file input so selecting the same file again triggers change event
    if (inputRef.current) {
      try {
        inputRef.current.value = "";
      } catch (err) {
        // some browsers restrict this, ignore
      }
    }

    onChange(null);
  };

  // cleanup when unmounting
  useEffect(() => {
    return () => {
      revokeLastObjectUrl();
    };
  }, []);

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
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Profile preview" className={styles["avatar-img"]} />
          ) : (
            // placeholder SVG (person icon)
            <svg className={styles["avatar-icon"]} viewBox="0 0 24 24" aria-hidden focusable="false">
              <circle cx="12" cy="8" r="3.2" fill="none" stroke="var(--icon-color,#09a8ff)" strokeWidth="1.2"/>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="var(--icon-color,#09a8ff)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          )}
        </div>

        <span className={styles["outer-ring"]} />

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
        <div className={styles["uploader-sub"]}>Image • max 5MB</div>
      </div>
    </div>
  );
}
