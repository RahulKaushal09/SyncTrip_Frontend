// components/ProgressBar.tsx
import React, { useEffect, useState } from "react";

type Props = {
  step: number;
  total: number;
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
};

const ProgressBar: React.FC<Props> = ({
  step,
  total,
  height = 6,
  backgroundColor = "var(--neutral-3)", // replace with your COLORS.grey[3] if you have
  fillColor = "var(--primary-1)", // replace with your COLORS.primary[1] if you have
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const nextProgress = Math.min(Math.max((step / total) * 100, 0), 100);
    setProgress(nextProgress);
  }, [step, total]);

  return (
    <div
      style={{
        width: "100%",
        height,
        backgroundColor,
        borderRadius: height / 2,
        overflow: "hidden",
        margin: "10px 0",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: fillColor,
          borderRadius: progress < 100 ? height / 2 : 0,
          transition: "width 0.4s ease-in-out",
        }}
      />
    </div>
  );
};

export default ProgressBar;
