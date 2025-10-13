"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { importLibrary } from '@googlemaps/js-api-loader';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// ---------------------------------------------
// TYPES
// ---------------------------------------------
interface LatLng {
  latitude: number;
  longitude: number;
}

interface PlacesToVisit {
  id: string;
  title: string;
  coordinates: { lat: number; long: number };
  image: string[];
  rating: string;
  tag: string;
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
const PLACE_CATALOG: PlacesToVisit[] = [
  { id: 'eiffel', title: 'Eiffel Tower', coordinates: { lat: 48.85837, long: 2.294481 }, image: ['https://picsum.photos/400/240?random=41'], rating: '4.8', tag: 'Cultural' },
  { id: 'arc', title: 'Arc de Triomphe', coordinates: { lat: 48.873792, long: 2.295028 }, image: ['https://picsum.photos/400/240?random=42'], rating: '4.8', tag: 'Adventure' },
  { id: 'louvre', title: 'Louvre Museum', coordinates: { lat: 48.860611, long: 2.337644 }, image: ['https://picsum.photos/400/240?random=43'], rating: '4.7', tag: 'Cultural' },
  { id: 'notredame', title: 'Notre-Dame Cathedral', coordinates: { lat: 48.853, long: 2.3499 }, image: ['https://picsum.photos/400/240?random=44'], rating: '4.7', tag: 'Cultural' },
  { id: 'montmartre', title: 'Montmartre & Sacré-Cœur', coordinates: { lat: 48.8867, long: 2.3431 }, image: ['https://picsum.photos/400/240?random=45'], rating: '4.6', tag: 'Cultural' },
];

const makeDay = (id: string, label: string, date?: string): DayPlan => ({
  id,
  label,
  date,
  activities: [],
  route: { signature: null, coords: null, polyline: null, distanceKm: null, waypointOrder: null, legDistancesKm: null },
});

const INITIAL_DAYS: DayPlan[] = [
  makeDay('d1', 'Day 1', 'January 21'),
  makeDay('d2', 'Day 2', 'January 22'),
];

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
  return s;
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

function decodePolyline(poly: string): LatLng[] {
  let index = 0, lat = 0, lng = 0;
  const coords: LatLng[] = [];
  const next = () => {
    let result = 0, shift = 0, b;
    do {
      b = poly.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    return (result & 1) ? ~(result >> 1) : (result >> 1);
  };
  while (index < poly.length) {
    lat += next();
    lng += next();
    coords.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return coords;
}

// Mock Directions API
async function mockDirectionsAPI(payload: { places: LatLng[]; mode: string; optimize: boolean }) {
  const { places, optimize } = payload;
  if (places.length < 2) return { coordinates: places };
  const coords = places.map(p => ({ latitude: p.latitude, longitude: p.longitude }));
  const legDistancesKm = [];
  for (let i = 1; i < places.length; i++) {
    legDistancesKm.push(haversineKm(places[i - 1], places[i]));
  }
  const totalKm = legDistancesKm.reduce((sum, d) => sum + d, 0);
  const waypointOrder = optimize ? Array.from({ length: places.length - 2 }, (_, i) => i) : null;
  return {
    coordinates: coords,
    distanceMeters: totalKm * 1000,
    waypoint_order: waypointOrder,
    legDistancesKm,
  };
}

// ---------------------------------------------
// COMPONENTS
// ---------------------------------------------
const PlaceCard: React.FC<{
  place: PlacesToVisit;
  onAdd: () => void;
}> = ({ place, onAdd }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-2 flex items-center">
    <img src={place.image[0]} alt={place.title} className="w-16 h-10 object-cover rounded mr-4" />
    <div className="flex-1">
      <h3 className="text-sm font-semibold">{place.title}</h3>
      <p className="text-xs text-gray-500">{place.tag} • {place.rating} ★</p>
    </div>
    <button
      onClick={onAdd}
      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
    >
      Add
    </button>
  </div>
);

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
      <p className="text-xs text-gray-500">{place.tag} • {place.rating} ★</p>
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

// ---------------------------------------------
// MAIN PAGE
// ---------------------------------------------
const TripPlannerPage: React.FC = () => {
  const [placesToVisit, setPlacesToVisit] = useState<PlacesToVisit[]>(PLACE_CATALOG);
  const [days, setDays] = useState<DayPlan[]>(INITIAL_DAYS);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [isOverview, setIsOverview] = useState(false);
  const [openOverviewIdx, setOpenOverviewIdx] = useState(0);
  const [optimizeByDay, setOptimizeByDay] = useState<Record<string, boolean>>({});
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [totalDistanceKm, setTotalDistanceKm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  const activeDay = days[isOverview ? openOverviewIdx : selectedDayIdx];
  const activeOptimize = optimizeByDay[activeDay?.id ?? ''] ?? false;
  // Initialize Google Map
  useEffect(() => {
    let mapInstance: google.maps.Map | null = null;

    (async () => {
      try {
        const { Map } = (await importLibrary('maps')) as google.maps.MapsLibrary;

        // Initialize the map only once
        if (!mapRef.current) {
          mapInstance = new Map(document.getElementById('map') as HTMLElement, {
            center: { lat: 48.85837, lng: 2.294481 }, // Eiffel Tower
            zoom: 12,
            styles: [
              { featureType: 'poi', stylers: [{ visibility: 'simplified' }] },
            ],
            // mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // optional if using Map ID
          });

          mapRef.current = mapInstance;
        }
      } catch (err) {
        console.error('Failed to initialize Google Map:', err);
      }
    })();

    return () => {
      if (polylineRef.current) polylineRef.current.setMap(null);
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  // Fit map to markers
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

  // Update markers and polyline
  useEffect(() => {
    if (!mapRef.current || !activeDay) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    const places = activeDay.activities.map(a => a.place);
    places.forEach((place, idx) => {
      const marker = new google.maps.Marker({
        position: { lat: place.coordinates.lat, lng: place.coordinates.long },
        map: mapRef.current,
        title: `${idx + 1}. ${place.title}`,
        label: { text: `${idx + 1}`, color: 'white', fontSize: '12px', fontWeight: 'bold' },
      });
      markersRef.current.push(marker);
    });

    // Update polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }
    if (routeCoords.length > 1) {
      polylineRef.current = new google.maps.Polyline({
        path: routeCoords.map(c => ({ lat: c.latitude, lng: c.longitude })),
        strokeColor: '#C2185B',
        strokeWeight: 5,
        map: mapRef.current,
      });
    }

    fitMapTo(places.map(p => ({ latitude: p.coordinates.lat, longitude: p.coordinates.long })));
  }, [activeDay, routeCoords, fitMapTo]);

  // Fetch route for active day
  const fetchRouteForFocusedDay = useCallback(async () => {
    if (!activeDay || isOverview) {
      setRouteCoords([]);
      setTotalDistanceKm(null);
      return;
    }

    const places = activeDay.activities.map(a => a.place);
    const optimize = activeOptimize;

    if (places.length < 2) {
      setRouteCoords(places.map(p => ({ latitude: p.coordinates.lat, longitude: p.coordinates.long })));
      setTotalDistanceKm(null);
      fitMapTo(places.map(p => ({ latitude: p.coordinates.lat, longitude: p.coordinates.long })));
      return;
    }

    const sig = routeSignature(activeDay.activities, optimize);
    if (activeDay.route?.signature === sig && activeDay.route.coords) {
      setRouteCoords(activeDay.route.coords);
      setTotalDistanceKm(activeDay.route.distanceKm ?? null);
      fitMapTo(activeDay.route.coords);
      return;
    }

    const payload = {
      places: places.map(p => ({ latitude: p.coordinates.lat, longitude: p.coordinates.long })),
      mode: 'DRIVING',
      optimize,
    };

    try {
      const data = await mockDirectionsAPI(payload);
      const coords = data.coordinates;
      const totalKm = data.distanceMeters as number / 1000;
      const legDistancesKm = data.legDistancesKm ?? [];
      const orderedPlaces = places; // Mock API doesn't reorder
      const activitiesWithDistances = attachDistancesToActivities(orderedPlaces, legDistancesKm);

      setRouteCoords(coords);
      setTotalDistanceKm(totalKm);
      fitMapTo(coords);

      setDays(prev => {
        const next = [...prev];
        const dIdx = next.findIndex(d => d.id === activeDay.id);
        if (dIdx >= 0) {
          next[dIdx] = {
            ...next[dIdx],
            activities: activitiesWithDistances,
            route: {
              signature: routeSignature(activitiesWithDistances, optimize),
              coords,
              polyline: null,
              distanceKm: totalKm,
              waypointOrder: data.waypoint_order ?? null,
              legDistancesKm,
            },
          };
        }
        return next;
      });
    } catch (err) {
      console.error('Route fetch error:', err);
    }
  }, [activeDay, activeOptimize, fitMapTo]);

  // Debounce route fetch
  useEffect(() => {
    const timeout = setTimeout(() => fetchRouteForFocusedDay(), 650);
    return () => clearTimeout(timeout);
  }, [fetchRouteForFocusedDay]);

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
    <>
      {/* <Head>
        <title>Trip Planner</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head> */}
      <div className="relative h-screen w-screen">
        {/* Map Background */}
        <div id="map" className="absolute inset-0" />

        {/* Right Sidebar (Search + Places + Itinerary) */}
        <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg flex flex-col">
          {/* Search Bar */}
          <div className="p-4">
            <input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Places to Visit */}
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-lg font-semibold mb-2">Places to Visit</h2>
            {filteredPlaces.map(place => (
              <PlaceCard
                key={place.id}
                place={place}
                onAdd={() => addPlaceToDay(place, isOverview ? openOverviewIdx : selectedDayIdx)}
              />
            ))}
          </div>

          {/* Itinerary Panel */}
          <div className="flex-1 border-t border-gray-200 p-4">
            <div className="flex space-x-2 mb-4 overflow-x-auto">
              {['Overview', ...days.map(d => d.label), '+'].map((label, i) => (
                <button
                  key={label + i}
                  onClick={() => {
                    if (label === '+') {
                      setDays(prev => [
                        ...prev,
                        makeDay(`d${prev.length + 1}`, `Day ${prev.length + 1}`)
                      ]);
                      setIsOverview(false);
                      setSelectedDayIdx(days.length);
                    } else if (label === 'Overview') {
                      setIsOverview(true);
                    } else {
                      const idx = days.findIndex(d => d.label === label);
                      if (idx >= 0) {
                        setIsOverview(false);
                        setSelectedDayIdx(idx);
                      }
                    }
                  }}
                  className={`px-4 py-2 rounded-lg ${isOverview && label === 'Overview' || !isOverview && days[selectedDayIdx]?.label === label ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {isOverview ? (
              <div>
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
                            onRemove={() => { }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">{activeDay?.date || activeDay?.label}</h2>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TripPlannerPage;