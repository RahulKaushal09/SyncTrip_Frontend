'use client';

import React, {  useState, useEffect } from "react";
// import HotelBookingSheet from "../bottomSheets/HotelBookingSheet"; // adjust path
import { Hotel } from "@/types"; // adjust your path
import HeartIcon from "../smallComponents/HeartIcon";
import { HotelImageCarousel } from "../PageDetails/HotelsAndStaysSection";

type Props = {
  h: Hotel;
  cardId: string;
  whishlistParentId: string;
  whishlistParentType: string;
  title: string;
  typeOfWhishlistCardEnum: string;
  isWishlisted: boolean;
  onBookingClick?: (hotel: Hotel) => void;
};

const formatPriceHotel = (price: number | string | { amount: number }) => {
  if (price == null) return "";
  if (typeof price === "number") return String(price);
  if (typeof price === "string") return price;
  if (typeof price === "object") {
    if ("amount" in price) return String(price.amount);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ("value" in price) return String((price as any).value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ("display" in price) return String((price as any).display);
    return JSON.stringify(price);
  }
  return String(price);
};

export default function LocationHotelCard({
  h,
  cardId,
  whishlistParentId,
  whishlistParentType,
  title,
  typeOfWhishlistCardEnum,
  isWishlisted,
  onBookingClick,
}: Props) {
  const imgs = h.hotel_images && h.hotel_images.length > 0 ? h.hotel_images : [""];
  const [showSheet, setShowSheet] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);


  const showBookingOptions = () => setShowSheet(true);

  return (
    <div style={styles.wrapper}>
      <div style={styles.cardWrap}>
        <div style={styles.heartWrap}>
          <HeartIcon
            id={cardId}
            parentId={whishlistParentId}
            parentType={whishlistParentType}
            name={title}
            type={typeOfWhishlistCardEnum}
            isWishlisted={isWishlisted}
          />
        </div>

        {/* Image carousel */}
        <HotelImageCarousel images={imgs} locationName={h.hotel_name} />
        

        <div style={styles.cardBody}>
          <div style={styles.rowSB}>
            <div style={styles.cardTitle}>{h.hotel_name}</div>
            {/* <RatingBox rating={h.hotel_location?.rating?.score as number} count={h.hotel_location?.rating?.review_count as number} /> */}
          </div>
          {!h.price && !(h.hotelLinks && h.hotelLinks.length > 0) ? "" : (<div style={styles.hr} />)}
          {/* <div style={styles.hr} /> */}
          
          {h.price || (h.hotelLinks && h.hotelLinks.length > 0) ? (
            <div style={{ ...styles.rowSB, justifyContent: "flex-end", width: "100%", position: "relative" }}>
              {h.price && (
                <div style={{ position: "absolute", left: 0 }}>
                  <div style={styles.priceText}>₹ {formatPriceHotel(h.price)} / Night</div>
                </div>
              )}

              {h.hotelLinks && h.hotelLinks.length > 0 && (
                <button style={styles.bookButtonSecondary} onClick={() => {
                  if (onBookingClick) {
                    onBookingClick(h);
                  }
                }}>
                  <span style={styles.bookButtonSecondaryText}>Book Now</span>
                </button>
              )}

              {/* <HotelBookingSheet visible={showSheet} onClose={() => setShowSheet(false)} hotelName={h.hotel_name} hotelLinks={h.hotelLinks ?? []} /> */}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* styles (const) */
const styles: { [k: string]: React.CSSProperties } = {
  wrapper: { width: "100%"},
  cardWrap: {
    // borderRadius: 16,
    overflow: "hidden",
    // marginBottom: 15,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#EEE",
    boxSizing: "border-box",
    borderRadius: "32px 32px 0 0",
  },
  heartWrap: { position: "relative", zIndex: 20 },
  carouselOuter: { position: "relative" },
  carousel: {
    display: "grid",
    gridAutoFlow: "column",
    gap: 8,
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch",
    padding: 0,
    margin: 0,
  },
  image: {
    objectFit: "cover",
    borderRadius: 8,
    display: "block",
  },
  dotsContainer: {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    gap: 6,
    zIndex: 10,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
  },
  activeDot: {
    backgroundColor: "#000",
  },
  cardBody: { padding: 15, width: "100%", boxSizing: "border-box" },
  rowSB: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: 700 },
  hr: { height: 1, width: "100%", backgroundColor: "rgba(0,0,0,0.06)", margin: "15px 0" },
  priceText: { fontWeight: 700, color: "var(--text, #111)" },
  bookButtonSecondary: {
    backgroundColor: "transparent",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
  },
  bookButtonSecondaryText: { fontWeight: 700, color: "var(--text, #111)" },
};
