"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "../../../styles/home/home.css";
import HomeHeroFeatures from "./featureHeroSection";
import { ICONS_CLASS } from "@/utils/icon.utils";
import Icon from "../Icons/Icons";
const HomeHeroSection: React.FC = () => {
    const images = [
        "/images/hero1.png",
        "/images/hero2.png",
        "/images/hero3.png",
    ];

    const [bgImage, setBgImage] = useState<string>(images[0]);

    // useEffect(() => {
    //     const randomImage = images[Math.floor(Math.random() * images.length)];
    //     setBgImage(randomImage);
    // }, []);

    return (
        <section
            className="homeHeroSection"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="heroOverlay">
                <div className="row rowHeroSection">
                    <div className="heroVectorBottom"></div>
                    
                    <div className="col-lg-5 col-md-12 col-sm-12 heroText">
                        <h1 className="text-white" style={{ fontSize: "60px"}}>Meet Your Next Co-Traveler</h1>
                        <h3 className="text-white">Connect, Plan & Explore Together</h3>
                        
                        <div className="row heroBtnsSection">
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <button className="btn btn-blue homebtnprimary b2">
                                    <Icon name={ICONS_CLASS.UsersIcon.iconName} />
                                    Find Travel Buddies
                                </button>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6">
                                <button className="btn btn-white-home-hero text-secondary-1 b2">
                                    <Icon name={ICONS_CLASS.PlayIcon.iconName} />
                                    How It Works
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
