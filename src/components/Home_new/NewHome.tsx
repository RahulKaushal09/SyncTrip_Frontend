"use client";

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import './newhomecss.css'
import { Compass, PlaneIcon, Sparkles } from 'lucide-react'
import FloatingImg1 from "../../assets/images/FloatingImg1.png";
import FloatingImg2 from "../../assets/images/FloatingImg2.png";
import FloatingImg3 from "../../assets/images/FloatingImg3.png";
import FloatingImg4 from "../../assets/images/FloatingImg4.png";
import FloatingImg5 from "../../assets/images/FloatingImg5.png";
import FloatingImg6 from "../../assets/images/FloatingImg6.png";
import FloatingImg7 from "../../assets/images/FloatingImg7.png";
import HomePageBg from "../../assets/images/HomePageBg.png";
import ChatHomePage1 from "../../assets/images/ChatHomePage1.png";
import ChatHomePage2 from "../../assets/images/ChatHomePage2.png";

const HomeHeroSectionNew = () => {
    const [screenWidth, setScreenWidth] = useState<number | null>(null);

    useEffect(() => {
        setScreenWidth(window.innerWidth);
        console.log("Screen width:", window.innerWidth);

        const handleResize = () => {
            setScreenWidth(window.innerWidth);
            console.log("Screen width:", window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <section style={{
            backgroundImage: `url(${HomePageBg.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }} className="homeHeroSection customPaddingHome">
            <div className="heroContent">
                <div className="heroBadge">
                    <Sparkles className="heroSparkle" />
                    <span>Join 10,000+ Happy Indian Travelers</span>
                </div>

                <h1 className="heroTitleMain">{screenWidth && screenWidth > 900 ? "Connect with Like-Minded Travel Friends." : "Stop Planning Solo."}</h1>
                <h1 className="heroTitleSub">{screenWidth && screenWidth > 900 ? "Plan Unforgettable Journeys." : "Start Exploring Together."}</h1>

                <p className="heroDescription">
                    Lead your trip, set your vibe, connect with verified explorers!
                </p>

                <span className='floatingChat1'>
                    <Image src={ChatHomePage1} alt='' width={200} height={120} />
                </span>
                
                <span className='floatingChat2'>
                    <Image src={ChatHomePage2} alt='' width={200} height={120} />
                </span>

                <div className="heroActions">
                    <button className="btn btn-primary hover:scale-105 transition-transform duration-200 !flex items-center justify-center">
                        <PlaneIcon className="w-5 h-5 mr-2" />
                        Create Your Trip
                    </button>
                    <button className="btn border text-white border-white !flex items-center justify-center hover:scale-105 transition-transform duration-400">
                        <Compass className="w-5 h-5 mr-2" />
                        Explore Locations
                    </button>
                </div>
            </div>

            <div className="floatingImagesWrapper">
                <Image className="floatingImg floatingImg2" priority src={FloatingImg1} alt="Floating Image 1" width={500} height={500} />
                <Image className="floatingImg floatingImg4" priority src={FloatingImg3} alt="Floating Image 3" width={500} height={500} />
                <Image className="floatingImg floatingImg5" priority src={FloatingImg4} alt="Floating Image 4" width={500} height={500} />
                <Image className="floatingImg floatingImg3" priority src={FloatingImg2} alt="Floating Image 2" width={500} height={500} />
                <Image className="floatingImg floatingImg1" priority src={FloatingImg5} alt="Floating Image 5" width={500} height={500} />
                <Image className="floatingImg floatingImg7" priority src={FloatingImg7} alt="Floating Image 7" width={500} height={500} />
                <Image className="floatingImg floatingImg6" priority src={FloatingImg6} alt="Floating Image 6" width={500} height={500} />
            </div>

            <Image className="heroVectorBottom z-50" priority src="/images/heroVectorBottom.png" alt="Hero Vector Bottom" width={1550} height={120} />
        </section>
    )
}

export default HomeHeroSectionNew