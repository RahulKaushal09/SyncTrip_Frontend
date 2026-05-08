"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Camera,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    ShieldCheck,
    ScanFace,
} from "lucide-react";
import { UserApiService } from "@/utils/user.api.utils";

interface Props {
    token: string;
    userName: string | null;
    invalidToken?: boolean;
}

export default function FaceVerificationClient({ token, userName, invalidToken = false }: Props) {

    const [repeatInstruction, setRepeatInstruction] = useState<string>(
        "Make sure your face is clearly visible and well-lit."
    );
    const [errorMsg, setErrorMsg] = useState<string>(
        invalidToken ? "Invalid or expired verification link." : ""
    );
    const [status, setStatus] = useState<"idle" | "camera_active" | "captured" | "verifying" | "success">("idle");
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [cameraReady, setCameraReady] = useState(false);

    const instructions = [
        "Position your face within the oval guide.",
        "Make sure you're in a well-lit area.",
        "Remove glasses or hats if possible.",
        "Look directly at the camera.",
        "Make sure you are alone in the frame.",
    ];

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % instructions.length;
            setRepeatInstruction(instructions[index]);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Cleanup camera on unmount
    useEffect(() => {
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        if (invalidToken) return;
        setErrorMsg("");
        setCameraReady(false);
        stopCamera();

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.srcObject = stream;

                await new Promise<void>((resolve) => {
                    const video = videoRef.current!;
                    if (video.readyState >= 2) {
                        resolve();
                        return;
                    }
                    video.onloadedmetadata = () => resolve();
                    setTimeout(resolve, 3000);
                });

                await videoRef.current.play();
                setCameraReady(true);
            }

            setStatus("camera_active");
        } catch (err: any) {
            console.error("Camera error:", err);
            if (
                err?.name === "NotAllowedError" ||
                err?.name === "PermissionDeniedError"
            ) {
                setErrorMsg(
                    "Camera permission denied. Please allow camera access in your browser settings."
                );
            } else if (err?.name === "NotFoundError") {
                setErrorMsg("No camera found on this device.");
            } else if (err?.name === "NotReadableError") {
                setErrorMsg(
                    "Camera is in use by another app. Please close it and try again."
                );
            } else {
                setErrorMsg("Could not access camera. Please try again.");
            }
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraReady(false);
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL("image/jpeg", 0.9);
            setCapturedImage(imageData);
            setStatus("captured");
            stopCamera();
        }
    };

    const retakeImage = () => {
        setCapturedImage(null);
        setErrorMsg("");
        startCamera();
    };

    const verifyFace = async () => {
        if (!capturedImage || !token) return;
        setStatus("verifying");
        setErrorMsg("");
        try {
            const res = await fetch(capturedImage);
            const blob = await res.blob();
            const selfieFile = new File([blob], "selfie.jpg", { type: "image/jpeg" });
            const result = await UserApiService.verifyUserSelfie(selfieFile, token);
            if (!result.success) {
                setErrorMsg(result.message || "Face verification failed. Please try again.");
                setStatus("captured");
                return;
            }
            setStatus("success");

            // ✅ Auto-redirect after short delay so user sees the success screen
            setTimeout(() => {
                window.location.href = "https://synctrip.in/profile/verify-return";
            }, 1500);

        } catch (err) {
            console.error("verifyFace error:", err);
            setErrorMsg("Something went wrong. Please try again.");
            setStatus("captured");
        }
    };

    const handleRedirect = () => {
        window.location.href = "https://synctrip.in/profile/verify-return";
    };

    return (
        <>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; }

                .vf-page {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                    padding-top: 80px;
                }

                .vf-card {
                    background: var(--white, #fff);
                    border-radius: 20px;
                    border: 1px solid var(--neutral-4, #e2e4e9);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.07);
                    width: 100%;
                    max-width: 440px;
                    overflow: hidden;
                }

                .vf-camera-wrap {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 3 / 4;
                    background: #080810;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .vf-video {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transform: scaleX(-1);
                    display: block;
                    background: #080810;
                }

                .vf-captured-img {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .vf-oval {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -54%);
                    width: 60%;
                    aspect-ratio: 3 / 4;
                    border: 2.5px dashed rgba(255,255,255,0.6);
                    border-radius: 50%;
                    pointer-events: none;
                    box-shadow: 0 0 0 9999px rgba(0,0,0,0.38);
                }

                .vf-verifying-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(8,8,20,0.75);
                    backdrop-filter: blur(5px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }

                .vf-scan-line {
                    position: absolute;
                    left: 0; right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, var(--primary-1, #4f6ef7), transparent);
                    animation: vfScan 2s ease-in-out infinite;
                }

                @keyframes vfScan {
                    0%   { top: 8%; opacity: 0; }
                    8%   { opacity: 1; }
                    92%  { opacity: 1; }
                    100% { top: 92%; opacity: 0; }
                }

                .vf-idle-placeholder {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    color: rgba(255,255,255,0.35);
                }

                .vf-camera-loading {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    color: rgba(255,255,255,0.45);
                    font-size: 13px;
                }

                .vf-body {
                    padding: 20px 20px 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }

                .vf-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }

                .vf-title {
                    font-size: 17px;
                    font-weight: 600;
                    color: var(--secondary-1, #16324f);
                    margin: 0 0 4px 0;
                    line-height: 1.3;
                }

                .vf-subtitle {
                    font-size: 13px;
                    color: var(--neutral-2, #666);
                    margin: 0;
                    line-height: 1.5;
                    min-height: 38px;
                }

                .vf-error {
                    background: var(--error-5, #fff0f0);
                    border: 1px solid var(--error-3, #fca5a5);
                    color: var(--error-1, #b91c1c);
                    border-radius: 10px;
                    padding: 11px 13px;
                    font-size: 13px;
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    line-height: 1.45;
                }

                .vf-btn-row {
                    display: flex;
                    gap: 10px;
                }

                .vf-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    padding: 13px 16px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    outline: none;
                    transition: opacity 0.15s, transform 0.1s;
                    min-height: 48px;
                    -webkit-tap-highlight-color: transparent;
                }

                .vf-btn:active:not(:disabled) { transform: scale(0.97); }
                .vf-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

                .vf-btn-primary {
                    background: var(--primary-1, #4f6ef7);
                    color: #fff;
                }

                .vf-btn-outline {
                    background: transparent;
                    color: var(--secondary-1, #16324f);
                    border: 1.5px solid var(--neutral-4, #ddd);
                }

                .vf-success-body {
                    padding: 48px 28px 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .vf-success-icon {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: var(--success-1, #16a34a);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    box-shadow: 0 6px 20px rgba(22,163,74,0.25);
                }

                .vf-spin {
                    animation: vfSpin 1s linear infinite;
                }

                @keyframes vfSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }

                /* Desktop: side-by-side */
                @media (min-width: 640px) {
                    .vf-card:not(.vf-card--success) {
                        max-width: 820px;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                    }

                    .vf-camera-wrap {
                        aspect-ratio: unset;
                        min-height: 500px;
                    }

                    .vf-body {
                        padding: 28px 28px 32px;
                        justify-content: space-between;
                    }
                }
            `}</style>

            <div className="vf-page">
                <div className={`vf-card${status === "success" ? " vf-card--success" : ""}`}>

                    {status === "success" ? (
                        <div className="vf-success-body">
                            <div className="vf-success-icon">
                                <CheckCircle2 size={36} color="#fff" />
                            </div>
                            <h2
                                className="vf-title"
                                style={{ fontSize: 20, marginBottom: 10 }}
                            >
                                Verification Complete
                            </h2>
                            <p
                                className="vf-subtitle"
                                style={{ marginBottom: 28, minHeight: "auto" }}
                            >
                                Your identity has been authenticated and securely linked to
                                your profile.
                            </p>
                            <button
                                className="vf-btn vf-btn-primary"
                                style={{ width: "100%" }}
                                onClick={handleRedirect}
                            >
                                <ShieldCheck size={18} />
                                Return to App
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* ── Camera panel ── */}
                            <div className="vf-camera-wrap">

                                {/* Idle or invalid token placeholder */}
                                {status === "idle" && (
                                    <div className="vf-idle-placeholder">
                                        <ScanFace size={52} />
                                        <span style={{ fontSize: 13 }}>
                                            {invalidToken ? "Verification unavailable" : "Camera inactive"}
                                        </span>
                                    </div>
                                )}

                                {/* Loading spinner shown while stream connects */}
                                {status === "camera_active" && !cameraReady && (
                                    <div className="vf-camera-loading">
                                        <RefreshCw size={24} className="vf-spin" />
                                        <span>Starting camera…</span>
                                    </div>
                                )}

                                {/* Video always mounted when camera_active so the ref is valid */}
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="vf-video"
                                    style={{
                                        display: status === "camera_active" ? "block" : "none",
                                    }}
                                />

                                {status === "camera_active" && cameraReady && (
                                    <div className="vf-oval" />
                                )}

                                {(status === "captured" || status === "verifying") &&
                                    capturedImage && (
                                        <img
                                            src={capturedImage}
                                            alt="Captured selfie"
                                            className="vf-captured-img"
                                        />
                                    )}

                                {status === "verifying" && (
                                    <div className="vf-verifying-overlay">
                                        <div className="vf-scan-line" />
                                        <RefreshCw size={28} color="#fff" className="vf-spin" />
                                        <span
                                            style={{
                                                color: "#fff",
                                                fontSize: 14,
                                                fontWeight: 600,
                                            }}
                                        >
                                            Analyzing face…
                                        </span>
                                    </div>
                                )}

                                <canvas ref={canvasRef} style={{ display: "none" }} />
                            </div>

                            {/* ── Info + actions panel ── */}
                            <div className="vf-body">
                                <div className="vf-header">
                                    <ShieldCheck
                                        size={20}
                                        color="var(--primary-1, #4f6ef7)"
                                        style={{ marginTop: 2, flexShrink: 0 }}
                                    />
                                    <div>
                                        <p className="vf-title">
                                            {userName
                                                ? `Hi ${userName.split(" ")[0]}, let's verify you`
                                                : "Identity Verification"}
                                        </p>
                                        <p className="vf-subtitle">{repeatInstruction}</p>
                                    </div>
                                </div>

                                {errorMsg && (
                                    <div className="vf-error">
                                        <AlertCircle
                                            size={15}
                                            style={{ flexShrink: 0, marginTop: 1 }}
                                        />
                                        <span>{errorMsg}</span>
                                    </div>
                                )}

                                <div className="vf-btn-row">
                                    {status === "idle" && (
                                        <button
                                            className="vf-btn vf-btn-primary"
                                            onClick={startCamera}
                                            disabled={invalidToken}
                                        >
                                            <Camera size={17} /> Start Camera
                                        </button>
                                    )}

                                    {status === "camera_active" && (
                                        <button
                                            className="vf-btn vf-btn-primary"
                                            onClick={captureImage}
                                            disabled={!cameraReady}
                                        >
                                            {cameraReady ? "Capture Photo" : "Loading…"}
                                        </button>
                                    )}

                                    {status === "captured" && (
                                        <>
                                            <button
                                                className="vf-btn vf-btn-outline"
                                                onClick={retakeImage}
                                            >
                                                <RefreshCw size={15} /> Retake
                                            </button>
                                            <button
                                                className="vf-btn vf-btn-primary"
                                                onClick={verifyFace}
                                            >
                                                <ShieldCheck size={15} /> Verify
                                            </button>
                                        </>
                                    )}

                                    {status === "verifying" && (
                                        <button className="vf-btn vf-btn-primary" disabled>
                                            <RefreshCw size={15} className="vf-spin" />{" "}
                                            Analyzing…
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}