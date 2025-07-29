import React from "react"

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "medium" | "large";
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = "medium",
  overlay = true 
}) => {
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-10 h-10 border-4", 
    large: "w-16 h-16 border-4"
  };

  const containerClasses = overlay 
    ? "fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 z-50"
    : "flex flex-col items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className={`${sizeClasses[size]} border-blue-300 border-t-transparent rounded-full animate-spin mb-3`} />
      {message && (
        <div className="text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded">
          {message}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner
