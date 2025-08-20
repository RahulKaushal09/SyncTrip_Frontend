"use client";


import { useState, useRef, useEffect, JSX } from "react";

import { ChevronDown, Check, Compass, Clock, Calendar, Star, MapPin } from "lucide-react";
import "../../../styles/home/exploreNearbySection.css"
import { Filter } from "lucide-react";
import { ApiService, CommonServices } from "@/utils";
import {  Location } from "@/types";
// import { useRouter } from "next/router";
import { useLoader } from "../providers/LoaderContext";
import { Carousel } from "react-bootstrap";
import { ROUTES } from "@/constants";
import { useRouter } from 'next/navigation';


const distanceFilters = [
  { label: "Within 20 km", value: 20 },
  { label: "Within 40 km", value: 40 },
  { label: "Within 60 km", value: 60 },
  { label: "Within 100 km", value: 100 },
  { label: "Within 150 km", value: 150 },
  // { label: "Anywhere in India", value: 9999 }
];
type Option = {
  value: string | number;
  label: string;
};

interface DropdownProps {
  label: string;
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
}


function Dropdown({ label, options, value, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1 w-full sm:w-48" ref={dropdownRef}>
      <label className="text-sm font-medium text-[#003b59]">{label}</label>
      <div
        className="relative"
        onClick={() => setOpen((prev) => !prev)}
      >
        {/* Selected */}
        <div className=" selectOptionsDiv flex items-center justify-between border border-[#e3f5ff] bg-white px-3 py-2 rounded-md cursor-pointer hover:border-[#3abef5] transition-colors">
          <span>{options.find(o => o.value === value)?.label || "Select..."}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>

        {/* Menu */}
        {open && (
          <div className="selectOptionsDiv absolute left-0 right-0 mt-1 bg-white border border-[#e3f5ff] rounded-md shadow-md z-10 max-h-30 overflow-y-auto animate-fadeIn" style={{ scrollbarWidth: "none" }}>
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`selectOptions flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-[#e3f5ff] ${value === opt.value ? "bg-[#e3f5ff]/60" : ""
                  }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <Check className="w-4 h-4 text-[#3abef5]" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



export default function ExploreNearbySection() {
  const [selectedTypeColor, setSelectedTypeColor] = useState("var(--primary-1)");
  const [selectedType, setSelectedType] = useState("All");
  const { showLoader } = useLoader();
  const router = useRouter();
const redirectLocationUrl = (id: string, title: string, placesNo: string, country: string) => {
    // Implement your redirection logic here
    showLoader();
    window.location.href = CommonServices.generateLocationSlug(id, title, placesNo, country);
    // router.push(CommonServices.generateLocationSlug(id, title, placesNo, country));
  };
  const redirectBtnClick = (url: string) => {
    console.log(url);
    showLoader();
    router.push(url);
  };
  const renderLocationCard = (location: Location) => {
  const title = location.title || 'Untitled Location';
  const description = location.description || 'No description available';
  const rating = Number(location.rating) || 3;
  const distance = 'distance' in location && location.distance
    ? (location.distance as number / 1000).toFixed(1) + '' as string
    : null;
  const coordinates = location.fullDetails?.coordinates;
  const images = location.images || location.photos || [];
  const state = location.state || 'Unknown State';
  const country = location.country || 'India';
  const NoPlaces = location.placesNumberToVisit;
  const filterTags = location.filterTags || [];
  const bestTime = location.best_time || 'Anytime';
  return renderResultCard(location.id, title, description, rating, distance as string, images, state, NoPlaces as string, bestTime, filterTags, country);
}
const renderResultCard = (id: string, title: string, description: string, rating: number, distance: string | null, images: string[], state: string, placesToVisitNo: string, bestTime: string, tags: string[], country: string): JSX.Element => {
  const redirectUrlForLocation = "/location/" + CommonServices.generateLocationSlug(id, title, placesToVisitNo, country);

  return (
    <div className="destination-card-explorenearby-section m-animate m-slide-up hov-lift" key={id}>
      <div className="image-wrap-explorenearby-section">
        {/* <img
          src={images[0]}
          alt={title}
          className="w-full h-48 object-cover"
        /> */}
        {images.length > 1 ? (
            <Carousel interval={null} indicators={false} style={{ borderRadius: '8px' }}>
                {images.map((imgUrl, idx) => (
                    <Carousel.Item key={idx}>
                        <img
                            src={imgUrl}
                            className="w-full h-48 object-cover"
                            alt={`Slide ${idx + 1}`}
                            style={{height:"12rem"}}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
        ) : (
            <img
                src={images[0] }
                className="w-full h-48 object-cover"
                alt={title}
                            style={{height:"12rem"}}
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="absolute top-3 left-3">
            <div className="badge-explorenearby-section bg-white/90 text-[#003b59]">
              {distance} km away
            </div>
          </div>
          {/* <div className="absolute top-3 right-3">
            <div 
              className=" text-xs bg-[#fff]/10 text-[var(--success-1)]" style={{ borderRadius: "10px", border: "1px solid var(--success-1)", padding: "5px 10px" }}
              style={{ backgroundColor: "var(--success-4)" }}
            >
              {dest.type}
            </div>
          </div> */}
          <div className="absolute bottom-3 left-3 text-white">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm opacity-90">{state}</p>
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 fill-[#ffc53d] text-[#ffc53d]" />
            <span className="text-xs font-medium text-white">
              {rating}
            </span>
          </div>
        </div>
      </div>
      <div className="card-body-explorenearby-section">
        <p className="text-[#80838d] leading-relaxed clamp-4">
          {description}
        </p>
        <div className="meta-explorenearby-section grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#3abef5]" />
            <div>
              {/* <div className="font-medium text-[#003b59]"></div> */}
              <div className="text-s text-[var(--secondary-1)]">{placesToVisitNo} Places</div>
            </div>
          </div>
          {/* <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[#e5484d]" />
            <div>
              <div className="font-medium text-[#003b59]">{dest.weather}</div>
              <div className="text-xs text-[#80838d]">avg temp</div>
            </div>
          </div> */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-[#2b9a66]" />
            <span className="text-[#80838d]">Best time:</span>
            <span className="font-medium text-[#003b59]">{CommonServices.convertLongBestTimeNameToShortNotations(bestTime)}</span>
          </div>
        </div>

        <div className="highlights-explorenearby-section flex items-center gap-2 flex-wrap">
          {tags.map((highlight, i) => (
            <span
              key={i}
              className="text-xs bg-[#f2faff] text-[#3abef5] border-[#e3f5ff] px-2 py-1 rounded"
            >
              {highlight}
            </span>
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling to parent
            redirectBtnClick(redirectUrlForLocation);
          }}
          className="explore-btn-explorenearby-section w-full bg-[#3abef5] text-white px-4 py-2 rounded hover:bg-[#7accf5] transition-all duration-200 cursor-pointer"
        >
          Explore {title}
        </button>
      </div>
    </div>
  );
};
// const typeFilters = ["All", "Beach", "Hill Station", "Heritage", "Mountain", "Backwaters", "Spiritual"];
  const [typeFilters, setTypeFilters] = useState<string[]>(["All"]);

  const [destinations, setDestinations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(20); // km default
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [filteredDestinations, setFilteredDestinations] = useState<Location[]>([]);
  const setUniqueTypeFilters = (Locations: Location[]) => {
    let filters = Array.from(new Set(Locations.flatMap(loc => loc.filterTags)));
    filters = ["All", ...filters];
    setTypeFilters(filters as string[]);
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
        },
        (err) => {
          console.error("Geolocation error:", err);
          // You could fall back to default coords here if you want
        }
      );
    }
  }, []);
  useEffect(() => {
    if (!userLocation) return;

    const fetchNearby = async () => {
      setLoading(true);
      try {
        const results = await ApiService.fetchNearbyLocations(
          userLocation.lat,
          userLocation.lng,
          radius
        );
        setUniqueTypeFilters(results.locations);
        setDestinations(results.locations || []);
      } catch (err) {
        console.error("Failed to fetch nearby destinations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [userLocation, radius]);

  // useE
  // const filteredDestinations = destinations.filter(dest => {
  //   const distance = 'distance' in dest && dest.distance
  //   ? dest.distance as number:0;
  //   const withinDistance = distance <= radius;
  //   const matchesType = selectedType === "All" || dest.type === selectedType;
  //   return withinDistance && matchesType;
  // });
   useEffect(() => {
    const filtered = destinations.filter(dest => {
      const distance = 'distance' in dest && dest.distance
        ? dest.distance as number : 0;
      const withinDistance = distance/1000 <= radius;
      const matchesType = selectedType === "All" || (Array.isArray(dest.filterTags) && dest.filterTags.includes(selectedType));
      return withinDistance && matchesType;
    });
    setFilteredDestinations(filtered);
  }, [destinations, selectedType]);




  // const getTypeColor = (type: string) => {
  //   const colors: Record<string, string> = {
  //     "Beach": "#3abef5",
  //     "Hill Station": "#2b9a66",
  //     "Heritage": "#ffc53d",
  //     "Mountain": "#16324f",
  //     "Backwaters": "#7accf5",
  //     "Spiritual": "#e5484d"
  //   };
  //   return colors[type] || "#80838d";
  // };

  const colorMap: Record<string, string> = {
  Beach: "var(--primary-1)",
  "Hill Station": "var(--success-1)",
  Heritage: "var(--warning-1)",
  Mountain: "var(--secondary-1)",
  Spiritual: "var(--error-1)",
};

const assignedColors: Record<string, string> = {};
const availableColors = Object.values(colorMap);

function getTypeColor(type: string) {
  // If predefined, return directly
  if (colorMap[type]) return colorMap[type];

  // If already assigned, return the same
  if (assignedColors[type]) return assignedColors[type];

  // Assign a random color from the palette
  const randomColor =
    availableColors[Math.floor(Math.random() * availableColors.length)];
  assignedColors[type] = randomColor;
  return randomColor;
}
useEffect(() => {
  // Reset assigned colors when the component unmounts
  setSelectedTypeColor(getTypeColor(selectedType));
}, [selectedType]);

  return (
    <section id="explore-nearby-section" className="explore-nearby-section container-custom">
      <div className="explore-header m-animate m-slide-up is-inview ">
        <div className="explore-badge">
          <Compass className="w-5 h-5 text-[#3abef5] m-rotate-loop" />
          <span className="explore-badge-text">Incredible India Awaits</span>
        </div>
        <h2>Explore Destinations Near You</h2>
        <p>Discover India&apos;s most beautiful destinations within your preferred travel distance. From beaches to mountains, heritage to spirituality! 🏔️</p>
      </div>

      <div className=" filterMainBoxexplorenearby flex flex-col  gap-4 items-start lg:items-center justify-between m-animate m-slide-up is-inview border border-[#e3f5ff] bg-[#f2faff]/50 backdrop-blur-sm">
        {/* Header */}
        <div className="flex   filterBoxExploreNearby1" >
          <div className="flex items-center gap-2 ">
            <Filter className="w-5 h-5 text-[#3abef5]" />
            <h3 className="font-semibold text-[#003b59]" style={{ margin: "0px" }}>Filter Destinations</h3>
          </div>

          {/* Filters */}
          <div className="filterBoxExploreNearby2 flex flex-row sm:flex-row gap-4 w-full lg:w-auto" >
            {/* Distance Filter */}
            <div className="space-y-2">

              <Dropdown
                label="Distance from you"
                options={distanceFilters.map((filter) => ({
                  value: filter.value,
                  label: filter.label,
                }))}
                value={radius}
                onChange={(newValue) => setRadius(Number(newValue))}

              />
            </div>

            {/* Type Filter */}
            <div className="space-y-2">

              <Dropdown
                label="Destination type"
                options={typeFilters.map((type) => ({
                  value: type,
                  label: type,
                }))}
                value={selectedType}
                onChange={(newValue) => setSelectedType(String(newValue))}
              />
            </div>
          </div>
        </div>


        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 items-center border-t border-[#e3f5ff] w-100 pt-4" >
          <span className="text-sm text-[#80838d]">Active filters:</span>
          <span className=" text-xs   bg-[#3abef5]/10 text-[#3abef5]" style={{ borderRadius: "10px", border: "1px solid #3abef5", padding: "5px 10px" }}>
            {distanceFilters.find((f) => f.value === radius)?.label}
          </span>
          {selectedType !== "All" && (
            <span
              className={`text-xs px-2 py-1 rounded-md filterTagsTheme${selectedType}`}
              style={{
                backgroundColor: selectedTypeColor.replace("1","5"),
                color: selectedTypeColor,
                border: `1px solid ${selectedTypeColor}`,
              }}
            >
              {selectedType}
            </span>
          )}
          <span className="text-sm text-[#80838d] foundDestinationExplore" style={{ width: "max-content" }}>
            {filteredDestinations.length} destinations found
          </span>
        </div>
      </div>

      <div className="destinations-grid-explorenearby-section m-stagger mt-5">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loader"></div>
          </div>
        ) : filteredDestinations.length > 0 ? (
          filteredDestinations.map((location) => renderLocationCard(location))
        ) : (
          <div className="text-center text-gray-500 py-12">
            No destinations found matching your filters. Please make sure your location services are enabled and try adjusting the filters.
          </div>
        )}
      </div>


      <div className="text-center mt-8 m-animate m-slide-up is-inview">
        <div className="hov-lift inline-block">
          {/* <Button 
      variant="outline" 
      size="lg"
      className="border-[#3abef5] text-[#3abef5] hover:bg-[#f2faff] px-8 py-3 transition-transform"
    > */}
          <button
            className="HomePageMoreExploreButtonCss"
            onClick={() => redirectBtnClick(ROUTES.EXPLORE)}
          >
            <span>Discover More Destinations</span>
            <span className="ml-2 m-animate m-rotate-in is-inview"><Clock /></span>
          </button>
        </div>

        <p className="text-sm text-[#80838d] mt-4 m-animate m-fade-in is-inview" style={{ animationDelay: "0.2s" }}>
          800+ destinations across India • Real-time distance calculation (2D) • Updated daily
        </p>
      </div>
    </section>
  );
}
