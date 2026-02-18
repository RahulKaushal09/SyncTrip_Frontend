'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
// import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import Script from "next/script";

// import { GoogleMap, DirectionsService, DirectionsRenderer, Marker, Polyline } from '@react-google-maps/api';
import { Plus, Star } from "lucide-react";

import Image from 'next/image';

import { MapProvider } from '@/components/createTrip/MapProvider';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { LocationFields } from '@/constants';
import { LocationServices } from '@/utils/location.utils';
import TripServices from '@/utils/trip.utils';
import { PlacesToVisit, UserTrip, UserTripActivity } from '@/types';
import '../../../../styles/tripPlanner.css';
import { IsUserProfileComplete } from '@/utils';
import toast from 'react-hot-toast';
import { useLoader } from '@/components/providers/LoaderContext';
import { DirectionComputeUtils, ComputeRouteRequest } from '@/utils/directionCompute.utils';
// ---------------------------------------------
// TYPES
// ---------------------------------------------
interface LatLng {
  latitude: number;
  longitude: number;
}

interface ActivityWithDistance {
  place: PlacesToVisit;
  distanceKm: number | null;
}

interface DayRouteCache {
  signature: string | null;
  coords: LatLng[] | null;
  polyline: string | null;
  distanceKm: number | null;
  waypointOrder?: number[] | null;
  legDistancesKm?: number[] | null;
}

interface DayPlan {
  id: string;
  label: string;
  date?: string;
  activities: ActivityWithDistance[];
  route: DayRouteCache;
}

// ---------------------------------------------
// HELPERS (kept mostly same)
// ---------------------------------------------
const makeDay = (id: string, label: string, date?: string): DayPlan => ({
  id,
  label,
  date,
  activities: [],
  route: { signature: null, coords: null, polyline: null, distanceKm: null, waypointOrder: null, legDistancesKm: null },
});

function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const c = 2 * Math.asin(Math.sqrt(sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon));
  return Math.round(R * c * 10) / 10;
}

function sumPolylineKm(coords: LatLng[]): number {
  let s = 0;
  for (let i = 1; i < coords.length; i++) s += haversineKm(coords[i - 1], coords[i]);
  return Math.round(s * 10) / 10;
}

