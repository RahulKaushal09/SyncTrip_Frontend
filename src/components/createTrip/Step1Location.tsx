"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Search, X } from "lucide-react";
import { LocationServices } from "@/utils/location.utils";
import apiClient from "@/utils/apiClient";
import { LocationFields, typeOfLocationCardEnum } from "@/constants";
import LocationCard from "../LocationCard/LocationCard";
import { Location } from "@/types";



export default function LocationSelector({
    onSelect,
    // onProceed,
    initialSelectedLocation = null,
}: {
    onSelect?: (loc: Location) => void;
    // onProceed: (loc: Location) => void;
    initialSelectedLocation?: Location | null;
}) {
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Location[]>([]);
    const [selected, setSelected] = useState<Location | null>(initialSelectedLocation);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setError(null);
            return;
        }

        const controller = new AbortController();
        const timer = setTimeout(async () => {

            try {
                setLoading(true);
                const res = await LocationServices.fetchLocationsBySearch(query);

                setResults((res || []) as Location[]);
                setError(null);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    setError("Failed to load results");
                    setResults([]);
                }
            } finally {
                setLoading(false);
            }
        }, 400);


        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    const handleSelect = (loc: Location) => {
        setSelected(loc);
        setQuery("");
        setFocused(false);
        onSelect?.(loc);
    };

    return (
        <div className="flex flex-col   " >
            <h2 className="DescriptionHeading" >
                <strong> Where are you going?</strong>
            </h2>
            <p style={{ color: "rgb(102, 102, 102)", marginBottom: "16px" }}>
                Start by selecting your travel destination.
            </p>

            {/* Search Input */}
            <div className="relative w-full max-w-lg">
                <div
                    className={`flex items-center bg-white border rounded-full px-5 py-3 shadow-sm transition ${focused ? "border-blue-500" : "border-gray-200"
                        }`}
                >
                    <Search className="text-gray-400 mr-3" size={18} />
                    <input
                        type="text"
                        placeholder="Search your destination..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setFocused(true)}
                        className="flex-1 outline-none text-gray-700"
                    />
                    {query && (
                        <button onClick={() => setQuery("")}>
                            <X className="text-gray-400" size={18} />
                        </button>
                    )}
                </div>

                {/* Search Results Dropdown */}
                {focused && query && (
                    <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20 max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="py-4 text-center text-gray-400">Loading...</div>
                        ) : error ? (
                            <div className="py-4 text-center text-gray-400">{error}</div>
                        ) : results.length === 0 ? (
                            <div className="py-4 text-center text-gray-400">
                                No results found.
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {results.map((loc) => (
                                    <li
                                        key={loc.id}
                                        onClick={() => handleSelect(loc)}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <div className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-md">
                                            <MapPin size={16} className="text-gray-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{loc.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {[loc.state, loc.country].filter(Boolean).join(", ")}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Selected Location Card */}
            {selected ? (
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px', gap: '15px', width: '100%' }}>
                    <LocationCard
                        key={selected.id}
                        isWishlisted={selected.isWishlisted}
                        placeConnectedwithid={selected.locationConnectedWith}
                        name={selected.title}
                        rating={selected.rating}
                        images={selected.photos}
                        // inlineStyle={{ width: isMobile ? "100%" : "260px" }}
                        // imageInlineStyle={{ width: isMobile ? 500 : 260 }}
                        // whishlistParentId={parentId}
                        // whishlistParentType={parentType}
                        typeOfWhishlistCardEnum={selected.isWishlisted ? "filled" : "outline"}
                        cardId={selected.id}
                        typeOfCard={typeOfLocationCardEnum.location}
                    />
                    {/* <div className="flex gap-3 mt-5">
                        <button
                            onClick={() => onProceed({ id: selected.id, name: selected.title })}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2.5 transition"
                        >
                            Next
                        </button>
                        <button
                            onClick={() => setSelected(null)}
                            className="text-gray-500 hover:text-gray-700 font-medium"
                        >
                            Change
                        </button>
                    </div> */}
                </div>

                // <LocationCard location={selected} />
            ):
            <div style={{height:"50%"}}></div>
            }
        </div >
    );
}
