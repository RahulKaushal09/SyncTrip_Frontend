"use client";

import React, { useState, useEffect } from "react";
import {Search} from "lucide-react";

import "../../../styles/SearchBar.css";

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    searchBarPlaceHolder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    setSearchTerm,
    searchBarPlaceHolder
}) => {
    const [placeholder, setPlaceholder] = useState(searchBarPlaceHolder);

    useEffect(() => {
        const updatePlaceholder = () => {
            if (window.innerWidth <= 768) {
                // Mobile view: Alternate placeholder
                if (searchBarPlaceHolder === "Search Trips") {
                    setPlaceholder("Search trips...");
                } else {
                    setPlaceholder("Search destinations...");
                    const interval = setInterval(() => {
                        setPlaceholder((prev) =>
                            prev === "Search destinations..." ? "Search hotels..." : "Search destinations..."
                        );
                    }, 4000); // Switch every 4 seconds
                    return () => clearInterval(interval);
                }
            } else {
                // Desktop view: Full placeholder
                setPlaceholder(searchBarPlaceHolder);
            }
        };

        // Run on mount and window resize
        updatePlaceholder();
        window.addEventListener("resize", updatePlaceholder);
        return () => window.removeEventListener("resize", updatePlaceholder);
    }, [searchBarPlaceHolder]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="" role="search">
            <div className="input-group-searchBar dateBlock">
                <span className="d-flex align-items-center me-2" aria-hidden="true">
                    <Search style={{ color: "#1E1E1E", scale: "1.1" }} />
                </span>
                <input
                    type="search"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="searchBarInput"
                    aria-label="Search for destinations, hotels, and travel experiences"
                    autoComplete="off"
                    spellCheck="false"
                />
            </div>
        </div>
    );
};

export default SearchBar;