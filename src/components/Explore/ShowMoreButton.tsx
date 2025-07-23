"use client";

import React from 'react';

interface ShowMoreButtonProps {
    hasMoreBtn: boolean;
    showMoreButtonToShow: boolean;
    locationsLength: number;
    isLoading: boolean;
    onShowMoreClick: () => void;
}

export default function ShowMoreButton({
    hasMoreBtn,
    showMoreButtonToShow,
    locationsLength,
    isLoading,
    onShowMoreClick
}: ShowMoreButtonProps) {
    if (!hasMoreBtn || !showMoreButtonToShow || locationsLength === 0) {
        return null;
    }

    return (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <button
                className="btn btn-black"
                onClick={onShowMoreClick}
                disabled={isLoading}
                aria-label="Load more destinations"
            >
                {isLoading ? 'Loading...' : 'Show More'}
            </button>
        </div>
    );
}
