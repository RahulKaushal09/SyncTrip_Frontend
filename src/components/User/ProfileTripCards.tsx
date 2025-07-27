'use client';

import { CSSProperties } from 'react';
import '../../../styles/Profile/ProfileCardUI.css';
import { FaStar } from 'react-icons/fa';
import { ProfileCardEnum } from '@/constants';
import { appliedUsers } from '@/classes/ApiResponse.classes';

interface ButtonConfig {
    text: string;
    onClick: () => void;
    className?: string;
    inlineStyle?: CSSProperties;
}



interface ProfileCardUiProps {
    profileCardInlineStyle?: CSSProperties;
    user: appliedUsers;
    instagramSocialMedia?: string;
    onViewProfile: (id: string | number) => void;
    hasSentRequest?: boolean;
    isConnected?: boolean;
    type: string;
    btns?: ButtonConfig[];
    showviewProfile?: boolean;
}

const TripsProfileCardUi: React.FC<ProfileCardUiProps> = ({
    profileCardInlineStyle,
    user,
    instagramSocialMedia,
    onViewProfile,
    hasSentRequest,
    isConnected,
    type,
    btns,
    showviewProfile
}) => {
    const { name, profilePicture, age, rating, persona, id } = user;
    const handle = instagramSocialMedia || '';

    return (
        <div className="profile-card" style={profileCardInlineStyle}>
            <img
                src={profilePicture || '/default-profile.png'}
                alt={name}
                className="profile-picture"
            />
            <div className="profile-info">
                <div className="profile-header">
                    <h3 className="profile-name">{name}</h3>
                    {handle && <span className="profile-handle">{handle}</span>}
                </div>

                <div className="profile-stats">
                    {age && <span className="stat-item">Age: {age}</span>}
                    {rating !== undefined && (
                        <span className="stat-item">
                            Rating: {rating} <FaStar style={{ color: '#f5c518', marginLeft: '5px' }} />
                        </span>
                    )}
                    {persona && <span className="stat-item">Persona: {persona}</span>}
                </div>

                <div className="profile-actions">
                    {type === ProfileCardEnum.ReceivedRequests && (
                        <>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {btns?.map((btn, index) => (
                                    <button
                                        key={index}
                                        className={`${btn.className ?? ''} action-btn`}
                                        onClick={btn.onClick}
                                        style={btn.inlineStyle}
                                    >
                                        {btn.text}
                                    </button>
                                ))}
                            </div>
                            {showviewProfile && (
                                <button
                                    className="action-btn view-btn"
                                    onClick={() => onViewProfile(id)}
                                >
                                    View Profile
                                </button>
                            )}
                        </>
                    )}

                    {type === ProfileCardEnum.AllGoing && (
                        <>
                            {isConnected ? (
                                <>
                                    <span className="requested-text">Connected</span>
                                    {showviewProfile && (
                                        <button
                                            className="action-btn view-btn"
                                            onClick={() => onViewProfile(id)}
                                        >
                                            View Profile
                                        </button>
                                    )}
                                </>
                            ) : hasSentRequest ? (
                                <>
                                    <span className="requested-text">Requested</span>
                                    {showviewProfile && (
                                        <button
                                            className="action-btn view-btn"
                                            onClick={() => onViewProfile(id)}
                                        >
                                            View Profile
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {btns?.map((btn, index) => (
                                        <button
                                            key={index}
                                            className={`${btn.className ?? ''} action-btn`}
                                            onClick={btn.onClick}
                                        >
                                            {btn.text}
                                        </button>
                                    ))}
                                    {showviewProfile && (
                                        <button
                                            className="action-btn view-btn"
                                            onClick={() => onViewProfile(id)}
                                        >
                                            View Profile
                                        </button>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {type === ProfileCardEnum.Connection && (
                        <>
                            {btns?.map((btn, index) => (
                                <button
                                    key={index}
                                    className={btn.className ? btn.className : 'btn btn-black'}
                                    onClick={btn.onClick}
                                >
                                    {btn.text}
                                </button>
                            ))}
                            {showviewProfile && (
                                <button
                                    className="action-btn view-btn"
                                    onClick={() => onViewProfile(id)}
                                >
                                    View Profile
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TripsProfileCardUi;
