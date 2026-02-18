"use client";

import "../../../styles/home/home.css";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { useLoader } from '@/components/providers/LoaderContext';
import { Heart, Plane, Star, Sparkles, ShieldCheck, PlaneIcon, Compass } from "lucide-react";
import GroupTripImage from "../../assets/images/groupTripDetails.png";
import GroupTripMembers from "../../assets/images/groupTripMembers.png";
import Image from "next/image";
import { triggerLogin } from "@/utils";

const HomeHeroSection: React.FC = () => {
    const { showLoader } = useLoader();
    const router = useRouter();
    const isMobile = typeof window !== "undefined" ? window.innerWidth <= 500 : false;
    const floatingIcons = [
        { icon: Heart, color: "#e5484d", delay: "0s" },
        { icon: Plane, color: "#3abef5", delay: "0.5s" },
        { icon: Star, color: "#ffc53d", delay: "1s" },
    ];

    const redirectToUrl = (redirectUrl: string) => {
        showLoader();
        router.push(redirectUrl);
    };

    return (
        <section className="homeHeroSection">
            {/* FLOATING ICONS */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hide-tablet-down">
                {floatingIcons.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            key={index}
                            className="floating-icon-hero"
                            style={{
                                left: `${15 + index * 30}%`,
                                top: `${20 + index * 25}%`,
                                animationDelay: item.delay,
                                zIndex: 1
                            }}
                        >
                            <div className="icon-wrapper-hero" style={{ backgroundColor: item.color }}>
                                <IconComponent className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="heroOverlay bg-gradient-to-br from-[#f2faff] via-[#e3f5ff] to-[#b8e8ff] heroNotLoggedIn">
                <div className="row rowHeroSection align-items-center">
                    {/* LEFT SIDE: Content */}
                    <div className="col-lg-7 col-md-12 heroText m-animate m-slide-up" style={{ zIndex: 5 }}>
                        <div className="inline-flex items-center gap-2 bg-white/90 rounded-full px-3 py-2.5 border border-[#b8e8ff] mb-3 hero-badge">
                            <Sparkles className="w-4 h-4 text-[#3abef5]" />
                            <span className="text-sm">Join 10,000+ Happy Indian Travelers</span>
                        </div>

                        <h1 className="font-bold relative z-[5] leading-tight hero-title">
                            <span className="text-secondary-1">Stop Planning Solo.</span>
                            <br />
                            <span className="text-primary-1">Start Exploring Together.</span>
                        </h1>

                        <p className="r1 text-neutral-1 mt-3 hero-description" style={{ maxWidth: "550px" }}>
                            The social travel network where <strong>YOU lead!</strong> Create your trip, set your vibe, and connect with verified explorers heading your way.
                            <strong> Simple, safe, and social.</strong>
                        </p>

                        {/* UPDATED BUTTON SECTION */}
                        <div className="row heroBtnsSection mt-4 g-3 justify-content-center-tablet">
                            <div className="col-lg-5 col-md-6 col-12">
                                <button
                                    className="btn btn-blue homebtnprimary b2 w-100"
                                    onClick={() => triggerLogin(() => redirectToUrl(ROUTES.CREATE_TRIP))}
                                >
                                    <PlaneIcon className="w-5 h-5 mr-2" />
                                    Create Your Trip
                                </button>
                            </div>
                            <div className="col-lg-5 col-md-6 col-12">
                                <button
                                    className="btn btn-white-home-hero b2 w-100 flexbtn"
                                    style={{ border: '1px solid var(--secondary-1)' }}
                                    onClick={() => redirectToUrl(ROUTES.EXPLORE)}
                                >
                                    <Compass className="w-5 h-5 mr-2" />
                                    Explore Locations
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Image Collage */}
                    <div className="col-lg-5 col-md-12 mt-5 mt-lg-0 m-animate m-zoom-in hide-tablet-down" style={{ zIndex: 5 }}>
                        <div onClick={() => triggerLogin(() => redirectToUrl(ROUTES.CREATE_TRIP))} className="group-collage-wrapper">
                            <div className="collage-card details-back shadow-lg">
                                <Image src={GroupTripImage} alt="Group Trip Details" priority className="img-fluid" width={272} height={411} />
                            </div>
                            <div className="collage-card members-front shadow-xl">
                                <Image src={GroupTripMembers} alt="Group Trip Members" className="img-fluid" />
                            </div>
                        </div>
                    </div>
                </div>

                <Image className="heroVectorBottom" priority src="/images/heroVectorBottom.png" alt="Hero Vector Bottom"  width={isMobile ? 500 : 1540} height={120} fetchPriority="high" />
            </div>
        </section>
    );
};

export default HomeHeroSection;