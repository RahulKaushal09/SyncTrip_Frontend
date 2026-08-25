'use client';
import React from 'react';
import "../../../styles/Footer.css";
import SyncTripLogoText from "../../assets/images/logoWeb.png";
import SyncTripLogo from "../../assets/images/logo_main_withoutBG.png"
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import GetItOnPlaystore from "../../assets/icons/GetOnPlayStoreSVG.svg";
import GetItOnAppStore from "../../assets/icons/GetOnAppStore.svg";
import { APP_LINKS } from '@/constants';

const Footer = () => {
    const pathname = usePathname();
    const router = useRouter();
    const shouldHideFooter = pathname.includes('/chats') || pathname.includes('/invite') || pathname.includes('/groups') || pathname.includes('/create') || (pathname.includes('userTrip/') && pathname.includes('/travel-mode')) || (pathname.includes('userTrip/') && pathname.includes('/groups')) || (pathname.includes('userTrip/') && pathname.includes('/planner')) || (pathname.includes('userTrip/') && pathname.includes('/matching')) || pathname.includes('/checkout') || pathname.includes('/club') || pathname.includes('/careers/linkedin/march-2026') || pathname.includes('/explore/plans') || pathname.includes('/profile');

    const companyLinks = [
        { name: 'About', url: '/about' },
        // { name: 'Explore', url: '/explore' },
        { name: 'Blog', url: '/blogs' },
        // { name: 'Plans', url: '/explore/plans' },
    ];

    /**
     * Sitewide internal links.
     *
     * Until now the homepage exposed exactly three crawlable internal URLs
     * (/, /about, /blogs) because the navbar and every card navigate with
     * router.push, which crawlers cannot follow. These rows put the city and
     * destination hubs on every page of the site, which is how link equity
     * reaches them at all.
     */
    const cityLinks = [
        { name: 'Gurgaon', url: '/city/gurgaon' },
        { name: 'Delhi', url: '/city/delhi' },
        { name: 'Noida', url: '/city/noida' },
        { name: 'Faridabad', url: '/city/faridabad' },
    ];

    const exploreLinks = [
        { name: 'Destinations', url: '/explore' },
        { name: 'Local plans & meetups', url: '/explore/plans' },
        { name: 'Travel blog', url: '/blogs' },
        { name: 'How it works', url: '/how-it-works' },
    ];

    const contactLinks = [
        { name: 'Help Center', url: 'https://www.instagram.com/synctrips/' },
        { name: 'Feedback', url: 'https://www.instagram.com/synctrips/' },
    ];

    return (
        <footer className="footer" style={{ display: shouldHideFooter ? 'none' : 'block' }}>
            <div id="recaptcha-container" />
            <div className="footer-content">
                {/* Brand Section */}
                <div className="footer-section brand-section">
                    <div onClick={() => router.push('/')} className='footer-logo'>
                        <img
                            src={SyncTripLogo.src}
                            alt="SyncTrip Icon"
                            className="footer-logo-icon"
                        />
                        <img
                            src={SyncTripLogoText.src}
                            alt="SyncTrip Text"
                            className="footer-logo-text"
                        />
                    </div>
                    <p className='footerTextColorNormal footer-tagline'>
                        Plan together, travel smarter - sync your perfect trip in minutes.
                    </p>
                </div>

                {/* Company Links */}
                <div className="footer-section">
                    <h3 className="footer-title">Company</h3>
                    <ul className="footer-nav-list ul-withNoListStyle">
                        {companyLinks.map((link, index) => (
                            <li key={index} className="footer-nav-item">
                                <a className='footerTextColorNormal' href={link.url}>
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Links */}
                <div className="footer-section">
                    <h3 className="footer-title">Contact</h3>
                    <ul className="footer-nav-list ul-withNoListStyle">
                        {contactLinks.map((link, index) => (
                            <li key={index} className="footer-nav-item">
                                <a
                                    className='footerTextColorNormal'
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social & App Links */}
                <div className="footer-section">
                    <h3 className="footer-title">Follow Us</h3>
                    <div className="social-icons">
                        <a
                            href="https://www.facebook.com/profile.php?id=61575952974556"
                            className="social-icon"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <Facebook size={20} strokeWidth={1.5} />
                        </a>
                        <a
                            href="https://www.instagram.com/synctrips/"
                            className="social-icon"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <Instagram size={20} strokeWidth={1.5} />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/synctrip"
                            className="social-icon"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={20} strokeWidth={1.5} />
                        </a>
                    </div>

                    {/* App Button */}
                    <h3 className="footer-title" style={{ marginTop: "30px", marginBottom: "15px" }}>
                        Get the App
                    </h3>
                    <div className="app-buttons gap-3">
                        <a
                            href={APP_LINKS.PLAY_STORE} // replace with actual Play Store link
                            className="playstore-btn"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Get it on Google Play"
                        >
                            <img
                                src={GetItOnPlaystore.src}
                                alt="Get it on Google Play"
                                className="playstore-img"
                            />
                        </a>
                        <a
                            href={APP_LINKS.APP_STORE} // replace with actual App Store link
                            className="playstore-btn select-none"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Get it on App Store"
                        >
                            <img
                                src={GetItOnAppStore.src}
                                alt="Get it on App Store"
                                className="appstore-img"
                            />
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-links-row">
                <div className="footer-links-group">
                    <span className="footer-links-label">Plans in Delhi NCR</span>
                    <div className="footer-links-set">
                        {cityLinks.map((link) => (
                            <Link key={link.url} className="footerTextColorNormal" href={link.url}>
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="footer-links-group">
                    <span className="footer-links-label">Explore</span>
                    <div className="footer-links-set">
                        {exploreLinks.map((link) => (
                            <Link key={link.url} className="footerTextColorNormal" href={link.url}>
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright">
                    © 2026 Synctrip. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;