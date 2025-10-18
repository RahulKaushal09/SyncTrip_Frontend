import React from "react";
import '../../../styles/HotelSection.css'; // Import CSS (create this file separately)


const SkeletonHotelCard = () => {
    return (
        <div className="hotels-grid">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="hotel-card skeleton">
                    <div className="skeleton-image" style={{ height: '200px', background: '#e0e0e0' }} />
                    <div className="card-content-hotel">
                        <div className="skeleton-text" style={{ height: '20px', background: '#e0e0e0', marginBottom: '10px' }} />
                        <div className="skeleton-text" style={{ height: '16px', background: '#e0e0e0' }} />
                    </div>
                </div>
            ))}
        </div>
    );
};


export default SkeletonHotelCard;
