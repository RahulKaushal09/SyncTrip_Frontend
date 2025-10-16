'use client';

import React, { useMemo, useState, useEffect, useRef } from "react";
import { DayWeather } from "@/types";
import { Sun, Cloud, CloudSnow, CloudRain, Zap, Thermometer, CloudLightning, Wind, SunDim, Moon, Droplet } from "lucide-react";

type Props = {
  days: DayWeather[];
  startDate: string; // inclusive range start
  endDate: string; // inclusive range end
  initialSelectedDate?: string;
};

const VISIBLE_DAYS = 7;
const WEEKDAY_HEIGHT = 14;
const DAY_MARGIN_TOP = 4;
const PILL_TOP = 21;
const PILL_HEIGHT = 35;
const PILL_RADIUS = 21;

function isBetween(dateStr: string, startStr: string, endStr: string) {
  const d = new Date(dateStr).setHours(0, 0, 0, 0);
  const s = new Date(startStr).setHours(0, 0, 0, 0);
  const e = new Date(endStr).setHours(0, 0, 0, 0);
  return d >= s && d <= e;
}

function monthYearLabel(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

function weekdayLetter(dateStr: string) {
  return new Date(dateStr)
    .toLocaleDateString(undefined, { weekday: "short" })
    .slice(0, 1);
}

function dayNumber(dateStr: string) {
  return String(new Date(dateStr).getDate());
}

function formatTime(value?: string) {
  if (!value) return "--";
  if (/^\d{1,2}:\d{2}/.test(value)) return value;
  const d = new Date(value);
  if (isNaN(d.getTime())) return "--";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function WeatherRangeCard({ days, startDate, endDate, initialSelectedDate }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  if (containerRef.current) {
    setContainerWidth(containerRef.current.offsetWidth);
  }

  const handleResize = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
  const sortedDays = useMemo(
    () => [...days].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [days]
  );

  const initialCandidate = initialSelectedDate || startDate || (sortedDays[0]?.date ?? "");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const candidate = initialCandidate;
    if (sortedDays.find(d => d.date === candidate && d.available)) return candidate;
    const firstAvailable = sortedDays.find(d => d.available)?.date;
    return firstAvailable || (sortedDays[0]?.date ?? candidate);
  });

  useEffect(() => {
    const existsAndAvailable = sortedDays.find(d => d.date === selectedDate && d.available);
    if (!existsAndAvailable) {
      const firstAvailable = sortedDays.find(d => d.available)?.date;
      setSelectedDate(firstAvailable || sortedDays[0]?.date || initialCandidate);
    }
  }, [sortedDays, selectedDate, initialCandidate]);

  const [containerWidth, setContainerWidth] = useState<number>(700); // default width for web

  const selectedIndexGlobal = sortedDays.findIndex(d => d.date === selectedDate);
  const rangeStartIndexGlobal = sortedDays.findIndex(d => isBetween(d.date, startDate, endDate));
  const rangeEndIndexGlobal = (() => {
    let idx = -1;
    sortedDays.forEach((d, i) => {
      if (isBetween(d.date, startDate, endDate)) idx = i;
    });
    return idx;
  })();

  const dayChunks = useMemo(() => {
    const chunks: DayWeather[][] = [];
    for (let i = 0; i < sortedDays.length; i += VISIBLE_DAYS) {
      chunks.push(sortedDays.slice(i, i + VISIBLE_DAYS));
    }
    return chunks;
  }, [sortedDays]);

  const dayWidth = containerWidth / VISIBLE_DAYS;
  const dayRowHeight = 56;
  const selectedDay = sortedDays.find(d => d.date === selectedDate) || sortedDays[0];

//   function onDaysContainerLayout(e: LayoutChangeEvent) {
//     const w = e.nativeEvent.layout.width;
//     if (w && Math.abs(w - containerWidth) > 1) setContainerWidth(w);
//   }

  const weatherIconName = (w?: DayWeather) => {
    const desc = (w?.icon || w?.description || "").toLowerCase();
    if (/snow/.test(desc)) return <CloudSnow size={30} />;
    if (/rain|shower/.test(desc)) return <CloudRain size={30} />;
    if (/cloud/.test(desc)) return <Cloud size={30} />;
    if (/clear|sunny/.test(desc)) return <Sun size={30} />;
    if (/storm|thunder/.test(desc)) return <Zap size={30} />;
    return null;
  };

  const getPillForRow = (row: number, chunk: DayWeather[]) => {
    if (rangeStartIndexGlobal < 0 || rangeEndIndexGlobal < 0) return null;

    const rowStartGlobal = row * VISIBLE_DAYS;
    const rowEndGlobal = rowStartGlobal + chunk.length - 1;
    const rangeStartInRow = Math.max(rowStartGlobal, rangeStartIndexGlobal);
    const rangeEndInRow = Math.min(rowEndGlobal, rangeEndIndexGlobal);
    if (rangeStartInRow > rangeEndInRow) return null;
    const startInRowLocal = rangeStartInRow - rowStartGlobal;
    const endInRowLocal = rangeEndInRow - rowStartGlobal;
    const left = startInRowLocal * dayWidth + dayWidth * 0.06;
    const width = (endInRowLocal - startInRowLocal + 1) * dayWidth - dayWidth * 0.12;
    return (
      <div
        style={{
          position: "absolute",
          backgroundColor: "var(--primary-background)",
          left,
          width,
          top: PILL_TOP,
          height: PILL_HEIGHT,
          borderRadius: PILL_RADIUS,
          zIndex: 0,
        }}
      />
    );
  };

  const previousMonth = { current: "" };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div ref={containerRef}>

        {/* <div onLayout={onDaysContainerLayout as any}> */}
          {dayChunks.map((chunk, row) => {
            const month = monthYearLabel(chunk[0]?.date || startDate);
            const showMonth = row === 0 || month !== previousMonth.current;
            previousMonth.current = month;
            const showWeekday = row === 0;

            return (
              <div key={row} style={{ marginTop: row > 0 ? 8 : 0 }}>
                {showMonth && <div style={styles.monthText}>{month}</div>}
                <div style={styles.daysRowContainer}>
                  {getPillForRow(row, chunk)}
                  <div style={{ ...styles.daysRow, height: dayRowHeight }}>
                    {chunk.map((d) => {
                      const isSelected = d.date === selectedDate;
                      const inRange = isBetween(d.date, startDate, endDate);
                      const dataAvailable = !!d.available;
                      return (
                        <button
                          key={d.date}
                          onClick={() => dataAvailable && setSelectedDate(d.date)}
                          disabled={!dataAvailable}
                          style={{ ...styles.dayCol, width: dayWidth }}
                        >
                          {showWeekday && <div style={styles.weekday}>{weekdayLetter(d.date)}</div>}
                          <div style={{ ...styles.dayWrapper, marginTop: showWeekday ? DAY_MARGIN_TOP : WEEKDAY_HEIGHT + DAY_MARGIN_TOP }}>
                            <div
                              style={{
                                ...styles.dayCircle,
                                ...(inRange && styles.dayCircleInRange),
                                ...(isSelected && styles.dayCircleSelected),
                                ...(!dataAvailable && styles.dayCircleUnavailable),
                              }}
                            >
                              <div
                                style={{
                                  color: isSelected ? "var(--on-primary)" : !dataAvailable ? "#bbb" : "#222",
                                  fontWeight: 600,
                                }}
                              >
                                {dayNumber(d.date)}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.separator} />

        <div style={styles.detailsCard}>
          <div style={styles.center}>
            <div style={styles.iconRow}>{weatherIconName(selectedDay) || <span style={styles.bigIcon}>{selectedDay?.icon || "❄️"}</span>}</div>
            <div style={styles.bigTemp}>{Math.round(selectedDay?.temp ?? 0)}°</div>
            <div style={styles.desc}>{selectedDay?.description ?? "--"}</div>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <Thermometer size={18} />
              <div style={styles.statValue}>{selectedDay?.minTemp ?? Math.round((selectedDay?.temp ?? 0) - 7)}°</div>
              <div style={styles.statLabel}>Low</div>
            </div>

            <div style={styles.statItem}>
              <Cloud size={18} />
              <div style={styles.statValue}>{selectedDay?.cloud ?? 0}%</div>
              <div style={styles.statLabel}>Cloud</div>
            </div>

            <div style={styles.statItem}>
              <Wind size={18} />
              <div style={styles.statValue}>{selectedDay?.wind_kmh ?? 0} Km/h</div>
              <div style={styles.statLabel}>Wind</div>
            </div>

            <div style={styles.statItem}>
              <SunDim size={18} />
              <div style={styles.statValue}>{formatTime(selectedDay?.sunrise)}</div>
              <div style={styles.statLabel}>Sunrise</div>
            </div>

            <div style={styles.statItem}>
              <Moon size={18} />
              <div style={styles.statValue}>{formatTime(selectedDay?.sunset)}</div>
              <div style={styles.statLabel}>Sunset</div>
            </div>

            <div style={styles.statItem}>
              <Droplet size={18} />
              <div style={styles.statValue}>{selectedDay?.precipitation ?? 0}%</div>
              <div style={styles.statLabel}>Drop</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { width: "100%" },
  monthText: { textAlign: "center", fontSize: 14, color: "#555", marginBottom: 8 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 4px 8px rgba(0,0,0,0.05)" },
  daysRowContainer: { position: "relative", overflow: "visible" },
  daysRow: { display: "flex", flexDirection: "row", alignItems: "center" },
  dayCol: { display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer" },
  weekday: { fontSize: 11, color: "#999" },
  dayWrapper: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
  rangePillAbsolute: { position: "absolute", backgroundColor: "var(--primary-background)", zIndex: 0 },
  dayCircle: { zIndex: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", borderWidth: 0 },
  dayCircleInRange: { backgroundColor: "transparent" },
  dayCircleSelected: { backgroundColor: "var(--secondary-1)" ,color:'white'},
  separator: { height: 1, backgroundColor: "#eee", margin: "12px 0" },
  detailsCard: { paddingTop: 4 },
  center: { display: "flex", alignItems: "center",justifyContent: 'center' },
  bigIcon: { fontSize: 28 },
  bigTemp: { fontSize: 28, fontWeight: "700", marginTop: 4 },
  desc: { fontSize: 13, color: "#666", marginTop: 2 },
  statsGrid: { marginTop: 12, display: "flex", flexWrap: "wrap", justifyContent: "space-between" },
  statItem: { width: "30%", display: "flex", flexDirection: "column", alignItems: "center", margin: "6px 0" },
  statValue: { fontSize: 14, fontWeight: "600", marginTop: 2 },
  statLabel: { fontSize: 11, color: "#999" },
  iconRow: { display: "flex", flexDirection: "row", alignItems: "center" },
  dayCircleUnavailable: { backgroundColor: "#f4f4f4", borderWidth: 1, borderColor: "#eee" },
};
