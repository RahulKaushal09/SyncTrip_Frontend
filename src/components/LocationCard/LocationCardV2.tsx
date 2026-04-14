import React from 'react';
import { useRouter } from 'next/navigation';
import { typeOfLocationCardEnum } from '@/constants';
import { CommonServices } from '@/utils';
import { useLoader } from '@/components/providers/LoaderContext';
import GumletImage from '../common/GumletImage';
import HeartIcon from '../smallComponents/HeartIcon';
import { Star, MapPin } from 'lucide-react';

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
            <div className="group relative w-[calc((100%-60px)/4)] min-w-[calc((100%-60px)/4)] h-[360px] rounded-2xl overflow-hidden flex-shrink-0 snap-start bg-gray-100 animate-pulse">
                {/* shimmer lines at bottom */}
                <div className="absolute bottom-0 w-full p-5 flex flex-col gap-3">
                    <div className="h-3 w-16 bg-gray-200 rounded-full" />
                    <div className="h-6 w-2/3 bg-gray-200 rounded-lg" />
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
            className="group relative w-[calc((100%-60px)/4)] min-w-[calc((100%-60px)/4)] h-[360px] rounded-2xl overflow-hidden flex-shrink-0 snap-start cursor-pointer"
            itemScope
            itemType="https://schema.org/Place"
            role={locationLink ? undefined : 'button'}
            tabIndex={locationLink ? undefined : 0}
        >
            {/* Image — zooms slightly on hover */}
            <div className="absolute inset-0 z-0">
                <GumletImage
                    src={displayImage}
                    alt={`Visit ${cleanName}`}
                    fill
                    sizes="(max-width: 768px) 260px, 260px"
                    style={{ objectFit: 'cover' }}
                    containerClassName="h-full"
                    className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                />
            </div>

            {/* Gradient scrim — just enough for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 pointer-events-none" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex flex-col gap-2">

                {/* Rating + Places row */}
                <div className="flex items-center gap-2">
                    {numericRating && (
                        <div className="flex items-center gap-1">
                            <Star size={11} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-white/90 text-xs font-semibold">{numericRating}</span>
                        </div>
                    )}
                    {numericRating && places && (
                        <span className="text-white/30 text-xs">·</span>
                    )}
                    {places && (
                        <div className="flex items-center gap-1">
                            <MapPin size={11} className="text-white/60" strokeWidth={2} />
                            <span className="text-white/80 text-xs font-medium">{places} places</span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3
                    itemProp="name"
                    className="text-[22px] font-extrabold text-white m-0"
                >
                    {cleanName || 'Unknown Destination'}
                </h3>
                <h5
                    itemProp="name"
                    className="text-[16px] font-medium text-white leading-tight tracking-tight m-0"
                >
                    {`${cleanState ? cleanState + ', ' : ''}${cleanCountry || 'India'}`}
                </h5>
            </div>
        </article>
    );
};

export default LocationCardV2;