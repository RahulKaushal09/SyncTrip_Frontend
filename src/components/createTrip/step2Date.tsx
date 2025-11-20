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

// local midnight to avoid DST/time-of-day issues
const localMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const dayCountInclusive = (start: Date, end: Date) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const s = localMidnight(start).getTime();
  const e = localMidnight(end).getTime();
  return Math.floor((e - s) / msPerDay) + 1;
};

const Step2SelectDates: React.FC<Step2SelectDatesProps> = ({
  startDatePreTrip,
  endDatePreTrip,
  onDatesSelected,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const today = useMemo(() => localMidnight(new Date()), []);
  const globalMax = useMemo(() => {
    const m = new Date(today);
    m.setFullYear(today.getFullYear() + 1);
    return m;
  }, [today]);

  // preload if coming from modify/edit
  useEffect(() => {
    if (startDatePreTrip && endDatePreTrip) {
      const start = new Date(startDatePreTrip);
      const end = new Date(endDatePreTrip);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        setStartDate(start);
        setEndDate(end);
      }
    }
  }, [startDatePreTrip, endDatePreTrip]);

  // computed allowed end maximum based on start (start + MAX_TRIP_DAYS - 1) or globalMax
  const computedEndMax = useMemo(() => {
    if (!startDate) return globalMax;
    const m = new Date(startDate);
    m.setDate(m.getDate() + (MAX_TRIP_DAYS - 1));
    return m > globalMax ? globalMax : m;
  }, [startDate, globalMax]);

  // clear both dates (the '×' control)
  const clearDates = useCallback(() => {
    
    onDatesSelected(null as unknown as Date, null as unknown as Date); // inform parent of clearing
    setStartDate(null);
    setEndDate(null);
    setError(null);
    setInfo(null);
  }, []);

  // handle date selections from DatePicker
  const handleDateChange = useCallback((dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    // selecting only start
    if (start && !end) {
      setStartDate(start);
      setEndDate(null);
      setError(null);
      setInfo(`Max trip length is ${MAX_TRIP_DAYS} days. End date limited to ${new Date(start.getFullYear(), start.getMonth(), start.getDate() + (MAX_TRIP_DAYS - 1)).toDateString()}.`);
      return;
    }

    // selecting start + end
    if (start && end) {
      const days = dayCountInclusive(start, end);
      if (days > MAX_TRIP_DAYS) {
        // clamp end to allowed max and show an informational error
        const clamped = new Date(start);
        clamped.setDate(clamped.getDate() + (MAX_TRIP_DAYS - 1));
        setStartDate(start);
        setEndDate(clamped);
        setError(`Trip limited to ${MAX_TRIP_DAYS} days. End date adjusted to ${clamped.toDateString()}.`);
        setInfo(null);
        return;
      }
      setStartDate(start);
      setEndDate(end);
      setError(null);
      setInfo(null);
      return;
    }

    // no selection (reset)
    setStartDate(null);
    setEndDate(null);
    setError(null);
    setInfo(null);
  }, []);

  // call parent only when both dates exist and valid
  useEffect(() => {
    setError((e) => e); // noop but keeps error state stable
    if (startDate && endDate) {
      const days = dayCountInclusive(startDate, endDate);
      if (days <= MAX_TRIP_DAYS) {
        onDatesSelected(startDate, endDate);
      } else {
        // don't call parent if invalid
      }
    }
  }, [startDate, endDate, onDatesSelected]);

  return (
    <div className="step2-date-selection" style={{ position: 'relative' }}>
      <h2 className="DescriptionHeading">
        <strong>Select Your Trip Dates</strong>
      </h2>

      {/* Clear button (accessible) */}


      <p className="sub-text" style={{ color: '#666', marginBottom: '12px' }}>
        Choose your dates so we can plan perfect itinerary and connect you with the right travel buddies.
      </p>

      <div className="calendar-container" style={{ position: 'relative' }}>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          minDate={today}
          maxDate={computedEndMax}
          monthsShown={2}
          aria-label="Select trip dates"
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


      {/* info + error */}
      {/* {info && (
        <div role="status" style={{ color: '#0a66c2', marginTop: 8 }}>
          {info} — click the × to clear and choose a different start date.
        </div>
      )} */}
      {/* {error && (
        <div role="alert" style={{ color: 'crimson', marginTop: 8 }}>
          {error}
        </div>
      )} */}

      {/* small helper to reduce confusion */}
      <div style={{ marginTop: 8, fontSize: 13, color: '#666' }}>
        Tip: Maximum duration of the trip can be {MAX_TRIP_DAYS} days.
      </div>
    </div>
  );
};

export default Step2SelectDates;
