"use client";

import React, { useState } from 'react';
import { ApiService } from '../../utils/api.utils';
import { User } from '../../types';
import '../../../styles/popups/phoneNumberPopup.css';

interface PhoneNumberPopupProps {
    user: User;
    onClose: () => void;
    onPhoneSubmit: (user: User) => void;
}

export default function PhoneNumberPopup({ user, onClose, onPhoneSubmit }: PhoneNumberPopupProps) {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone || phone.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await ApiService.addPhoneNumber(user.id, phone);

            if (response?.user) {
                onPhoneSubmit(response.user);
                onClose();
            } else {
                setError(response?.message || 'Failed to save phone number');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || 'An error occurred. Please try again.');
            } else {
                setError('An unknown error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="phone-number-overlay">
            <div className="phone-number-container">
                <button className="phone-number-close-btn" onClick={onClose} disabled={isLoading}>
                    ×
                </button>
                <h2 className="phone-number-title">Add Your Phone Number</h2>
                <p style={{ marginBottom: "5px" }}>Please help us contact you.</p>
                <p className="phone-number-subtext" style={{ fontSize: "12px", color: "#ccc" }}>
                    We promise not to call too often — just when it&apos;s important!
                </p>

                <form onSubmit={handleSubmit} className="phone-number-form">
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        className="phone-number-input"
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            setError('');
                        }}
                        disabled={isLoading}
                        maxLength={10}
                        pattern="[0-9]{10}"
                        required
                    />
                    {error && <div className="phone-number-error" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
                    <button type="submit" className="phone-number-submit-btn" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}
