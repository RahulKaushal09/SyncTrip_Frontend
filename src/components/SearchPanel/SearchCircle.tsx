import React from "react";
import { FiSearch } from "react-icons/fi";
import "../../../styles/SearchBar.css";

const SearchCircle: React.FC = () => {
    return (
        <button
            className="search-circle"
            type="button"
            aria-label="Search"
        >
            <FiSearch className="search-icon" aria-hidden="true" />
        </button>
    );
};

export default SearchCircle;