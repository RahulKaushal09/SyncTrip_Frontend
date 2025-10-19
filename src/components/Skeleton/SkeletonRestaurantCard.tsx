'use client';

import React from "react";
import "../../../styles/skeleton.css"; // make sure this imports your CSS file

const SkeletonRestaurantCard: React.FC = () => {
  return (
    <div className="skeleton-card" style={styles.card}>
      {/* Image Carousel */}
      <div className="skeleton-image" style={styles.image}></div>

      {/* Pagination Dots */}
      <div style={styles.dotsContainer}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="skeleton-circle"
            style={{ ...styles.dot, width: 6, height: 6 }}
          />
        ))}
      </div>

      {/* Category + Title + Button */}
      <div style={styles.body}>
        <div className="skeleton-line" style={{ width: "30%", height: 16, borderRadius: 8, marginBottom: 6 }}></div>
        <div className="skeleton-line" style={{ width: "60%", height: 18, borderRadius: 8, marginBottom: 10 }}></div>
        <div className="skeleton-line" style={{ width: 80, height: 35, borderRadius: 20 }}></div>
      </div>
    </div>
  );
};

/* Styles as const */
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: "calc(100% - 32px)",
    borderRadius: 16,
    backgroundColor: "#fff",
    margin: "10px auto",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
  },
  dotsContainer: {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: 8,
    width: "100%",
    gap: 6,
  },
  dot: {
    borderRadius: "50%",
  },
  body: {
    padding: 14,
  },
};

export default SkeletonRestaurantCard;
