import React from "react";
import { FiSearch } from "react-icons/fi";
import "../../../styles/SearchBar.css";

const SearchCircle: React.FC = () => {
    return (
        <button
            className="search-circle"
            type="button"
            aria-label="Search"
            onClick={() => {
                // Handle search action if needed
                console.log('Search triggered');
            }}
        >
            <FiSearch className="search-icon" aria-hidden="true" />
        </button>
    );
};

export default SearchCircle;