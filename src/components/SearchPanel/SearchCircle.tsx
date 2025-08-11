import React from "react";

import {Search} from "lucide-react";
import "../../../styles/SearchBar.css";

const SearchCircle: React.FC = () => {
    return (
        <button
            className="search-circle"
            type="button"
            aria-label="Search"
        >
            <Search className="search-icon" aria-hidden="true" />
        </button>
    );
};

export default SearchCircle;