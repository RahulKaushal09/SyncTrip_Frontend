// src/components/SearchPanel/MainSearchBar.tsx
import React from "react";
import SearchBar from './SearchBar';
import SearchCircle from './SearchCircle';
import "../../../styles/SearchBar.css";
import {Search} from "lucide-react";

interface MainSearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    searchBarPlaceHolder: string;
}
interface MainSearchBarPropsSkeleton {
    searchBarPlaceHolder: string;
}

const MainSearchBar: React.FC<MainSearchBarProps> = ({
    searchTerm,
    setSearchTerm,
    searchBarPlaceHolder
}) => {
    return (
        <div className="search-container main-search-container" role="search" aria-label="Search destinations">
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchBarPlaceHolder={searchBarPlaceHolder}
            />
            <SearchCircle />
        </div>
    );
};

// Skeleton Loader Component
const MainSearchBarSkeleton: React.FC<MainSearchBarPropsSkeleton> = ({
    searchBarPlaceHolder
}) => {
    return (
        <div className="search-container main-search-container" role="search" aria-label="Loading search bar">
            <div className="input-group-searchBar dateBlock">
                <span className="d-flex align-items-center me-2" aria-hidden="true">
                    <Search style={{ color: "#1E1E1E", scale: "1.1" }} />
                </span>
                <input
                    type="search"
                    placeholder={searchBarPlaceHolder}
                    // value={""}
                    defaultValue=""
                    className="searchBarInput"
                    aria-label="Search for destinations, hotels, and travel experiences"
                    autoComplete="off"
                    spellCheck="false"
                />
                <SearchCircle />
            </div>
        </div>
    );
};

export default MainSearchBar;
export { MainSearchBarSkeleton }; // Export skeleton separately for use in dynamic import