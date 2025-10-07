
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../styles/PlanTripDates.css';

import DatePicker from 'react-datepicker';



interface Step2SelectDatesProps {
  startDatePreTrip?: string | null;
  endDatePreTrip?: string | null;
  onDatesSelected: (start: Date, end: Date) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2SelectDates: React.FC<Step2SelectDatesProps> = ({
  startDatePreTrip,
  endDatePreTrip,
  onDatesSelected,
  onNext,
  onBack,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() + 1);

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

  const handleDateChange = useCallback((dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  }, []);

  const handleNext = useCallback(() => {
    if (startDate && endDate) {
      onDatesSelected(startDate, endDate);
      onNext();
    } else {
      alert('Please select both start and end dates.');
    }
  }, [startDate, endDate, onDatesSelected, onNext]);

  return (
    <div className="step2-date-selection">
      <h2 className="DescriptionHeading">
        <strong>Select Your Trip Dates</strong>
      </h2>

      <p className="sub-text" style={{ color: '#666', marginBottom: '16px' }}>
        Choose your start and end dates for the trip.
      </p>

      <div className="calendar-container">
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          minDate={today}
          maxDate={maxDate}
          monthsShown={2}
          aria-label="Select trip dates"
        />
      </div>

      <div className="date-range-display" aria-live="polite" style={{ marginTop: '12px' }}>
        {startDate && endDate
          ? `${startDate.toDateString()} - ${endDate.toDateString()}`
          : 'Select your trip dates'}
      </div>

      <div className="button-container row" style={{ marginTop: '20px' }}>
        <div className="col-lg-6 col-md-6 col-sm-12 zeroPaddingInMobile-btn-1000">
          <button
            onClick={onBack}
            className="btn btn-outline-dark"
            style={{ width: '100%', borderRadius: '9px' }}
          >
            Back
          </button>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 zeroPaddingInMobile-btn-1000">
          <button
            onClick={handleNext}
            className="view-more-btn create-trip"
            style={{
              width: '100%',
              borderRadius: '9px',
              textAlign: 'center',
              backgroundColor: "var(--primary-1)",
              color: 'white',
              border: 'none',
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2SelectDates;
