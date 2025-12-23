// "use client";

// import React, { useEffect, useState } from 'react';
// import { GoogleLogin } from '@react-oauth/google';
// import { ApiService } from '../../utils/api.utils';
// import { ValidationUtils } from '../../utils/validation.utils';
// import { User } from '../../types';
// import '../../../styles/popups/loginPopup.css';
// import { CredentialResponse } from '@react-oauth/google'; // If you're using the Google OAuth package

// interface LoginPopupProps {
//   onClose: () => void;
//   onLogin: (user: User, requiresPhone?: boolean) => void;
// }

// export default function LoginPopup({ onClose, onLogin }: LoginPopupProps) {
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     sex: '',
//   });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError(''); // Clear error on input change
//   };

//   useEffect(() => {
//     if (isRegistering) {
//       setForm({
//         name: '',
//         email: '',
//         phone: '',
//         password: '',
//         sex: '',
//       });
//     } else {
//       setForm({
//         name: '',
//         email: '',
//         phone: '',
//         password: '',
//         sex: '',
//       });
//     }
//   }, [isRegistering]);

//   const validateForm = (): boolean => {
//     if (!form.email || !form.password) {
//       setError('Email and password are required');
//       return false;
//     }

//     const emailError = ValidationUtils.validateEmail(form.email);
//     if (emailError) {
//       setError(emailError);
//       return false;
//     }

//     const passwordError = ValidationUtils.validatePassword(form.password);
//     if (passwordError) {
//       setError(passwordError);
//       return false;
//     }

//     if (isRegistering) {
//       const nameError = ValidationUtils.validateName(form.name);
//       if (nameError) {
//         setError(nameError);
//         return false;
//       }

//       if (!form.phone) {
//         setError('Phone number is required for registration');
//         return false;
//       }
//       if (form.phone.length !== 10) {
//         setError('Phone number must be exactly 10 digits');
//         return false;
//       }
//       if (!/^\d{10}$/.test(form.phone)) {
//         setError('Phone number must contain only digits');
//         return false;
//       }
//       if (!form.sex) {
//         setError('Please select your gender');
//         return false;
//       }
//       if (form.password.length < 6) {
//         setError('Password must be at least 6 characters long');
//         return false;
//       }
//       if (form.password.length > 20) {
//         setError('Password must not exceed 20 characters');
//         return false;
//       }
    

//     }
//     return true;
//   };

//   const handleManualSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsLoading(true);
//     setError('');

//     try {
//       let response;

//       if (isRegistering) {
//         if (!form.sex) {
//           setError('Please select your gender');
//           setIsLoading(false);
//           return;
//         }
//         const registrationData = {
//           name: form.name,
//           email: form.email,
//           password: form.password,
//           // confirmPassword: form.password,
//           phone: form.phone,
//           sex: form.sex,
//         };

//         response = await ApiService.register(registrationData);
//       } else {
//         const loginData = {
//           email: form.email,
//           password: form.password,
//         };

//         response = await ApiService.login(loginData);
//       }
//       const user = response?.user;
//       if ( response && response.token?.trim()!="") {
//         if (response?.token) {
//           localStorage.setItem('userToken', response.token);
//           document.cookie = `userToken=${response.token}; path=/; max-age=604800; SameSite=Strict; Secure`;
//           const safeUser = {
//             id: user.id,
//             name: user.name,
//             profile_picture: user.profile_picture,
//           };
//           document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(safeUser))}; path=/; max-age=604800; SameSite=Lax`;


