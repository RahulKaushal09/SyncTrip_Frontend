'use client';
import React from 'react';
import "../../../styles/Footer.css";
import SyncTripLogo from "../../assets/images/logoWeb.png";
import { usePathname } from 'next/navigation';
// import { FaFacebook, FaGooglePlay, FaInstagram, FaApple } from 'react-icons/fa';


const Footer = () => {
    const pathname = usePathname();
    const shouldHideFooter = pathname.includes('/chats') || pathname.includes('/create') || pathname.includes('userTrip/planner') || pathname.includes('userTrip/matching');

    const companyLinks = [
        { name: 'About', url: '/about' },
        { name: 'How It Works', url: '/how-it-works' },
        { name: 'Blog', url: '/blogs' },
    ];

    const contactLinks = [
        { name: 'Help Center', url: 'https://www.instagram.com/synctrips/' },
        {name: 'Feedback', url: 'https://www.instagram.com/synctrips/'},
        // { name: 'Press', url: '/home' },
        // { name: 'FAQs', url: 'https://www.instagram.com/synctrips/' },
    ];

    return (
        <footer className="footer" style={{ display: shouldHideFooter ? 'none' : 'block' }}>
            <div className="footer-content">
                {/* Logo & Tagline */}
                <div className="footer-section">
                    <img
                        src={SyncTripLogo.src}
                        alt="SyncTrip Logo"
                        className="footer-logo"
                        style={{ width: "30%", marginBottom: "50px" }}
                    />
                    <p className='footerTextColorNormal'>
                        Plan together, travel smarter—sync your perfect trip in minutes.
                    </p>
                </div>

                {/* Company Links */}
                <div className="footer-section">
                    <h3 className="footer-title">Company</h3>
                    <ul className="footer-nav-list">
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
                    <ul className="footer-nav-list">
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
                    <div className="social-icons">
                        <a
                            href="https://www.facebook.com/profile.php?id=61575952974556"
                            className="social-icon"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            {/* <FaFacebook /> */}
                        </a>
                        <a
                            href="https://www.instagram.com/synctrips/"
                            className="social-icon"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            {/* <FaInstagram /> */}
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
                    </div> */}
                </div>
            </div>

            <p className="copyright">
                © 2025 Synctrip. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
