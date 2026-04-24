"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AnanyaProfileCard from '../../assets/images/AnanyaIyerProfileCard.png';
import GeneralScreenLayout from '../../assets/images/GeneralScreenLayout.png';
import PriyaProfileCard from '../../assets/images/PriyaSharmaProfileCard.png';
import MatchPopUp from '../../assets/images/MatchPopUp.png';
// Using the same profile image for the chat avatar
import AnanyaAvatar from '../../assets/images/AnanyaIyerProfileCard.png';
import GumletImage from '../common/GumletImage';

type ScreenState = 'browsing' | 'swiping' | 'match' | 'chat';

const SwipeDemo: React.FC = () => {
    const [step, setStep] = useState<ScreenState>('browsing');

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 'browsing') {
            timer = setTimeout(() => setStep('swiping'), 1800);
        } else if (step === 'swiping') {
            timer = setTimeout(() => setStep('match'), 800);
        } else if (step === 'match') {
            timer = setTimeout(() => setStep('chat'), 2500);
        } else if (step === 'chat') {
            timer = setTimeout(() => setStep('browsing'), 6000); // Longer to see the chat flow
        }
        return () => clearTimeout(timer);
    }, [step]);

    return (
        <div style={containerStyle}>
            <div style={phoneFrameStyle}>

                {/* 1. General App Layout (Hidden in Chat) */}
                {step !== 'chat' && (
                    <div style={fullAbsoluteStyle}>
                        <GumletImage
                            containerStyle={{ objectFit: 'cover', height: '100%' }}
                            src={"https://synctrip.gumlet.io/compressed/Images/GeneralScreenLayout.png"}
                            alt="App Layout"
                            loading='lazy'
                            fill
                        />
                    </div>
                )}

                {/* 2. Profile Cards Layer */}
                {(step === 'browsing' || step === 'swiping' || step === 'match') && (
                    <div style={cardContainerStyle}>
                        {/* PRIYA CARD: Sits behind and scales up */}
                        <div style={{
                            ...nextCardStyle,
                            transform: (step === 'swiping' || step === 'match') ? 'scale(1)' : 'scale(0.96)',
                            opacity: (step === 'swiping' || step === 'match') ? 1 : 0.9,
                            transition: 'transform 0.7s ease-out, opacity 0.7s'
                        }}>
                            <GumletImage containerStyle={{
                                ...cardImgStyle,
                                height: '100%',
                            }} width={558} height={920} src={"https://synctrip.gumlet.io/compressed/Images/PriyaSharmaProfileCard.png"} loading='lazy' alt="Priya Profile" />
                        </div>

                        {/* ANANYA CARD: The one that gets swiped */}
                        {step !== 'match' && <div style={{
                            ...activeCardStyle,
                            transform: step === 'swiping'
                                ? 'translate(130%, -10%) rotate(20deg)'
                                : 'translate(0, 0) rotate(0deg)',
                            opacity: step === 'swiping' ? 0 : 1,
                            transition: 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s'
                        }}>
                            <GumletImage containerStyle={{
                                ...cardImgStyle,
                                height: '100%',
                            }} width={553} height={920} loading='lazy' src={"https://synctrip.gumlet.io/compressed/Images/AnanyaIyerProfileCard.png"} alt="Ananya Profile" />
                        </div>}
                    </div>
                )}

                {/* 3. Match Pop-up */}
                {step === 'match' && (
                    <div className="m-animate m-zoom-in" style={overlayWrapperStyle}>
                        <div style={{
                            width: '260px',
                            height: '450px',
                            position: 'relative',
                            borderRadius: '24px',
                            overflow: 'hidden',
                        }}>
                            <GumletImage containerStyle={{ objectFit: 'contain', height: '100%', width: '100%' }} loading='lazy' src={"https://synctrip.gumlet.io/compressed/Images/MatchPopUp.png"} width={260} height={400} alt="It's a Match!" />
                        </div>
                    </div>
                )}

                {/* 4. Realistic Chat Interface (Based on Image Reference) */}
                {step === 'chat' && (
                    <div className="m-animate m-fade-in" style={chatFullScreenStyle}>
                        {/* Custom Header matching Reference Screen */}
                        <div style={chatHeaderStyle}>
                            <div style={{ position: 'absolute', left: '15px', color: '#0d344b', fontSize: '20px' }}>‹</div>
                            <div style={headerInfoStyle}>
                                <div style={avatarHeaderWrapper}>
                                    <GumletImage loading='lazy' src={"https://synctrip.gumlet.io/compressed/Images/AnanyaIyerProfileCard.png"} alt="AnanyaAvatar" height={35} width={35} containerStyle={{
                                        objectFit: 'cover', borderRadius: '50%', width: '35px',
                                        height: '35px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }} />
                                </div>
                                <div className="b1 text-secondary-1" style={{ fontSize: '16px' }}>Ananya Iyer</div>
                            </div>
                        </div>

                        {/* Message List matching Reference Styling */}
                        <div style={messageListStyle}>
                            {/* Received Message Group */}
                            <div style={receivedWrapper}>
                                <div style={bubbleAvatarWrapper}>
                                    <GumletImage loading='lazy' src={"https://synctrip.gumlet.io/compressed/Images/AnanyaIyerProfileCard.png"} alt="AnanyaAvatar" height={28} width={28} containerStyle={{
                                        objectFit: 'cover', borderRadius: '50%', width: '28px',
                                        height: '28px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }} />
                                </div>
                                <div style={bubbleReceived}>Hey! Just saw your profile, you look ready for Goa! 🌴</div>
                            </div>

                            <div className="m-animate m-slide-up" style={{ ...receivedWrapper, animationDelay: '1s' }}>
                                <div style={bubbleAvatarWrapper}>
                                    <GumletImage loading='lazy' src={"https://synctrip.gumlet.io/compressed/Images/AnanyaIyerProfileCard.png"} alt="AnanyaAvatar" height={28} width={28} containerStyle={{
                                        objectFit: 'cover', borderRadius: '50%', width: '28px',
                                        height: '28px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }} />
                                </div>
                                <div style={bubbleReceived}>So... is the Goa Plan officially on? I&apos;ve already started a checklist! 📝</div>
                            </div>
                            {/* Sent Message Group (Me) */}
                            <div className="m-animate m-slide-up" style={{ ...sentWrapper, animationDelay: '2.5s' }}>
                                <div style={bubbleSent}>Obviously! I&apos;ve already started packing my bags. 🌊</div>
                            </div>


                            <div className="m-animate m-slide-up" style={{ ...sentWrapper, animationDelay: '4s' }}>
                                <div style={bubbleSent}>Can&apos;t wait for another amazing journey!</div>
                            </div>
                        </div>

                        {/* Mock Message Input matching Reference */}
                        <div style={chatInputArea}>
                            <div style={inputContainer}>
                                <div className="r2" style={{ color: 'var(--neutral-1)' }}>Message...</div>
                                <div style={sendButtonRef}>
                                    <span style={{ color: 'white', fontSize: '14px' }}>↑</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Styles ---

const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '800px',
};

const phoneFrameStyle: React.CSSProperties = {
    width: '330px',
    height: '660px',
    backgroundColor: 'var(--white)',
    borderRadius: '45px',
    border: '8px solid #1a1a1a',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
};

const fullAbsoluteStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
};

const cardContainerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'translateY(-10px)'
};

const activeCardStyle: React.CSSProperties = {
    position: 'relative',
    width: '280px',
    height: '460px',
    zIndex: 10,
};

const nextCardStyle: React.CSSProperties = {
    position: 'absolute',
    width: '280px',
    height: '460px',
    zIndex: 9,
};

const cardImgStyle: React.CSSProperties = {
    // width: '100%',
    // height: '100%',
    objectFit: 'contain',
};

const overlayWrapperStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const popUpSizeStyle: React.CSSProperties = {
    width: '260px',
    height: '500px',
    position: 'relative',
};

// --- Chat Specific Styles (Matching Reference Image) ---

const chatFullScreenStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'var(--white)',
    zIndex: 30,
    display: 'flex',
    flexDirection: 'column',
};

const chatHeaderStyle: React.CSSProperties = {
    height: '70px',
    padding: '10px 15px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fff',
};

const headerInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginLeft: '30px'
};

const avatarHeaderWrapper: React.CSSProperties = {
    width: '35px',
    height: '35px',
    position: 'relative',
    borderRadius: '50%',
};

const messageListStyle: React.CSSProperties = {
    flex: 1,
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflowY: 'hidden',
};

const receivedWrapper: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    marginBottom: '4px'
};

const bubbleAvatarWrapper: React.CSSProperties = {
    width: '28px',
    height: '28px',
    position: 'relative',
};

const bubbleReceived: React.CSSProperties = {
    backgroundColor: '#eceef1',
    color: '#0d344b',
    padding: '8px 16px',
    borderRadius: '18px',
    fontSize: '14px',
    maxWidth: '75%',
};

const sentWrapper: React.CSSProperties = {
    alignSelf: 'flex-end',
    marginBottom: '4px'
};

const bubbleSent: React.CSSProperties = {
    backgroundColor: '#4bbef5', // SyncTrip Primary 1
    color: 'white',
    padding: '8px 16px',
    borderRadius: '18px',
    fontSize: '14px',
    maxWidth: '100%',
};

const chatInputArea: React.CSSProperties = {
    padding: '10px 15px 30px 15px',
    borderTop: '1px solid #f0f0f0',
};

const inputContainer: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f6f8fa',
    padding: '8px 10px 8px 18px',
    borderRadius: '25px',
    border: '1px solid #e1e4e8',
};

const sendButtonRef: React.CSSProperties = {
    width: '30px',
    height: '30px',
    backgroundColor: '#bde7f9', // Lightened primary for the circular button
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

export default SwipeDemo;