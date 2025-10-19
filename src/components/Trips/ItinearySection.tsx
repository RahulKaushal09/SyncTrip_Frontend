"use client";

import React, { useEffect, useState } from "react";
import TripServices from "@/utils/trip.utils";
// import ActivityRowForTrip from "../../../components/ActivityRowForTrip";

// keep utilityStyles import path the same as in your project
import { ChevronDown, ChevronUp } from "lucide-react";
import { PlacesToVisit, UserTrip, UserTripActivity } from "@/types";
import { LocationServices } from "@/utils/location.utils";
import ActivityRowForTrip from "./ActivityRowForTrip";
import { useRouter } from "next/navigation";
import "../../../styles/skeleton.css"
// Types
type Coordinates = { lat: number; long: number };
type Activity = {
  id: string;
  place: PlacesToVisit;
  distanceKm?: number | null;
};
type RouteCache = {
  signature: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
// ither provide trip Id or tripDetails with acitvities and places too


const ItinerarySection: React.FC<{ tripId: string, tripDetails: UserTrip, loading: boolean }> = ({ tripId, tripDetails, loading }) => {
  
  const [days, setDays] = useState<DayPlan[]>([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tripData, setTripData] = useState<UserTrip>({} as UserTrip);
  const router = useRouter();


  const setTripDetailsOnPage = async (tripData_: UserTrip) => {
    const start = new Date(tripData_.startDate);
    const end = new Date(tripData_.endDate);
    const totalDays = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );

    const activityGroups: { [dayId: string]: UserTripActivity[] } = {};

    let placesData: PlacesToVisit[] = [];


    tripData_?.activities?.forEach((act) => {
      if (!activityGroups[act.dayId]) activityGroups[act.dayId] = [];
      activityGroups[act.dayId].push(act);
    });
    if (tripData_?.activities && tripData_?.activities.length > 0) {
      tripData_?.activities?.forEach((act) => {
        if (act.placeId === act.placeDetails?.id) {
          // all good
          placesData = [...placesData, act.placeDetails];
        }
      });
    }
    console.log("Places data collected from activities:", placesData);
    if (placesData.length === 0) {
      const allPlaceIds = [
        ...new Set(tripData_?.activities?.map((act) => act.placeId)),
      ];
      placesData =
        allPlaceIds.length > 0
          ? await LocationServices.getPlacesToVisitByIds(allPlaceIds)
          : [];
    }
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
  }


  useEffect(() => {
    // const fetchItineraryData = async (tripDetails: UserTrip) => {
    //   try {
    //     // setLoading(true);
    //     setError(null);
    //     console.log("Fetching trip details for tripId:", tripId);
    //     let tripData_: UserTrip = {} as UserTrip;
    //     console.log("Using provided tripDetails:", tripDetails);
    //     if (tripDetails) {
    //       tripData_ = tripDetails;
    //     } else {
    //       // tripData_ = await TripServices.fetchTripDetails(tripId);
    //     }
    //     if (!tripData_) throw new Error("Trip data not found");
    //     setTripData(tripData_);

    //   } catch (err) {
    //     setError("Failed to load itinerary. Please try again.");
    //   } finally {
    //     // setLoading(false);
    //   }
    // };

    // fetchItineraryData(tripDetails);
    if (loading === false) {
      setTripDetailsOnPage(tripDetails);
    }
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

  if (loading || !tripDetails?.activities) {

    return (
      <>
        <div className="skeleton-card">
          <div className="skeleton-row">
            <div className="skeleton-image" style={{ width: "140px" }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text small"></div>
            </div>
          </div>
        </div>
        <div className="skeleton-card">
          <div className="skeleton-row">
            <div className="skeleton-image" style={{ width: "140px" }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text small"></div>
            </div>
          </div>
        </div>
        <div className="skeleton-card">
          <div className="skeleton-row">
            <div className="skeleton-image" style={{ width: "140px" }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text small"></div>
            </div>
          </div>
        </div>
        <div className="skeleton-card">
          <div className="skeleton-row">
            <div className="skeleton-image" style={{ width: "140px" }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text small"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const openEditItineraryScreen = () => {
    router.push('/userTrip/planner?tripId=' + tripDetails.id);
    // navigate("TripPlannerManually", { tripId: tripId, showHotelsAfter: false });
  };


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
                    <ChevronUp style={styles.chev } />
                  ) : (
                    <ChevronDown style={styles.chev } />
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

        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
          <button className="btn btn-secondary"
            style={{
              width: 100,
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
