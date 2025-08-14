"use client";

// import Image from "next/image";
import "../../../styles/home/home.css";
import HomeHeroFeatures from "./featureHeroSection";
import { ICONS_CLASS } from "@/utils/icon.utils";
import Icon from "../Icons/Icons";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { useLoader } from '@/components/providers/LoaderContext';
import { Heart, Plane, Star } from "lucide-react";
import { triggerLogin } from "@/utils";

const HomeHeroSection: React.FC = () => {
    const { showLoader } = useLoader();
    const router = useRouter();
    const images = [
        "/images/hero1.png",
        "/images/hero2.png",
        "/images/hero3.png",
    ];
    const floatingIcons = [
        { icon: Heart, color: "#e5484d", delay: "0s" },
        { icon: Plane, color: "#3abef5", delay: "0.5s" },
        { icon: Star, color: "#ffc53d", delay: "1s" },
    ];

    // const [bgImage, setBgImage] = useState<string>(images[0]);
    const redirectToUrl = (redirectUrl: string) => {
        // Implement your redirect logic here
        showLoader();
        router.push(redirectUrl);
    };


    return (
        <section
            className="homeHeroSection"
        // style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none hideInMobile">
                {floatingIcons.map((item, index) => {

                    const IconComponent = item.icon;
                    return (
                        <div
                            key={index}
                            className="floating-icon-hero"
                            style={{
                                left: `${15 + index * 30}%`,
                                top: `${20 + index * 25}%`,
                                animationDelay: item.delay
                            }}
                        >
                            <div
                                className="icon-wrapper-hero"
                                style={{ backgroundColor: item.color }}
                            >
                                <IconComponent className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="heroOverlay bg-gradient-to-br from-[#f2faff] via-[#e3f5ff] to-[#b8e8ff]">
                <div className="row rowHeroSection ">
                    <div className="heroVectorBottom"></div>

                    <div className="col-lg-7 col-md-8 col-sm-12 heroText">
                        <div
                            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-[#b8e8ff] hideInMobile" style={{ marginBottom: "10px", position: "relative", zIndex: "5px" }}>
                            <Plane className="w-4 h-4 text-[#3abef5]" />
                            <span className="text-sm font-medium text-[#16324f]" >
                                Join 10,000+ Happy Indian Travelers
                            </span>
                        </div>

                        {/* <h1 className="text-white" style={{ fontSize: "60px", fontWeight: "bold",position:"relative",zIndex:"5px" }}><span className="text-custom-secondary">Find Your Perfect</span><br></br><span className="text-custom-primary">Travel Companion</span></h1> */}

                        <h1
                            className="text-white font-bold relative z-[5] text-[40px] md:text-[50px] leading-tight"
                        >
                            <span className="text-custom-secondary">Find Your Perfect</span>

                            {/* Only shows on desktop */}
                            <span className="hidden md:inline"><br /></span>

                            {/* Only shows on mobile */}
                            <span className="inline md:hidden"> </span>

                            <span className="text-custom-primary">Travel Companion</span>
                        </h1>
                        {/* <h3 className="text-white">Connect, Plan & Explore Together</h3> */}
                        <p className="text-[var(--neutral-1)]" style={{ position: "relative", zIndex: "5px", width: "100%" }}>Connect with like-minded Indian travelers, explore incredible India together, and create unforgettable memories. Your next adventure across India is just a match away! 🇮🇳</p>

                        <div className="row heroBtnsSection">
                            <div className="col-lg-5 col-md-5 col-sm-6">
                                <button className="btn btn-blue homebtnprimary b2" onClick={() => redirectToUrl(ROUTES.EXPLORE)}>
                                    <Icon name={ICONS_CLASS.UsersIcon.iconName} />
                                    Start Matching
                                </button>
                            </div>
                            <div className="col-lg-5 col-md-5 col-sm-6">
                                <button className="btn btn-white-home-hero text-secondary-1 b2" onClick={() => triggerLogin(() => redirectToUrl(ROUTES.EXPLORE))}>
                                    <Icon name={ICONS_CLASS.PlayIcon.iconName} />
                                    Create a Trip
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-12 col-sm-12">
                        <HomeHeroFeatures showInMobile={false} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeHeroSection;
