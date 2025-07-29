import React, { useEffect, useState } from "react";

interface ChangeIndicatorProps {
  cellRef: string;
  durationMs?: number;
  style?: React.CSSProperties; // Optional inline style positioning (absolute coordinates)
}

const ChangeIndicator: React.FC<ChangeIndicatorProps> = ({
  cellRef,
  durationMs = 1500,
  style,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide after duration
    const timer = setTimeout(() => setIsVisible(false), durationMs);
    return () => clearTimeout(timer);
  }, [durationMs]);

  if (!isVisible) return null;

  return (
    <div
      aria-label={`Change indicator for cell ${cellRef}`}
      className="absolute rounded border-2 border-blue-500 pointer-events-none animate-pulse"
      style={{
        ...style,
        zIndex: 30,
      }}
    />
  );
};

export default ChangeIndicator;