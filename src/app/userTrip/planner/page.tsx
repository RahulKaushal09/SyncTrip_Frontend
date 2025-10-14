'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { GoogleMap, DirectionsService, DirectionsRenderer, Marker, Polyline } from '@react-google-maps/api';
import { Plus, Star } from "lucide-react";

import { MapProvider } from '@/components/createTrip/MapProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { LocationFields } from '@/constants';
import { LocationServices } from '@/utils/location.utils';
import TripServices from '@/utils/trip.utils';
import { PlacesToVisit, UserTripActivity } from '@/types';
import '../../../styles/tripPlanner.css';
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
// MOCK DATA
// ---------------------------------------------


const makeDay = (id: string, label: string, date?: string): DayPlan => ({
  id,
  label,
  date,
  activities: [],
  route: { signature: null, coords: null, polyline: null, distanceKm: null, waypointOrder: null, legDistancesKm: null },
});



// ---------------------------------------------
// HELPERS
// ---------------------------------------------
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
// COMPONENTS
// ---------------------------------------------

interface PlaceCardProps {
  place: PlacesToVisit;
  onAdd: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onAdd }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const images = place.image || [];
  const showAddButton = place.coordinates && place.coordinates.lat && place.coordinates.long;
  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all mb-3 overflow-hidden">
      {/* Image carousel */}
      <div className="relative w-full h-40">
        <img
          src={images[currentImg]}
          alt={place.title}
          className="w-full h-full object-cover transition-all duration-300"
        />
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImg(i)}
                className={`w-2 h-2 rounded-full ${
                  currentImg === i ? "bg-white" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
        {/* Add button (floating on image) */}
        {showAddButton &&(
        <button
          onClick={onAdd}
          className="absolute top-2 right-2 bg-white/80 hover:bg-blue-500 hover:text-white transition-colors rounded-full p-2 shadow-md"
        >
          <Plus size={18} />
        </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex" style={{justifyContent:"space-between"}}>
        <h3 className="font-semibold text-gray-800 text-sm truncate">
          {place.title}
        </h3>
        {place.rating && (
          <div style={{display:"flex",gap:5}}>
          <Star size={18} color="var(--warning-1)" />
          <p className="text-xs text-gray-500 truncate">{place.rating}</p>
          </div>
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
      {/* <p className="text-xs text-gray-500">{place.tag} • {place.rating} ★</p> */}
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

  let current = new Date(startDate);
  let index = 1;

  while (current <= endDate) {
    // format date however you like, e.g. “January 21”
    const label = `Day ${index}`;
    const dateString = current.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });

    days.push(makeDay(`d${index}`, label, dateString));

    // increment
    current.setDate(current.getDate() + 1);
    index++;
  }

  return days;
}

// ---------------------------------------------
// MAIN PAGE
// ---------------------------------------------
// http://localhost:3000/userTrip/planner?tripId=43c3d093-f00d-4976-83fb-28457e373b1d
const TripPlannerPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tripId = searchParams?.get('tripId');
  const showHotelsAfter = searchParams?.get('showHotelsAfter') === 'true';
  const [showPanel, setShowPanel] = useState(false);

  const [placesToVisit, setPlacesToVisit] = useState<PlacesToVisit[]>([]);
  const [days, setDays] = useState<DayPlan[]>([]);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [isOverview, setIsOverview] = useState(false);
  const [openOverviewIdx, setOpenOverviewIdx] = useState(0);
  const [optimizeByDay, setOptimizeByDay] = useState<Record<string, boolean>>({});
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [totalDistanceKm, setTotalDistanceKm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mainLocationLatitude, setMainLocationLatitude] = useState<number>(28.6139); // Default to New Delhi
  const [mainLocationLongitude, setMainLocationLongitude] = useState<number>(77.209); // Default to New Delhi

  const [tripDetails, setTripDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const activeDay = days[isOverview ? openOverviewIdx : selectedDayIdx];
  const activeOptimize = optimizeByDay[activeDay?.id ?? ''] ?? false;

  const mapContainerStyle = { width: '100%', height: '100vh' };
  // const center = { lat: 48.85837, lng: 2.294481 }; // Eiffel Tower
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: mainLocationLatitude, lng: mainLocationLongitude });

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
      console.error('Error loading trip activities');
    }
  };

  useEffect(() => {
    const fetchDetails = async (locationId: string) => {
      if (!locationId) {
        // showInAppNotification('Error: Missing destination ID');
        // navigation.goBack();
        router.replace('/userTrips');
      }
      else {
        const LocationDetailsFields = [
          LocationFields.ID,
          LocationFields.TITLE,
          LocationFields.COORDINATES,
          LocationFields.COUNTRY,
          LocationFields.PLACES_TO_VISIT,
        ];
        const LocationDetails = await LocationServices.fetchLocationDetails(locationId, LocationDetailsFields);
        if (!LocationDetails) {
          // showInAppNotification('Error: Could not fetch location details');
          // navigation.goBack();
          // router.replace('/userTrips');
          return;
        }

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
      if (!tripId) {
        // showInAppNotification('Error: Missing trip ID');
        // navigation.goBack();
        // router.replace('/userTrips');
        return;
      }
      try {
        const tripDetails_ = await TripServices.fetchTripDetails(tripId);
        if (!tripDetails_) {
          // showInAppNotification('Error: Could not fetch trip details');
          // navigation.goBack();
          // router.replace('/userTrips');
          return;
        }
        setTripDetails(tripDetails_);
        setDays(() =>
          tripDetails_.startDate && tripDetails_.endDate
            ? generateDays(tripDetails_.startDate, tripDetails_.endDate)
            : []);
        // Set main location coords if available
        if (tripDetails_.locationId) {
          await fetchDetails(tripDetails_.locationId);
        }

      }
      catch (error) {
        // showInAppNotification('Error fetching trip details');
        // navigation.goBack();
        // router.replace('/userTrips');
      }
      setLoading(false);
    };
    fetchTripDetails();
  }, [tripId]);

  useEffect(() => {
    if (tripDetails?.activities && tripDetails.activities.length > 0 && placesToVisit.length > 0) {
      loadActivities(tripDetails.activities);
    }
  }, [tripDetails, placesToVisit]);

  const saveTrip = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const activities: UserTripActivity[] = [];
      days.forEach(day => {
        day.activities.forEach((act, order) => {
          activities.push({
            dayId: day.id,
            dayLabel: day.label,
            dayDate: day.date ? new Date(day.date) : null as any,
            placeId: act.place.id,
            order,
            distanceKm: act.distanceKm as number,
            routeSignature: day.route.signature as string,
            polyline: day.route.polyline as string,
          });
        });
      });

      const res = await TripServices.saveTripActivities(tripDetails, activities, true);
      if (!res) {
        throw new Error('Save failed');
      }
      console.log('Trip saved successfully!');
      if (showHotelsAfter) {
        router.push(`/userTrip/hotelSelection?tripId=${tripId}&locationId=${tripDetails.locationId}`);
      } else {
        router.push(`/userTrip/details?tripId=${tripId}&locationId=${tripDetails.locationId}`);
      }
    } catch (err: any) {
      console.error('Save error:', err);
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Fit map to bounds
  const fitMapTo = useCallback((coords: LatLng[]) => {
    if (!mapRef.current || !coords.length) return;

    if (coords.length === 1) {
      mapRef.current.setCenter({ lat: coords[0].latitude, lng: coords[0].longitude });
      mapRef.current.setZoom(15);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    coords.forEach(coord => bounds.extend({ lat: coord.latitude, lng: coord.longitude }));
    mapRef.current.fitBounds(bounds, { top: 80, right: 400, bottom: 40, left: 40 });
  }, []);

  // Directions callback
  const directionsCallback = useCallback((response: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    if (response !== null && status === 'OK') {
      setDirections(response);

      const route = response.routes[0];
      const totalKm = route.legs.reduce((sum, leg) => sum + (leg.distance?.value ?? 0) / 1000, 0);
      const legDistancesKm = route.legs.map(leg => (leg.distance?.value ?? 0) / 1000);
      let orderedPlaces = activeDay.activities.map(a => a.place);
      if (activeOptimize && route.waypoint_order) {
        const optimizedOrder = buildOptimizedOrder(orderedPlaces.length, route.waypoint_order);
        orderedPlaces = optimizedOrder.map(i => orderedPlaces[i]);
      }
      const activitiesWithDistances = attachDistancesToActivities(orderedPlaces, legDistancesKm);

      setTotalDistanceKm(totalKm);

      setDays(prev => {
        const next = [...prev];
        const dIdx = next.findIndex(d => d.id === activeDay.id);
        if (dIdx >= 0) {
          next[dIdx] = {
            ...next[dIdx],
            activities: activitiesWithDistances,
            route: {
              signature: routeSignature(activitiesWithDistances, activeOptimize),
              coords: route.overview_path.map(p => ({ latitude: p.lat(), longitude: p.lng() })),
              polyline: route.overview_polyline,
              distanceKm: totalKm,
              waypointOrder: activeOptimize ? route.waypoint_order ?? null : null,
              legDistancesKm,
            },
          };
        }
        return next;
      });

      fitMapTo(route.overview_path.map(p => ({ latitude: p.lat(), longitude: p.lng() })));
    } else {
      console.error('Directions request failed:', status);
      setDirections(null);
      setTotalDistanceKm(null);
    }
  }, [activeDay, activeOptimize, fitMapTo]);

  // Directions options
  const directionsOptions = useMemo(() => {
    if (!activeDay || isOverview || activeDay.activities.length < 2) return null;

    const places = activeDay.activities.map(a => a.place);
    const waypoints = places.slice(1, -1).map(place => ({
      location: { lat: place.coordinates.lat, lng: place.coordinates.long },
      stopover: true,
    }));

    return {
      origin: { lat: places[0].coordinates.lat, lng: places[0].coordinates.long },
      destination: { lat: places[places.length - 1].coordinates.lat, lng: places[places.length - 1].coordinates.long },
      waypoints,
      optimizeWaypoints: activeOptimize,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: false,
      avoidFerries: false,
      avoidHighways: false,
      avoidTolls: false,
    } as google.maps.DirectionsRequest;
  }, [activeDay, isOverview, activeOptimize]);

  useEffect(() => {
    if (!activeDay || isOverview) {
      setDirections(null);
      setRouteCoords([]);
      setTotalDistanceKm(null);
      return;
    }

    const sig = routeSignature(activeDay.activities, activeOptimize);
    if (activeDay.route.signature === sig && activeDay.route.coords && activeDay.route.coords.length > 1) {
      setDirections(null);
      setRouteCoords(activeDay.route.coords);
      setTotalDistanceKm(activeDay.route.distanceKm ?? null);
      fitMapTo(activeDay.route.coords);
    } else {
      setRouteCoords([]);
      setTotalDistanceKm(null);
    }
  }, [activeDay, activeOptimize, isOverview, fitMapTo]);

  // Handlers
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

  const onDragEnd = useCallback((result: DropResult, dayIndex: number) => {
    if (!result.destination) return;
    const newActivities = [...days[dayIndex].activities];
    const [reorderedItem] = newActivities.splice(result.source.index, 1);
    newActivities.splice(result.destination.index, 0, reorderedItem);
    setDays(prev => {
      const next = [...prev];
      const day = { ...next[dayIndex] };
      day.activities = newActivities.map(a => ({ ...a, distanceKm: null }));
      day.route = { signature: null, coords: null, polyline: null, distanceKm: null, waypointOrder: null, legDistancesKm: null };
      next[dayIndex] = day;
      return next;
    });
  }, [days]);

  const toggleOptimizeForDay = useCallback((dayId: string) => {
    setOptimizeByDay(prev => ({ ...prev, [dayId]: !(prev[dayId] ?? false) }));
  }, []);

  const filteredPlaces = placesToVisit.filter(place =>
    place.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MapProvider>
      <div className="relative h-screen w-screen">
        {/* Map Background */}

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onLoad={map => {
            mapRef.current = map;
          }}
          options={{
            styles: [{ featureType: 'poi', stylers: [{ visibility: 'simplified' }] }],
          }}
        >
          {/* Markers */}
          {activeDay?.activities.map((item, idx) => (
            <Marker
              key={item.place.id}
              position={{ lat: item.place.coordinates.lat, lng: item.place.coordinates.long }}
              title={`${idx + 1}. ${item.place.title}`}
              label={{ text: `${idx + 1}`, color: 'white', fontSize: '12px', fontWeight: 'bold' }}
            />
          ))}

          {/* Directions */}
          {directionsOptions && (
            <DirectionsService
              options={directionsOptions}
              callback={directionsCallback}
            />
          )}

          {directions && (
            <DirectionsRenderer
              options={{
                directions,
                polylineOptions: { strokeColor: '#C2185B', strokeWeight: 5 },
              }}
            />
          )}
          {routeCoords.length > 1 && !directions && (
            <Polyline
              path={routeCoords.map(c => ({ lat: c.latitude, lng: c.longitude }))}
              options={{ strokeColor: '#C2185B', strokeWeight: 5 }}
            />
          )}
        </GoogleMap>

        {/* Right Sidebar (Search + Places + Itinerary) */}
        <div className="absolute left-0 top-0 h-full w-96 bg-white shadow-lg flex flex-col">
          {/* Search Bar */}
  <div className="p-3 border-b border-gray-200 flex items-center space-x-2">
    
    <input
      type="text"
      placeholder="Search places to visit"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="flex-1 bg-gray-50 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-gray-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
  </div>

  {/* Places List */}
  <div className="flex-1 overflow-y-auto p-3" style={{scrollbarWidth:"none"}}>
    {/* <h2 className="text-base font-semibold mb-3 text-gray-700">Places to Visit</h2> */}

    {filteredPlaces.map((place) => (
      <PlaceCard
        key={place.id}
        place={place}
        onAdd={() => addPlaceToDay(place, isOverview ? openOverviewIdx : selectedDayIdx)}
      />
    ))}
  </div>

          {/* Itinerary Panel */}

        </div>
        <div className="">
          {/* Itinerary panel — slides under days bar */}
          <div
            className={`absolute top-0 right-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 flex flex-col transform transition-transform duration-300 ${showPanel ? 'translate-x-0' : 'translate-x-full'
              }`}
            style={{ zIndex: 20 }} // under days bar
          >
            <button
              onClick={saveTrip}
              disabled={saving}
              className="bg-blue-500 text-white p-2 rounded m-2"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <div className="flex-1 p-4 overflow-y-auto">
              {isOverview ? (
                <>
                  {days.map((day, i) => (
                    <div key={day.id} className="mb-4">
                      <button
                        onClick={() => setOpenOverviewIdx(i)}
                        className="w-full text-left font-semibold"
                      >
                        {day.date || day.label} ({day.activities.length} Activities)
                      </button>
                      {openOverviewIdx === i && (
                        <div className="mt-2">
                          {day.activities.map((item, idx) => (
                            <ActivityCard
                              key={item.place.id}
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
                      {activeDay?.date || activeDay?.label}
                    </h2>
                    <button
                      onClick={() => toggleOptimizeForDay(activeDay.id)}
                      className="text-blue-500"
                    >
                      {optimizeByDay[activeDay.id] ? 'Optimize ✓' : 'Optimize'}
                    </button>
                  </div>

                  <DragDropContext onDragEnd={result => onDragEnd(result, selectedDayIdx)}>
                    <Droppable droppableId="activities">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {activeDay?.activities.map((item, index) => (
                            <Draggable key={item.place.id} draggableId={item.place.id} index={index}>
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

          {/* Fixed days vertical bar */}
          <div
            className="fixed right-0 top-0 h-full w-16  flex flex-col items-center "
            style={{ zIndex: 30 }} // stays above itinerary
          >
            <div className="py-4 space-y-2" style={{overflow:"scroll",scrollbarWidth:"none"}}>
            {['Overview', ...days.map(d => d.label)].map((label, i) => (
              <button
                key={label + i}
                onClick={() => {
                  if (label === 'Overview') {
                    if (isOverview && showPanel) setShowPanel(false);
                    else {
                      setIsOverview(true);
                      setShowPanel(true);
                    }
                  } else {
                    const idx = days.findIndex(d => d.label === label);
                    if (idx >= 0) {
                      if (selectedDayIdx === idx && showPanel) {
                        setShowPanel(false);
                      } else {
                        setIsOverview(false);
                        setSelectedDayIdx(idx);
                        setShowPanel(true);
                      }
                    }
                  }
                }}
                className={`w-12 h-12 rounded-lg text-sm flex items-center justify-center text-center transition-all
          ${isOverview && label === 'Overview' || (!isOverview && days[selectedDayIdx]?.label === label)
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {label === 'Overview' ? 'Overview' : 'Day'+i}
              </button>
            ))}

            
            </div>
          </div>
        </div>

      </div>
    </MapProvider>
  );
};



export default TripPlannerPage;