"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./DOBSelects.module.css";
import { CommonServices } from "@/utils";

interface DOBSelectProps {
  value: string | null;        // ISO string: "2000-05-12" or "" or null
  onChange: (value: string) => void;
  required?: boolean;
  label?: string;
  showAge?: boolean;           // show computed age under the selects
  className?: string;
}

export const DOBSelects: React.FC<DOBSelectProps> = ({
  value,
  onChange,
  required = true,
  label = "Date of Birth",
  showAge = true,
  className = ""
}) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const YEARS_BACK = 100;

  const years = useMemo(
    () => Array.from({ length: YEARS_BACK }, (_, i) => currentYear - i),
    [currentYear]
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  // Local controlled pieces so UI updates immediately
  const [localDay, setLocalDay] = useState<number | "">("");
  const [localMonth, setLocalMonth] = useState<number | "">("");
  const [localYear, setLocalYear] = useState<number | "">("");

  // Sync local state when external `value` changes
  useEffect(() => {
    if (!value) {
      setLocalDay("");
      setLocalMonth("");
      setLocalYear("");
      return;
    }

    // value expected as "YYYY-MM-DD" (en-CA)
    const parts = value.split("-");
    if (parts.length === 3) {
      const [yStr, mStr, dStr] = parts;
      const y = Number(yStr);
      const m = Number(mStr);
      const d = Number(dStr);
      if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
        setLocalYear(y);
        setLocalMonth(m);
        setLocalDay(d);
        return;
      }
    }

    // fallback: try Date parse
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      setLocalYear(parsed.getFullYear());
      setLocalMonth(parsed.getMonth() + 1);
      setLocalDay(parsed.getDate());
    } else {
      setLocalDay("");
      setLocalMonth("");
      setLocalYear("");
    }
  }, [value]);

  // days in month depends on (year, month)
  const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
  const totalDays =
    localYear && localMonth ? daysInMonth(Number(localYear), Number(localMonth)) : 31;

  const age = CommonServices.computeAge(value);

  // format to en-CA "YYYY-MM-DD" (keeps local date for IST)
  const formatIsoFromParts = (y: number, m: number, d: number) => {
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // yields YYYY-MM-DD
  };

  // handlers: update local immediately, only call onChange when all parts are set
  const onDayChange = (d: number | "") => {
    setLocalDay(d);
    if (d && localMonth && localYear) {
      onChange(formatIsoFromParts(Number(localYear), Number(localMonth), Number(d)));
    } else {
      // don't emit partial; keep parent's value unchanged
    }
  };

  const onMonthChange = (m: number | "") => {
    setLocalMonth(m);
    // if month changed and selected day > new month's totalDays, clamp day
    if (m && localYear && localDay) {
      const md = daysInMonth(Number(localYear), Number(m));
      if (Number(localDay) > md) {
        setLocalDay(md);
        onChange(formatIsoFromParts(Number(localYear), Number(m), md));
        return;
      }
    }
    if (localDay && m && localYear) {
      onChange(formatIsoFromParts(Number(localYear), Number(m), Number(localDay)));
    }
  };

  const onYearChange = (y: number | "") => {
    setLocalYear(y);
    if (y && localMonth && localDay) {
      // clamp day if needed (Feb 29 etc)
      const md = daysInMonth(Number(y), Number(localMonth));
      if (Number(localDay) > md) {
        setLocalDay(md);
        onChange(formatIsoFromParts(Number(y), Number(localMonth), md));
        return;
      }
      onChange(formatIsoFromParts(Number(y), Number(localMonth), Number(localDay)));
    }
  };

  // clear all (propagate empty)
  const clear = () => {
    setLocalDay("");
    setLocalMonth("");
    setLocalYear("");
    onChange("");
  };

  return (
    <div className={`${styles["synctrip-dob-root"]} ${className}`}>
      <label className={styles["synctrip-dob-label"]}>
        {label} {required && <span className={styles["synctrip-required-star"]}>*</span>}
      </label>

      <div className={styles["synctrip-dob-row"]}>
        <div className={styles["synctrip-select-wrap"]}>
          <select
            id="synctrip-dob-day"
            name="dob-day"
            aria-label="Day"
            className={styles["synctrip-select"]}
            required={required}
            value={localDay ?? ""}
            onChange={(e) => {
              const val = e.target.value === "" ? "" : Number(e.target.value);
              onDayChange(val);
            }}
          >
            <option value="">Day</option>
            {Array.from({ length: totalDays }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className={styles["synctrip-select-wrap"]}>
          <select
            id="synctrip-dob-month"
            name="dob-month"
            aria-label="Month"
            className={styles["synctrip-select"]}
            required={required}
            value={localMonth ?? ""}
            onChange={(e) => {
              const val = e.target.value === "" ? "" : Number(e.target.value);
              onMonthChange(val);
            }}
          >
            <option value="">Month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString("en", { month: "short" })}
              </option>
            ))}
          </select>
        </div>

        <div className={styles["synctrip-select-wrap"]}>
          <select
            id="synctrip-dob-year"
            name="dob-year"
            aria-label="Year"
            className={styles["synctrip-select"]}
            required={required}
            value={localYear ?? ""}
            onChange={(e) => {
              const val = e.target.value === "" ? "" : Number(e.target.value);
              onYearChange(val);
            }}
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={styles["synctrip-clear-btn"]}
          aria-label="Clear date of birth"
          onClick={clear}
          title="Clear"
          hidden={!localDay && !localMonth && !localYear && !value}
        >
          ✕
        </button>
      </div>

      <div className={styles["synctrip-dob-meta"]}>
        {showAge && age !== null && (
          <span className={styles["synctrip-age"]}>Age: <strong>{age}</strong> years</span>
        )}
      </div>
    </div>
  );
};

export default DOBSelects;
