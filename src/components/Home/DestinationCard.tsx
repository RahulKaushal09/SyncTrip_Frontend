// components/Home/DestinationCard.tsx
import React from 'react';
import { TrendingLocationData } from '@/types';
import "../../../styles/DestinationCard.css";
const DestinationCard: React.FC<TrendingLocationData> = ({
    imgUrl,
    Title,
    Location,
    peopleVisited,
}) => {

    return (
        <div className="card destination-card border-0">

            <div
                className="card-img-container"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    height: '350px',
                    borderRadius: '22px',
                    display: 'flex',
                    alignItems: 'flex-end',
                }}
            >
                <h3 className="card-title-destination fw-bold text-white text-start" style={{ fontSize: '30px', marginLeft: '10px' }} itemProp="name">
                    {Title}
                </h3>
            </div>
            <div className="card-body-destination text-center" style={{ padding: '15px 15px 0px 15px' }}>
                <p className="card-text-destination" itemProp="address">
                    {Location}
                </p>
                <div className="avatars d-flex justify-content-center gap-2">
                    {[...Array(5)].map((_, i) => (
                        <img
                            key={i}
                            src={`${imgUrl}`}
                            alt={`User ${i + 1}`}
                            className="rounded-circle"
                            style={{ width: '25px', height: '25px', border: '1px solid white', marginRight: '-15px' }}
                        />
                    ))}
                    <p style={{ marginLeft: '10px', fontSize: '14px', fontWeight: 700 }}>
                        {peopleVisited}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DestinationCard;
