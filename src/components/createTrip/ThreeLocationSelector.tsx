"use client";

import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { Location } from "@/types";
import { ApiService } from "@/utils";
import { LocationFields } from "@/constants";
import { useEffect, useState } from "react";

const CACHE_KEY = "synctrip_top_locations";
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes
export default  function ThreeLocationSelector({
    selectedLocationId,
    onSelect,
}: {
    selectedLocationId?: string
    onSelect?: (loc: Location) => void;
}) {
    const [topLocations, setTopLocations] = useState<Location[]>([]);
    const LocationFieldsToFetch = [
        LocationFields.TITLE,
        LocationFields.RATING,
        LocationFields.IMAGES,
        LocationFields.BEST_TIME,
        LocationFields.PLACES_NUMBER_TO_VISIT,
        LocationFields.ID,
        LocationFields.STATE,
        LocationFields.COUNTRY,


    ];
    useEffect(  () =>  {
        const fetchTopLocations = async () => {
            try {
                if (typeof window === "undefined") return null;

                // 1) Check cache
                const cached = localStorage.getItem(CACHE_KEY);

                if (cached) {
                    const { data, timestamp } = JSON.parse(cached);

                    // 2) Check expiry
                    if (data.length != 0 && Date.now() - timestamp < CACHE_TTL) {
                        setTopLocations(data);
                        return; // use cached data
                    }
                }

                // 3) Fetch fresh data
                const res = await ApiService.fetchLocations(0, 3, LocationFieldsToFetch);

                // 4) Save to cache
                localStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify({
                        data: res.locations,
                        timestamp: Date.now(),
                    })
                );

                setTopLocations(res.locations);
            } catch (e) {
                console.error("Failed to fetch top locations:", e);
            }
        };

        fetchTopLocations();
    }, []);
    // These 3 locations will be manually passed or hardcoded.
    // const topLocations: Location[] = (await ApiService.fetchLocations(0, 3, LocationFieldsToFetch)).locations;

    return (
        <section className="w-full flex flex-col ">
            {/* Heading */}
            <h2 className="DescriptionHeading">
                <strong>Where are you going?</strong>
            </h2>

            <p className="text-neutral-1 max-w-md mb-6">
                We’re currently building strong traveler communities in these cities.
            </p>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">

                {topLocations.map((loc) => (
                    <div
                        key={loc.id}
                        onClick={() => onSelect?.(loc)}
                        className="cursor-pointer rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow group border border-neutral-3"
                    >
                        {/* Image */}
                        <div className="relative h-48 w-full">
                            <Image
                                src={loc.images?.[0] || "/placeholder.png"}
                                alt={loc.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {selectedLocationId === loc.id && (<span className="absolute top-3 left-3 bg-white/80 px-3 py-1 rounded-full text-xs font-semibold text-primary-1">
                                Active Now
                            </span>)}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <div className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                                <MapPin size={18} className="text-primary-1" />
                                {loc.title}
                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                                {loc.state && `${loc.state}, `}{loc.country}
                            </p>

                            {/* <button className="mt-4 w-full flex items-center justify-center gap-2 bg-primary-1 text-white py-2 rounded-xl font-medium hover:bg-primary-hover transition">
                                Explore Trips
                                <ArrowRight size={16} />
                            </button> */}
                        </div>
                    </div>
                ))}

            </div>

            {/* Waitlist Section */}
            {/* <div className="mt-10 text-center">
                <p className="text-neutral-1 mb-3">
                    Can’t find your city?
                </p>

                <button
                    onClick={onWaitlist}
                    className="bg-neutral-5 border border-neutral-3 text-secondary-1 px-5 py-2.5 rounded-full hover:bg-primary-1 hover:text-white font-semibold transition"
                >
                    Join Early Access for New Cities
                </button>
            </div> */}
        </section>
    );
}