//         }
//         onLogin(response.user);
//         onClose();
//       } 
//       else {
//         throw new Error(response.error || 'Operation failed');
//       }
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('An unexpected error occurred. Please try again.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
//     setIsLoading(true);
//     setError('');

//     try {
//       if (!credentialResponse.credential) {
//         throw new Error('Google credential is missing. Please try again.');
//       }

//       const response = await ApiService.googleLogin(credentialResponse.credential);

//       // Google login might return data directly or wrapped in ApiResponse
//       const userData = response;
//       const userToken = userData?.token;
//       const user = userData?.user;

//       if (userData && user) {
//         if (userToken) {
//           localStorage.setItem('userToken', userToken);
//           document.cookie = `userToken=${response.token}; path=/; max-age=604800; SameSite=Strict; Secure`;
//           const safeUser = {
//             id: user.id,
//             name: user.name,
//             profile_picture: user.profile_picture,
//           };
//           document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(safeUser))}; path=/; max-age=604800; SameSite=Lax`;

//         }
//         onLogin(user);
//         onClose();
//         // window.location.reload();

//       } else {
//         throw new Error('Google login failed');
//       }
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setError(err.message || 'Google login failed. Please try again.');
//       } else {
//         console.error('Google login error:', err);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleError = () => {
//     console.error('Google OAuth Error Details:', {
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//       currentOrigin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
//       userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
//     });
//     setError('Google login configuration error. Please check console or try manual login.');
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     // Disable background scroll
//     document.body.style.overflow = "hidden";

//     return () => {
//         // Re-enable scroll when popup closes
//         document.body.style.overflow = "";
//     };
// }, []);
//   return (
//     <div className="login-popup-overlay">
//       <div className="login-popup-container">
//         <button
//           className="login-popup-close-btn"
//           onClick={onClose}
//           disabled={isLoading}
//         >
//           ×
//         </button>
//         <h2 className="login-popup-title">
//           {isRegistering ? 'Create an Account' : 'Welcome Back'}
//         </h2>

//         <form onSubmit={handleManualSubmit} className="login-popup-form">
//           {isRegistering && (
//             <>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Full Name"
//                 className="login-popup-input"
//                 onChange={handleChange}
//                 value={form.name}
//                 disabled={isLoading}
//                 required
//               />
//               <select
//                 name="sex"
//                 className="login-popup-input"
//                 onChange={handleChange}
//                 value={form.sex}
//                 disabled={isLoading}
//               >
//                 <option value="" disabled>Please select your gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//               <input
//                 type="tel"
//                 name="phone"
//                 placeholder="Phone Number"
//                 className="login-popup-input"
//                 onChange={handleChange}
//                 value={form.phone}
//                 disabled={isLoading}
//                 required
//               />
//             </>
//           )}

//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             className="login-popup-input"
//             onChange={handleChange}
//             value={form.email}
//             disabled={isLoading}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             className="login-popup-input"
//             onChange={handleChange}
//             value={form.password}
//             disabled={isLoading}
//             required
//           />
//           {error && <div className="login-popup-error" style={{ color: "red" }}>{error}</div>}
//           <button
//             type="submit"
//             className="login-popup-submit-btn"
//             disabled={isLoading}
//           >
//             {isLoading
//               ? 'Processing...'
//               : isRegistering
//                 ? 'Create Account'
//                 : 'Sign In'
//             }
//           </button>
//         </form>

//         <div className="login-popup-divider">OR</div>

//         <div className="login-popup-google-container">
//           {!isLoading && (
//             <GoogleLogin
//               onSuccess={handleGoogleLogin}
//               onError={handleGoogleError}
//             />
//           )}

//         </div>

//         <p className="login-popup-toggle-text">
//           {isRegistering ? 'Already have an account?' : "Don't have an account?"}
//           <button
//             onClick={() => {
//               setIsRegistering(!isRegistering);
//               setError('');
//               setForm({
//                 name: '',
//                 email: '',
//                 phone: '',
//                 password: '',
//                 sex: '',
//               });
//             }}
//             className="login-popup-toggle-btn"
//             disabled={isLoading}
//           >
//             {isRegistering ? 'Sign In' : 'Create Account'}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { ApiService } from '../../utils/api.utils';
import { ValidationUtils } from '../../utils/validation.utils';
import { User } from '../../types';
import '../../../styles/popups/loginPopup.css';
import { CredentialResponse } from '@react-oauth/google';
import { sendOtp, verifyOtp } from "@/utils/firebaseAuthClient"; // Import Firebase OTP functions
import { AuthServices } from "@/utils/auth.utils"; // If needed for backend verify, but we'll use ApiService


interface LoginPopupProps {
  onClose: () => void;
  onLogin: (user: User, requiresPhone?: boolean) => void;
}

export default function LoginPopup({ onClose, onLogin }: LoginPopupProps) {
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

  // OTP-specific states for registration
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setOtp(value);
    setError('');
  };

  useEffect(() => {
    if (isRegistering) {
      setForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        sex: '',
      });
      // Reset OTP states on toggle to register
      resetOtpStates();
    } else {
      setForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        sex: '',
      });
    }
  }, [isRegistering]);

  // Reset OTP-related states
  const resetOtpStates = () => {
    setOtpSent(false);
    setOtp('');
    setPhoneVerified(false);
    setFirebaseToken(null);
    setResendTimer(0);
  };

  // Timer for resend cooldown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-focus OTP input after sending
  useEffect(() => {
    if (otpSent && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [otpSent]);

  const validateForm = (): boolean => {
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
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      if (form.password.length > 20) {
        setError('Password must not exceed 20 characters');
        return false;
      }
    }
    return true;
  };

  // Handle Send/Resend OTP
  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await sendOtp("+91" + form.phone);
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
      setIsLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const token = await verifyOtp(otp);
      setFirebaseToken(token);
      setPhoneVerified(true);
      setOtp(''); // Clear OTP field after success
      // setError('Phone verified successfully!'); // Optional success message
    } catch (e: any) {
      setError(e.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      let response;

      if (isRegistering) {
        if (!form.sex) {
          setError('Please select your gender');
          setIsLoading(false);
          return;
        }

        // For registration: First ensure phone is verified (OTP checked), then send to backend with firebaseToken
        if (!phoneVerified || !firebaseToken) {
          setError('Phone verification required');
          setIsLoading(false);
          return;
        }

        const registrationData = {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          sex: form.sex,
          firebaseToken, // Send the verified Firebase token to backend for linking
        };

        response = await ApiService.register(registrationData);
      } else {
        const loginData = {
          email: form.email,
          password: form.password,
        };

        response = await ApiService.login(loginData);
      }

      const user = response?.user;
      if (response && response.token?.trim() !== "") {
        if (response?.token) {
          localStorage.setItem('userToken', response.token);
          document.cookie = `userToken=${response.token}; path=/; max-age=604800; SameSite=Strict; Secure`;
          const safeUser = {
            id: user.id,
            name: user.name,
            profile_picture: user.profile_picture,
          };
          document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(safeUser))}; path=/; max-age=604800; SameSite=Lax`;
        }
        onLogin(response.user);
        onClose();
      } else {
        throw new Error(response.error || 'Operation failed');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
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

      // Google login might return data directly or wrapped in ApiResponse
      const userData = response;
      const userToken = userData?.token;
      const user = userData?.user;

      if (userData && user) {
        if (userToken) {
          localStorage.setItem('userToken', userToken);
          document.cookie = `userToken=${response.token}; path=/; max-age=604800; SameSite=Strict; Secure`;
          const safeUser = {
            id: user.id,
            name: user.name,
            profile_picture: user.profile_picture,
          };
          document.cookie = `userInfo=${encodeURIComponent(JSON.stringify(safeUser))}; path=/; max-age=604800; SameSite=Lax`;
        }
        onLogin(user);
        onClose();
        // window.location.reload();
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
    // Disable background scroll
    document.body.style.overflow = "hidden";

    return () => {
        // Re-enable scroll when popup closes
        document.body.style.overflow = "";
    };
}, []);

  return (
    <div className="login-popup-overlay">
      <div className="login-popup-container">
        <button
          className="login-popup-close-btn"
          onClick={onClose}
          disabled={isLoading}
        >
          ×
        </button>
        <h2 className="login-popup-title">
          {isRegistering ? 'Create an Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleManualSubmit} className="login-popup-form">
          {isRegistering && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="login-popup-input"
                onChange={handleChange}
                value={form.name}
                disabled={isLoading}
                required
              />
              <select
                name="sex"
                className="login-popup-input"
                onChange={handleChange}
                value={form.sex}
                disabled={isLoading}
              >
                <option value="" disabled>Please select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div className="phone-input-row"> {/* Wrapper for responsive layout */}
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="login-popup-input phone-input"
                  onChange={handleChange}
                  value={form.phone}
                  disabled={isLoading || phoneVerified} // Disable after verification
                  required
                  style={{ flex: 1 }} // Same row on desktop
                />
                {/* Verify/Resend button - below on mobile, same row on desktop */}
                <button
                  type="button"
                  className={`phone-verify-btn ${otpSent ? 'resend-btn' : ''} btn btn-black`}
                  onClick={otpSent ? handleSendOtp : handleSendOtp} // Toggle between send/resend
                  disabled={isLoading || resendTimer > 0 || !form.phone || phoneVerified}
                  style={{
                    marginLeft: otpSent ? '0' : '0.5rem', // Space in same row
                    width: otpSent ? 'auto' : 'auto',
                    flex: otpSent ? 'none' : 'none',
                    textAlign: 'center',
                    padding: '0.75rem 1rem',
                    fontSize: '0.9rem',
                  }}
                >
                  {phoneVerified
                    ? 'Verified ✓'
                    : otpSent
                    ? resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : 'Resend OTP'
                    : 'Verify Phone'
                  }
                </button>
              </div>

              {/* OTP input - shown after OTP sent */}
              {otpSent && !phoneVerified && (
                <div className="otp-input-group" >
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
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.length !== 6}
                    style={{ marginTop: "0.5rem", padding: "0.75rem" }}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              )}
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="login-popup-input"
            onChange={handleChange}
            value={form.email}
            disabled={isLoading}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="login-popup-input"
            onChange={handleChange}
            value={form.password}
            disabled={isLoading}
            required
          />
          {error && <div className="login-popup-error" style={{ color: "red" }}>{error}</div>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || (isRegistering && !phoneVerified)}
          >
            {isLoading
              ? 'Processing...'
              : isRegistering
                ? 'Create Account'
                : 'Sign In'
            }
          </button>
        </form>

        <div className="login-popup-divider">OR</div>

        <div className="login-popup-google-container">
          {!isLoading && (
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleError}
            />
          )}
        </div>

        <p className="login-popup-toggle-text">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setForm({
                name: '',
                email: '',
                phone: '',
                password: '',
                sex: '',
              });
              resetOtpStates(); // Reset on toggle
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