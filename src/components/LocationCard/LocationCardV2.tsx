import React from 'react';
import { useRouter } from 'next/navigation';
import { typeOfLocationCardEnum } from '@/constants';
import { CommonServices } from '@/utils';
import { useLoader } from '@/components/providers/LoaderContext';
import GumletImage from '../common/GumletImage';
import { Star, MapPin } from 'lucide-react';
import "../../../styles/locationCard/locationCardV2.css";

interface LocationCardProps {
    name?: string;
    state?: string;
    rating?: string;
    places?: string;
    bestTime?: string;
    images?: string[];
    Highlights?: string;
    inlineStyle?: React.CSSProperties;
    imageInlineStyle?: React.CSSProperties;
    placeConnectedwithid?: string;
    cardId?: string;
    showWishlistIcon?: boolean;
    isWishlisted?: boolean;
    typeOfWhishlistCardEnum?: string;
    whishlistParentId?: string;
    whishlistParentType?: string;
    isLoading?: boolean;
    typeOfCard?: string;
    country?: string;
}

const LocationCardV2: React.FC<LocationCardProps> = ({
    name = '',
    rating,
    state,
    country,
    places,
    images = [],
    cardId,
    isLoading = false,
    typeOfCard
}) => {
    const router = useRouter();
    const { showLoader } = useLoader();

    let locationLink = `/location/`;

    if (typeOfCard !== typeOfLocationCardEnum.placestovisit) {
        locationLink += CommonServices.generateLocationSlug(cardId as string, name, places as string, 'India');
    }

    const cleanName = name.replace(/[0-9.]/g, '').trim();
    const cleanState = state?.replace(/[0-9.]/g, '').trim();
    const cleanCountry = country?.replace(/[0-9.]/g, '').trim() || 'India';

    const numericRating =
        typeof rating === 'string' && rating !== 'N/A'
            ? parseFloat(rating.split('/')[0].trim())
            : null;

    if (isLoading) {
        return (
            <div className="lc-skeleton">
                <div className="lc-skeleton-content">
                    <div className="lc-skeleton-line-short" />
                    <div className="lc-skeleton-line-long" />
                </div>
            </div>
        );
    }

    const handleCardClick = () => {
        if (locationLink) {
            showLoader();
            router.push(locationLink);
        }
    };

    const displayImage =
        images && images.length > 0
            ? images[0]
            : 'https://via.placeholder.com/300x400?text=No+Image';

    return (
        <article
            onClick={handleCardClick}
            className="lc-card group"
            itemScope
            itemType="https://schema.org/Place"
            role={locationLink ? undefined : 'button'}
            tabIndex={locationLink ? undefined : 0}
        >
            {/* Image Layer */}
            <div className="lc-image-layer">
                <GumletImage
                    src={displayImage}
                    alt={`Visit ${cleanName}`}
                    fill
                    // Updated sizes to match the new responsive CSS widths for optimized loading
                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 33vw, 25vw"
                    containerClassName="h-full"
                    className="lc-image"
                />
            </div>

            {/* Gradient Scrim */}
            <div className="lc-scrim" />

            {/* Content Overlay */}
            <div className="lc-content">
                <div className="lc-meta-row">
                    {numericRating && (
                        <div className="lc-meta-item">
                            <Star size={11} color="#fbbf24" fill="#fbbf24" />
                            <span className="lc-rating-text">{numericRating}</span>
                        </div>
                    )}

                    {numericRating && places && (
                        <span className="lc-dot">·</span>
                    )}

                    {places && (
                        <div className="lc-meta-item">
                            <MapPin size={11} color="rgba(255,255,255,0.7)" strokeWidth={2} />
                            <span className="lc-places-text">{places} places</span>
                        </div>
                    )}
                </div>

                <h3 itemProp="name" className="lc-title" title={cleanName}>
                    {cleanName || 'Unknown Destination'}
                </h3>

                <h5 itemProp="address" className="lc-subtitle" title={`${cleanState ? cleanState + ', ' : ''}${cleanCountry || 'India'}`}>
                    {`${cleanState ? cleanState + ', ' : ''}${cleanCountry || 'India'}`}
                </h5>
            </div>
        </article>
    );
};

export default LocationCardV2;