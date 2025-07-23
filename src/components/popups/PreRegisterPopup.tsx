"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import preRegisterPopupImg from '../../../assets/images/preRegisterPopupImg.png';
import '../../../styles/preRegisterPopup.css';

interface PreRegisterPopupProps {
    onClose: () => void;
}

const PreRegisterPopup: React.FC<PreRegisterPopupProps> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async () => {
        if (!email) return;

        setIsLoading(true);
        // Handle form submission logic here
        // You can add API call to save email for beta access
        setTimeout(() => {
            setIsLoading(false);
            onClose(); // Close the popup after submission
        }, 1000);
    };

    return (
        <div className="preRegister-popup-overlay">
            <div className="preRegister-popup-content">
                <button className="close-button-popUpEmail" onClick={onClose} disabled={isLoading}>
                    ×
                </button>
                <div className="preRegister-popup-body">
                    <Image
                        src={preRegisterPopupImg}
                        alt="Traveler"
                        className="preRegister-popup-image"
                        width={200}
                        height={200}
                    />
                    <div className="preRegister-popup-text">
                        <h2>Enjoying exploring your next adventure?</h2>
                        <p>
                            You can request beta access among the first to experience SyncTrip!
                        </p>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={handleEmailChange}
                            className="email-input"
                            disabled={isLoading}
                        />
                        <button
                            className="submit-button"
                            onClick={handleSubmit}
                            disabled={isLoading || !email}
                        >
                            {isLoading ? 'Submitting...' : 'Get Access'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreRegisterPopup;
