'use client';

import React, { useMemo, useState,useEffect } from 'react';
import Image from 'next/image';
import { Restaurants } from '@/types';
import { useRouter } from 'next/navigation';
import { HotelImageCarousel } from '../PageDetails/HotelsAndStaysSection';
import HeartIcon from '../smallComponents/HeartIcon';

type Props = {
  r: Restaurants;
  onDirections?: (r: Restaurants) => void;
  onCall?: (phone?: string) => void;
  isWishlisted?: boolean;
  typeOfWhishlistCardEnum: string;
  whishlistParentId?: string;
  whishlistParentType?: string;
  cardId?: string;
  style?: React.CSSProperties;
};

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function LocationRestaurantCard({
  r,
  onDirections,
  onCall,
  isWishlisted = false,
  typeOfWhishlistCardEnum,
  whishlistParentId,
  whishlistParentType,
  cardId,
  style,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(isWishlisted);
  const router = useRouter();
const [imageReady, setImageReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const imgs = useMemo(
    () => (r.photos?.length ? r.photos.map((p) => p.url) : []),
    [r.photos]
  );


  /** Preload FIRST image only */
  useEffect(() => {
    if (!imgs.length) {
      setImageFailed(true);
      return;
    }

    const img = new window.Image();
    img.src = imgs[0];

    img.onload = () => setImageReady(true);
    img.onerror = () => setImageFailed(true);
  }, [imgs]);

  /** ⛔ FIRST IMAGE NOT READY → DO NOT RENDER CARD */
 
  const openingMap = useMemo(() => {
    const map: Record<string, { open: string; close: string }[]> = {};
    (r.openingHours || []).forEach((h) => {
      const k = (h.day || '').trim().toLowerCase();
      if (!map[k]) map[k] = [];
      map[k].push({ open: h.open, close: h.close });
    });
    return map;
  }, [r.openingHours]);

  const weekOpen = dayOrder.map((d) => {
    const entries = openingMap[d];
    if (!entries?.length) return false;
    return entries.some((e) => e.open?.toLowerCase() !== 'closed');
  });

  const hoursText = useMemo(() => {
    const todayIdx = new Date().getDay();
    const mappingIdx = todayIdx === 0 ? 6 : todayIdx - 1;
    const today = openingMap[dayOrder[mappingIdx]];
    if (today?.length) return `${today[0].open} - ${today[0].close}`;
    if (r.openingHours?.length) return `${r.openingHours[0].open} - ${r.openingHours[0].close}`;
    return '';
  }, [openingMap, r.openingHours]);

  const handleDirections = () => {
    if (onDirections) return onDirections(r);
    let url = '';
    if (r.coordinates && (r.coordinates.lat || r.coordinates.long)) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${r.coordinates.lat},${r.coordinates.long}`;
    } else if (r.geo?.coordinates?.length === 2) {
      const [lon, lat] = r.geo.coordinates;
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    } else if (r.address) {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address)}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name)}`;
    }
    window.open(url, '_blank');
  };

  const handleCall = () => {
    if (onCall) return onCall(r.phone);
    if (!r.phone) return;
    window.location.href = `tel:${r.phone}`;
  };

  const toggleLike = () => {
    setLiked((prev) => !prev);
    // Optionally trigger wishlist API here
  };
const shouldRender = imgs.length && imageReady && !imageFailed;
  if (!shouldRender) return null;
  const primaryType =
    r.types && r.types.length ? capitalizeFirst(r.types[0]) : r.cuisineType || 'Cafe';

  return (
    <div style={{ ...styles.card, ...style }}>
      {/* Image Carousel */}
      <div style={styles.imageWrap}>
        <div style={{ display: 'flex', overflowX: 'scroll', overflowY: 'hidden', scrollSnapType: 'x mandatory', height: '100%' }}>
          {/* {imgs.map((img, i) => (
            <div key={i} style={{ flex: '0 0 100%', scrollSnapAlign: 'start' }}>
              <Image
                src={img}
                alt={r.name}
                width={800}
                height={400}
                style={styles.image}
                onLoad={() => setActiveIndex(i)}
              />
            </div>
          ))} */}
        <HotelImageCarousel images={imgs} locationName={r.name} />
        </div>

        <div style={styles.categoryChip}>
          <p style={styles.categoryText}>{primaryType}</p>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            cursor: 'pointer',
          }}
          onClick={toggleLike}
        >
          
           <HeartIcon
            id={r.id}
            parentId={whishlistParentId}
            parentType={whishlistParentType}
            name={r.name}
            type={typeOfWhishlistCardEnum}
            isWishlisted={isWishlisted}
          />
        </div>

        <div style={styles.dotsContainer}>
          {imgs.map((_, i) => (
            <div key={i} style={{ ...styles.dot, ...(i === activeIndex ? styles.activeDot : {}) }} />
          ))}
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.rowSB}>
          <p style={styles.title}>{r.name}</p>
          <div style={styles.ratingPill}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{r.rating ?? '-'}</span>
            <span style={{ fontSize: 12, marginLeft: 4 }}>({r.userRatingsTotal ?? 0})</span>
          </div>
        </div>

        <div style={styles.rowSB}>
          <div style={styles.daysWrap}>
            {weekOpen.map((open, i) => (
              <div
                key={i}
                style={{
                  ...styles.dayDot,
                  ...(open ? styles.dayOn : styles.dayOff),
                }}
              >
                <span style={open ? styles.dayOnText : styles.dayOffText}>{dayLetters[i]}</span>
              </div>
            ))}
          </div>
          {hoursText && <p style={styles.hours}>{hoursText}</p>}
        </div>

        <div style={styles.divider} />

        <div style={styles.actionsRow}>
          <button style={styles.buttonSecondaryAlt} onClick={handleDirections}>
            <span style={styles.buttonIcon}>🗺️</span> Get Directions
          </button>
          <button style={styles.buttonSecondary} onClick={handleCall}>
            <span style={styles.buttonIcon}>📞</span> Call
          </button>
        </div>
      </div>
    </div>
  );
}

