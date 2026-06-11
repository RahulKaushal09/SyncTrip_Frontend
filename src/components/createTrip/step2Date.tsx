'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../styles/PlanTripDates.css';
import DatePicker from 'react-datepicker';

interface Step2SelectDatesProps {
  startDatePreTrip?: string | null;
  endDatePreTrip?: string | null;
  onDatesSelected: (start: Date, end: Date) => void;
}

const MAX_TRIP_DAYS = 15; // inclusive
const MIN_TRIP_DAYS = 2; // must choose at least 2 days

// local midnight to avoid DST/time-of-day issues
const localMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const dayCountInclusive = (start: Date, end: Date) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const s = localMidnight(start).getTime();
  const e = localMidnight(end).getTime();
  return Math.floor((e - s) / msPerDay) + 1;
};

// returns true if a date is Saturday (6) or Sunday (0) - pure weekday test
const isWeekend = (d: Date) => {
  const dow = d.getDay();
  return dow === 0 || dow === 6;
};

// compute the upcoming weekend (Fri-Sun) containing or after the given date
const weekendRangeForDate = (d: Date) => {
  // aim for Friday (5) to Sunday (0)
  const candidate = localMidnight(new Date(d));
  const dow = candidate.getDay();
  // if Friday (5) or Saturday (6) or Sunday (0) -> find that weekend's Fri-Sun
  // else find next Friday
  let daysToFriday = 0;
  if (dow <= 5) {
    daysToFriday = 5 - dow;
  } else {
    // dow === 6 (Sat) or 0 (Sun) handled above but we fallback to next Fri
    daysToFriday = (5 + 7) - dow;
  }
  const fri = localMidnight(new Date(candidate));
  fri.setDate(fri.getDate() + daysToFriday);
  const sun = new Date(fri);
  sun.setDate(sun.getDate() + 2);
  return { start: fri, end: sun };
};

// clamp date to maxDate
const clampToMax = (d: Date, max: Date) => (d > max ? new Date(max) : d);

