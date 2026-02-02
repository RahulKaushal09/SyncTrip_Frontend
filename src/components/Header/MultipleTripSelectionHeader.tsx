import { UserTrip } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ChatIcon from "../Navbar/ChatIcon";
import { CommonServices } from "@/utils";
import path from "path";
import MatchingUsersIcon from "../common/MatchingUsersIcon";

// /d:/DOITBUNNYY/NextJs/SyncTrip_Frontend/src/components/Header/MatchingScreenHeader.tsx

type Props = {
  tripName: string;
  dates?: string;
  tripId?: string;
  onBack?: () => void;
  className?: string;
  onSelectTrip?: (tripId: string, tripName: string, dates: string) => void;
  allTrips?: UserTrip[];
  unreadByTrip?: Record<string, number>;
};

const iconStyle: React.CSSProperties = {
  width: 20,
  height: 20,
  display: "block",
  fill: "currentColor",
};

const buttonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  padding: 8,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const containerStyle: React.CSSProperties = {
  display: "flex",

  padding: "12px 16px",
  justifyContent: "space-between"
};

const textColumnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  lineHeight: 1,
};

const titleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
};

const datesStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280", // gray
  marginTop: 2,
};

export default function MultipleTripSelectionHeader({
  tripId,
  tripName,
  dates,
  onBack,
  className,
  allTrips = [],
  onSelectTrip,
  unreadByTrip,
}: Props) {
  const router = useRouter();
  const pathName = usePathname();
  // get url 
  // const url = new URL(window.location.href);
  const [showSheet, setShowSheet] = useState(false);
  const [filteredTrips, setFilteredTrips] = useState<UserTrip[]>([]);
  const [headerType, setHeaderType] = useState<'matching' | 'chat'>(pathName.includes('/chats') ? 'chat' : 'matching');
  useEffect(() => {
    // if(pathName.includes('/chats')){
    //   setFilteredTrips(allTrips);
    // }
    // if(pathName.includes('/userTrip/matching')){
    
      setFilteredTrips(allTrips.filter(trip => trip.endDate.split('T')[0] >= new Date().toISOString().split('T')[0]));
    // }
  }, [allTrips]);
  const handleTripClick = () => {
    setShowSheet(true);
  };

  const handleSelectTrip = (trip: UserTrip) => {
    const formattedDates = `${CommonServices.formatDateShortHeaderTripSelection(trip.startDate, trip.endDate)}`;
    // const formattedDates = `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`;
    onSelectTrip?.(trip.id as string, trip.locationName as string, formattedDates);
    setShowSheet(false);
  };

  const onChatOpen = () => {
    router.push("/chats?tripId=" + tripId);
  };
  const onMatchingOpen = () => {
    router.push("/userTrip/"+tripId+"/matching");
  };

  return (
    <header style={containerStyle} className={`${className} border-b`}>
      <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 12 }}>
        <button type="button" onClick={onBack ? onBack : router.back} aria-label="Go back" style={buttonStyle}>
          <svg viewBox="0 0 24 24" style={iconStyle} aria-hidden>
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <div style={textColumnStyle} onClick={handleTripClick}>
          <div style={titleStyle}>{tripName}</div>
          <div className="flex flex-row align-items-center">
            {dates ? <div style={datesStyle}>{dates}</div> : null}
            {/* toggle drop down/up icon */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowSheet((s) => !s);
              }}
              aria-label={showSheet ? "Close trip selector" : "Open trip selector"}
              style={{
                ...buttonStyle,
                padding: 4,
                marginLeft: 8,
                width: 32,
                height: 32,
                borderRadius: 6,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  ...iconStyle,
                  width: 18,
                  height: 18,
                  transition: "transform 0.18s ease",
                  transform: showSheet ? "rotate(180deg)" : "rotate(0deg)",
                }}
                aria-hidden
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

          </div>
        </div>
      </div>

      {showSheet && (
        <div style={sheetOverlayStyle} onClick={() => setShowSheet(false)}>
          <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 8 }}>Select a Trip</h3>
            {filteredTrips.map((trip) => {
              const unreadForTrip = unreadByTrip?.[trip.id as string] || 0;

              return (
                <div
                  key={trip.id}
                  style={tripItemStyle}
                  onClick={() => handleSelectTrip(trip)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <div>
                      <div>{trip.locationName}</div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>
                        {CommonServices.formatDateShortHeaderTripSelection(
                          trip.startDate,
                          trip.endDate
                        )}
                      </div>
                    </div>

                    {/* show unread badge only in chats header + if > 0 */}
                    {headerType === "chat" && unreadForTrip > 0 && (
                      <span style={unreadBadgeStyle}>{unreadForTrip}</span>
                    )}
                  </div>
                </div>
              );
            })}
            {/* {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                style={tripItemStyle}
                onClick={() => handleSelectTrip(trip)}
              >
                <div>{trip.locationName}</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  {CommonServices.formatDateShortHeaderTripSelection(trip.startDate, trip.endDate)}
                </div>
              </div>
            ))} */}
          </div>
        </div>
      )}
      {headerType === 'matching' && tripId && (
        <ChatIcon onClickOpen={() => onChatOpen()} />
      )}
      {headerType === 'chat' && tripId &&
        <MatchingUsersIcon onClickOpen={() => onMatchingOpen()} />}


    </header>
  );
}



const sheetOverlayStyle: React.CSSProperties = {
  position: "fixed",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
  zIndex: 999,
};

const sheetStyle: React.CSSProperties = {
  background: "#fff",
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  width: "100%",
  maxHeight: "60vh",
  overflowY: "auto",
  padding: 16,
  boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
};

const tripItemStyle: React.CSSProperties = {
  padding: "12px 8px",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
};
const unreadBadgeStyle: React.CSSProperties = {
  minWidth: 20,
  padding: "2px 6px",
  borderRadius: 999,
  backgroundColor: "#EF4444", // red-500 style
  color: "#fff",
  fontSize: 12,
  fontWeight: 600,
  textAlign: "center",
};