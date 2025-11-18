import React from "react";
import Image from "next/image";
import { PlacesToVisit } from "@/types";


// Styles (no Tailwind, no inline)
const styles = {
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
    marginBottom: 12,
    border: "1px solid #F3F4F6",
    boxShadow: "0px 2px 3px rgba(0,0,0,0.04)",
    minHeight: 90,
    position: "relative" as const,
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
  },
  activityImg: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginRight: 12,
    objectFit: "cover" as const,
  },
  activityTagRow: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginTop: 4,
    marginBottom: 6,
    gap: 8,
    flexWrap: "wrap" as const,
    
  },
  tagPill: {
    fontSize: 12,
    color: "var(--gray)",
  },
  distancePill: {
    padding: "2px 8px",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    backgroundColor: "#F9FAFB",
    fontSize: 12,
    color: "var(--text-dark)",
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "var(--text-dark)",
  },
  ratingBox: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#FFF9E6",
    borderRadius: 12,
    padding: "3px 8px",
  },
  star: {
    color: "#FACC15",
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 13,
    color: "var(--text-dark)",
  },
  removeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FEE2E2",
    display: "flex",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    cursor: "pointer",
  },
  removeBtnText: {
    color: "#B91C1C",
    fontSize: 18,
    lineHeight: "18px",
  },
  rightside: {
    position: "absolute" as const,
    top: 10,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-end" as const,
    gap: 8,
  },
  dragHandle: {
    marginLeft: 6,
  },
  mobileRatingBox: {
  position: "absolute",
  top: 10,
  left: 10,
}
};

function ActivityRowForTrip({
  place,
  onRemove,
  showHandle = false,
  CanRemove = true,
  distanceKm = null,
}: {
  place: PlacesToVisit;
  onRemove?: () => void;
  showHandle?: boolean;
  CanRemove?: boolean;
  distanceKm?: number | null;
}) {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  return (
    <div style={styles.activityCard}>
      <Image
        src={place.image?.[0] || "/placeholder.jpg"}
        alt={place.title}
        width={140}
        height={140}
        style={styles.activityImg}
      />

      <div style={{ flex: 1, paddingRight: 60,position: "relative" }}>
        <div style={styles.activityTagRow} className="activityTagRow">
          <span style={styles.tagPill}>{place.tag || "Activity"}</span>
          {typeof distanceKm === "number" && (
            <span style={styles.distancePill}>{distanceKm.toFixed(1)} km</span>
          )}
        </div>

        <span style={styles.activityTitle}>{place.title}</span>
        <div>
        {!isMobile && <span >{place.description}</span>}
        </div>
      </div>

      <div style={styles.rightside} className={'rightSideActivityRow'}>
        {CanRemove ? (
          <>
            <div onClick={onRemove} style={styles.removeBtn}>
              <span style={styles.removeBtnText}>×</span>
            </div>
            {showHandle && (
              <div style={styles.dragHandle}>
                <span style={{ fontSize: 18, color: "#999" }}>≡</span>
              </div>
            )}
          </>
        ) : (
          place.rating && (
            <div className={'rating-box-itineary'}
  style={
    styles.ratingBox
    }
>
              <span style={styles.star}>★</span>
              <span style={styles.ratingText}>{place.rating.replaceAll("\n", "")}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ActivityRowForTrip;