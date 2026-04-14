"use client";

import React, { useState, useEffect } from "react";
import "../../../styles/home/home.css";
import { ExplorePageData, Location } from "@/types";
import dynamic from "next/dynamic";
import { LocationServices } from "@/utils/location.utils";

const ExploreSection = dynamic(
    () => import("../Explore/ExploreSectionV2"),
    { ssr: true }
);

export default function HomeContentV2() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [currPage, setPage] = useState(1);
    const [explorePageData, setExplorePageData] = useState<ExplorePageData>();

    const [searchTerm, setSearchTerm] = useState<{ term: string, state: string }>({ term: "", state: "" });
    const [isLoading, setIsLoading] = useState(false);

    // ✅ SEARCH HANDLER
    const handleSearchFromExplore = async (query: { term: string, state: string }, page = currPage) => {
        setSearchTerm(query);

        try {
            setIsLoading(true);

            const response = await LocationServices.searchLocationsForExplore(query, page);
            setPage(page+1); // Update current page for pagination

            console.log("Search response in HomeContentV2:", response);

            setLocations(response || []);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ INITIAL LOAD (ONLY ONCE)
    useEffect(() => {
        const fetchExplorePageData = async () => {
            try {
                const data = await LocationServices.getDataForExplorePage();
                setExplorePageData(data);
            } catch (error) {
                console.error("Error fetching explore page data:", error);
            }
        };

        fetchExplorePageData();
    }, []);

    return (
        <main className="min-h-screen HomePage paddingSectionLeftRight">
            <ExploreSection
                explorePageData={explorePageData}
                locations={locations || []}
                onSearch={handleSearchFromExplore}
                showMoreButtonToShow={true}
                handleShowMoreClick={() => {
                    handleSearchFromExplore(searchTerm, currPage);
                }}
                hasMoreBtn={true}
                isLoading={isLoading}
                searchTerm={searchTerm}
            />
        </main>
    );
}