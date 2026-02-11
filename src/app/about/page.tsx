import React from 'react';
import { Metadata } from 'next';
import TeamImage from '../../assets/images/teamImage.png';
import MapPlanner from '../../assets/images/InviteOnlyScreenMapView.png';
import Image from 'next/image';

/* ================= SEO METADATA ================= */
export const metadata: Metadata = {
    title: 'About SyncTrip | The Collaborative Travel Planner',
    description: 'SyncTrip is revolutionizing group travel with real-time itinerary collaboration. Connect with us on LinkedIn, Product Hunt, and AngelList.',
    keywords: ['travel planner', 'group travel', 'collaborative itinerary', 'trip organizer', 'SyncTrip team', 'travel startup'],
    openGraph: {
        title: 'About SyncTrip',
        description: 'Planning trips together, simplified. Meet the team behind the best group travel tool.',
        type: 'website',
        url: 'https://synctrip.com/about',
        siteName: 'SyncTrip',
    },
};

/* ================= SOCIAL LINKS DATA (With SVG Logos) ================= */
const SOCIALS = [
    {
        name: 'Product Hunt',
        url: 'https://www.producthunt.com/@rahulkaushal',
        desc: 'Upvote Us',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.5 13.5H10V15H8.5V9H13.5C14.74 9 15.75 10.01 15.75 11.25C15.75 12.49 14.74 13.5 13.5 13.5ZM13.5 10.5H10V12H13.5C13.91 12 14.25 11.66 14.25 11.25C14.25 10.84 13.91 10.5 13.5 10.5Z" />
            </svg>
        )
    },
    {
        name: 'Crunchbase',
        url: 'https://www.crunchbase.com/organization/synctrip',
        desc: 'Company Profile',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 18V6H18V2H6V6H2V18H6V22H18V18H22ZM18 18H6V6H18V18Z" />
                <path d="M10 10H14V14H10V10Z" />
            </svg>
        )
    },
    {
        name: 'Pinterest',
        url: 'https://in.pinterest.com/synctrip/',
        desc: 'Travel Boards',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.017 0C5.396 0 0.029 5.367 0.029 11.987C0.029 17.046 3.167 21.432 7.643 23.136C7.575 22.185 7.669 20.573 7.892 19.619C8.1 18.736 9.256 13.844 9.256 13.844C9.256 13.844 8.905 13.141 8.905 12.102C8.905 10.285 9.959 8.928 11.267 8.928C12.383 8.928 12.924 9.764 12.924 10.769C12.924 11.891 12.207 13.565 11.836 15.119C11.526 16.42 12.492 17.481 13.784 17.481C16.104 17.481 17.887 15.035 17.887 11.509C17.887 8.379 15.688 6.196 12.086 6.196C7.904 6.196 5.449 9.333 5.449 12.527C5.449 13.772 5.927 15.109 6.536 15.848C6.657 15.993 6.675 16.077 6.639 16.223C6.586 16.436 6.438 17.039 6.392 17.228C6.326 17.5 6.132 17.595 5.86 17.483C4.336 16.776 3.361 14.869 3.361 12.574C3.361 7.618 6.953 3.978 12.348 3.978C16.68 3.978 20.046 7.065 20.046 11.559C20.046 16.289 17.063 20.082 13.931 20.082C12.882 20.082 11.902 19.539 11.565 18.892C11.565 18.892 11.006 21.011 10.887 21.465C10.669 22.296 10.087 23.362 9.767 23.876C11.233 24.332 12.787 24.417 14.332 24.116C18.667 23.271 22.378 20.088 23.518 15.82C24.658 11.551 23.013 7.025 19.387 4.453C17.275 2.955 14.717 2.053 12.017 2.053V0Z" />
            </svg>
        )
    },
    {
        name: 'LinkedIn',
        url: 'https://linkedin.com/company/synctrip',
        desc: 'Company News',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452H16.892V14.88C16.892 13.553 16.866 11.848 15.043 11.848C13.193 11.848 12.91 13.29 12.91 14.783V20.452H9.354V9H12.768V10.565H12.816C13.291 9.664 14.453 8.715 16.182 8.715C19.782 8.715 20.447 11.086 20.447 14.167V20.452ZM5.337 7.433C4.196 7.433 3.274 6.509 3.274 5.37C3.274 4.229 4.196 3.307 5.337 3.307C6.476 3.307 7.4 4.229 7.4 5.37C7.4 6.509 6.476 7.433 5.337 7.433ZM3.562 20.452H7.116V9H3.562V20.452Z" />
            </svg>
        )
    },
    {
        name: 'Wellfound',
        url: 'https://wellfound.com/company/synctrip',
        desc: 'Jobs & Culture',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 10.5L15.2 20H18.8L23.2 4H19.5L16.8 15.8L13.7 4H10.3L7.2 15.8L4.5 4H0.8L5.2 20H8.8L12 10.5Z" />
            </svg>
        )
    },
    {
        name: 'Instagram',
        url: 'https://instagram.com/synctrips',
        desc: 'Visual Inspiration',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
            </svg>
        )
    },
    {
        name: 'Twitter / X',
        url: 'https://x.com/synctrip44398',
        desc: 'Latest Updates',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99003 21.75H1.68003L9.41003 12.915L1.25403 2.25H8.08003L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.08403 4.126H5.11703L17.083 19.77Z" />
            </svg>
        )
    },
    {
        name: 'YouTube',
        url: 'https://www.youtube.com/@synctripofficial',
        desc: 'Tutorials & Vlogs',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.615 3.184C21.378 3.184 22.813 4.619 22.813 6.382V17.618C22.813 19.379 21.378 20.814 19.615 20.814H4.385C2.622 20.814 1.187 19.38 1.187 17.618V6.382C1.187 4.62 2.622 3.184 4.385 3.184H19.615ZM9.851 15.651L15.422 12.001L9.851 8.352V15.651Z" />
            </svg>
        )
    },
    {
        name: 'IndieHackers',
        url: 'https://www.indiehackers.com/product/synctrip',
        desc: 'Build Journey',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H24V24H0V0ZM4.8 4.8V19.2H8.4V14.4H15.6V19.2H19.2V4.8H15.6V9.6H8.4V4.8H4.8Z" />
            </svg>
        )
    },
    // {
    //     name: 'Devpost',
    //     url: 'https://devpost.com/software/synctrip-jyv905',
    //     desc: 'Hackathons',
    //     icon: (
    //         <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    //             <path d="M6.002 4.805L12.59 2.553L19.176 4.805V13.886L12.59 19.689L6.002 13.886V4.805ZM12.59 16.924L16.48 13.488V6.634L12.59 5.3L8.7 6.634V13.488L12.59 16.924Z" />
    //         </svg>
    //     )
    // },
    // {
    //     name: 'Betalist',
    //     url: 'https://betalist.com',
    //     desc: 'Early Access',
    //     icon: (
    //         <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    //             <path d="M4 4H20V20H4V4ZM15 16H17V8H15V16ZM7 8V10H13V8H7ZM7 11V13H13V11H7ZM7 14V16H13V14H7Z" />
    //         </svg>
    //     )
    // },
    // {
    //     name: 'AlternativeTo',
    //     url: 'https://alternativeto.net',
    //     desc: 'Compare Us',
    //     icon: (
    //         <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    //             <path d="M16 8L20 12L16 16M4 12H20M8 16L4 12L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    //         </svg>
    //     )
    // },
    {
        name: 'StartupRanking',
        url: 'https://www.startupranking.com/startup/synctrip',
        desc: 'Global Listing',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" />
            </svg>
        )
    },
    {
        name: 'Peerlist',
        url: 'https://peerlist.io/synctrip/project/synctrip--finding-you-travel-buddies',
        desc: 'Product Profile',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 9.5C21 13.6421 17.6421 17 13.5 17H9V22H5V2H13.5C17.6421 2 21 5.35786 21 9.5ZM13.5 13C15.433 13 17 11.433 17 9.5C17 7.567 15.433 6 13.5 6H9V13H13.5Z" />
            </svg>
        )
    },
];

