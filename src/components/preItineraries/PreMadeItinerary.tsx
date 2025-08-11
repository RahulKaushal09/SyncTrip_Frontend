"use client";

import { useRouter } from "next/navigation";
import { Circle, Car,Waves } from "lucide-react";

import ItineraryCarousel from "./ItineraryCarousel";
import "../../../styles/PreMadeItinerary.css";

interface Location {
    id: string;
    title: string;
    images?: string[];
    days?: string;
}

interface Feature {
    Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    title: string;
    description: string;
}

interface PreMadeItineraryProps {
    locations: Location[];
}

const features: Feature[] = [
    {
        Icon: Circle,
        title: "Choose Destination",
        description:
            "Pick from curated destinations, from vibrant cities to tranquil beaches. SyncTrip connects you with like-minded travelers for the perfect start.",
    },
    {
        Icon: Waves,
        title: "Explore Itinerary",
        description:
            "Browse expert-crafted itineraries with iconic sights and hidden gems. SyncTrip simplifies planning to match your style and budget.",
    },
    {
        Icon: Car,
        title: "Customise It to your liking",
        description:
            "Tailor your itinerary to your interests and budget. Collaborate with companions for a trip that’s uniquely yours.",
    },
];

const PreMadeItinerary: React.FC<PreMadeItineraryProps> = ({ locations }) => {
    const router = useRouter();
    const iconStyle: React.CSSProperties = {
        width: "100px",
        height: "40px",
        padding: "8px",
        backgroundColor: "black",
        color: "white",
        borderRadius: "5px",
        marginRight: "10px",
    };

    return (
        <section>
            <div className="container-fluid py-5 pre-made-itinerary mb-5 mt-5" style={{ textAlign: "left" }}>
                <div className="row justify-content-center align-items-center" style={{ marginLeft: "0px" }}>
                    {/* Left Column: Text Content */}
                    <div className="col-md-6 col-lg-5 text-left text-md-start mb-4 mb-md-0" style={{ padding: "0px" }}>
                        <p className="text-muted" style={{ fontWeight: "700" }}>Easy and Fast</p>
                        <h1 className="fw-bold text-custom-secondary majorHeadings">
                            Save The Hassle With Pre-Made Itinerary
                        </h1>
                        <ul className="list-group list-group-flush mt-4">
                            {features.map(({ Icon, title, description }, index) => (
                                <li key={index} className="list-group-item d-flex border-0 p-2">
                                    <Icon style={iconStyle} />
                                    <p className="mb-0">
                                        <strong>{title}</strong>
                                        <br />
                                        {description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Right Column: Carousel */}
                    <div className="col-md-6 col-lg-7 d-flex flex-column flex-md-row gap-3 justify-content-center">
                        <ItineraryCarousel locations={locations} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PreMadeItinerary;