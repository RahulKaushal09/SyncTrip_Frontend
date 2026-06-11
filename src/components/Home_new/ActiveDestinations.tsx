"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useLogin } from "../providers/LoginProvider";
import { triggerLogin } from "@/utils/login.utils";
import { useLoader } from "../providers/LoaderContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Destination = {
    id: string;
    name: string;
    image: string;
    usp: string;
    activePlaceLabel: string;
    activePlaceValue: string;
};

const DEFAULT_DESTINATIONS: Destination[] = [
    {
        id: "c9ad104e-9640-477e-a24d-2f9d51d8b50b",
        name: "Manali",
        image:
            "/images/Manali.jpg",
        usp:
            "Experience thrilling Himalayan adventures with snow-capped peaks, challenging treks, and unforgettable mountain memories.",
        activePlaceLabel: "Community Hotspot",
        activePlaceValue: "Old Manali & Solang Valley",
    },
    {
        id: "9c04b59c-93a3-43e3-aec2-0b36d2670753",
        name: "Goa",
        image:
            "/images/Goa.jpg",
        usp:
            "Vibrant beach culture, electrifying nightlife, and golden sunsets. Where every moment is a celebration.",
        activePlaceLabel: "Community Hotspot",
        activePlaceValue: "North Goa & Anjuna Beach",
    },
    {
        id: "6abbfbf0-0ebd-4567-97b0-5b5f129fc206",
        name: "Rishikesh",
        image:
            "/images/Rishikesh.jpg",
        usp:
            "Find peace by the Ganges with serene yoga retreats, spiritual awakenings, and riverside meditation.",
        activePlaceLabel: "Community Hotspot",
        activePlaceValue: "Laxman Jhula & Tapovan",
    },
];

export default function ActiveDestinations({
    destinations = DEFAULT_DESTINATIONS,
}: {
    destinations?: Destination[];
}) {
    const router = useRouter();
    const { showLoader, hideLoader } = useLoader();


    const createTrip = (locationId?: string, featured?: boolean) => {
        showLoader();


        if (!locationId) {
            router.push("/create/trip");
            return;
        }


        if (featured) {
            router.push(`/create/trip?locationId=${locationId}`);
            return;
        }


        toast.error(
            "We’re launching city by city to ensure you meet real travellers. For now, Manali, Goa & Rishikesh have active communities."
        );
        router.push("/explore");
        hideLoader();
    };


    const loginThenNavigate = (locationId: string) => {
        triggerLogin(() => createTrip(locationId, true));
    };


    return (
        <section className="max-w-[1200px] mx-auto container-custom">
            <header className="text-center mb-12">
                <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[#16324F] mb-4">
                    <span className="text-[#3ABEF5]">SyncTrip</span> is Currently Active In
                </h2>
                <p className="text-neutral-600 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
                    <strong>Host your trip</strong> in these trending destinations.
                    Connect with <strong>verified travel buddies</strong> and lead your own
                    adventure in India’s most active traveler communities.
                </p>
            </header>

            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-10">
                {destinations.map((d, idx) => (
                    <article
                        key={d.id}
                        className="group bg-white rounded-2xl overflow-hidden border border-[#E8E8EC] shadow-sm hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                        aria-labelledby={`dest-${d.id}-title`}
                    >
                        <div className="relative h-60 md:h-56 lg:h-60">
                            <Image
                                src={d.image}
                                alt={`${d.name} image`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                priority={false}
                            // width={idx == 0?290:280}
                            // height={idx == 0?387:466}
                            />

                            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(22,50,79,0)] to-[rgba(22,50,79,0.52)] pointer-events-none" />

                            <span className="absolute top-4 right-4 inline-flex items-center gap-2 bg-[#2B9A66] text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                                ACTIVE
                            </span>
                        </div>

                        <div className="p-6 md:p-7">
                            <h3
                                id={`dest-${d.id}-title`}
                                className="text-2xl md:text-2xl font-semibold text-[#16324F] flex items-center gap-3 mb-3"
                            >
                                <svg
                                    className="w-6 h-6 text-[#3ABEF5] flex-shrink-0"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {d.name}
                            </h3>

                            <p className="text-neutral-500 mb-4 leading-relaxed text-sm md:text-base">{d.usp}</p>

                            <div className="bg-[#F2FAFF] py-3 px-4 rounded-lg mb-5 border-l-4 border-[#3ABEF5]">
                                <div className="text-xs uppercase tracking-wide text-[#3ABEF5] font-bold">
                                    {d.activePlaceLabel}
                                </div>
                                <div className="text-sm md:text-base font-semibold text-[#16324F]">{d.activePlaceValue}</div>
                            </div>

                            <button
                                onClick={() => loginThenNavigate(d.id)}

                                className="inline-flex items-center justify-center w-full bg-[#3ABEF5] hover:bg-[#16324F] text-white font-semibold rounded-lg py-3 px-4 shadow-md transition-transform duration-200 hover:-translate-y-1"
                                aria-label={`Create trip in ${d.name}`}
                            >
                                Create Trip in {d.name}
                                <span className="ml-3 transform transition-transform">→</span>
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            <div className="rounded-xl p-8 md:p-12 border border-[#E3F5FF] bg-gradient-to-tr from-[#F7FAFD] to-[#F2FAFF] text-center">

                <h4 className="text-xl md:text-2xl font-semibold text-[#16324F] mb-3">
                    How SyncTrip Works
                </h4>

                <p className="text-neutral-600 max-w-2xl mx-auto mb-8">
                    Create your perfect trip and connect with travellers heading to the same destination - or join groups already planning their adventure.
                </p>

                {/* FLOW */}
                <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 mb-8">

                    <div className="px-4 py-2.5 bg-white rounded-xl font-semibold text-[#16324F] shadow-sm">
                        Create a Trip
                    </div>

                    <div className="text-[#3ABEF5] font-bold hidden sm:block">→</div>

                    <div className="px-4 py-2.5 bg-white rounded-xl font-semibold text-[#16324F] shadow-sm">
                        Find Matches <span className="text-neutral-400 font-medium">or</span> Explore Groups
                    </div>

                    <div className="text-[#3ABEF5] font-bold hidden sm:block">→</div>

                    <div className="px-4 py-2.5 bg-white rounded-xl font-semibold text-[#16324F] shadow-sm">
                        Swipe & Connect <span className="text-neutral-400 font-medium">or</span> Join a Group
                    </div>

                    <div className="text-[#3ABEF5] font-bold hidden sm:block">→</div>

                    <div className="px-4 py-2.5 bg-white rounded-xl font-semibold text-[#16324F] shadow-sm">
                        Plan Together
                    </div>
                </div>

                <button
                    onClick={() => loginThenNavigate('')}
                    className="btn btn-secondary mx-auto flex items-center justify-center"
                >
                    <span className="btn-secondary-text">
                        Create Your First Trip
                    </span>
                </button>

            </div>

        </section>
    );
}
