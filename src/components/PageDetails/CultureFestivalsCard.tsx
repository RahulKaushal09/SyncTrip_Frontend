'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { MapPin, Clock } from "lucide-react";

import { Culture, Festival } from '@/types';
import '../../../styles/CultureFestivalsSection.css';
import GumletImage from '../common/GumletImage';

interface CultureFestivalsCardProps {
    data: Culture | Festival;
    type: 'culture' | 'festival';
}

const CultureFestivalsCard: React.FC<CultureFestivalsCardProps> = ({ data, type }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (data.images && data.images.length > 1) {
            const interval = setInterval(() => {
                setIsTransitioning(true);
                setTimeout(() => {
                    setCurrentImageIndex((prev) => (prev === data.images.length - 1 ? 0 : prev + 1));
                    setIsTransitioning(false);
                }, 150);
            }, 4000);

            return () => clearInterval(interval);
        }
    }, [data.images]);

    const handleImageError = () => {
        setCurrentImageIndex(0);
    };

    return (
        <div className="cf-card" role="article" aria-label={`${data.name} ${type}`}>
            <div className="row g-0 h-100">
                <div className="col-lg-4 col-md-5 col-sm-6">
                    <div className="cf-image-container">
                        {data.images && data.images.length > 1 ? (
                            <div className="cf-carousel-wrapper">
                                <div
                                    className="cf-carousel-track"
                                    style={{
                                        transform: `translateX(-${currentImageIndex * 100}%)`,
                                        transition: isTransitioning ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    {data.images.map((image, index) => (
                                        <div key={index} className="cf-carousel-slide">
                                            <GumletImage
                                                src={image.image_url || '/api/placeholder/300/200'}
                                                alt={`${data.name} - Image ${index + 1}`}
                                                className="cf-image"
                                                width={300}
                                                height={150}
                                                quality={75}
                                                loading="lazy"
                                                onError={handleImageError}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="cf-indicators" role="navigation" aria-label="Image carousel controls">
                                    {data.images.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`cf-indicator ${index === currentImageIndex ? 'cf-indicator-active' : ''}`}
                                            onClick={() => {
                                                setIsTransitioning(true);
                                                setTimeout(() => {
                                                    setCurrentImageIndex(index);
                                                    setIsTransitioning(false);
                                                }, 150);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setIsTransitioning(true);
                                                    setTimeout(() => {
                                                        setCurrentImageIndex(index);
                                                        setIsTransitioning(false);
                                                    }, 150);
                                                }
                                            }}
                                            role="button"
                                            aria-label={`Go to image ${index + 1}`}
                                            tabIndex={0}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <GumletImage
                                src={data.images?.[0]?.image_url || '/api/placeholder/300/200'}
                                alt={data.name}
                                className="cf-image cf-single-image"
                                width={300}
                                height={150}
                                quality={75}
                                loading="lazy"
                                onError={handleImageError}
                            />
                        )}
                        <div className="cf-badge-container">
                            <span className={`cf-badge ${type === 'culture' ? 'cf-badge-culture' : 'cf-badge-festival'}`}>
                                {type === 'culture' ? 'Culture' : 'Festival'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8 col-md-7 col-sm-6">
                    <div className="cf-content">
                        <div className="cf-header">
                            <h3 className="cf-title">{data.name}</h3>
                            <p className="cf-description">{data.description}</p>
                        </div>
                        <div className="cf-details">
                            <div className="cf-detail-item">
                                <MapPin size={18} className="cf-icon cf-icon-location" aria-hidden="true" />
                                <span className="cf-detail-text">{data.village || 'Unknown'}</span>
                            </div>
                            <div className="cf-detail-item">
                                <Clock size={18} className="cf-icon cf-icon-time" aria-hidden="true" />
                                <span className="cf-detail-text">{data.timings || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CultureFestivalsCard;