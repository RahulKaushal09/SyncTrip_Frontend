'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
// import MainHeader from "@/components/headerBlocks/MainHeader";
// import TripsStatusFilter from "@/components/Trip/Details/TripsStatusFilter";
import TripCard from "@/components/Cards/TripCard";
import TripServices from "@/utils/trip.utils";
import { useLogin } from "@/components/providers/LoginProvider";
import { UserTrip } from "@/types";

type FilterKey = "all" | "active" | "upcoming" | "completed";

const getTripStatus = (trip: UserTrip): "active" | "upcoming" | "completed" => {
  const today = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  // normalize times to midnight to match RN behavior
  const t = new Date(today).setHours(0, 0, 0, 0);
  const s = new Date(start).setHours(0, 0, 0, 0);
  const e = new Date(end).setHours(0, 0, 0, 0);

  if (t < s) return "upcoming";
  if (t > e) return "completed";
  return "active";
};

const filterTripsByStatus = (trips: UserTrip[], status: FilterKey) => {
  if (status === "all") return trips;
  return trips.filter((trip) => getTripStatus(trip) === status);
};

export default function AllTripsPage() {
  const router = useRouter();
  const { user } = useLogin(); // ⬅️ use context directly
  

  const [trips, setTrips] = useState<UserTrip[]>([]);
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    let mounted = true;
    const fetchTrips = async () => {
      if (!user) {
        // optionally redirect to auth if needed
        return;
      }
      try {
        const userTrips = await TripServices.fetchUserTrips();
        if (!mounted) return;
        if (userTrips) {
          userTrips.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
          setTrips(userTrips);
        }
      } catch (err) {
        // handle error/log
        console.error("Failed to fetch trips", err);
      }
    };
    fetchTrips();
    return () => { mounted = false; };
  }, [user]);

  const filteredTrips = useMemo(() => filterTripsByStatus(trips, filter), [trips, filter]);

  const openTripDetailsScreen = (tripId: string, locationId?: string) => {
    // push to trip details page; adjust route as you use in your app
    const query = locationId ? `?locationId=${encodeURIComponent(locationId)}` : "";
    router.push(`/userTrip/details?tripId=${encodeURIComponent(tripId)}&locationId=${encodeURIComponent(locationId || "")}`);
  };

  const renderHeader = (
    <div style={styles.headerWrap}>
      {/* <MainHeader /> */}
      <div style={{ marginTop: 12 }}>
        {/* <TripsStatusFilter activeKey={filter} onChange={(k) => setFilter(k as FilterKey)} /> */}
      </div>
    </div>
  );

  return (
    <div style={styles.safe}>
      <div style={styles.container}>
        {renderHeader}
        <div style={styles.listContent}>
          {filteredTrips.map((trip) => (
            <div key={trip.id} style={styles.tripRow}>
              <TripCard
                trip={trip}
                onPressCard={() => openTripDetailsScreen(trip.id as string, trip.locationId as string)}
                onPressEdit={() => openTripDetailsScreen(trip.id as string, trip.locationId as string)}
              />
            </div>
          ))}

          {filteredTrips.length === 0 && (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No trips found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Styles (const) */
// const styles: { [k: string]: React.CSSProperties } = {
//   safe: { width: "100%", minHeight: "100vh", backgroundColor: "var(--background-light-app, #F8FAFC)" },
//   container: { margin: "0 auto", padding: "24px 40px", display: "grid", gridTemplateColumns: "1fr", maxWidth: 800 },
//   headerWrap: { marginBottom: 8 },
//   listContent: { paddingBottom: 40 },
//   tripRow: { marginBottom: 8 },
//   emptyState: { padding: 20 },
//   emptyText: { color: "#666" },
// };
const styles: { [k: string]: React.CSSProperties } = {
  safe: { width: "100%", minHeight: "100vh", backgroundColor: "var(--background-light-app, #F8FAFC)" },
  container: { margin: "0 auto", padding: "24px 40px", display: "grid", gridTemplateColumns: "1fr" }, // container for layout
  headerWrap: { marginBottom: 8 },
  
  // Grid for trip cards
  listContent: { 
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Auto-fill grid with minimum card width
    gap: "16px",  // spacing between cards
    paddingBottom: 40 
  },
  
  // Card row with consistent height and margin
  tripRow: { 
    display: "flex", 
    justifyContent: "center",  // Center each card in the grid cell
    height: "100%", // Ensure the card takes full height available within its grid cell
  },
  
  // Empty state for when no trips are found
  emptyState: { padding: 20 },
  emptyText: { color: "#666" },

  // You can add any other card-specific styles here if needed, like:
  tripCard: {
    height: "100%", // Maintain height of the card
    display: "flex", 
    flexDirection: "column", 
    justifyContent: "space-between", // Ensure consistent content spacing in card
  }
};
