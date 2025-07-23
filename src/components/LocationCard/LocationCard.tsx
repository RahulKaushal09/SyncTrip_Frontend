import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'next/image';
import '../../../styles/LocationCard.css';
import HeartIcon from '../smallComponents/HeartIcon';
import { useRouter } from 'next/navigation';

interface LocationCardProps {
    name?: string;
    rating?: string;
    places?: number;
    bestTime?: string;
    images?: string[];
    // onClickFunction?: () => void;
    Highlights?: string;
    inlineStyle?: React.CSSProperties;
    imageInlineStyle?: React.CSSProperties;
    placeConnectedwithid?: string;
    cardId?: string;
    isWishlisted?: boolean;
    typeOfWhishlistCardEnum: string;
    whishlistParentId?: string;
    whishlistParentType?: string;
    isLoading?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({
    name = '',
    rating,
    places,
    bestTime,
    images = [],
    // onClickFunction,
    Highlights,
    inlineStyle,
    imageInlineStyle,
    placeConnectedwithid,
    cardId,
    isWishlisted = false,
    typeOfWhishlistCardEnum,
    whishlistParentId,
    whishlistParentType,
    isLoading = false,
}) => {
    const locationLink = `/location/` + (placeConnectedwithid ? `${placeConnectedwithid}` : `${cardId}`);
    const router = useRouter();

    // Clean name for better SEO
    const cleanName = name.replace(/[0-9.]/g, '').trim();
    const imageAlt = `Visit ${cleanName} - Top destination for travel and adventure`;

    // Parse rating for structured data
    const numericRating =
        typeof rating === 'string' && rating !== 'N/A'
            ? parseFloat(rating.split('/')[0].trim())
            : null;

    if (isLoading) {
        return (
            <article className="location-card" style={inlineStyle} aria-label="Loading destination">
                <div className="card-image">
                    <div
                        style={{
                            height: '400px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Loading...
                    </div>
                </div>
                <div className="card-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '150px', height: '24px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
                        <div style={{ width: '50px', height: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
                    </div>
                    <div style={{ width: '100px', height: '16px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginTop: '8px' }}></div>
                    <div style={{ width: '120px', height: '16px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginTop: '4px' }}></div>
                </div>
            </article>
        );
    }

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the click from bubbling to the parent location-card
        if (locationLink) {
            router.push(locationLink);
        }
    };

    const cardContent = (
        <div
            className="location-card"
            style={inlineStyle}
            onClick={() => {
                // console.log("location " + locationLink);
                if (locationLink) {
                    router.push(locationLink);
                }
            }}
            itemScope
            itemType="https://schema.org/Place"
            role={locationLink ? undefined : 'button'}
            tabIndex={locationLink ? undefined : 0}
            aria-label={`Explore ${cleanName} - ${places ? `${places} places to visit` : 'Amazing destination'}`}
        >

            <div className="card-image">
                <Carousel
                    interval={null}
                    controls={images.length > 1}
                    indicators={images.length > 1}
                    wrap={true}
                    role="img"
                    aria-label={`Images of ${cleanName}`}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent carousel controls from triggering navigation
                >
                    {images && images.length > 0 ? (
                        images.map((image, index) => (
                            <Carousel.Item key={index} style={{ cursor: 'pointer' }}>
                                <Image
                                    className="d-block"
                                    src={decodeURIComponent(image)}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    alt={index === 0 ? imageAlt : `${cleanName} view ${index + 1}`}
                                    style={{ objectFit: 'cover', ...imageInlineStyle }}
                                    itemProp={index === 0 ? 'image' : undefined}
                                    priority={index === 0} // Replace loading="eager"
                                    decoding="async"
                                    onClick={handleImageClick} // Add click handler for image
                                />
                            </Carousel.Item>
                        ))
                    ) : (
                        <Carousel.Item>
                            <Image
                                className="d-block"
                                src="https://via.placeholder.com/300x200?text=No+Image"
                                alt={`${cleanName} - Image coming soon`}
                                style={{ objectFit: 'cover' }}
                                loading="lazy"
                                    fill
                                decoding="async"
                                    onClick={handleImageClick} // Add click handler for placeholder image
                            />
                        </Carousel.Item>
                    )}
                </Carousel>

                {cardId && (
                    <HeartIcon
                        id={cardId}
                        parentId={whishlistParentId}
                        parentType={whishlistParentType}
                        name={name}
                        type={typeOfWhishlistCardEnum}
                        isWishlisted={isWishlisted}
                    />
                )}
            </div>

            <div className="card-content" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 itemProp="name" className="location-title">
                        {cleanName || 'Unknown Destination'}
                    </h3>
                    {rating && rating !== 'N/A' && (
                        <div className="rating" aria-label={`Rating: ${numericRating} out of 5 stars`}>
                            <span>★ {numericRating}/5</span>
                        </div>
                    )}
                </div>

                {places && (
                    <p className="places-count" itemProp="description">
                        {places} places to visit
                    </p>
                )}

                {bestTime && bestTime !== 'N/A' && (
                    <p className="best-time">
                        <span>Best time: </span>
                        <time>{bestTime}</time>
                    </p>
                )}

                {Highlights && (
                    <p className="highlights" itemProp="description">
                        {Highlights}
                    </p>
                )}
            </div>
            <noscript>
                <img
                    src={decodeURIComponent(images[0])}
                    alt={`Visit ${cleanName}`}
                    itemProp="image"
                    style={{ width: '100%', height: 'auto' }}
                />
            </noscript>
        </div>

    );

    return cardContent;
};

export default LocationCard;