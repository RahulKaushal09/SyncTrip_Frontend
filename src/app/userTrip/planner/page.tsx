// src/app/userTrip/planner/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { GoogleMap, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { MapProvider } from '@/components/createTrip/MapProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { LocationFields } from '@/constants';
import { LocationServices } from '@/utils/location.utils';
import TripServices from '@/utils/trip.utils';
import { PlacesToVisit } from '@/types';
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
      {/* <p className="text-xs text-gray-500">{place.filter} • {place.rating} ★</p> */}
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

  const [placesToVisit, setPlacesToVisit] = useState<PlacesToVisit[]>([]);
  const [days, setDays] = useState<DayPlan[]>(INITIAL_DAYS);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [isOverview, setIsOverview] = useState(false);
  const [openOverviewIdx, setOpenOverviewIdx] = useState(0);
  const [optimizeByDay, setOptimizeByDay] = useState<Record<string, boolean>>({});
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [totalDistanceKm, setTotalDistanceKm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mainLocationLatitude, setMainLocationLatitude] = useState<number>(28.6139); // Default to New Delhi
  const [mainLocationLongitude, setMainLocationLongitude] = useState<number>(77.209); // Default to New Delhi

  const [tripDetails, setTripDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);

  const activeDay = days[isOverview ? openOverviewIdx : selectedDayIdx];
  const activeOptimize = optimizeByDay[activeDay?.id ?? ''] ?? false;

  const mapContainerStyle = { width: '100%', height: '100vh' };
  // const center = { lat: 48.85837, lng: 2.294481 }; // Eiffel Tower
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: mainLocationLatitude, lng: mainLocationLongitude });


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

        setMainLocationLatitude(LocationDetails.fullDetails?.coordinates?.lat  as number);
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
      const orderedPlaces = activeDay.activities.map(a => a.place); // Maintain original order for now
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
              waypointOrder: route.waypoint_order ?? null,
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
        </GoogleMap>

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
                            onRemove={() => removePlaceFromDay(item.place.id, i)}
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
    </MapProvider>
  );
};

export default TripPlannerPage;