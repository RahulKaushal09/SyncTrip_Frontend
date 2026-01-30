"use client";

import React, { useEffect, useState, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { ApiService } from '../../utils/api.utils';
import { ValidationUtils } from '../../utils/validation.utils';
import { User } from '../../types';
import '../../../styles/popups/loginPopup.css';
import { CredentialResponse } from '@react-oauth/google';
import { sendOtp, verifyOtp } from "@/utils/firebaseAuthClient";

interface LoginPopupProps {
  onClose: () => void;
  onLogin: (user: User, requiresPhone?: boolean) => void;
  headingText?: string;
}

export default function LoginPopup({ onClose, onLogin, headingText }: LoginPopupProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    sex: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Shared OTP states for registration
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // OTP states for login (phone)
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState('');
  const [loginPhoneVerified, setLoginPhoneVerified] = useState(false);
  const [loginFirebaseToken, setLoginFirebaseToken] = useState<string | null>(null);
  const [loginResendTimer, setLoginResendTimer] = useState(0);

  const [loginType, setLoginType] = useState<'email' | 'phone' | null>(null);
  const [emailFieldClass, setEmailFieldClass] = useState('login-field show');
  const [passwordFieldClass, setPasswordFieldClass] = useState('login-field hide');
  const [phoneFieldClass, setPhoneFieldClass] = useState('login-field show');
  const [showOROfEmail, setShowOROfEmail] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const onSignInToggle = () => {
    if (form.email.trim() !== "") {
      setLoginType("email");
      setEmailFieldClass('login-field show');
      setPasswordFieldClass('login-field show');
      setPhoneFieldClass('login-field hide');
      setShowOROfEmail(true);
    } else if (form.phone.trim() !== "") {
      setLoginType("phone");
      setEmailFieldClass('login-field hide');
      setPasswordFieldClass('login-field hide');
      setPhoneFieldClass('login-field show');
      setShowOROfEmail(false);
    } else {
      setLoginType(null);
      setEmailFieldClass('login-field show');
      setPasswordFieldClass('login-field hide');
      setPhoneFieldClass('login-field show');
      setShowOROfEmail(true);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === "email" && e.target.value !== "") {
      setLoginType("email");
      setEmailFieldClass('login-field show');
      setPasswordFieldClass('login-field show');
      setPhoneFieldClass('login-field hide');
      setShowOROfEmail(true);
    } else if (e.target.name === "phone" && e.target.value !== "") {
      setLoginType("phone");
      setEmailFieldClass('login-field hide');
      setPasswordFieldClass('login-field hide');
      setPhoneFieldClass('login-field show');
      setShowOROfEmail(false);
    } else {
      setLoginType(null);
      setEmailFieldClass('login-field show');
      setPasswordFieldClass('login-field hide');
      setPhoneFieldClass('login-field show');
      setShowOROfEmail(true);
    }
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setOtp(value);
    setError('');
  };

  const handleLoginOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setLoginOtp(value);
    setError('');
  };

  useEffect(() => {
    const resetAllStates = () => {
      setForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        sex: '',
      });
      setOtpSent(false);
      setOtp('');
      setPhoneVerified(false);
      setFirebaseToken(null);
      setResendTimer(0);
      setLoginOtpSent(false);
      setLoginOtp('');
      setLoginPhoneVerified(false);
      setLoginFirebaseToken(null);
      setLoginResendTimer(0);
      setLoginType(null);
    };

    resetAllStates();
    if (isRegistering) {
      setEmailFieldClass('login-field show');
      setPasswordFieldClass('login-field show');
      setPhoneFieldClass('login-field hide');
      setShowOROfEmail(false);
    } else {
      onSignInToggle();
    }
  }, [isRegistering]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (loginResendTimer > 0) {
      const timer = setTimeout(() => setLoginResendTimer(loginResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [loginResendTimer]);

  useEffect(() => {
    if ((otpSent || loginOtpSent) && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [otpSent, loginOtpSent]);

  const validateForm = (): boolean => {
    if (isRegistering) {
      const nameError = ValidationUtils.validateName(form.name);
      if (nameError) {
        setError(nameError);
        return false;
      }

      if (!form.phone) {
        setError('Phone number is required for registration');
        return false;
      }
      if (form.phone.length !== 10) {
        setError('Phone number must be exactly 10 digits');
        return false;
      }
      if (!/^\d{10}$/.test(form.phone)) {
        setError('Phone number must contain only digits');
        return false;
      }

      if (!phoneVerified) {
        setError('Please verify your phone number first');
        return false;
      }

      if (!form.sex) {
        setError('Please select your gender');
        return false;
      }

      if (!form.email) {
        setError('Email is required');
        return false;
      }
      const emailError = ValidationUtils.validateEmail(form.email);
      if (emailError) {
        setError(emailError);
        return false;
      }

      if (!form.password) {
        setError('Password is required');
        return false;
      }
      const passwordError = ValidationUtils.validatePassword(form.password);
      if (passwordError) {
        setError(passwordError);
        return false;
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      if (form.password.length > 20) {
        setError('Password must not exceed 20 characters');
        return false;
      }
      return true;
    } else {
      if (loginType === null && form.email === '' && form.phone === '') {
        setError('Please enter email or phone number');
        return false;
      }
      if (loginType === 'email' || form.email.trim() !== "") {
        if (!form.email || !form.password) {
          setError('Email and password are required');
          return false;
        }
        const emailError = ValidationUtils.validateEmail(form.email);
        if (emailError) {
          setError(emailError);
          return false;
        }
        const passwordError = ValidationUtils.validatePassword(form.password);
        if (passwordError) {
          setError(passwordError);
          return false;
        }
        return true;
      } else { // phone
        if (!form.phone) {
          setError('Phone number is required');
          return false;
        }
        if (form.phone.length !== 10) {
          setError('Phone number must be exactly 10 digits');
          return false;
        }
        if (!/^\d{10}$/.test(form.phone)) {
          setError('Phone number must contain only digits');
          return false;
        }
        if (!loginPhoneVerified) {
          setError('Please verify your phone number first');
          return false;
        }
        return true;
      }
    }
  };

  // Registration OTP handlers
  // const handleSendOtp = async () => {
  //   if (!/^\d{10}$/.test(form.phone)) {
  //     setError("Please enter a valid 10-digit phone number");
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     setError("");
  //     await sendOtp("+91" + form.phone);
  //     setOtpSent(true);
  //     setResendTimer(60);
  //     setOtp("");
  //   } 
  //   // eslint-disable-next-line 
  //   catch (e: any) {
  //     console.error("Error sending OTP:", e);
  //     if (e.code === "auth/too-many-requests") {
  //       setError("Too many attempts. Please wait a few minutes and try again.");
  //     } else {
  //       setError("Failed to send OTP. Please try again.");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleResendOtp = async () => {
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await sendOtp("+91" + form.phone);
      setResendTimer(60);
      setOtp("");
    }
    // eslint-disable-next-line 
    catch (e: any) {
      console.error("Error resending OTP:", e);
      if (e.code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const handleVerifyOtp = async () => {
  //   if (otp.length !== 6) {
  //     setError("Please enter a valid 6-digit OTP");
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     setError("");

  //     const token = await verifyOtp(otp);
  //     setFirebaseToken(token);
  //     setPhoneVerified(true);
  //     setOtp('');
  //   }
  //   // eslint-disable-next-line 
  //   catch (e: any) {
  //     console.error("Error verifying OTP:", e);
  //     setError("Invalid OTP. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Login OTP handlers
  const handleSendLoginOtp = async () => {
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const UserAlreadyExistWithPhone = await ApiService.checkUserExistsWithPhoneNumber(form.phone);
      if (!UserAlreadyExistWithPhone) {
        setError("No account found with this phone number. Please create account first.");
        setIsLoading(false);
        return;
      }
      await sendOtp("+91" + form.phone);
      setLoginOtpSent(true);
      setLoginResendTimer(60);
      setLoginOtp("");
    }
    // eslint-disable-next-line 
    catch (e: any) {
      console.error("Error sending login OTP:", e);
      if (e.code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLoginOtp = async () => {
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await sendOtp("+91" + form.phone);
      setLoginResendTimer(60);
      setLoginOtp("");
    }
    // eslint-disable-next-line 
    catch (e: any) {
      console.error("Error resending login OTP:", e);
      if (e.code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLoginOtp = async () => {
    if (loginOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const token = await verifyOtp(loginOtp);
      setLoginFirebaseToken(token);
      setLoginPhoneVerified(true);
      setLoginOtp('');

      // AUTO-LOGIN: Trigger the login process immediately once verified
      const response = await ApiService.LoginWithPhoneNumber(token, form.phone);

      if (response?.token?.trim()) {
        const { user, token: userToken } = response;
        localStorage.setItem('userToken', userToken);
        document.cookie = `userToken=${userToken}; path=/; max-age=604800; SameSite=Strict; Secure`;
        const safeUser = { id: user.id, name: user.name, profile_picture: user.profile_picture };
        document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(safeUser))}; path=/; max-age=604800; SameSite=Lax`;
        onLogin(user);
        onClose();
      } else {
        throw new Error(response?.message || 'Login failed after verification');
      }
    } catch (e: unknown) {
      console.error("Error during verify & login:", e);

      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Invalid OTP or login failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRegistrationOtp = async () => {
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      const userExists = await ApiService.checkUserExistsWithPhoneNumber(form.phone);
      if (userExists) {
        setError('An account with this phone number already exists. Please log in instead.');
        setIsLoading(false);
        return;
      }
      await sendOtp("+91" + form.phone);
      setOtpSent(true);
      setResendTimer(60);
      setOtp('');
    }
    // eslint-disable-next-line 
    catch (e: any) {
      console.error('Error sending registration OTP:', e);
      setError(e.code === "auth/too-many-requests" ? "Too many attempts. Try again later." : e.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyRegistrationOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      const token = await verifyOtp(otp);
      if (!token) {
        setError('Invalid OTP');
        return;
      }
      setFirebaseToken(token);
      setPhoneVerified(true);
      setOtp('');
    }
    // eslint-disable-next-line 
    catch (e: any) {
      console.error('Error verifying registration OTP:', e);
      setError('Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      let response;

      if (isRegistering) {
        if (!phoneVerified || !firebaseToken) {
          setError('Phone verification required');
          setIsLoading(false); // Make sure to stop loading
          return;
        }

        response = await ApiService.register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          sex: form.sex,
          firebaseToken,
        });
      } else {
        if (loginType === 'phone') {
          if (!loginPhoneVerified || !loginFirebaseToken) {
            setError('Phone verification required');
            setIsLoading(false);
            return;
          }
          response = await ApiService.LoginWithPhoneNumber(loginFirebaseToken, form.phone);
        } else {
          response = await ApiService.login({
            email: form.email,
            password: form.password,
          });
        }
      }

      // Check if the response contains a token (Success)
      if (response?.token?.trim()) {
        const { user, token } = response;
        localStorage.setItem('userToken', token);
        document.cookie = `userToken=${token}; path=/; max-age=604800; SameSite=Strict; Secure`;
        const safeUser = { id: user.id, name: user.name, profile_picture: user.profile_picture };
        document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(safeUser))}; path=/; max-age=604800; SameSite=Lax`;

        onLogin(user);
        onClose();
      } else {
        // ERROR HANDLING LOGIC
        // 1. Check for 'message' (used by your backend for existing users)
        // 2. Check for 'error' (generic)
        // 3. Fallback
        const errorMsg = response?.message || response?.error || 'Login/Registration failed';
        throw new Error(errorMsg);
      }
    }
    catch (e: unknown) {
      console.error("Error during reg/login:", e);

      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An error occurred, please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setError('');

    try {
      if (!credentialResponse.credential) {
        throw new Error('Google credential is missing. Please try again.');
      }

      const response = await ApiService.googleLogin(credentialResponse.credential);
      const userToken = response?.token;
      const user = response?.user;

      if (response && user) {
        if (userToken) {
          localStorage.setItem('userToken', userToken);
          document.cookie = `userToken=${userToken}; path=/; max-age=604800; SameSite=Strict; Secure`;
          const safeUser = {
            id: user.id,
            name: user.name,
            profile_picture: user.profile_picture,
          };
          document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(safeUser))}; path=/; max-age=604800; SameSite=Lax`;
        }
        onLogin(user);
        onClose();
      } else {
        throw new Error('Google login failed');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Google login failed. Please try again.');
      } else {
        console.error('Google login error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google OAuth Error Details:', {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
    });
    setError('Google login configuration error. Please check console or try manual login.');
    setIsLoading(false);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="login-popup-overlay">
      <div className="login-popup-container">
        <button className="login-popup-close-btn" onClick={onClose} disabled={isLoading}>
          ×
        </button>

        <h2 className="login-popup-title">
          {headingText ? headingText : (isRegistering ? 'Create an Account' : 'Welcome Back')}
        </h2>
        {!isRegistering && (
          <div className="login-popup-google-container">
            {!isLoading && <GoogleLogin onSuccess={handleGoogleLogin} onError={handleGoogleError} />}
          </div>
        )}

        <div className="login-popup-divider" style={{ display: showOROfEmail ? 'flex' : 'none' }}>
          <div style={{ width: '46%' }}><hr /></div>
          OR
          <div style={{ width: '46%' }}><hr /></div>
        </div>

        <form onSubmit={handleSubmit} className="login-popup-form" noValidate>
          {isRegistering && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="login-popup-input margin1RemBottom"
                value={form.name}
                onChange={handleChange}
                disabled={isLoading}
              />
              <select
                name="sex"
                className="login-popup-input margin1RemBottom"
                value={form.sex}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <p style={{ fontSize: "11px", color: "#ccc", padding: "0px 2px" }}>Please make sure you enter a valid phone number for verification.</p>

              <div className="phone-input-row margin1RemBottom">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="login-popup-input phone-input"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={isLoading || phoneVerified}
                  maxLength={10}
                />
                <button
                  type="button"
                  className={`phone-verify-btn ${otpSent ? 'resend-btn' : ''} btn btn-primary`}
                  onClick={phoneVerified ? undefined : otpSent ? handleResendOtp : handleSendRegistrationOtp}
                  disabled={isLoading || (otpSent && resendTimer > 0) || !form.phone || phoneVerified}
                >
                  {phoneVerified ? 'Verified ✓' : otpSent ? (resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP') : 'Verify Phone'}
                </button>

              </div>

              {otpSent && !phoneVerified && (
                <div className="otp-input-group margin1RemBottom">
                  <input
                    ref={otpInputRef}
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="login-popup-input"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary otp-verify-btn"
                    onClick={handleVerifyRegistrationOtp}
                    style={{ marginTop: "20px" }}
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              )}

            </>
          )}

          <div className={emailFieldClass}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="login-popup-input"
              value={form.email}
              onChange={isRegistering ? handleChange : handleLoginChange}
              disabled={isLoading}
            />
          </div>

          <div className={passwordFieldClass}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="login-popup-input password-input"
              value={form.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {!isRegistering && (
            <div className={phoneFieldClass}>
              <div className="login-popup-divider">
                <div style={{ width: '46%' }}><hr /></div>
                OR
                <div style={{ width: '46%' }}><hr /></div>
              </div>
              <p style={{ fontSize: "11px", color: "#ccc", padding: "0px 2px" }}>
                Enter your phone number to receive a secure login code.
              </p>

              <div className="phone-input-row margin1RemBottom">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="login-popup-input phone-input"
                  value={form.phone}
                  onChange={handleLoginChange}
                  disabled={isLoading || loginPhoneVerified}
                  maxLength={10}
                />
                {/* Small resend link/button that only appears after OTP is sent */}
                {loginOtpSent && !loginPhoneVerified && (
                  <button
                    type="button"
                    className="resend-link-btn"
                    onClick={handleResendLoginOtp}
                    disabled={isLoading || loginResendTimer > 0}
                    style={{ fontSize: '10px', marginLeft: '10px', background: 'none', border: 'none', color: 'var(--primary-1)', cursor: 'pointer' }}
                  >
                    {loginResendTimer > 0 ? `Resend in ${loginResendTimer}s` : 'Resend OTP'}
                  </button>
                )}
              </div>

              {loginOtpSent && !loginPhoneVerified && (
                <div className="otp-input-group margin1RemBottom animate-fade-in">
                  <input
                    ref={otpInputRef}
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="login-popup-input"
                    value={loginOtp}
                    onChange={handleLoginOtpChange}
                    maxLength={6}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          )}

          {error && <div className="login-popup-error" style={{ color: 'red', fontSize: "12px" }}>{error}</div>}

          {/* MODIFIED PRIMARY BUTTON */}
          <button
            type={loginType === 'phone' && !loginOtpSent ? "button" : "submit"}
            className="btn btn-primary"
            style={{ marginTop: '20px' }}
            disabled={isLoading}
            onClick={(e) => {
              if (loginType === 'phone') {
                if (!loginOtpSent) {
                  e.preventDefault();
                  handleSendLoginOtp();
                } else if (!loginPhoneVerified) {
                  e.preventDefault();
                  handleVerifyLoginOtp().then(() => {
                    // Once verified, the login is handled by the useEffect or 
                    // you can trigger handleSubmit manually here if preferred.
                    // For a single-click experience, handleVerifyLoginOtp should 
                    // call the login API directly upon success.
                  });
                }
              }
            }}
          >
            {isLoading ? 'Processing...' :
              isRegistering ? 'Create Account' :
                (loginType === 'phone' ? (loginOtpSent ? 'Verify & Sign In' : 'Send OTP') : 'Sign In')}
          </button>
        </form>

        <p className="login-popup-toggle-text">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="login-popup-toggle-btn"
            disabled={isLoading}
          >
            {isRegistering ? 'Sign In' : 'Create Account'}
          </button>
        </p>
      </div>
    </div>
  );
}