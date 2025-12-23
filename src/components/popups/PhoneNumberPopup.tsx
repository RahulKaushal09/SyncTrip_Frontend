"use client";

import React, { useState, useEffect, useRef } from "react";
import { User } from "../../types";
import "../../../styles/popups/phoneNumberPopup.css";
import { sendOtp, verifyOtp } from "@/utils/firebaseAuthClient";
import { AuthServices } from "@/utils/auth.utils";

interface PhoneNumberPopupProps {
  user: User;
  onClose: () => void;
  onPhoneSubmit: (user: User) => void;
}

export default function PhoneNumberPopup({
  user,
  onClose,
  onPhoneSubmit,
}: PhoneNumberPopupProps) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // Timer for resend cooldown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-focus OTP input after sending OTP
  useEffect(() => {
    if (otpSent && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [otpSent]);

  async function handleSendOtp() {
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await sendOtp("+91" + phone);
      setOtpSent(true);
      setResendTimer(60); // 60s cooldown
      setOtp(""); // clear OTP field
    } catch (e: any) {
      if (e.code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else {
        setError(e.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const firebaseToken = await verifyOtp(otp);
      const updatedUser = await AuthServices.verifyPhone(firebaseToken, phone);

      if (!updatedUser) {
        throw new Error("Verification failed");
      }

      onPhoneSubmit(updatedUser);
      onClose();
    } catch (e: any) {
      setError(e.message || "Invalid OTP or verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="phone-number-overlay">
      <div className="phone-number-container">
        <button
          className="phone-number-close-btn"
          onClick={onClose}
          disabled={loading}
        >
          ×
        </button>

        <h2 className="phone-number-title">Verify your phone number</h2>

        {/* Phone number input */}
        <div className="input-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            placeholder="Enter 10-digit number"
            className="phone-number-input"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError("");
            }}
            maxLength={10}
            disabled={loading || otpSent}
          />
        </div>

        {/* Send OTP button → becomes "Resend OTP" text after first send */}
        {!otpSent ? (
          <button
            type="button"
            className="phone-number-submit-btn"
            onClick={handleSendOtp}
            disabled={loading || resendTimer > 0}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <div className="resend-container">
            <button
              type="button"
              className="resend-text"
              onClick={handleSendOtp}
              disabled={loading || resendTimer > 0}
              style={{
                background: "none",
                border: "none",
                color: resendTimer > 0 ? "#999" : "#007bff",
                cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                textDecoration: resendTimer > 0 ? "none" : "underline",
                fontSize: "0.95rem",
              }}
            >
              {resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : "Resend OTP"}
            </button>
          </div>
        )}

        {/* OTP section - shown after sending OTP */}
        {otpSent && (
          <>
            <div className="input-group" style={{ marginTop: "1.5rem" }}>
              <label htmlFor="otp">Enter OTP</label>
              <input
                ref={otpInputRef}
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                className="phone-number-input"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setOtp(value);
                  setError("");
                }}
                maxLength={6}
                disabled={loading}
              />
            </div>

            {/* Verify button - active only when 6 digits */}
            <button
              type="button"
              className="phone-number-submit-btn"
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              style={{
                marginTop: "1rem",
                ...(otp.length === 6 ? {} : { opacity: 0.6 }),
              }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}


        {error && (
          <div
            className="phone-number-error"
            style={{ color: "red", marginTop: "1rem", fontSize: "0.9rem" }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}