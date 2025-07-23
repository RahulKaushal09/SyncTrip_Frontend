import React from "react";
import SearchBar from './SearchBar';
import SearchCircle from './SearchCircle';
import "../../../styles/SearchBar.css";

interface MainSearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
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

export default MainSearchBar;