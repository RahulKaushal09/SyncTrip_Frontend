import React from 'react'
import LoggedInHeroSection from './LoggedInHeroSection';
import HomeHeroSection from './HomeHeroSection';
import { CookieUtils } from '@/utils/cookie.utils';

const HomeWrapper = async ({ version }: { version?: string }) => {
    // v1: group cards (only if logged in, else nothing), v2: loggedin state
    const isLoggedIn = await CookieUtils.isUserLoggedIn();

    if (isLoggedIn && version === 'v2') {
        return <LoggedInHeroSection />;
    } else if (!isLoggedIn && version === 'v2') {
        return <HomeHeroSection />;
    }

    if (version === 'v1' && isLoggedIn) {
        return <HomeHeroSection />;
    }

    return null;
}

export default HomeWrapper