const Step2SelectDates: React.FC<Step2SelectDatesProps> = ({
  startDatePreTrip,
  endDatePreTrip,
  onDatesSelected,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // detect mobile for layout adjustments
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  const today = useMemo(() => localMidnight(new Date()), []);
  // globalMax now limited to 30 days in the future per requirement
  const globalMax = useMemo(() => {
    const m = new Date(today);
    m.setDate(m.getDate() + 30);
    return m;
  }, [today]);

  // preload if coming from modify/edit
  useEffect(() => {
    if (startDatePreTrip && endDatePreTrip) {
      const start = new Date(startDatePreTrip);
      const end = new Date(endDatePreTrip);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // clamp preloaded dates within allowed window
        const clampedStart = start < today ? today : start;
        const clampedEnd = end > globalMax ? globalMax : end;
        setStartDate(clampedStart);
        setEndDate(clampedEnd);
      }
    }
  }, [startDatePreTrip, endDatePreTrip, globalMax, today]);

  // computed allowed end maximum based on start (start + MAX_TRIP_DAYS - 1) or globalMax
  const computedEndMax = useMemo(() => {
    if (!startDate) return globalMax;
    const m = new Date(startDate);
    m.setDate(m.getDate() + (MAX_TRIP_DAYS - 1));
    const clamped = m > globalMax ? globalMax : m;
    return clamped;
  }, [startDate, globalMax]);

  // clear both dates (the '×' control)
  const clearDates = useCallback(() => {
    onDatesSelected(null as unknown as Date, null as unknown as Date); // inform parent of clearing
    setStartDate(null);
    setEndDate(null);
    setError(null);
  }, [onDatesSelected]);

  // recommended templates (buttons) helpers
  const applyTemplate = useCallback(
    (type: 'weekend' | 'long-weekend' | 'five-day') => {
      setError(null);

      if (type === 'weekend') {
        // choose next weekend Fri-Sun inside allowed window
        const { start, end } = weekendRangeForDate(today);
        const s = start < today ? today : start;
        const clampedStart = clampToMax(s, globalMax);
        const clampedEnd = clampToMax(end, globalMax);
        // ensure min days
        if (dayCountInclusive(clampedStart, clampedEnd) < MIN_TRIP_DAYS) {
          const e = new Date(clampedStart);
          e.setDate(e.getDate() + (MIN_TRIP_DAYS - 1));
          setStartDate(clampedStart);
          setEndDate(clampToMax(e, globalMax));
        } else {
          setStartDate(clampedStart);
          setEndDate(clampedEnd);
        }
      } else if (type === 'long-weekend') {
        // Thu-Sun (4 days) starting the nearest upcoming Thursday
        const cand = localMidnight(new Date(today));
        const dow = cand.getDay();
        // days to Thursday (4)
        const daysToThu = dow <= 4 ? 4 - dow : (4 + 7) - dow;
        const thu = new Date(cand);
        thu.setDate(thu.getDate() + daysToThu);
        const sun = new Date(thu);
        sun.setDate(sun.getDate() + 3);
        setStartDate(clampToMax(thu, globalMax));
        setEndDate(clampToMax(sun, globalMax));
      } else {
        // five-day escape: start as soon as possible (today or tomorrow) and run 5 days
        const s = new Date(today);
        // if today is weekend attempt to start next Monday for better travel vibes
        if (s.getDay() === 6) s.setDate(s.getDate() + 2); // Sat -> Mon
        if (s.getDay() === 0) s.setDate(s.getDate() + 1); // Sun -> Mon
        const e = new Date(s);
        e.setDate(e.getDate() + 4); // 5 days inclusive
        setStartDate(clampToMax(s, globalMax));
        setEndDate(clampToMax(e, globalMax));
      }
    },
    [globalMax, today]
  );

  // helper: produce a tooltip string for weekends (only returns text when inside booking window)
  const weekendTooltipFor = useCallback(
    (d: Date) => {
      const { start, end } = weekendRangeForDate(d);
      // only show if within allowed booking window
      if (start > globalMax) return '';
      const s = start.toDateString();
      const e = end > globalMax ? globalMax.toDateString() : end.toDateString();
      return `Recommended weekend: ${s} - ${e}`;
    },
    [globalMax]
  );

  // handle date selections from DatePicker
  const handleDateChange = useCallback(
    (dates: [Date | null, Date | null]) => {
      const [start, end] = dates;

      // selecting only start
      if (start && !end) {
        // clamp start within bounds
        const clampedStart = start < today ? today : start;
        const clamped = clampToMax(clampedStart, globalMax);
        setStartDate(clamped);
        setEndDate(null);
        setError(null);
        return;
      }

      // selecting start + end
      if (start && end) {
        // clamp start/end into allowed window
        const s = start < today ? today : start;
        const e = end > globalMax ? globalMax : end;

        const days = dayCountInclusive(s, e);

        // enforce minimum stay
        if (days < MIN_TRIP_DAYS) {
          const adjustedEnd = new Date(s);
          adjustedEnd.setDate(adjustedEnd.getDate() + (MIN_TRIP_DAYS - 1));
          const finalEnd = clampToMax(adjustedEnd, globalMax);
          setStartDate(s);
          setEndDate(finalEnd);
          setError(`Minimum stay is ${MIN_TRIP_DAYS} days. End date adjusted to ${finalEnd.toDateString()}.`);
          return;
        }

        // enforce maximum stay
        if (days > MAX_TRIP_DAYS) {
          // clamp end to allowed max and show an informational error
          const clamped = new Date(s);
          clamped.setDate(clamped.getDate() + (MAX_TRIP_DAYS - 1));
          const finalClamped = clamped > globalMax ? globalMax : clamped;
          setStartDate(s);
          setEndDate(finalClamped);
          setError(`Trip limited to ${MAX_TRIP_DAYS} days. End date adjusted to ${finalClamped.toDateString()}.`);
          return;
        }

        setStartDate(s);
        setEndDate(e);
        setError(null);
        return;
      }

      // no selection (reset)
      setStartDate(null);
      setEndDate(null);
      setError(null);
    },
    [globalMax, today]
  );

  // call parent only when both dates exist and valid
  useEffect(() => {
    setError((e) => e); // noop but keeps error state stable
    if (startDate && endDate) {
      const days = dayCountInclusive(startDate, endDate);
      if (days <= MAX_TRIP_DAYS && days >= MIN_TRIP_DAYS) {
        onDatesSelected(startDate, endDate);
      } else {
        // don't call parent if invalid
      }
    }
  }, [startDate, endDate, onDatesSelected]);

  // New: only highlight weekends that fall within [today, globalMax]
  const isWeekendInWindow = useCallback(
    (date: Date) => {
      const d = localMidnight(date);
      if (d < today) return false;
      if (d > globalMax) return false;
      return isWeekend(d);
    },
    [today, globalMax]
  );

  // dayClassName: highlight weekends inside booking window only
  const dayClassName = useCallback(
    (date: Date) => {
      if (isWeekendInWindow(date)) {
        return 'weekend-day';
      }
      return undefined;
    },
    [isWeekendInWindow]
  );

  // renderDayContents to attach 'title' attribute (tooltip) only for weekends in window
  const renderDayContents = useCallback(
    (day: React.ReactNode, date?: Date) => {
      if (!date) return <span>{day}</span>;
      if (isWeekendInWindow(date)) {
        const tip = weekendTooltipFor(date);
        return (
          <span title={tip} aria-label={tip} style={{ position: 'relative', display: 'inline-block' }}>
            {day}
          </span>
        );
      }
      return <span>{day}</span>;
    },
    [isWeekendInWindow, weekendTooltipFor]
  );

  return (
    <div className="step2-date-selection" style={{ position: 'relative' }}>
      <h2 className="DescriptionHeading">
        <strong>Select Your Trip Dates</strong>
      </h2>

      <p className="sub-text" style={{ color: '#666', marginBottom: '12px' }}>
        Choose your dates so we can connect the right travel buddies.
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: !isMobile ? 'row' : 'column' }}>
        {/* Recommended templates */}
        <div style={{ minWidth: 220, width: !isMobile ? 'auto' : '100%' }}>
          <div style={{ fontSize: 13, marginBottom: 6, color: '#444' }}>Recommended trip templates</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              onClick={() => applyTemplate('weekend')}
              className="recommended-btn"
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #ddd',
                background: 'white',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              Weekend Quick (Fri–Sun)
            </button>
            <button
              type="button"
              onClick={() => applyTemplate('long-weekend')}
              className="recommended-btn"
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #ddd',
                background: 'white',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              Long Weekend (Thu–Sun)
            </button>
            <button
              type="button"
              onClick={() => applyTemplate('five-day')}
              className="recommended-btn"
              style={{
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #ddd',
                background: 'white',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              5-day Escape
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div className="calendar-container" style={{ position: 'relative' }}>
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
              minDate={today}
              // maxDate for the datepicker as a whole is globalMax (booking window)
              maxDate={globalMax}
              monthsShown={2}
              aria-label="Select trip dates"
              dayClassName={dayClassName as (date: Date) => string}
              renderDayContents={(day, date) => renderDayContents(day, date as Date)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="date-range-display" aria-live="polite" style={{ marginTop: '12px' }}>
              {startDate || endDate
                ? `${startDate ? startDate.toDateString() : 'Start Date'} - ${endDate ? endDate.toDateString() : 'End Date'}`
                : 'Select your trip dates'}
            </div>
            {(startDate || endDate) && (
              <button
                onClick={clearDates}
                aria-label="Clear selected dates"
                title="Clear selected dates"
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: 20,
                  lineHeight: 1,
                  cursor: 'pointer',
                  padding: 6,
                  marginTop: 4,
                }}
              >
                ×
              </button>
            )}
          </div>

          {error && (
            <div role="alert" style={{ color: 'crimson', marginTop: 8 }}>
              {error}
            </div>
          )}

          {/* small helper to reduce confusion */}
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            Tip: Booking window: next 30 days. Minimum stay: {MIN_TRIP_DAYS} days. Max: {MAX_TRIP_DAYS} days.
          </div>
          <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
            Most travelers choose weekends - you may find better matches on those dates.
          </div>
        </div>
      </div>

      {/* small legend for weekend highlighting */}
      <div style={{ marginTop: 10, fontSize: 13, color: '#666' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              width: 25,
              height: 25,
              borderRadius: 3,
              background: '#fff7e6',
              border: '1px solid #f0c36b',
            }}
          />
          Weekends are highlighted - hover a weekend to see recommended weekend range.
        </span>
      </div>

      {/* inline weekend-day style fallback if user hasn't added CSS */}
      <style>
        {`
          /* weekend highlight fallback; you can move this into PlanTripDates.css */
          .weekend-day {
            // background: #fff7e6 !important;
            border: 1px solid #f0c36b !important;
            border-radius: 4px;
          }
          .recommended-btn:hover {
            box-shadow: 0 2px 6px rgba(0,0,0,0.06);
            transform: translateY(-1px);
          }
        `}
      </style>
    </div>
  );
};

export default Step2SelectDates;
