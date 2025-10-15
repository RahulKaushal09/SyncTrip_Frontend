"use client";

import React, { useEffect, useState } from "react";
import TripServices from "@/utils/trip.utils";
// import ActivityRowForTrip from "../../../components/ActivityRowForTrip";

// keep utilityStyles import path the same as in your project
import { ChevronDown, ChevronUp } from "lucide-react";
import { PlacesToVisit, UserTrip, UserTripActivity } from "@/types";
import { LocationServices } from "@/utils/location.utils";
import ActivityRowForTrip from "./ActivityRowForTrip";

// Types
type Coordinates = { lat: number; long: number };
type Activity = {
  id: string;
  place: PlacesToVisit;
  distanceKm?: number | null;
};
type RouteCache = {
  signature: string | null;
  coords: any[] | null;
  polyline: string | null;
  distanceKm: number | null;
  waypointOrder: number[] | null;
  legDistancesKm: number[] | null;
};
type DayPlan = {
  id: string;
  label: string;
  date?: string;
  activities: Activity[];
  route: RouteCache;
};

// Styles declared as a single const object (no Tailwind). Use CSS variables using dash form (e.g. --secondary-1)
export const styles = {
  screen: {
    flex: 1,
    backgroundColor: "var(--backgroundLightApp)",
  },
  container: {
    padding: 15,
    paddingBottom: 40,
  },
  dayCard: {
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0px 4px 6px rgba(0,0,0,0.06)",
    elevation: 2,
  },
  dayHeader: {
    padding: 14,
    paddingLeft: 0,
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    width: "100%",
    cursor: "pointer",
  },
  dayBadge: {
    backgroundColor: "var(--secondary-1)",
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 6,
    paddingBottom: 6,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  dayBadgeText: {
    color: "var(--white)",
    fontWeight: 700,
  },
  dayDate: {
    color: "var(--secondary-1)",
    fontSize: 16,
    fontWeight: 600,
  },
  headerRight: {
    alignItems: "flex-end",
    marginLeft: "auto",
  },
  activitiesCount: {
    color: "var(--gray)",
    fontSize: 12,
    marginLeft: 8,
  },
  chev: {
    fontSize: 18,
    color: "var(--secondary-1)",
    marginTop: 4,
  },
  dayBody: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 10,
    paddingRight: 10,
  },
  singleRow: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "flex-start",
    marginBottom: 8,
  },
  centerCol: {
    flex: 1,
    paddingRight: 8,
  },
  slotCard: {
    borderRadius: 12,
    padding: 10,
  },
  emptySlot: {
    paddingTop: 14,
    paddingBottom: 14,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  emptyText: {
    color: "var(--gray)",
    fontSize: 12,
  },
};

