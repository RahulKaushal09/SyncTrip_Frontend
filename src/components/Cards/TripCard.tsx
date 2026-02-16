'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { Sun, Pencil, Clock, MessageCircle, Heart, Users2, User2 } from "lucide-react";
import { UserTrip } from "@/types";

type Props = {
  trip: UserTrip;
  onPressCard?: () => void;
  onPressChats?: () => void;
  onPressMatch?: () => void;
  onPressEdit?: () => void;
};

const formatRange = (start?: string, end?: string) => {
  if (!start && !end) return "";
  try {
    const s = start ? new Date(start) : undefined;
    const e = end ? new Date(end) : undefined;
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    const sStr = s && !isNaN(+s) ? s.toLocaleDateString(undefined, options) : "";
    const eStr = e && !isNaN(+e) ? e.toLocaleDateString(undefined, options) : "";
    if (sStr && eStr) return `${sStr} - ${eStr} ${e!.getFullYear()}`;
    return `${sStr}${eStr ? " - " + eStr : ""}`;
  } catch {
    return `${start || ""} - ${end || ""}`;
  }
};

const TripCard: React.FC<Props> = ({ trip, onPressCard, onPressChats, onPressMatch, onPressEdit }) => {
  const router = useRouter();
  const imageUrl = trip.image || "/images/placeholder-trip.jpg"; // replace with real placeholder path
  console.log("TripCard render:", trip);
  return (
    <article style={cardStyles.card} role="button" onClick={onPressCard ?? (() => { })}>
      <div style={cardStyles.imageWrap}>
        {trip.groupContext?.isInGroup ? (
          <div style={cardStyles.chipboxMember}>
            <Users2 size={16} color="var(--primary-1)" />
            {trip.groupContext?.membersCount}/ {trip.groupContext?.maxMembers} members
          </div>
        ) : null}
        {trip.groupContext?.isInGroup ? (
          <div style={cardStyles.chipbox}>
            <Users2 size={16} color="var(--primary-1)" />
            <p style={{marginBottom:0}}>In a group</p>
          </div>
        ) : (
          <div style={cardStyles.chipbox}>
            <User2 size={16} color="var(--primary-1)" />
            <p style={{marginBottom:0}}>Solo trip</p>
          </div>

        )}
        <img src={imageUrl} alt={trip.locationName || "trip image"} style={cardStyles.image} loading="lazy" />
      </div>

      <div style={cardStyles.content}>
        <div style={cardStyles.titleRow}>
          <div style={cardStyles.chip}>

          </div>
          <h3 style={cardStyles.title}>{trip.locationName}</h3>
          <button
            onClick={(e) => { e.stopPropagation(); onPressEdit?.(); }}
            aria-label="Edit trip"
            style={cardStyles.iconButton}
          >
            <Pencil size={18} color="var(--primary-1)" />
          </button>
        </div>

        <div style={cardStyles.dates}>{formatRange(trip.startDate, trip.endDate)}</div>

        {/* optional stats (commented out in your RN file) */}

      </div>
    </article>
  );
};

export default React.memo(TripCard);

/* Styles (const) */
const cardStyles: { [k: string]: React.CSSProperties } = {
  card: {
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "var(--card-bg, #fff)",
    borderRadius: 14,
    margin: "16px 0",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    cursor: "pointer",
    overflow: "hidden",
  },
  imageWrap: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    backgroundColor: "#eee",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  content: {
    padding: 14,
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "var(--text, #111827)",
    margin: 0,
    maxWidth: "85%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  dates: {
    marginTop: 6,
    fontSize: 14,
    color: "var(--neutral-1, #6B7280)",
  },
  iconButton: {
    background: "transparent",
    border: "none",
    padding: 6,
    cursor: "pointer",
  },
  chip: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "var(--primary-5, #E0F2FE)",
    borderRadius: 12,
    padding: "2px 8px",
    display: "inline-block",
  },
  chipbox: {
    position: "absolute",
    top: 12,
    right: 12,
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: "4px 8px",
    borderRadius: 999,
    color: "var(--primary-1)",
    fontWeight: 600,
  },
  chipboxMember: {
    position: "absolute",
    top: 12,
    left: 12,
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    backgroundColor: "var(--primary-5, #E0F2FE)",
    padding: "4px 8px",
    borderRadius: 999,
    color: "var(--primary-1)",
    fontWeight: 600,
  },
};
