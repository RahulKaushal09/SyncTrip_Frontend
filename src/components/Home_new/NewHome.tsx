"use client";

import Image from 'next/image'
import React from 'react'
import './newhomecss.css'
import { Compass, PlaneIcon, Sparkles } from 'lucide-react'
import { triggerLogin } from '@/utils';
import { useLoader } from '../providers/LoaderContext';
import { useRouter } from 'next/navigation';
import { APP_LINKS, ROUTES } from '@/constants';
import GumletImage from '../common/GumletImage';
import GumletBackgroundImage from '../common/GumletBackgroundImage';

import DownloadPlaystore from '@/assets/icons/GetOnPlayStoreSVG.svg';
import DownloadAppstore from '@/assets/icons/GetOnAppStore.svg';

const HomeHeroSectionNew = () => {
    // const [screenWidth, setScreenWidth] = useState<number | null>(null);
    const { showLoader } = useLoader();
    const router = useRouter();
    const redirectToUrl = (redirectUrl: string) => {
        showLoader();
        router.push(redirectUrl);
    };

    // useEffect(() => {
    //     setScreenWidth(window.innerWidth);
    //     // console.log("Screen width:", window.innerWidth);

    //     const handleResize = () => {
    //         setScreenWidth(window.innerWidth);
    //         // console.log("Screen width:", window.innerWidth);
    //     };
    //     window.addEventListener('resize', handleResize);
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);

    return (
        <div style={{
            position: "relative",
        }}>
            <GumletBackgroundImage
                src={"https://synctrip.gumlet.io/compressed/Images/HomePageBg.png"}
                priority={true}
                className="homeHeroSection h-[100vh] customPaddingHome"
            >
                <section className="homeHeroSection customPaddingHome">
                    <div className="heroContent">
                        <div className="heroBadge">
                            <Sparkles className="heroSparkle" />
                            <span>Join 10000+ verified Indian explorers</span>
                        </div>
                        <h1 className="heroTitleMain">
                            Find Your People.<br></br>
                            Plan Your Next Adventure.
                        </h1>
                        <h2 className="heroTitleSub">
                            Trips, activities & weekend outings with verified people who share your vibe.
                        </h2>


                        {/* <h1 className="heroTitleMain">{screenWidth && screenWidth > 900 ? "Any Plan. Any Time." : "Stop Planning Solo."}</h1>
                        <h1 className="heroTitleSub">{screenWidth && screenWidth > 900 ? "Connect for trips, rides, and events." : "Start Exploring Together."}</h1> */}

                        {/* <p className="heroDescription">
                            Whether it's a Goa trip, a Sunday turf match, a breakfast ride, or just catching a movie - SyncTrip connects you with travellers and locals near you. Lead your own plan or join one.
                        </p> */}

                        <span className='floatingChat1'>
                            <GumletImage src={"https://synctrip.gumlet.io/compressed/Images/ChatHomePage1.png"} alt='ChatBubble1' width={200} height={120} />
                        </span>

                        <span className='floatingChat2'>
                            <GumletImage src={"https://synctrip.gumlet.io/compressed/Images/ChatHomePage2.png"} alt='ChatBubble2' width={200} height={120} />
                        </span>

                        <div className="heroActions">
                            {/* <button
                                onClick={() => triggerLogin(() => redirectToUrl(ROUTES.CREATE_TRIP))}
                                className="btn btn-primary hover:scale-105 transition-transform duration-200 !flex items-center justify-center">
                                <PlaneIcon className="w-5 h-5 mr-2" />
                                Create Your Trip
                            </button>
                            <button
                                onClick={() => redirectToUrl(ROUTES.EXPLORE)}
                                className="btn border text-white border-white !flex items-center justify-center hover:scale-105 transition-transform duration-400">
                                <Compass className="w-5 h-5 mr-2" />
                                Explore Locations
                            </button> */}
                            <Image onClick={() => router.push(APP_LINKS.PLAY_STORE)} className="hover:scale-105 duration-200 cursor-pointer" priority src={DownloadPlaystore} alt="Hero Vector Top" width={180} height={120} />
                            <Image onClick={() => router.push(APP_LINKS.APP_STORE)} className="hover:scale-105 duration-200 cursor-pointer" priority src={DownloadAppstore} alt="Hero Vector Top" width={180} height={120} />
                        </div>
                    </div>

                    <div className="floatingImagesWrapper">
                        <div className="floatingImg floatingImg2">
                            <GumletImage containerStyle={{
                                height: '416px',
                            }} src={"https://synctrip.gumlet.io/compressed/Images/FloatingImg1.png"} alt="Floating Image 1" fill />
                        </div>
                        <div className="floatingImg floatingImg4">
                            <GumletImage containerStyle={{
                                height: '300px',
                            }} src={"https://synctrip.gumlet.io/compressed/Images/FloatingImg3.png"} alt="Floating Image 3" fill />
                        </div>
                        <div className="floatingImg floatingImg5">
                            <GumletImage containerStyle={{
                                height: '250px',
                            }} src={"https://synctrip.gumlet.io/compressed/Images/FloatingImg4.png"} alt="Floating Image 4" fill />
                        </div>
                        <div className="floatingImg floatingImg3">
                            <GumletImage containerStyle={{
                                height: '360px',
                            }} src={"https://synctrip.gumlet.io/compressed/Images/FloatingImg2.png"} alt="Floating Image 2" fill />
                        </div>
                        <div className="floatingImg floatingImg1">
                            <GumletImage containerStyle={{
                                height: '300px',
                            }} src={"https://synctrip.gumlet.io/compressed/Images/FloatingImg5.png"} alt="Floating Image 5" fill />
                        </div>
                        <div className="floatingImg floatingImg7">
                            <GumletImage containerStyle={{
                                height: '416px',
                            }} src={"https://synctrip.gumlet.io/compressed/Images/FloatingImg7.png"} alt="Floating Image 7" fill />
                        </div>
                        <div className="floatingImg floatingImg6">
                            <GumletImage containerStyle={{
                                height: '416px',
                            }} src={"https://synctrip.gumlet.io/compressed/Images/FloatingImg6.png"} alt="Floating Image 6" fill />
                        </div>
                    </div>
                </section>
            </GumletBackgroundImage >
            <Image className="heroVectorBottom z-50" priority src="/images/heroVectorBottom.png" alt="Hero Vector Bottom" width={1550} height={120} />
        </div>
    )
}

export default HomeHeroSectionNew