const ItinerarySection: React.FC<{ tripId: string }> = ({ tripId }) => {
  const [days, setDays] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tripData, setTripData] = useState<UserTrip>({} as UserTrip);

  useEffect(() => {
    const fetchItineraryData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching trip details for tripId:", tripId);
        const tripData_: UserTrip = await TripServices.fetchTripDetails(tripId);
        console.log("Fetched trip data:", tripData_);
        if (!tripData_) throw new Error("Trip data not found");
        setTripData(tripData_);

        const start = new Date(tripData_.startDate);
        const end = new Date(tripData_.endDate);
        const totalDays = Math.max(
          1,
          Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        );

        const activityGroups: { [dayId: string]: UserTripActivity[] } = {};
        tripData_?.activities?.forEach((act) => {
          if (!activityGroups[act.dayId]) activityGroups[act.dayId] = [];
          activityGroups[act.dayId].push(act);
        });

        const allPlaceIds = [
          ...new Set(tripData_?.activities?.map((act) => act.placeId)),
        ];
        const placesData: PlacesToVisit[] =
          allPlaceIds.length > 0
            ? await LocationServices.getPlacesToVisitByIds(allPlaceIds)
            : [];
        const placesMap: { [id: string]: PlacesToVisit } = placesData.reduce(
          (map, place) => {
            map[place.id] = place;
            return map;
          },
          {} as { [id: string]: PlacesToVisit }
        );

        const dayPlans: DayPlan[] = Array.from({ length: totalDays }).map(
          (_, idx) => {
            const date = new Date(start);
            date.setDate(start.getDate() + idx);

            console.log("Processing day:", idx + 1, date.toDateString());
            const dayKey =
              Object.keys(activityGroups).find((k) => {
                if (activityGroups[k][0]?.dayDate) {
                    console.log("Matching dayDate:", new Date(activityGroups[k][0].dayDate).toDateString(), "with", date.toDateString());
                  return (
                    new Date(activityGroups[k][0].dayDate).toDateString() ===
                    date.toDateString()
                  );
                }
                return k === `d${idx + 1}` || k === `day-${idx + 1}`;
              }) ?? null;

            const acts = dayKey ? activityGroups[dayKey] : [];

            const activities: Activity[] = acts
              .filter((act) => placesMap[act.placeId])
              .sort((a, b) => a.order - b.order)
              .map((act) => ({
                id: act.placeId,
                place: placesMap[act.placeId],
                distanceKm: act.distanceKm,
              }));

            const totalDistance = acts.reduce(
              (sum, act) => sum + (act.distanceKm || 0),
              0
            );

            const firstAct = acts[0];
            console.log("First activity for the day:", firstAct);
            const route: RouteCache = {
              signature: firstAct?.routeSignature || null,
              coords: null,
              polyline: firstAct?.polyline || null,
              distanceKm: totalDistance,
              waypointOrder: null,
              legDistancesKm: acts.map((act) => act.distanceKm || 0),
            };

            return {
              id: dayKey || `day-${idx + 1}`,
              label: `Day ${idx + 1}`,
              date: date.toISOString().split("T")[0],
              activities,
              route,
            };
          }
        );
        setDays(dayPlans);
      } catch (err) {
        setError("Failed to load itinerary. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItineraryData();
  }, [tripId]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const map: Record<string, boolean> = {};
    days.forEach((d, i) => (map[d.id] = i === 0));
    setExpanded(map);
  }, [days]);

  const toggle = (dayId: string) => {
    setExpanded((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const openEditItineraryScreen = () => {
    // navigate("TripPlannerManually", { tripId: tripId, showHotelsAfter: false });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center" }}>
        loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center" }}>
        <span style={{ color: "red" }}>{error}</span>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center" }}>
        <span>No itinerary available.</span>
      </div>
    );
  }

  return (
    <div style={styles.screen}>
      <div style={styles.container}>
        {days.map((day, idx) => {
          const isOpen = !!expanded[day.id];
          return (
            <div key={day.id} style={styles.dayCard}>
              <div
                role="button"
                onClick={() => toggle(day.id)}
                style={styles.dayHeader}
                aria-expanded={isOpen}
              >
                <div style={styles.dayBadge}>
                  <span style={styles.dayBadgeText}>Day {idx + 1}</span>
                </div>

                <div style={{ flex: 1, marginLeft: 10, display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <span style={styles.dayDate}>{day.date ? `${day.date}` : ""}</span>
                  <span style={styles.activitiesCount}>({day.activities.length} Activities)</span>
                </div>

                <div style={styles.headerRight}>
                  {isOpen ? (
                    <ChevronUp style={styles.chev as any} />
                  ) : (
                    <ChevronDown style={styles.chev as any} />
                  )}
                </div>
              </div>

              {isOpen && (
                <div style={styles.dayBody}>
                  <div style={styles.singleRow}>
                    <div style={styles.centerCol}>
                      <div style={styles.slotCard}>
                        {day.activities.length > 0 ? (
                          day.activities.map((act) => (
                            <ActivityRowForTrip
                              key={act.id}
                              place={act.place}
                              CanRemove={false}
                              distanceKm={act.distanceKm}
                            />
                          ))
                        ) : (
                          <div style={styles.emptySlot}>
                            <span style={styles.emptyText}>No activities for this day</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div style={{ marginTop: 20 }}>
          <button className="btn btn-secondary"
            style={{
             
              marginTop: 20,
              borderWidth: 0,
            }}
            onClick={openEditItineraryScreen}
          >
            <span className="btn-secondary-text">Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItinerarySection;
