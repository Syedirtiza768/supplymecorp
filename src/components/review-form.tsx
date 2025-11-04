"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

interface ReviewFormProps {
  productId: string;
  existingReview?: {
    id: string;
    rating: number;
    comment: string;
    userName: string;
  } | null;
  onSubmit: (rating: number, comment: string, userName: string) => Promise<void>;
  onUpdate?: (reviewId: string, rating: number, comment: string) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  existingReview,
  onSubmit,
  onUpdate,
  onCancel,
  className = "",
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [userName, setUserName] = useState(existingReview?.userName || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingReview && onUpdate) {
        await onUpdate(existingReview.id, rating, comment);
      } else {
        await onSubmit(rating, comment, userName);
      }

      // Reset form if adding new review
      if (!existingReview) {
        setRating(0);
        setComment("");
        setUserName("");
      }
    } catch (err) {
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating *
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {!existingReview && (
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Name (Optional)
          </label>
          <Input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Anonymous"
            className="w-full"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Review (Optional)
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us about your experience with this product..."
          rows={4}
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Submitting..."
            : existingReview
            ? "Update Review"
            : "Submit Review"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
