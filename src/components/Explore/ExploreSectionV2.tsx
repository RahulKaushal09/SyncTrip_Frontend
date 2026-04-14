import React, { useEffect, useRef, useState, useCallback } from 'react';
import LocationCardV2 from '../LocationCard/LocationCardV2';
import { ExplorePageData, Location } from '@/types';
import { typeOfLocationCardEnum } from '@/constants';
import { Sparkles, Search } from 'lucide-react';
import LocationCard from '../LocationCard/LocationCard';
import SearchWidget from '../SearchPanel/SearchBarExplore';
import "../../../styles/ExploreSectionV2.css"; // IMPORTANT: Import the CSS

export interface SearchConfig {
    showDestination?: boolean;
    showDates?: boolean;
    showState?: boolean;
    showSearchButton?: boolean;
}

interface ExploreSectionProps {
    locations: Location[];
    isLoading?: boolean;
    isLoadingMore?: boolean;
    hasMoreBtn: boolean;
    handleShowMoreClick?: () => void;
    showMoreButtonToShow: boolean;
    totalCount?: number;
    explorePageData: ExplorePageData | undefined;
    searchConfig?: SearchConfig;
    onSearch?: (query: { term: string; state: string }) => void;
    searchTerm?: { term: string; state: string };
}

// ─── Category Slider with Dots ─────────────────────────────────────────────────
const CategorySlider = ({
    title, subtitle, icon: Icon, data, isLoading
}: {
    title: string; subtitle?: string; icon: React.ElementType; data: Location[]; isLoading: boolean;
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalDots, setTotalDots] = useState(0);

    // Calculate total dots based on data length and how many cards are visible
    const calculateDots = useCallback(() => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const firstChild = container.firstElementChild as HTMLElement;

        if (firstChild) {
            // Include the gap in the width calculation
            const itemWidth = firstChild.offsetWidth + 20; // 20px is roughly the 1.25rem gap
            const visibleItems = Math.max(1, Math.floor(container.offsetWidth / itemWidth));
            // Total dots = total items minus the ones already visible on the screen + 1
            const calculatedDots = Math.max(1, data.length - visibleItems + 1);
            setTotalDots(calculatedDots);
        }
    }, [data.length]);

    useEffect(() => {
        if (!isLoading && data.length > 0) {
            calculateDots();
            window.addEventListener('resize', calculateDots);
            return () => window.removeEventListener('resize', calculateDots);
        }
    }, [isLoading, data.length, calculateDots]);

    // Update active dot on scroll
    const handleScroll = () => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const firstChild = container.firstElementChild as HTMLElement;

        if (firstChild) {
            const itemWidth = firstChild.offsetWidth + 20;
            const newIndex = Math.round(container.scrollLeft / itemWidth);
            setActiveIndex(Math.min(newIndex, totalDots - 1));
        }
    };

    // Click dot to scroll to card
    const scrollToDot = (index: number) => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const firstChild = container.firstElementChild as HTMLElement;

        if (firstChild) {
            const itemWidth = firstChild.offsetWidth + 20;
            container.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
            setActiveIndex(index);
        }
    };

    if (!isLoading && data.length === 0) return null;

    return (
        <div className="es-slider-section">
            <div className="es-slider-header">
                <div>
                    <h2 className="es-slider-title">{title}</h2>
                    {subtitle && <p className="es-slider-subtitle">{subtitle}</p>}
                </div>
            </div>

            {/* Scrollable Track */}
            <div
                className="es-slider-track"
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <LocationCardV2 key={`sk-${i}`} isLoading={true} typeOfWhishlistCardEnum="location" />
                    ))
                    : data.map((loc, i) => (
                        <LocationCardV2
                            key={loc.id || i}
                            name={loc.title?.replace(/[0-9.]/g, '') || 'Unknown Destination'}
                            rating={loc.rating || 'N/A'}
                            places={loc.placesNumberToVisit as string}
                            images={loc.images?.length ? loc.images : []}
                            cardId={loc.id}
                            isLoading={false}
                            typeOfCard={typeOfLocationCardEnum.location}
                            state={loc.state || ""}
                            country={loc.country || "India"}
                        />
                    ))}
            </div>

            {/* Navigation Dots */}
            {!isLoading && totalDots > 1 && (
                <div className="es-dots-container">
                    {Array.from({ length: totalDots }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollToDot(idx)}
                            className={`es-dot ${activeIndex === idx ? 'is-active' : ''}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Skeleton Card for Grid ───────────────────────────────────────────────────
const SkeletonCardGrid = () => (
    <div className="w-full animate-pulse" style={{ maxWidth: '100%' }}>
        <div style={{ backgroundColor: 'var(--es-bg-empty)', borderRadius: '16px', aspectRatio: '4/3', width: '100%', marginBottom: '0.75rem' }} />
        <div style={{ backgroundColor: 'var(--es-bg-empty)', borderRadius: '4px', height: '1rem', width: '75%', marginBottom: '0.5rem' }} />
        <div style={{ backgroundColor: 'var(--es-bg-empty)', borderRadius: '4px', height: '0.75rem', width: '50%' }} />
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const ExploreSectionV2: React.FC<ExploreSectionProps> = ({
    explorePageData,
    locations,
    isLoading = false,
    isLoadingMore = false,
    hasMoreBtn,
    handleShowMoreClick,
    showMoreButtonToShow,
    totalCount = 0,
    searchConfig = { showDestination: true, showDates: false, showState: true, showSearchButton: true },
    onSearch,
    searchTerm = { term: '', state: '' }
}) => {
    const isSearching = (searchTerm?.term ?? '').trim().length > 0 || (searchTerm?.state ?? '').trim().length > 0;
    const gridLocations = locations || [];

    return (
        <section className="es-container" aria-label="Explore destinations">

            <SearchWidget
                onSearch={onSearch}
                config={searchConfig}
                initialTerm={searchTerm.term}
                initialState={searchTerm.state}
            />

            {/* Featured category sliders — hidden smoothly when searching */}
            <div
                style={{
                    transition: 'var(--es-transition)',
                    opacity: isSearching ? 0 : 1,
                    height: isSearching ? 0 : 'auto',
                    overflow: 'hidden',
                    pointerEvents: isSearching ? 'none' : 'auto'
                }}
            >
                {explorePageData && Array.isArray(explorePageData) && explorePageData.map((item, key) => (
                    <CategorySlider
                        key={key}
                        title={item.heading || ""}
                        subtitle={item.subHeading || ""}
                        icon={Sparkles}
                        data={item.data ?? []}
                        isLoading={isLoading}
                    />
                ))}
            </div>

            {/* Results section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Header row */}
                <div className="es-grid-header">
                    <div>
                        <h2 className="es-slider-title">
                            {isSearching
                                ? searchTerm?.term
                                    ? `Results for "${searchTerm.term}"${searchTerm.state ? ` in ${searchTerm.state}` : ''}`
                                    : `Destinations in ${searchTerm.state}`
                                : 'All Destinations'
                            }
                        </h2>
                        {(isSearching || gridLocations.length > 0) && !isLoading && (
                            <p className="es-slider-subtitle">
                                {totalCount > 0
                                    ? `${totalCount} destination${totalCount !== 1 ? 's' : ''} found`
                                    : gridLocations.length > 0
                                        ? `Showing ${gridLocations.length} destination${gridLocations.length !== 1 ? 's' : ''}`
                                        : ''
                                }
                            </p>
                        )}
                    </div>
                </div>

                {/* Loading state (initial) */}
                {isLoading && gridLocations.length === 0 ? (
                    <div className="es-grid-container">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCardGrid key={i} />)}
                    </div>
                ) : gridLocations.length === 0 && isSearching ? (

                    /* Empty state */
                    <div className="es-empty-state">
                        <div className="es-empty-icon">
                            <Search size={32} />
                        </div>
                        <h3 className="es-empty-title">No destinations found</h3>
                        <p style={{ color: 'var(--es-text-muted)', maxWidth: '300px', lineHeight: 1.5 }}>
                            {searchTerm?.state
                                ? `No matches in ${searchTerm.state}${searchTerm.term ? ` for "${searchTerm.term}"` : ''}. Try a different state or search term.`
                                : `No matches for "${searchTerm?.term || ''}". Try another location.`
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="es-grid-container">
                            {gridLocations.map((loc, i) => (
                                <div key={loc.id || i} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <LocationCard
                                        name={loc.title?.replace(/[0-9.]/g, '') || 'Unknown Destination'}
                                        rating={loc.rating || 'N/A'}
                                        places={loc.placesNumberToVisit as string}
                                        images={loc.images?.length ? loc.images : []}
                                        isWishlisted={loc.isWishlisted || false}
                                        typeOfWhishlistCardEnum="location"
                                        cardId={loc.id}
                                        placeConnectedwithid=""
                                        isLoading={isLoading && gridLocations.length === 0}
                                        typeOfCard={typeOfLocationCardEnum.location}
                                        showWishlistIcon={false}
                                    />
                                </div>
                            ))}

                            {/* Inline skeleton cards while loading more */}
                            {isLoadingMore && Array.from({ length: 4 }).map((_, i) => (
                                <div key={`lm-${i}`} style={{ width: '100%' }}>
                                    <SkeletonCardGrid />
                                </div>
                            ))}
                        </div>

                        {/* View More button */}
                        {hasMoreBtn && showMoreButtonToShow && !isLoadingMore && (
                            <button onClick={handleShowMoreClick} className="es-load-more-btn">
                                View More Destinations
                            </button>
                        )}

                        {/* End of results */}
                        {!showMoreButtonToShow && gridLocations.length > 0 && !isLoading && (
                            <p style={{ marginTop: '2.5rem', fontSize: '0.875rem', color: 'var(--es-text-muted)', fontWeight: 600 }}>
                                All {totalCount > 0 ? totalCount : gridLocations.length} destinations shown
                            </p>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default ExploreSectionV2;