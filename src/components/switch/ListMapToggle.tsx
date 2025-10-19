'use client';

import React, { useEffect, useRef, useState } from "react";
import "../../../styles/toggleSwitch.css";

type Props = {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  height?: number;
  borderRadius?: number;
  animationDuration?: number;
};

/**
 * Web version of ListMapToggleSwitch
 */
const ListMapToggleSwitch: React.FC<Props> = ({
  options,
  value,
  onChange,
  height = 40,
  borderRadius = 20,
  animationDuration = 180,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [indicatorLeft, setIndicatorLeft] = useState(0);

  // Compute selected index
  const index = Math.max(0, options.indexOf(value));

  // Measure width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Animate indicator
  useEffect(() => {
    if (!containerWidth) return;
    const optionWidth = containerWidth / options.length;
    setIndicatorLeft(optionWidth * index);
  }, [index, containerWidth, options.length]);

  const optionWidth = containerWidth / options.length;

  // dynamic border radius based on position
  const getIndicatorRadius = (): React.CSSProperties => {
    if (index === 0) {
      return {
        // borderTopLeftRadius: borderRadius,
        // borderBottomLeftRadius: borderRadius,
        // borderTopRightRadius: 0,
        // borderBottomRightRadius: 0,
      };
    } else if (index === options.length - 1) {
      return {
        // borderTopRightRadius: borderRadius,
        // borderBottomRightRadius: borderRadius,
        // borderTopLeftRadius: 0,
        // borderBottomLeftRadius: 0,
      };
    } else {
      return { borderRadius: 0 };
    }
  };

  return (
    <div
      className="toggle-container"
      ref={containerRef}
      style={{
        height,
        borderRadius,
      }}
    >
      {/* Sliding Indicator */}
      <div
        className="toggle-indicator"
        style={{
          width: optionWidth,
          height,
          left: indicatorLeft,
          transition: `left ${animationDuration}ms ease`,
          ...getIndicatorRadius(),
        }}
      ></div>

      {/* Options */}
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`toggle-option ${selected ? "selected" : ""}`}
            style={{ width: optionWidth, height }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default ListMapToggleSwitch;
