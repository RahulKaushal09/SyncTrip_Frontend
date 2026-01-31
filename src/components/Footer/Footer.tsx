'use client';
import React from 'react';
import "../../../styles/Footer.css";
import SyncTripLogoText from "../../assets/images/logoWeb.png";
import SyncTripLogo from "../../assets/images/logo_main_withoutBG.png"
import { usePathname } from 'next/navigation';
import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
    const pathname = usePathname();
    const shouldHideFooter = pathname.includes('/chats') || pathname.includes('/create') ||(pathname.includes('userTrip/') && pathname.includes('/groups'))||(pathname.includes('userTrip/') && pathname.includes('/planner')) || (pathname.includes('userTrip/') && pathname.includes('/matching'));

    const companyLinks = [
        { name: 'About', url: '/about' },
        { name: 'How It Works', url: '/how-it-works' },
        { name: 'Blog', url: '/blogs' },
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
                    <div className='footer-logo'>
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
                        Plan together, travel smarter — sync your perfect trip in minutes.
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
                    </div>

                    {/* <h3 className="footerTextColorNormal" style={{ fontSize: "1.55rem" }}>
                        Discover our app
                    </h3>

                    <div className="app-buttons">
                        <a
                            href="https://play.google.com/store/apps/details?id=com.synctrip.app" // replace with actual Play Store link
                            className='buttonGetApp'
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Get it on Google Play"
                        >
                            <FaGooglePlay style={{ marginRight: "10px", width: "40px", height: "40px" }} />
                            <p style={{ marginBottom: 0 }}>Get it on Google Play</p>
                        </a>
                        <a
                            href="https://apps.apple.com/us/app/synctrip/id1234567890" // replace with actual App Store link
                            className='buttonGetApp'
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Available on the App Store"
                        >
                            <FaApple style={{ marginRight: "10px", width: "40px", height: "40px" }} />
                            <p style={{ marginBottom: 0 }}>Available on the App Store</p>
                        </a>
                    </div> 
                    */}
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright">
                    © 2025 Synctrip. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;