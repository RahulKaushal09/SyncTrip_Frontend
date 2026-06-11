"use client";

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import app_image_1 from '@/assets/images/download-popup/app_image_1.png';
import app_image_2 from '@/assets/images/download-popup/app_image_2.png';
import app_image_3 from '@/assets/images/download-popup/app_image_3.png';
import app_image_4 from '@/assets/images/download-popup/app_image_4.png';
import app_image_5 from '@/assets/images/download-popup/app_image_5.png';
import app_image_6 from '@/assets/images/download-popup/app_image_6.png';
import app_image_7 from '@/assets/images/download-popup/app_image_7.png';
import { redirectToStore } from '@/utils/redirectToStore';

const APP_IMAGES = [
    app_image_1.src,
    app_image_2.src,
    app_image_3.src,
    app_image_4.src,
    app_image_5.src,
    app_image_6.src,
    app_image_7.src
];

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const DownloadAppModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Prevent background scrolling and handle 'Escape' key
    useEffect(() => {
        if (!isOpen) return;

        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalStyle;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Carousel Auto-play logic
    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % APP_IMAGES.length);
        }, 3000); // Changes image every 3 seconds

        return () => clearInterval(timer);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px',
                animation: 'modalFadeIn 0.2s ease-out forwards',
            }}
        >
            {/* Injecting CSS for Animations and Hover states */}
            <style>
                {`
                    @keyframes modalFadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes modalScaleUp {
                        from { opacity: 0; transform: scale(0.95) translateY(10px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                    .app-btn-primary:hover { background: #27272a !important; transform: translateY(-1px); }
                    .app-btn-primary:active { transform: translateY(1px) scale(0.98); }
                    .app-close-btn:hover { background: #e4e4e7 !important; color: #09090b !important; }
                    .app-btn-secondary:hover { color: #09090b !important; background: #f4f4f5 !important; }
                `}
            </style>

            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    background: '#ffffff',
                    borderRadius: '24px',
                    padding: '32px 24px 24px',
                    width: '100%', maxWidth: '380px',
                    textAlign: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    animation: 'modalScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="app-close-btn"
                    aria-label="Close dialog"
                    style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: '#f4f4f5', border: 'none', borderRadius: '50%',
                        width: '32px', height: '32px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#71717a', transition: 'all 0.2s ease',
                        zIndex: 10
                    }}
                >
                    <X size={18} strokeWidth={2.5} />
                </button>

                <h2 id="modal-title" style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px', color: '#09090b', letterSpacing: '-0.02em' }}>
                    Only Available on Mobile
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#52525b', margin: '0 0 20px', lineHeight: 1.5 }}>
                    Sign up, join plans, and connect with your crew - all in the app.
                </p>

                {/* ── CAROUSEL SECTION ── */}
                <div style={{
                    width: '100%',
                    aspectRatio: '4 / 5', // Automatically sizes height to be 5 when width is 4
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '24px',
                    background: '#e4e4e7' // Fallback skeleton color
                }}>
                    <div style={{
                        display: 'flex',
                        height: '100%',
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: `translateX(-${currentSlide * 100}%)`
                    }}>
                        {APP_IMAGES.map((imgSrc, index) => (
                            <img
                                key={index}
                                src={imgSrc}
                                alt={`App Preview ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover', // Edge-to-edge
                                    flexShrink: 0
                                }}
                            />
                        ))}
                    </div>

                    {/* Gradient Overlay to ensure dots are readable against light photos */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: '40px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)',
                        pointerEvents: 'none'
                    }} />

                    {/* Carousel Dots */}
                    <div style={{
                        position: 'absolute', bottom: '12px', left: 0, right: 0,
                        display: 'flex', justifyContent: 'center', gap: '6px'
                    }}>
                        {APP_IMAGES.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                style={{
                                    width: '8px', height: '8px', padding: 0,
                                    borderRadius: '50%', border: 'none', cursor: 'pointer',
                                    background: currentSlide === index ? '#ffffff' : 'rgba(255,255,255,0.4)', // Switched to white dots for contrast over image
                                    transition: 'background-color 0.3s ease'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                        onClick={redirectToStore}
                        className="app-btn-primary"
                        style={{
                            background: 'black', border: 'none',
                            fontSize: '0.875rem', fontWeight: 600,
                            color: '#fff', cursor: 'pointer',
                            padding: '14px', borderRadius: '14px', fontFamily: 'inherit',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Download Now
                    </button>
                    <button
                        onClick={onClose}
                        className="app-btn-secondary"
                        style={{
                            background: 'transparent', border: 'none',
                            fontSize: '0.875rem', fontWeight: 500,
                            color: '#71717a', cursor: 'pointer',
                            padding: '12px', borderRadius: '12px', fontFamily: 'inherit',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
};