function decodePolyline(poly: string): LatLng[] {
  let index = 0, lat = 0, lng = 0;
  const coords: LatLng[] = [];

  const next = () => {
    let result = 0, shift = 0, b;
    do { b = poly.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; }
    while (b >= 0x20);
    return (result & 1) ? ~(result >> 1) : (result >> 1);
  };

  while (index < poly.length) {
    lat += next(); lng += next();
    coords.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return coords;
}

function routeSignature(activities: ActivityWithDistance[], optimize: boolean): string {
  const ids = activities.map(a => a.place.id).join('>');
  return `${optimize ? '1' : '0'}|${ids}`;
}

function attachDistancesToActivities(orderedPlaces: PlacesToVisit[], legDistancesKm: number[] | null): ActivityWithDistance[] {
  const out: ActivityWithDistance[] = [];
  for (let i = 0; i < orderedPlaces.length; i++) {
    const distanceKm = i === 0 ? null : (legDistancesKm?.[i - 1] ?? null);
    out.push({ place: orderedPlaces[i], distanceKm });
  }
  return out;
}

function buildOptimizedOrder(count: number, waypointOrder: number[] | null): number[] {
  if (!waypointOrder || !waypointOrder.length) return Array.from({ length: count }, (_, i) => i);
  if (count < 2) return Array.from({ length: count }, (_, i) => i);
  const middle = waypointOrder.map(n => Number(n)).filter(n => Number.isFinite(n));
  const result = [0, ...middle.map(i => i + 1), count - 1];
  const uniq = Array.from(new Set(result)).filter(i => i >= 0 && i < count);
  if (uniq.length === count) return uniq;
  return Array.from({ length: count }, (_, i) => i);
}

// ---------------------------------------------
// PLACE CARD / ACTIVITY CARD
// ---------------------------------------------
interface PlaceCardProps {
  place: PlacesToVisit;
  onAdd: () => void;
  showDescription?: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onAdd, showDescription = false }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const images = place.image || [];
  const showAddButton = !!(place.coordinates && place.coordinates.lat && place.coordinates.long);
  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all mb-3 overflow-hidden max-w-sm">
      {/* Image carousel */}
      <div className="relative w-full h-32 md:h-40">
        {images?.length ? (
          <>
            <Image
              src={images[currentImg]}
              alt={place.title || 'Place image'}
              className="w-full h-full object-cover transition-all duration-300"
              width={400}
              height={160}
            />
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-2 h-2 rounded-full ${currentImg === i ? "bg-white" : "bg-gray-400"}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        {/* Add button (floating on image) */}
        {showAddButton && (
          <button
            onClick={onAdd}
            className="absolute top-2 right-2 bg-white/80 hover:bg-blue-500 hover:text-white transition-colors rounded-full p-2 shadow-md"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 text-sm truncate flex-1 pr-2">
            {place.title}
          </h3>
          {place.rating && (
            <div className="flex items-center gap-1">
              <Star size={14} color="var(--warning-1)" fill="var(--warning-1)" />
              <p className="text-xs truncate">{place.rating}</p>
            </div>
          )}
        </div>
        {place.description && showDescription && (
          <p className="text-xs text-gray-500 line-clamp-3 mb-2">
            {place.description}
          </p>
        )}
      </div>
    </div>
  );
};

const ActivityCard: React.FC<{
  place: PlacesToVisit;
  distanceKm: number | null;
  index: number;
  onRemove: () => void;
}> = ({ place, distanceKm, index, onRemove }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-2 flex items-center">
    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4">
      {index + 1}
    </div>
    <div className="flex-1">
      <h3 className="text-sm font-semibold">{place.title}</h3>
      {distanceKm != null && (
        <p className="text-xs text-gray-500">Distance: {distanceKm.toFixed(1)} km</p>
      )}
    </div>
    <button
      onClick={onRemove}
      className="text-red-500 hover:text-red-700"
    >
      Remove
    </button>
  </div>
);

function generateDays(start: string | Date, end: string | Date): DayPlan[] {
  const days: DayPlan[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);

  const current = new Date(startDate);
  let index = 1;

  while (current <= endDate) {
    const label = `Day ${index}`;

    // store an ISO date string as the canonical date (unambiguous)
    const isoDate = current.toISOString(); // e.g. '2025-10-15T...'

    // keep the user-facing short display separately if needed; you can compute it when rendering
    days.push(makeDay(`d${index}`, label, isoDate));

    current.setDate(current.getDate() + 1);
    index++;
  }

  return days;
}

// ---------------------------------------------
// MAIN PAGE
// ---------------------------------------------

export default function TripPlannerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TripPlannerPageContent />
    </Suspense>
  );
}

const TripPlannerPageContent: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const tripId = params.tripId as string;

  const searchParams = useSearchParams();
  const showHotelsAfter = searchParams?.get('showHotelsAfter') === 'true';

  const [showPanel, setShowPanel] = useState(false);
  const [placesToVisit, setPlacesToVisit] = useState<PlacesToVisit[]>([]);
  const [days, setDays] = useState<DayPlan[]>([]);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [isOverview, setIsOverview] = useState(false);
  const [openOverviewIdx, setOpenOverviewIdx] = useState(0);
  const [optimizeByDay, setOptimizeByDay] = useState<Record<string, boolean>>({});
  // const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [totalDistanceKm, setTotalDistanceKm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mainLocationLatitude, setMainLocationLatitude] = useState<number>(28.6139); // default New Delhi
  const [mainLocationLongitude, setMainLocationLongitude] = useState<number>(77.209);

  const [tripDetails, setTripDetails] = useState<UserTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [overlayPosition, setOverlayPosition] = useState<{ x: number; y: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);  // For the absolute-positioned popup div
  const [isDragging, setIsDragging] = useState(false);
  const activeDayIdRef = useRef<string | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<PlacesToVisit | null>(null);
  const { showLoader, hideLoader } = useLoader();

  const activeDay = days[isOverview ? openOverviewIdx : selectedDayIdx];
  const activeOptimize = optimizeByDay[activeDay?.id ?? ''] ?? false;
  useEffect(() => { activeDayIdRef.current = activeDay?.id ?? null; }, [activeDay?.id]);

  const mapContainerStyle = { width: '100%', height: '100vh' };
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: mainLocationLatitude, lng: mainLocationLongitude });

  const [panelWidthPx, setPanelWidthPx] = useState<number>(420); // used to slide days bar left when panel opens

  // compute panel width on mount / resize (mirrors CSS min(420px, 90vw))
  useEffect(() => {
    const compute = () => {
      const w = Math.min(420, Math.floor(window.innerWidth * 0.9));
      setPanelWidthPx(w);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);
  useEffect(() => {
    if (!activeDay || isOverview || activeDay.activities.length < 2) {
      setRouteCoords([]);
      setTotalDistanceKm(null);
      return;
    }

    const sig = routeSignature(activeDay.activities, activeOptimize);

    // ✅ Use cached route if same signature
    if (activeDay.route.signature === sig && activeDay.route.coords?.length) {
      setRouteCoords(activeDay.route.coords);
      setTotalDistanceKm(activeDay.route.distanceKm ?? null);
      fitMapTo(activeDay.route.coords);
      return;
    }

    const places = activeDay.activities.map(a => a.place);

    const payload: ComputeRouteRequest = {
      origin: {
        lat: places[0].coordinates.lat,
        lng: places[0].coordinates.long
      },
      destination: {
        lat: places[places.length - 1].coordinates.lat,
        lng: places[places.length - 1].coordinates.long
      },
      waypoints: places.slice(1, -1).map(p => ({
        lat: p.coordinates.lat,
        lng: p.coordinates.long
      })),
      optimize: activeOptimize
    };

    const timer = setTimeout(async () => {
      try {
        const res = await DirectionComputeUtils.computeRoute(payload);
        const coords = decodePolyline(res.polyline);

        setRouteCoords(coords);
        setTotalDistanceKm(res.totalKm);

        setDays(prev =>
          prev.map(d =>
            d.id !== activeDay.id
              ? d
              : {
                ...d,
                route: {
                  signature: sig,
                  coords,
                  polyline: res.polyline,
                  distanceKm: res.totalKm,
                  waypointOrder: res.waypointOrder,
                  legDistancesKm: res.legDistancesKm
                }
              }
          )
        );

        fitMapTo(coords);
      } catch (err) {
        console.error("Route compute failed:", err);
      }
    }, 700); // debounce = prevents spam

    return () => clearTimeout(timer);

  }, [activeDay?.activities, activeOptimize, isOverview]);


  // Loaders
  const loadActivities = (activities: UserTripActivity[]) => {
    try {
      const updatedDays = [...days];
      const dayActivitiesMap: Record<string, { act: UserTripActivity, place: PlacesToVisit }[]> = {};
      activities.forEach(act => {
        const place = placesToVisit.find(p => p.id === act.placeId);
        if (place) {
          if (!dayActivitiesMap[act.dayId]) dayActivitiesMap[act.dayId] = [];
          dayActivitiesMap[act.dayId].push({ act, place });
        }
      });
      Object.keys(dayActivitiesMap).forEach(dayId => {
        const dayActs = dayActivitiesMap[dayId].sort((a, b) => a.act.order - b.act.order);
        const activitiesWithDist: ActivityWithDistance[] = dayActs.map((item, idx) => ({
          place: item.place,
          distanceKm: item.act.distanceKm as number || null
        }));
        const legDists = activitiesWithDist.slice(1).map(a => a.distanceKm).filter((d): d is number => d != null);
        const totalKm = legDists.reduce((sum, d) => sum + d, 0);
        const lastAct = dayActs[dayActs.length - 1]?.act;
        const sig = lastAct?.routeSignature ?? null;
        const poly = lastAct?.polyline ?? null;
        const coords = poly ? decodePolyline(poly) : null;
        const dayIdx = updatedDays.findIndex(d => d.id === dayId);
        if (dayIdx >= 0) {
          updatedDays[dayIdx].activities = activitiesWithDist;
          updatedDays[dayIdx].route = {
            signature: sig,
            coords,
            polyline: poly,
            distanceKm: totalKm || (coords ? sumPolylineKm(coords) : null),
            waypointOrder: null,
            legDistancesKm: legDists.length > 0 ? legDists : null
          };
        }
      });
      setDays(updatedDays);
      setLoading(false);
    } catch (err) {
      console.error('Error loading trip activities', err);
    }
  };


  useEffect(() => {
    const fetchDetails = async (locationId: string) => {
      if (!locationId) {
        router.replace('/userTrips');
      } else {
        const LocationDetailsFields = [
          LocationFields.ID,
          LocationFields.TITLE,
          LocationFields.COORDINATES,
          LocationFields.COUNTRY,
          LocationFields.PLACES_TO_VISIT,
        ];
        const LocationDetails = await LocationServices.fetchLocationDetails(locationId, LocationDetailsFields);
        if (!LocationDetails) return;
        setMainLocationLatitude(LocationDetails.fullDetails?.coordinates?.lat as number);
        setMainLocationLongitude(LocationDetails.fullDetails?.coordinates?.long as number);
        setCenter({ lat: LocationDetails.fullDetails?.coordinates?.lat as number, lng: LocationDetails.fullDetails?.coordinates?.long as number });
        const placesToVisitIds: string[] = LocationDetails.placesToVisit as string[] || [];
        if (placesToVisitIds.length > 0) {
          const placesToVisit_ = await LocationServices.getPlacesToVisitByIds(placesToVisitIds);
          setPlacesToVisit(placesToVisit_);
        }
        setLoading(false);
      }
    };

    const fetchTripDetails = async () => {
      if (!tripId) return;
      try {
        const tripDetails_ = await TripServices.fetchTripDetails(tripId);
        if (!tripDetails_) return;
        setTripDetails(tripDetails_);
        setDays(() =>
          tripDetails_.startDate && tripDetails_.endDate
            ? generateDays(tripDetails_.startDate, tripDetails_.endDate)
            : []);
        if (tripDetails_.locationId) {
          await fetchDetails(tripDetails_.locationId);
        }
      } catch (error) {
        console.error('Error fetching trip', error);
      }
      setLoading(false);
    };
    fetchTripDetails();
    // only on mount / tripId
  }, [tripId, router]);

  useEffect(() => {
    if (tripDetails?.activities && tripDetails.activities.length > 0 && placesToVisit.length > 0) {
      loadActivities(tripDetails.activities);
    }
  }, [tripDetails, placesToVisit]);

  // Fit map to all places on load — robust with padding and center
  useEffect(() => {
    if (!mapRef.current) return;
    if (!placesToVisit || placesToVisit.length === 0) {
      if (center?.lat && center?.lng) {
        try {
          mapRef.current.setCenter({ lat: center.lat, lng: center.lng });
          mapRef.current.setZoom(12);
        } catch (e) { /* ignore */ }
      }
      return;
    }
    const validPlaces = placesToVisit.filter(p => p?.coordinates?.lat && p?.coordinates?.long);
    if (validPlaces.length === 0) return;

    setTimeout(() => {
      try {
        const bounds = new google.maps.LatLngBounds();
        validPlaces.forEach(place => bounds.extend({
          lat: place.coordinates.lat,
          lng: place.coordinates.long
        }));
        if (center?.lat && center?.lng) bounds.extend({ lat: center.lat, lng: center.lng });
        mapRef.current!.fitBounds(bounds, {
          top: 80,
          bottom: 40,
          left: 40,
          right: isMobile ? 150 : 440
        } as google.maps.Padding);
      } catch (e) {
        // map might not be ready
      }
    }, 0);

  }, [placesToVisit, center]);

  const saveTrip = async () => {
    if (saving) return;
    setSaving(true);
    showLoader();
    try {
      const activities: UserTripActivity[] = [];
      days.forEach(day => {
        day.activities.forEach((act, order) => {
          activities.push({
            dayId: day.id,
            dayLabel: day.label,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dayDate: day.date ? new Date(day.date) : null as any,
            placeId: act.place.id,
            order,
            distanceKm: act.distanceKm as number,
            routeSignature: day.route.signature as string,
            polyline: day.route.polyline as string,
          });
        });
      });

      const res = await TripServices.saveTripActivities(tripDetails as UserTrip, activities, true);
      if (!res) {
        throw new Error('Save failed');
      }
      if (showHotelsAfter) {
        // router.replace(`/userTrip/${tripId}hotelSelection?tripId=${tripId}&locationId=${tripDetails?.locationId}`);
        router.replace(`/userTrip/${tripId}/details?locationId=${tripDetails?.locationId}`);

      } else {
        router.replace(`/userTrip/${tripId}/details?locationId=${tripDetails?.locationId}`);

      }
    } catch (err: unknown) {
      console.error('Save error:', err);
      alert(`Save failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
      hideLoader();
    }
  };

  // Fit map to coords
  const fitMapTo = useCallback((coords: LatLng[]) => {
    if (!mapRef.current || !coords.length) return;
    try {
      if (coords.length === 1) {
        mapRef.current.setCenter({ lat: coords[0].latitude, lng: coords[0].longitude });
        mapRef.current.setZoom(15);
        return;
      }
      const bounds = new google.maps.LatLngBounds();
      coords.forEach(coord => bounds.extend({ lat: coord.latitude, lng: coord.longitude }));
      mapRef.current.fitBounds(bounds, { top: 80, right: 400, bottom: 40, left: 40 } as google.maps.Padding);
    } catch (e) { /* ignore */ }
  }, []);

  const getPixelPositionFromLatLng = useCallback((lat: number, lng: number) => {
    if (!mapRef.current || !lat || !lng) return null;  // Add this safety
    const map = mapRef.current;
    const projection = map.getProjection?.();
    if (!projection) return null;
    const bounds = map.getBounds?.();
    if (!bounds) return null;

    try {
      const ne = projection.fromLatLngToPoint(bounds.getNorthEast());
      const sw = projection.fromLatLngToPoint(bounds.getSouthWest());
      const worldPoint = projection.fromLatLngToPoint(new google.maps.LatLng(lat, lng));
      const scale = Math.pow(2, map.getZoom() ?? 0);
      if (!ne || !sw || !worldPoint || !scale) return null;
      const x = (worldPoint.x - sw.x) * scale;
      const y = (worldPoint.y - ne.y) * scale;

      const mapDiv = map.getDiv();
      const rect = mapDiv.getBoundingClientRect();
      // Return pixel coordinates relative to page (so we can absolutely position an overlay)
      return {
        x: rect.left + x,
        y: rect.top + y
      };
    } catch (e) {
      return null;
    }
  }, []);
  useEffect(() => {
    if (!selectedPlace || !mapRef.current) {
      setOverlayPosition(null);  // Reset when no selection
      return;
    }

    const map = mapRef.current;
    const lat = selectedPlace.coordinates.lat;
    const lng = selectedPlace.coordinates.long;

    // Initial position
    const initialPos = getPixelPositionFromLatLng(lat, lng);
    if (initialPos) {
      setOverlayPosition(initialPos);
    }

    // Listen for map changes
    const events = ['dragend', 'zoom_changed', 'idle'];  // 'idle' covers post-pan/zoom settling
    const handlers: google.maps.MapsEventListener[] = events.map(event =>
      google.maps.event.addListener(map, event, () => {
        const pos = getPixelPositionFromLatLng(lat, lng);
        if (pos) {
          setOverlayPosition(pos);
        }
      })
    );

    return () => {
      handlers.forEach(handler => google.maps.event.removeListener(handler));
    };
  }, [selectedPlace, getPixelPositionFromLatLng]);

  // Directions options computed
  // const directionsOptions = useMemo(() => {
  //   if (!activeDay || isOverview || activeDay.activities.length < 2) return null;
  //   const places = activeDay.activities.map(a => a.place);
  //   const waypoints = places.slice(1, -1).map(place => ({
  //     location: { lat: place.coordinates.lat, lng: place.coordinates.long },
  //     stopover: true,
  //   }));
  //   console.log('Requesting directions for', { places, waypoints, optimize: activeOptimize });
  //   return {
  //     origin: { lat: places[0].coordinates.lat, lng: places[0].coordinates.long },
  //     destination: { lat: places[places.length - 1].coordinates.lat, lng: places[places.length - 1].coordinates.long },
  //     waypoints,
  //     optimizeWaypoints: activeOptimize,
  //     travelMode: google.maps.TravelMode.DRIVING,
  //     // provideRouteAlternatives: false,
  //     // avoidFerries: false,
  //     // avoidHighways: false,
  //     // avoidTolls: false,
  //   } as google.maps.DirectionsRequest;
  // }, [activeDay, isOverview, activeOptimize]);


  // Use cached route if signatures match (avoid new Directions requests)
  useEffect(() => {
    if (!activeDay || isOverview) {
      setRouteCoords([]);
      setTotalDistanceKm(null);
      return;
    }
    const sig = routeSignature(activeDay.activities, activeOptimize);
    if (activeDay.route.signature === sig && activeDay.route.coords && activeDay.route.coords.length > 1) {
      setRouteCoords(activeDay.route.coords);
      setTotalDistanceKm(activeDay.route.distanceKm ?? null);
      fitMapTo(activeDay.route.coords);
    } else {
      setRouteCoords([]);
      setTotalDistanceKm(null);
    }
  }, [activeDay, activeOptimize, isOverview, fitMapTo]);

  // Drag/drop handlers
  const addPlaceToDay = useCallback((place: PlacesToVisit, dayIndex: number) => {
    setDays(prev => {
      const next = [...prev];
      const day = { ...next[dayIndex] };
      if (!day.activities.find(a => a.place.id === place.id)) {
        day.activities = [...day.activities, { place, distanceKm: null }];
        day.route = { signature: null, coords: null, polyline: null, distanceKm: null, waypointOrder: null, legDistancesKm: null };
        day.activities = day.activities.map(a => ({ ...a, distanceKm: null }));
        next[dayIndex] = day;
      }
      return next;
    });
  }, []);

  const removePlaceFromDay = useCallback((placeId: string, dayIndex: number) => {
    setDays(prev => {
      const next = [...prev];
      const day = { ...next[dayIndex] };
      day.activities = day.activities.filter(a => a.place.id !== placeId);
      day.route = { signature: null, coords: null, polyline: null, distanceKm: null, waypointOrder: null, legDistancesKm: null };
      day.activities = day.activities.map(a => ({ ...a, distanceKm: null }));
      next[dayIndex] = day;
      return next;
    });
  }, []);

  // IMPORTANT: droppableId and draggableId must be strings and unique across the DragDropContext.
  const onDragEnd = useCallback((result: DropResult, dayIndex: number) => {
    if (!result.destination) return;
    setDays(prev => {
      const next = [...prev];
      const day = { ...next[dayIndex] };
      const newActivities = Array.from(day.activities);
      const [moved] = newActivities.splice(result.source.index, 1);
      newActivities.splice(result.destination!.index, 0, moved);
      day.activities = newActivities.map(a => ({ ...a, distanceKm: null }));
      day.route = { signature: null, coords: null, polyline: null, distanceKm: null, waypointOrder: null, legDistancesKm: null };
      next[dayIndex] = day;
      return next;
    });
  }, []);

  const toggleOptimizeForDay = useCallback((dayId: string) => {
    setOptimizeByDay(prev => ({ ...prev, [dayId]: !(prev[dayId] ?? false) }));
  }, []);

  const filteredPlaces = placesToVisit.filter(place =>
    place.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dayIndex = isOverview ? openOverviewIdx : selectedDayIdx;
  const expectedSig = routeSignature(activeDay?.activities ?? [], activeOptimize);

  // click anywhere on map -> close selectedPlace
  // useEffect(() => {
  //   if (!mapRef.current) return;
  //   const map = mapRef.current;
  //   const listener = map.addListener("click", () => setSelectedPlace(null));
  //   return () => {
  //     if (listener) google.maps.event.removeListener(listener);
  //   };
  // }, []);
  // useEffect(() => {
  //   if (!mapRef.current) return;
  //   const map = mapRef.current;
  //   const listener = map.addListener("click", (event: google.maps.MapMouseEvent) => {
  //     // Optional: Check if click is far from marker to avoid accidental closes, but not needed
  //     setSelectedPlace(null);
  //   });
  //   return () => {
  //     if (listener) google.maps.event.removeListener(listener);
  //   };
  // }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    let mouseDownPos: { x: number; y: number } | null = null;
    let touchStartPos: { x: number; y: number } | null = null;
    const dragThreshold = 5; // Pixels; small threshold to detect intentional drags

    // Mouse: Track mousedown position
    const mouseDownListener = map.addListener('mousedown', (e: google.maps.MapMouseEvent) => {
      // Use the DOM event's clientX/clientY instead of the non-existent e.pixel
      const dom = e.domEvent as MouseEvent | undefined;
      if (dom) {
        mouseDownPos = { x: dom.clientX, y: dom.clientY };
      }
    });

    // Touch: Track touchstart position
    const touchStartListener = google.maps.event.addDomListener(map.getDiv(), 'touchstart', (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    // Mouse: Detect drag movement
    const dragListener = map.addListener('drag', () => {
      setIsDragging(true);
    });

    // Touch: Detect touchmove (drag)
    const touchMoveListener = google.maps.event.addDomListener(map.getDiv(), 'touchmove', (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
      }
    });

    // Click handler: Close popup only if not dragging
    const clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (!isDragging && selectedPlace) {
        // Optional: For mouse, check if movement was minimal (click, not drag)
        const dom = e.domEvent as MouseEvent | undefined;
        if (mouseDownPos && dom) {
          const dx = Math.abs(dom.clientX - mouseDownPos.x);
          const dy = Math.abs(dom.clientY - mouseDownPos.y);
          if (dx <= dragThreshold && dy <= dragThreshold) {
            setSelectedPlace(null);
          }
        } else {
          // No mouseDownPos (e.g., touch or programmatic click) — close if not dragging
          setSelectedPlace(null);
        }
      }
    });

    // Reset dragging state after drag ends
    const dragEndListener = map.addListener('dragend', () => {
      setIsDragging(false);
      mouseDownPos = null;
    });

    // Touch: Reset after touch ends
    const touchEndListener = google.maps.event.addDomListener(map.getDiv(), 'touchend', () => {
      setIsDragging(false);
      touchStartPos = null;
    });

    return () => {
      google.maps.event.removeListener(mouseDownListener);
      google.maps.event.removeListener(dragListener);
      google.maps.event.removeListener(clickListener);
      google.maps.event.removeListener(dragEndListener);
      google.maps.event.removeListener(touchMoveListener);
      google.maps.event.removeListener(touchEndListener);
      google.maps.event.removeListener(touchStartListener);
    };
  }, [selectedPlace]);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (tripId === null) {
    router.replace('/explore');
    return null;
  }
  if (!IsUserProfileComplete()) {
    // Redirect to profile completion page
    toast.error('Please complete your profile before planning a trip.');
    router.replace('/explore');
    return null;
  }

  // UI & layout helpers
  const itineraryPanelVisible = showPanel;
  const daysBarRightOffset = itineraryPanelVisible ? panelWidthPx : 0;

  return (
    <div className="flex h-screen w-screen tripPlannerContainer">
      <Script
        id="google-maps"
        strategy="beforeInteractive"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=maps,marker`}
      />
      {/* Left narrow search/places column */}
      {!isMobile && <div className="relative left-0 top-0 h-full w-96 bg-white shadow-lg flex flex-col z-40">
        {/* Search Bar */}
        <div className="p-3 border-b border-gray-200 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search places to visit"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-gray-50 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>

        <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: "none" }}>
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onAdd={() => addPlaceToDay(place, isOverview ? openOverviewIdx : selectedDayIdx)}
            />
          ))}
        </div>
      </div>}

      <MapProvider>
        <div className="relative h-screen w-screen overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            onLoad={map => { mapRef.current = map; }}
            options={{
              // Disable default UI and only show zoom control
              disableDefaultUI: true,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              styles: [{ featureType: 'poi', stylers: [{ visibility: 'simplified' }] }],
            }}
          >
            {/* Map markers */}
            {placesToVisit.map((place) => {
              if (!place.coordinates || !place.coordinates.lat || !place.coordinates.long) return null;
              const isActive = activeDay?.activities.some(a => a.place.id === place.id);
              const activeIndex = isActive ? activeDay.activities.findIndex(a => a.place.id === place.id) : -1;
              return (
                <Marker
                  key={String(place.id)}
                  position={{ lat: place.coordinates.lat, lng: place.coordinates.long }}
                  icon={isActive ? undefined : { url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
                  label={
                    isActive
                      ? {
                        text: `${activeIndex + 1}`,
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }
                      : undefined
                  }
                  onClick={() => setSelectedPlace(place)}
                />
              );
            })}


            {/* Directions service / renderer */}
            {/* {directionsOptions && activeDay && (activeDay.route.signature !== expectedSig) && (
              <DirectionsService options={directionsOptions} callback={directionsCallback} />
            )} */}
            {/* {directionsOptions && activeDay && (activeDay.route.signature !== routeSignature(activeDay.activities, activeOptimize)) && (
              <DirectionsService options={directionsOptions} callback={directionsCallback} />
            )} */}

            {/* {directions && (
              <DirectionsRenderer
                options={{
                  directions,
                  polylineOptions: { strokeColor: '#C2185B', strokeWeight: 5 },
                }}
              />
            )} */}

            {routeCoords.length > 1 && (
              <Polyline
                path={routeCoords.map(c => ({ lat: c.latitude, lng: c.longitude }))}
                options={{ strokeColor: '#C2185B', strokeWeight: 5 }}
              />
            )}
          </GoogleMap>

          {/* Total Distance Overlay */}
          {!isOverview && activeDay?.activities.length >= 2 && totalDistanceKm != null && (
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              zIndex: 10,
              fontSize: '14px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}>
              Total Distance: {totalDistanceKm.toFixed(1)} km
            </div>
          )}

          {/* Itinerary panel */}
          <div
            className={`fixed top-0 right-0 h-full bg-white shadow-xl border-l border-gray-200 flex flex-col transform transition-transform duration-300`}
            style={{
              zIndex: 60,
              width: `min(420px, 90vw)`,
              transform: showPanel ? 'translateX(0)' : 'translateX(100%)'
            }}
          >
            <div className="p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">

              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="text-gray-600 hover:text-gray-900 p-1"
                aria-label="Close itinerary"
              >
                Close
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">

              {isOverview ? (
                <>
                  {days.map((day, i) => (
                    <div key={day.id} className="mb-4">
                      <button
                        onClick={() => setOpenOverviewIdx(i)}
                        className="w-full text-left font-semibold"
                      >
                        {day?.date
                          ? new Date(day.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
                          : day?.label} <span className="text-gray-500">({day.activities.length} Activities)</span>
                        {/* {day.date || day.label} ({day.activities.length} Activities) */}
                      </button>
                      {openOverviewIdx === i && (
                        <div className="mt-2">
                          {day.activities.map((item, idx) => (
                            <ActivityCard
                              key={String(item.place.id)}
                              place={item.place}
                              distanceKm={item.distanceKm}
                              index={idx}
                              onRemove={() => removePlaceFromDay(item.place.id, i)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">
                      {activeDay?.date
                        ? new Date(activeDay.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
                        : activeDay?.label}
                    </h2>

                    {/* <button
                      onClick={() => toggleOptimizeForDay(activeDay.id)}
                      className="text-blue-500"
                    >
                      {optimizeByDay[activeDay?.id] ? 'Optimize ✓' : 'Optimize'}
                    </button> */}
                  </div>

                  <DragDropContext onDragEnd={result => onDragEnd(result, selectedDayIdx)}>
                    <Droppable droppableId={`activities-${selectedDayIdx}`}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {activeDay?.activities.map((item, index) => (
                            <Draggable
                              key={String(item.place.id)}
                              draggableId={String(item.place.id)}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <ActivityCard
                                    place={item.place}
                                    distanceKm={item.distanceKm}
                                    index={index}
                                    onRemove={() => removePlaceFromDay(item.place.id, selectedDayIdx)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {totalDistanceKm != null && (
                    <div className="mt-2 text-sm text-gray-500">
                      Total Distance: {totalDistanceKm.toFixed(1)} km
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Days vertical bar (slides left when panel opens) */}
          <div
            className="fixed right-0 top-0 h-full w-16 flex flex-col items-center transition-all duration-300"
            style={{ zIndex: 70, right: `${daysBarRightOffset}px` }}
          >
            <div className="py-4 space-y-2 overflow-y-auto" style={{ maxHeight: '100vh' }}>
              <button
                onClick={saveTrip}
                disabled={saving}
                className="bg-primary-1 text-white p-2 rounded"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              {['Overview', ...days.map(d => d.label)].map((label, i) => (
                <button
                  key={label + i}
                  onClick={() => {
                    if (label === 'Overview') {
                      if (isOverview) {
                        setShowPanel(prev => !prev);
                      } else {
                        setIsOverview(true);
                        setOpenOverviewIdx(0);
                        setShowPanel(true);
                      }
                    } else {
                      const idx = days.findIndex(d => d.label === label);
                      if (idx < 0) return;
                      if (!isOverview && selectedDayIdx === idx) {
                        setShowPanel(prev => !prev);
                      } else {
                        setIsOverview(false);
                        setSelectedDayIdx(idx);
                        setShowPanel(true);
                      }
                    }
                  }}
                  className={`w-12 h-12 rounded-lg text-sm flex items-center justify-center text-center transition-all
                    ${(isOverview && label === 'Overview') || (!isOverview && days[selectedDayIdx]?.label === label)
                      ? 'bg-secondary-1 text-white shadow'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {label === 'Overview' ? 'All' : 'Day' + i}
                </button>
              ))}
            </div>
          </div>

          {/* Selected place overlay: positioned 20px above marker using map container rect */}
          {/* {selectedPlace && mapRef.current && (
            <div
              className="fixed inset-0 z-50 pointer-events-none"
              onClick={() => setSelectedPlace(null)}
            >
              {(() => {
                const pos = getPixelPositionFromLatLng(
                  selectedPlace.coordinates.lat,
                  selectedPlace.coordinates.long
                );
                if (!pos) return null;

                // We want the overlay 20px ABOVE the marker
                const overlayLeft = pos.x;
                const overlayTop = pos.y - 20; // 20px up

                return (
                  <div
                    className="absolute pointer-events-auto"
                    style={{
                      left: overlayLeft,
                      top: overlayTop,
                      transform: "translate(-50%, -100%)", // center horizontally and sit above marker
                      width: 320,
                      maxWidth: 'calc(100vw - 140px)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-transparent shadow-none border-none">
                      <PlaceCard
                        place={selectedPlace}
                        onAdd={() => {
                          addPlaceToDay(selectedPlace, dayIndex);
                          setSelectedPlace(null);
                          setShowPanel(true);
                        }}
                        showDescription={true}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          )} */}
          {selectedPlace && mapRef.current && overlayPosition && (
            <div
              className="fixed inset-0 z-50 pointer-events-none"  // Removed redundant onClick (disabled anyway)
            >
              <div
                ref={overlayRef}
                className="absolute pointer-events-auto"
                style={{
                  left: `${overlayPosition.x}px`,
                  top: `${overlayPosition.y}px`,  // No -20; transform pulls it above
                  transform: "translate(-50%, -100%)",  // Center horizontally, fully above marker
                  width: 320,
                  maxWidth: 'calc(100vw - 140px)',
                }}
                onClick={(e) => e.stopPropagation()}  // Prevent map click from firing
              >
                <div className="bg-transparent shadow-none border-none">
                  <PlaceCard
                    place={selectedPlace}
                    onAdd={() => {
                      addPlaceToDay(selectedPlace, dayIndex);
                      setSelectedPlace(null);
                      setShowPanel(true);
                    }}
                    showDescription={true}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </MapProvider>
    </div>
  );
};

// export default TripPlannerPage;
