"use client";

import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPopup from '../popups/LoginPopup';
import FullProfilePopup from '../popups/FullProfilePopup';
// import PhoneNumberPopup from '../popups/PhoneNumberPopup';
import { setLoginHandler, type LoginOptions } from '../../utils/login.utils';
import { StorageUtils } from '../../utils';
import { User } from '../../types';

import { requestFcmToken, onForegroundNotification } from '../../utils/firebaseClient';
import apiClient from '@/utils/apiClient';
import { STORAGE_KEYS } from '@/constants';
import { UserApiService } from '@/utils/user.api.utils';

interface LoginContextType {
    user: User | null;
    isLoggedIn: boolean;
    openLogin: (callback?: (user: User, requiresPhone?: boolean) => void, options?: LoginOptions) => void;
    closeLogin: () => void;
    logout: () => void;
    updateUserProfilePicture: (newUrl: string) => void;
    updateUserFields: (fields: Partial<User>) => void;
    updateLastStepOfCompleteProfile: (step: number) => void;
    lastStepOfCompleteProfile: number;
    isEmailVerified: boolean;
    registerFcmTokenForUser: (u: User | null) => Promise<void>;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const useLogin = () => {
    const context = useContext(LoginContext);
    if (context === undefined) {
        throw new Error('useLogin must be used within a LoginProvider');
    }
    return context;
};

interface LoginProviderProps {
    children: React.ReactNode;
    //   initialUser?: User | null;

}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
    const [showLogin, setShowLogin] = useState(false);
    const [loginOptions, setLoginOptions] = useState<LoginOptions>({});
    const [onLoginCallback, setOnLoginCallback] = useState<(user: User, requiresPhone?: boolean) => void>(() => () => { });
    const [user, setUser] = useState<User | null>(null);
    const [lastStepOfCompleteProfile, setLastStepOfCompleteProfile] = useState<number>(1);
    // const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(() => {
        if (typeof window === "undefined") return false;
        return StorageUtils.getItem<boolean>(STORAGE_KEYS.EMAIL_VERIFIED) || false;
    });

    useEffect(() => {
        StorageUtils.setItem(STORAGE_KEYS.EMAIL_VERIFIED, isEmailVerified);
    }, [isEmailVerified]);


    useEffect(() => {
        if (!user) {
            const storedUser = StorageUtils.getUser();
            if (storedUser) setUser(storedUser);
        }
    }, [user]);

    useEffect(() => {
        if (StorageUtils.getItem<number>(STORAGE_KEYS.COMPLETE_PROFILE_STEP)) {
            setLastStepOfCompleteProfile(StorageUtils.getItem<number>(STORAGE_KEYS.COMPLETE_PROFILE_STEP) || 1);
        }

        if (!lastStepOfCompleteProfile && user) {
            if (user.profileCompleted) {
                setLastStepOfCompleteProfile(5);
            }
        }
    }, [lastStepOfCompleteProfile, user]);

    const [showPhoneNumber, setShowPhoneNumber] = useState(false);
    const [showFullProfile, setShowFullProfile] = useState(false);

    // const openLogin = useCallback((callback?: (user: User, requiresPhone?: boolean) => void, options: LoginOptions = {}) => {
    //     console.log("openLogin called with options:", options);
    //     setOnLoginCallback(() => callback || (() => { }));
    //     setLoginOptions(options);
    //     setShowLogin(true);
    // }, []);
    const openLogin = useCallback(
        (callback?: (user: User, requiresPhone?: boolean) => void, options: LoginOptions = {}) => {

            const existingUser = StorageUtils.getUser();

            setOnLoginCallback(() => callback || (() => { }));
            setLoginOptions(options);

            // --- CASE 1: User already logged in ---
            if (existingUser) {
                if (!existingUser.name || existingUser.name === null) existingUser.name = "Guest User";
                setUser(existingUser);

                // skipCompleteProfile -> force skip
                if (options.skipCompleteProfile) {
                    callback?.(existingUser, false);
                    return;
                }

                // Stage 1: No phone
                if (!existingUser.phone) {
                    setShowFullProfile(true);
                    return;
                }

                // Stage 2: Phone present but profile incomplete
                if (!existingUser.profileCompleted) {
                    setShowFullProfile(true);
                    return;
                }

                // Stage 3: Everything complete
                callback?.(existingUser, false);
                return;
            }

            // --- CASE 2: User NOT logged in → Show login popup ---
            setShowLogin(true);
        },
        []
    );

    const closeLogin = useCallback(() => {
        setShowLogin(false);
    }, []);

    const logout = useCallback(async () => {
        try {
            await UserApiService.logoutUser();

        } catch (error) {
            console.error("Error during logout API call:", error);
        }
        StorageUtils.clearUserData();
        setUser(null);
        window.location.reload();
    }, []);

    // -------------- FCM registration logic --------------
    // Register FCM token and save it to backend for the current user.
    const registerFcmTokenForUser = useCallback(async (u: User | null) => {
        if (typeof window === "undefined") return;
        if (!u) return;
        try {
            // ask for permission and get token (this registers SW if necessary)
            const token = await requestFcmToken();
            if (!token) {
                console.debug("FCM token not granted or failed to get token");
                return;
            }
            if (u.fcmToken === token) {
                console.debug("FCM token is already up to date in user profile.");
                return;
            }
            // send to backend - use apiClient if available (it should attach auth header), else use fetch
            try {
                if (apiClient && typeof apiClient.post === "function") {
                    await apiClient.post("/notifications/save-token", { token });
                } else {
                    // fallback - use fetch and attach Authorization
                    const auth = StorageUtils.getToken();
                    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || ""}/api/notifications/save-token`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
                        },
                        body: JSON.stringify({ token }),
                    });
                }
                updateUserFields({ fcmToken: token });
                console.log("FCM token registered with backend");
            } catch (err) {
                console.error("Failed to save FCM token to backend", err);
            }
        } catch (err) {
            console.error("registerFcmTokenForUser error", err);
        }
    }, []);

    const handleLogin = useCallback((user: User, requiresPhone = false) => {
        if (!user.name || user.name === null) user.name = "Guest User";
        setUser(user);
        StorageUtils.setUser(user);

        const emailVerified = !!user?.email; // or detect google
        setIsEmailVerified(emailVerified);

        if (loginOptions.skipCompleteProfile) {
            // Skip phone and profile completion
            onLoginCallback(user, false);
            return;
        }

        if (!user.phone) {
            requiresPhone = true;
        }

        if (requiresPhone) {
            setShowFullProfile(true);
        } else if (!(user as User).profileCompleted) {
            setShowFullProfile(true);
        }
        else {

            // User is fully logged in
            onLoginCallback(user, false);
            registerFcmTokenForUser(user);
        }

        // Always run the external callback
        // onLoginCallback(user, requiresPhone);
    }, [onLoginCallback, loginOptions, registerFcmTokenForUser]);

    // Register login popup globally
    useEffect(() => {
        setLoginHandler(openLogin);
    }, [openLogin]);

    const updateLastStepOfCompleteProfile = useCallback((step: number) => {
        const existingStep = StorageUtils.getItem<number>(STORAGE_KEYS.COMPLETE_PROFILE_STEP) || 1;
        if (step <= existingStep) return;
        StorageUtils.setItem<number>(STORAGE_KEYS.COMPLETE_PROFILE_STEP, step);
        console.log("Updated COMPLETE_PROFILE_STEP in storage to:", step);
        setLastStepOfCompleteProfile(step);
    }, []);

    const handleProfileComplete = useCallback((updatedUser: User) => {
        setUser(updatedUser);
        StorageUtils.setUser(updatedUser);
        setShowFullProfile(false);

        onLoginCallback(updatedUser, false);
        registerFcmTokenForUser(updatedUser);
    }, [onLoginCallback, registerFcmTokenForUser]);
    const updateUserFields = useCallback((fields: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return prev;

            const updatedUser = {
                ...prev,
                ...fields,
            };

            StorageUtils.setUser(updatedUser);
            return updatedUser;
        });
    }, []);
    const updateUserProfilePicture = useCallback((newUrl: string) => {
        setUser((prev) => {
            if (!prev) return prev;

            const updatedUser: User = {
                ...prev,
                profile_picture: [
                    newUrl,                       // ✅ newest first
                    ...(prev.profile_picture || [])
                ],
            };

            // ✅ keep localStorage in sync
            StorageUtils.setUser(updatedUser);

            return updatedUser;
        });
    }, []);

    const contextValue: LoginContextType = {
        user,
        isLoggedIn: !!user,
        openLogin,
        closeLogin,
        logout,
        updateUserProfilePicture,
        updateUserFields,
        updateLastStepOfCompleteProfile,
        lastStepOfCompleteProfile,
        isEmailVerified,
        registerFcmTokenForUser
    };

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <LoginContext.Provider value={contextValue}>
                {children}

                {showLogin && (
                    <LoginPopup
                        onClose={closeLogin}
                        onLogin={handleLogin}
                        headingText={loginOptions.headingText}
                        onEmailVerification={() => setIsEmailVerified(true)}
                    />
                )}

                {/* Phone popup logic */}
                {/* {showPhoneNumber && user && (
                    <PhoneNumberPopup
                        user={user}
                        onClose={() => setShowPhoneNumber(false)}
                        onPhoneSubmit={(updatedUser) => {
                            setUser(updatedUser);
                            StorageUtils.setUser(updatedUser);
                            setShowPhoneNumber(false);

                            if (!(updatedUser as User).profileCompleted) {
                                setShowFullProfile(true);
                            }
                        }}
                    />
                )} */}

                {/* Profile popup logic */}
                {(showPhoneNumber || showFullProfile) && user && (
                    <FullProfilePopup
                        user={user}
                        onClose={() => setShowFullProfile(false)}
                        // onProfileComplete={(updatedUser) => {
                        //     setUser(updatedUser);
                        //     StorageUtils.setUser(updatedUser);
                        //     setShowFullProfile(false);
                        //     // window.location.reload();
                        // }}
                        onProfileComplete={handleProfileComplete}
                    />
                )}
            </LoginContext.Provider>
        </GoogleOAuthProvider>
    );
};
