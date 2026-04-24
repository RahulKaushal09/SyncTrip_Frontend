"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../../styles/home/home.css";
import { ExplorePageData, Location } from "@/types";
import dynamic from "next/dynamic";
import { LocationServices } from "@/utils/location.utils";

// const ExploreSection = dynamic(
//     () => import("../Explore/ExploreSectionV2"),
//     { ssr: true }
// );

import ExploreSection from "../Explore/ExploreSectionV2";

const PAGE_SIZE = 8;

interface HomeContentV2Props {
    initialLocations?: Location[];
    initialTotal?: number;
    initialExplorePageData?: ExplorePageData;
}

export default function HomeContentV2({
    initialLocations = [],
    initialTotal = 0,
    initialExplorePageData,
}: HomeContentV2Props) {
    const [locations, setLocations] = useState<Location[]>(initialLocations);
    const [page, setPage] = useState(initialLocations.length > 0 ? 2 : 1); // Start from page 2 if we have initial data
    const [hasMore, setHasMore] = useState(initialLocations.length < initialTotal);
    const [totalCount, setTotalCount] = useState(initialTotal);
    const [explorePageData, setExplorePageData] = useState<ExplorePageData | undefined>(initialExplorePageData);
    const [searchTerm, setSearchTerm] = useState<{ term: string; state: string }>({ term: "", state: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Use a ref to track the latest search term to avoid stale closure issues
    const latestSearchRef = useRef<{ term: string; state: string }>({ term: "", state: "" });

    /**
     * Core fetch function.
     * @param query   - The search filters
     * @param pageNum - The page to fetch
     * @param append  - If true, append results (pagination). If false, replace (new search).
     */
    const fetchLocations = useCallback(async (
        query: { term: string; state: string },
        pageNum: number,
        append: boolean
    ) => {
        const isInitialLoad = !query.term && !query.state && pageNum === 1;

        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
        }

        try {
            const response = await LocationServices.searchLocationsForExplore(query, pageNum);

            // Guard against stale responses: if the search term has changed since
            // this request was fired, discard the response.
            if (
                latestSearchRef.current.term !== query.term ||
                latestSearchRef.current.state !== query.state
            ) {
                return;
            }

            const items: Location[] = response.data || [];
            const total: number = response.total ?? items.length;
            const currentTotal = append ? locations.length + items.length : items.length;

            setLocations(prev => append ? [...prev, ...items] : items);
            setPage(pageNum + 1);
            setTotalCount(total);
            setHasMore(currentTotal < total);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [locations.length]);

    /**
     * Called by the SearchWidget when the user submits a new search.
     * Always resets pagination to page 1 and replaces results.
     */
    const handleSearch = useCallback((query: { term: string; state: string }) => {
        latestSearchRef.current = query;
        setSearchTerm(query);
        setLocations([]);
        setPage(1);
        setHasMore(false);
        fetchLocations(query, 1, false);
    }, [fetchLocations]);

    /**
     * Called by "View More" button. Appends next page of results
     * for the CURRENT search term.
     */
    const handleShowMore = useCallback(() => {
        fetchLocations(latestSearchRef.current, page, true);
    }, [fetchLocations, page]);

    // Initial load on mount — fetch first page with empty filters
    useEffect(() => {
        if (initialLocations.length === 0) {
            fetchLocations({ term: "", state: "" }, 1, false);
        }

        if (!initialExplorePageData) {
            const fetchExplorePageData = async () => {
                try {
                    const data = await LocationServices.getDataForExplorePage();
                    setExplorePageData(data);
                } catch (error) {
                    console.error("Error fetching explore page data:", error);
                }
            };
            fetchExplorePageData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="min-h-screen HomePage paddingSectionLeftRight">
            <ExploreSection
                explorePageData={explorePageData}
                locations={locations}
                onSearch={handleSearch}
                showMoreButtonToShow={hasMore}
                handleShowMoreClick={handleShowMore}
                hasMoreBtn={true}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                totalCount={totalCount}
                searchTerm={searchTerm}
            />
        </main>
    );
}