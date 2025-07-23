"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ItineraryCard from "./ItineraryCard";
import "../../../styles/itineraryCarousel.css";

interface Location {
    id: string;
    title: string;
    images?: string[];
    days?: string;
}

interface ItineraryCarouselProps {
    locations: Location[];
}

interface CardStyles {
    transform: string;
    zIndex: string | number;
    opacity: string | number;
    transition: string;
}

const ItineraryCarousel: React.FC<ItineraryCarouselProps> = ({ locations }) => {
    const itineraries = locations.slice(0, 4);
    const [cycleOffset, setCycleOffset] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const cardCount = itineraries.length;

    useEffect(() => {
        if (cardCount > 1) {
            startRotation();
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [cardCount]);

    const startRotation = () => {
        intervalRef.current = setInterval(() => {
            setCycleOffset((prev) => (prev + 1) % cardCount);
        }, 5000);
    };

    const getCardStyles = (index: number): CardStyles => {
        const position = (index + cycleOffset) % cardCount;
        const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

        const styles: CardStyles = {
            transform: "",
            zIndex: "",
            opacity: "",
            transition: "all 2s cubic-bezier(0.4, 0, 0.2, 1)",
        };

        if (isMobile) {
            switch (position) {
                case 0:
                    styles.transform = "translateX(-100%) scale(0.8)";
                    styles.zIndex = 1;
                    styles.opacity = 1;
                    break;
                case 1:
                    styles.transform = "translateX(0%) scale(1.2)";
                    styles.zIndex = 3;
                    styles.opacity = 1;
                    break;
                case 2:
                    styles.transform = "translateX(100%) scale(0.8)";
                    styles.zIndex = 1;
                    styles.opacity = 1;
                    break;
                default:
                    styles.transform = "translateX(240%) scale(0)";
                    styles.opacity = 0;
            }
        } else {
            switch (position) {
                case 0:
                    styles.transform = "translateX(-150%) scale(1.2)";
                    styles.zIndex = 4;
                    styles.opacity = 1;
                    break;
                case 1:
                    styles.transform = "translateX(0%) scale(1)";
                    styles.zIndex = 3;
                    styles.opacity = 1;
                    break;
                case 2:
                    styles.transform = "translateX(120%) scale(0.8)";
                    styles.zIndex = 2;
                    styles.opacity = 1;
                    break;
                case 3:
                    styles.transform = "translateX(190%) scale(0.4)";
                    styles.zIndex = 1;
                    styles.opacity = 1;
                    break;
                default:
                    styles.transform = "translateX(205%) scale(0.4)";
                    styles.opacity = 1;
                    styles.zIndex = 0;
            }
        }

        return styles;
    };

    const getShadowStyles = (index: number): CardStyles => {
        const cardStyles = getCardStyles(index);
        const scaleMatch = cardStyles.transform.match(/scale\(([^)]+)\)/);
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

        return {
            transform: `${cardStyles.transform.replace(/scale\([^)]+\)/, "")} translateY(280px) scale(${scale * 0.6}, ${scale * 0.3})`,
            zIndex: Number(cardStyles.zIndex) - 1,
            opacity: 0.4,
            transition: "all 2s cubic-bezier(0.4, 0, 0.2, 1)",
        };
    };

    return (
        <div
            className="carousel-container-itinerary"
            onMouseEnter={() => intervalRef.current && clearInterval(intervalRef.current)}
            onMouseLeave={startRotation}
        >
            {itineraries.map((itinerary, index) => {
                const cardStyles = getCardStyles(index);
                const shadowStyles = getShadowStyles(index);
                return (
                    <div key={index} className="card-wrapper-itinerary">
                        <div className="card-shadow-itinerary" style={shadowStyles}></div>
                        <div className="card-itinearyShow" style={cardStyles}>
                            <Link href={`/location/${itinerary.id}`} passHref>
                                <ItineraryCard
                                    name={itinerary.title.replace(/[0-9.]/g, "")}
                                    imgSrc={itinerary.images?.length ? itinerary.images[0] : ""}
                                    days={itinerary.days ?? "3 Days"}
                                />
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ItineraryCarousel;