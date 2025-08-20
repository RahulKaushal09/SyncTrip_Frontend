"use client";

import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPopup from '../popups/LoginPopup';
import FullProfilePopup from '../popups/FullProfilePopup';
import PhoneNumberPopup from '../popups/PhoneNumberPopup';
import { setLoginHandler, type LoginOptions } from '../../utils/login.utils';
import { StorageUtils } from '../../utils';
import { User } from '../../types';

interface LoginContextType {
    user: User | null;
    isLoggedIn: boolean;
    openLogin: (callback?: (user: User, requiresPhone?: boolean) => void, options?: LoginOptions) => void;
    closeLogin: () => void;
    logout: () => void;
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

    useEffect(() => {
         if (!user) {
        const storedUser = StorageUtils.getUser();
        if (storedUser) setUser(storedUser);
         }
     }, [user]);

    const [showPhoneNumber, setShowPhoneNumber] = useState(false);
    const [showFullProfile, setShowFullProfile] = useState(false);

    const openLogin = useCallback((callback?: (user: User, requiresPhone?: boolean) => void, options: LoginOptions = {}) => {
        setOnLoginCallback(() => callback || (() => { }));
        setLoginOptions(options);
        setShowLogin(true);
    }, []);

    const closeLogin = useCallback(() => {
        setShowLogin(false);
    }, []);

    const logout = useCallback(() => {
        StorageUtils.clearUserData();
        setUser(null);
        window.location.reload();
    }, []);

    const handleLogin = useCallback((user: User, requiresPhone = false) => {
        setUser(user);
        StorageUtils.setUser(user);

        if (loginOptions.skipCompleteProfile) {
            // Skip phone and profile completion
            onLoginCallback(user, false);
            return;
        }

        if (!user.phone) {
            requiresPhone = true;
        }

        if (requiresPhone) {
            setShowPhoneNumber(true);
        } else if (!(user as User).profileCompleted) {
            setShowFullProfile(true);
        }
        else{
            // User is fully logged in
            onLoginCallback(user, false);
        }

        // Always run the external callback
        // onLoginCallback(user, requiresPhone);
    }, [onLoginCallback, loginOptions]);

    // Register login popup globally
    useEffect(() => {
        setLoginHandler(openLogin);
    }, [openLogin]);

    const contextValue: LoginContextType = {
        user,
        isLoggedIn: !!user,
        openLogin,
        closeLogin,
        logout,
    };

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <LoginContext.Provider value={contextValue}>
                {children}

                {showLogin && (
                    <LoginPopup
                        onClose={closeLogin}
                        onLogin={handleLogin}
                    />
                )}

                {/* Phone popup logic */}
                {showPhoneNumber && user && (
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
                )}

                {/* Profile popup logic */}
                {showFullProfile && user && (
                    <FullProfilePopup
                        user={user}
                        onClose={() => setShowFullProfile(false)}
                        onProfileComplete={(updatedUser) => {
                            setUser(updatedUser);
                            StorageUtils.setUser(updatedUser);
                            setShowFullProfile(false);
                            window.location.reload();
                        }}
                    />
                )}
            </LoginContext.Provider>
        </GoogleOAuthProvider>
    );
};
