'use client';

import React from 'react';
import '../../../styles/skeleton.css';
import '../../../styles/LocationCard.css';

interface LocationCardSkeletonProps {
  inlineStyle?: React.CSSProperties;
}

const LocationCardSkeleton: React.FC<LocationCardSkeletonProps> = ({ inlineStyle }) => {
  return (
    <article className="location-card" style={inlineStyle} aria-label="Loading destination">
      <div className="card-image">
        <div className="skeleton-image" style={{ height: '200px', borderRadius: '12px' }}></div>
      </div>
      <div className="card-content">
        <div className="skeleton-row" style={{ justifyContent: 'space-between' }}>
          <div className="skeleton-line" style={{ width: '60%', height: '20px' }}></div>
          <div className="skeleton-line" style={{ width: '20%', height: '20px' }}></div>
        </div>
        <div className="skeleton-line" style={{ width: '80%', height: '14px' }}></div>
        <div className="skeleton-line" style={{ width: '50%', height: '14px' }}></div>
        <div className="skeleton-line small" style={{ width: '70%', height: '14px' }}></div>
      </div>
    </article>
  );
};

export default LocationCardSkeleton;
