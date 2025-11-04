"use client";
import React from "react";
import { Star, StarHalf } from "lucide-react";

interface RatingDisplayProps {
  rating: number;
  totalReviews?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  totalReviews = 0,
  showCount = true,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
        />
      );
    }

    if (hasHalfStar && fullStars < 5) {
      stars.push(
        <StarHalf
          key="half"
          className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className={`${sizeClasses[size]} text-gray-300`}
        />
      );
    }

    return stars;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">{renderStars()}</div>
      {showCount && totalReviews > 0 && (
        <span className="text-sm text-gray-600 ml-1">
          ({rating.toFixed(1)}) - {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;