function capitalizeFirst(s?: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

const RADIUS =32;

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: "white",
    borderRadius: RADIUS,
    margin: '10px auto',
    maxWidth: 600,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  imageWrap: { position: 'relative', width: '100%', height: 300 },
  image: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
  },
  categoryChip: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: "white",
    padding: '6px 12px',
    borderRadius: 999,
  },
  categoryText: { fontSize: 12, fontWeight: 600, color: "var(--neutral-1)", margin: 0 },
  dotsContainer: {
    position: 'absolute',
    bottom: 8,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#ccc',
  },
  activeDot: { backgroundColor: '#000' },
  body: { padding: 14 },
  rowSB: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: 700, color: "black", margin: 0 },
  ratingPill: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFF7E6',
    padding: '4px 10px',
    borderRadius: 999,
    border: '1px solid #FFE5B8',
  },
  daysWrap: { display: 'flex', gap: 5 },
  dayDot: {
    width: 24,
    height: 24,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dayOn: { backgroundColor: "var(--success-5)", border: `2px solid var(--success-1)` },
  dayOff: { backgroundColor: 'transparent', border: `1px solid var(--neutral-1)` },
  dayOnText: { fontSize: 12, fontWeight: 700, color: "var(--success-1)" },
  dayOffText: { fontSize: 12, fontWeight: 700, color: "var(--neutral-1)" },
  hours: { fontSize: 14, color: "var(--neutral-1)", margin: 0 },
  divider: { height: 1, backgroundColor: "var(--base-black)", margin: '15px 0' },
  actionsRow: { display: 'flex', justifyContent: 'space-between', gap: 8 },
  buttonSecondaryAlt: {
    flex: 1,
    backgroundColor: "white",
    color: "var(--secondary-1)",
    border: `1px solid var(--secondary-1)`,
    borderRadius: 8,
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: "var(--secondary-1)",
    color: "white",
    border: 'none',
    borderRadius: 8,
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
  },
  buttonIcon: { marginRight: 6 },
};
