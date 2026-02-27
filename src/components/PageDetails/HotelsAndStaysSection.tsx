'use client';

import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { WishlistTypeEnum } from '@/constants';
import { Hotel } from '@/types'; // Assuming you have a Hotel type defined
import HeartIcon from '../smallComponents/HeartIcon'; // Adjusted import path
import '../../../styles/HotelSection.css'; // Import CSS (create this file separately)
import Image from 'next/image';
import debounce from 'lodash/debounce';
import { UserApiService } from '@/utils/user.api.utils';
import GumletImage from '../common/GumletImage';
// Define props for HotelImageCarousel
interface HotelImageCarouselProps {
    images: string[];
    locationName: string;
}

export const HotelImageCarousel: React.FC<HotelImageCarouselProps> = ({
    images,
    locationName,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

    // Filter images that have NOT failed
    const validImages = (images || []).filter(
        (img) => img && !failedImages.has(img)
    );

    const handleImageError = () => {
        const failedUrl = validImages[currentIndex];
        if (!failedUrl) return;

        setFailedImages((prev) => {
            const next = new Set(prev);
            next.add(failedUrl);
            return next;
        });

        // Move to next image safely
        setCurrentIndex((prev) => {
            if (prev + 1 < validImages.length) return prev + 1;
            return 0;
        });
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) =>
            prev + 1 < validImages.length ? prev + 1 : 0
        );
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) =>
            prev === 0 ? validImages.length - 1 : prev - 1
        );
    };

    // ✅ No images left
    if (validImages.length === 0) {
        return (
            <div className="carousel no-image" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="no-image-placeholder">
                    No image found
                </div>
            </div>
        );
    }

    return (
        <div className="carousel" style={{ position: 'relative', width: '100%', height: "auto" }}>
            <GumletImage
                key={validImages[currentIndex]} // 🔥 forces clean re-render
                src={validImages[currentIndex]}
                alt={locationName}
                width={400}
                height={300}
                className="hotel-image"
                loading="lazy"
                onError={handleImageError}
            />
            {validImages.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '5px',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            cursor: 'pointer',
                            width: '10%',
                            height: '100%',
                        }}
                    >
                        ❮
                    </button>
                    <button
                        onClick={nextImage}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: '5px',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            cursor: 'pointer',
                            width: '10%',
                            height: '100%',
                        }}
                    >
                        ❯
                    </button>
                </>
            )}
            <div className="coursel-dots-custom">
                {validImages.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            height: '10px',
                            width: '10px',
                            backgroundColor: currentIndex === index ? '#333' : '#ccc',
                            borderRadius: '50%',
                            display: 'inline-block',
                            margin: '0 5px',
                            cursor: 'pointer',
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// Define props for HotelCard
interface HotelCardProps {
    hotel: Hotel;
    locationName: string;
    parentId: string;
    parentType: string;
    typeOfWhishlistCardEnum: string;
    cardId: string;
}

const HotelCard: React.FC<HotelCardProps> = ({
    hotel,
    locationName,
    parentId,
    parentType,
    typeOfWhishlistCardEnum,
    cardId,
}) => {
    const processHotelName = (name: string): string => {
        if (!name) return '';

        if (name.length > 40) {
            // If name contains spaces
            if (name.includes(' ')) {
                const words = name.split(' ');
                // If there are at least 4 words, join first 4
                if (words.length >= 4) {
                    return words.slice(0, 4).join(' ') + '...';
                } else {
                    // If less than 40 words, just trim the original to 40 chars
                    return name.slice(0, 40) + '...';
                }
            } else {
                // Single long word
                return name.slice(0, 40) + '...';
            }
        }

        return name; // If length <= 40, return as is
    };
    return (
        <div
            className="hotel-card"
            onClick={() => {
                const link = hotel?.hotel_link;
                if (link && !link.includes('https://www.holidify.com/')) {
                    window.location.href = link;
                } else {
                    toast.error('This hotel is not available for booking at the moment. Please try again later.');
                }
            }}
            style={{ cursor: 'pointer' }}
        >
            <div className="top-rated">Top Rated</div>
            <HeartIcon
                id={cardId}
                isWishlisted={hotel.isWishlisted as boolean}
                parentId={parentId}
                parentType={parentType}
                name={hotel.hotel_name}
                type={typeOfWhishlistCardEnum}
            />
            <HotelImageCarousel images={hotel.hotel_images} locationName={locationName} />
            <div className="card-content-hotel" style={{ position: hotel.hotel_images.length == 0 ? "absolute" : "relative", bottom: hotel.hotel_images.length == 0 ? "0" : "" }}>
                <div className="rating-hotel">
                    <span className="stars">★</span> <strong>{hotel.hotel_location.rating.score}</strong>{' '}
                    {hotel.hotel_location.rating.review_count
                        ? `(${hotel.hotel_location.rating.review_count})`
                        : '(84 reviews)'}
                </div>
                <h3>{processHotelName(hotel.hotel_name.replace(/[0-9.]/g, ''))}</h3>
                <p>{hotel.hotel_location.neighbourhood}</p>
            </div>
        </div>
    );
};

// Define props for HotelsAndStaysSection
interface HotelsAndStaysSectionProps {
    hotelIds: string[];
    locationName: string;
    parentId: string;
    parentType: string;
    HotelIdsWishListed?: string[];
}

const HotelsAndStaysSection: React.FC<HotelsAndStaysSectionProps> = ({
    hotelIds,
    locationName,
    parentId,
    parentType,
    HotelIdsWishListed = [],
}) => {

    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [activeHotelShow, setActiveHotelShow] = useState(6);
    const [previousShowMore, setPreviousShowMore] = useState(6);
    const [loading, setLoading] = useState(true); // Add loading state
    const handleLoadMore = useCallback(
        debounce(() => {
            setActiveHotelShow((prev) => prev + 6);
            setPreviousShowMore((prev) => prev + 6);
            if (previousShowMore + 6 >= hotels.length) {
                setActiveHotelShow(hotels.length);
                setPreviousShowMore(hotels.length);
            }
        }, 300),
        [hotels.length, previousShowMore]
    );
    useEffect(() => {
        const fetchHotels = async () => {
            if (!hotelIds || hotelIds.length === 0) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true); // Set loading true before fetching
                const userToken = localStorage.getItem('userToken');
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/hotels/getHotelsByIds`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: userToken ? `Bearer ${userToken}` : '',
                    },
                    body: JSON.stringify({ hotelIds }),
                });

                if (!response.ok) throw new Error('Failed to fetch hotels');
                const data: Hotel[] = await response.json();
                let updatedHotels: Hotel[] = [];
                if (HotelIdsWishListed && HotelIdsWishListed.length > 0) {
                    console.log('HotelIdsWishListed:', HotelIdsWishListed);
                    updatedHotels = data.map((hotel) => ({
                        ...hotel,
                        isWishlisted: HotelIdsWishListed.includes(hotel.id),
                    }));
                }
                else {
                    const hotelsWhistlisted = await UserApiService.fetchUserWishlist(WishlistTypeEnum.hotel);
                    updatedHotels = data.map((hotel) => ({
                        ...hotel,
                        isWishlisted: hotelsWhistlisted.some((wish) => wish.refId === hotel.id),
                    }));
                }
                setHotels(updatedHotels);
            } catch (err) {
                console.error((err as Error).message);
                toast.error('Failed to load hotels. Please try again.');
            } finally {
                setLoading(false); // Set loading false after fetch completes
            }
        };

        fetchHotels();
    }, [hotelIds]);

    if (loading) {
        return (
            <div className="hotels-container">
                <h2 className="DescriptionHeading">
                    <strong>Hotels & Stays {locationName ? `in ${locationName}` : ''}</strong>
                </h2>
                <div className="hotels-grid">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="hotel-card skeleton">
                            <div className="skeleton-image" style={{ height: '200px', background: '#e0e0e0' }} />
                            <div className="card-content-hotel">
                                <div className="skeleton-text" style={{ height: '20px', background: '#e0e0e0', marginBottom: '10px' }} />
                                <div className="skeleton-text" style={{ height: '16px', background: '#e0e0e0' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!hotels || hotels.length === 0) {
        return <div>No hotels available.</div>; // Provide feedback if no hotels
    }

    // Rest of the component remains the same
    return (
        <div className="hotels-container">
            <h2 className="DescriptionHeading">
                <strong>Hotels & Stays {locationName ? `in ${locationName}` : ''}</strong>
            </h2>
            <div className="hotels-grid">
                {hotels.slice(0, activeHotelShow).map((hotel, index) => (
                    <HotelCard
                        key={index}
                        hotel={hotel}
                        locationName={`Top ${index + 1} hotels in ${locationName}`}
                        parentId={parentId}
                        parentType={parentType}
                        typeOfWhishlistCardEnum={WishlistTypeEnum.hotel}
                        cardId={hotel.id}
                    />
                ))}
            </div>
            {hotels.length > 10 && previousShowMore < hotels.length && (
                <button
                    className="view-more-btn mt-4"
                    onClick={handleLoadMore}
                >
                    Load More
                </button>
            )}
        </div>
    );
};

export default HotelsAndStaysSection;