/* ================= SCHEMA MARKUP (JSON-LD) ================= */
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SyncTrip',
    url: 'https://synctrip.com',
    logo: 'https://synctrip.com/logo.png',
    sameAs: SOCIALS.map(s => s.url),
    description: 'A collaborative travel planning platform allowing groups to synchronize itineraries in real-time.',
};

export default function AboutPage() {
    return (
        <main className="App bg-background">
            {/* Inject Structured Data for Google Rich Results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Internal Styles for Custom Animations & Layouts */}
            <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .image-stack-container {
            margin-top: 60px;
            /* Allow height to grow on mobile */
            min-height: 350px !important; 
          }
        }

        /* Image Stacking Logic */
        .image-stack-container {
          position: relative;
          width: 100%;
          /* Increased container height to accommodate larger images */
          min-height: 500px; 
        }

        .stack-img {
          position: absolute;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          /* Changed to 'all' and 'cubic-bezier' for a smoother, premium feel */
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          object-fit: cover;
          border: 4px solid var(--white);
          cursor: pointer; /* Indicates interactivity */
        }

        /* TEAM IMAGE: Large Background */
        .stack-team {
          width: 85%;
          height: auto;
          aspect-ratio: 4/3;
          top: 0;
          right: 0;
          z-index: 1; /* Starts behind */
          transform: rotate(4deg);
        }

        /* MAP IMAGE: Overlapping UI */
        .stack-map {
          width: 60%;
          height: auto;
          bottom: 40px;
          left: 0;
          z-index: 2;
          transform: rotate(-8deg);
        }
        
        .stack-team:hover {
          z-index: 10; 
          transform: scale(1.05) rotate(0deg);
          box-shadow: 0 35px 60px rgba(0,0,0,0.25);
        }

        .stack-map:hover {
          z-index: 10;
          transform: scale(1.05) rotate(0deg);
          box-shadow: 0 35px 60px rgba(0,0,0,0.25);
        }

        /* Social Card Grid */
        .social-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .social-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: var(--white);
          border: 1px solid var(--neutral-4);
          border-radius: 12px;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .social-card:hover {
          border-color: var(--primary-1);
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(58, 190, 245, 0.15);
        }

        /* This targets the SVG inside the card on hover to make it blue */
        .social-card:hover {
          color: var(--primary-1);
        }

        .social-card:hover .social-name {
          color: var(--primary-1);
        }
      `}</style>

            {/* ================= HERO SECTION ================= */}
            <section className="container-custom">
                <div className="marginSectionLeftRight paddingSectionLeftRight" style={{ paddingBottom: '80px' }}>

                    <div className="hero-grid">
                        {/* Left Column: Content */}
                        <div className="m-animate m-slide-up">
                            <span className="s1 text-primary-1" style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>
                                About Us
                            </span>
                            <h1 className="h2 text-secondary-1" style={{ marginTop: '15px' }}>
                                Building the Future of <br />
                                <span className="text-primary-1 italic">Connected Travel</span>
                            </h1>
                            <p className="r1 text-neutral-1" style={{ marginTop: '20px', lineHeight: '1.6' }}>
                                Most trips die in the planning phase, lost in a mess of fragmented docs and endless group chats.
                            </p>
                            <p className="r1 text-neutral-1" style={{ marginTop: '15px', lineHeight: '1.6' }}>
                                <strong>SyncTrip</strong> is the collaborative engine that turns travel chaos into synchronized itineraries. We are a team of engineers and explorers dedicated to building a seamless, real-time platform where solo travelers and groups can plan, budget, and explore with total confidence!
                            </p>

                            <div style={{ marginTop: '30px' }}>
                                <a href="/explore" className="btn btn-primary-border">
                                    Plan your trip for Free
                                </a>
                            </div>
                        </div>

                        {/* Right Column: Overlapping Images */}
                        <div className="image-stack-container m-animate m-fade-in">

                            <Image
                                src={TeamImage}
                                alt="The SyncTrip Team"
                                className="stack-img stack-team bg-primary-5"
                            />

                            <Image
                                src={MapPlanner}
                                alt="SyncTrip Map Interface"
                                className="stack-img stack-map bg-neutral-3"
                            />
                        </div>
                    </div>

                </div>
            </section>

            {/* ================= SOCIALS SECTION ================= */}
            <section id="connect" className="bg-secondary-5" style={{ padding: '80px 0' }}>
                <div className="container-custom">
                    <div className="marginSectionLeftRight paddingSectionLeftRight">

                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h2 className="h2 italic text-secondary-1">Follow Our Journey</h2>
                            <p className="r1 text-neutral-1" style={{ maxWidth: '600px', margin: '0 auto' }}>
                                We are building and growing as a global community.
                                Connect with us across the web to stay updated on the latest features & updates!
                            </p>
                        </div>

                        <div className="social-grid m-animate m-slide-up">
                            {SOCIALS.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-card"
                                    title={`Follow SyncTrip on ${social.name}`}
                                >
                                    <div style={{ width: '24px', height: '24px', color: 'inherit' }}>
                                        {social.icon}
                                    </div>
                                    <div>
                                        <div className="b2 text-secondary-1 social-name">{social.name}</div>
                                        <div className="s2 text-neutral-2">{social.desc}</div>
                                    </div>
                                </a>
                            ))}
                        </div>

                    </div>
                </div>
            </section>

            <section className="bg-white" style={{ padding: '40px 0', textAlign: 'center' }}>
                <h3 className="h3 !italic text-secondary-1">Traveling Solo? Not Anymore.</h3>
                <p className="r1 text-neutral-1">SyncTrip connects solo explorers with like-minded travelers. Build your bucket list, share your itinerary, and find your next travel companion in one click.</p>
            </section>
        </main>
    );
}