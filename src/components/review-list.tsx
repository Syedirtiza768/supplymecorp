"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "./ui/button";
import RatingDisplay from "./rating-display";
import ReviewForm from "./review-form";
import { useReview } from "@/context/ReviewContext";

interface Review {
  id: string;
  sessionId: string;
  productId: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewListProps {
  productId: string;
  className?: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  productId,
  className = "",
}) => {
  const {
    sessionId,
    getProductReviews,
    getUserReview,
    addReview,
    updateReview,
    deleteReview,
    getAverageRating,
  } = useReview();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const [reviewsResult, avgResult, userReviewResult] = await Promise.all([
        getProductReviews(productId),
        getAverageRating(productId),
        getUserReview(productId),
      ]);

      if (reviewsResult.success) {
        setReviews(reviewsResult.reviews);
      }

      if (avgResult.success) {
        setAverageRating(avgResult.averageRating);
        setTotalReviews(avgResult.totalReviews);
      }

      if (userReviewResult.success && userReviewResult.review) {
        setUserReview(userReviewResult.review);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleAddReview = async (
    rating: number,
    comment: string,
    userName: string
  ) => {
    const result = await addReview(productId, rating, comment, userName);
    if (result.success) {
      setShowForm(false);
      await fetchReviews();
    } else {
      alert(result.error || "Failed to add review");
    }
  };

  const handleUpdateReview = async (
    reviewId: string,
    rating: number,
    comment: string
  ) => {
    const result = await updateReview(reviewId, rating, comment);
    if (result.success) {
      setEditingReview(null);
      await fetchReviews();
    } else {
      alert(result.error || "Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    const result = await deleteReview(reviewId);
    if (result.success) {
      await fetchReviews();
    } else {
      alert(result.error || "Failed to delete review");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Average Rating Summary */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
        {totalReviews > 0 ? (
          <RatingDisplay
            rating={averageRating}
            totalReviews={totalReviews}
            showCount={true}
            size="lg"
          />
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Add/Edit Review Section */}
      {userReview && !editingReview ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-blue-900 mb-2">Your Review</p>
              <RatingDisplay rating={userReview.rating} showCount={false} />
              {userReview.comment && (
                <p className="text-gray-700 mt-2">{userReview.comment}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Posted on {formatDate(userReview.createdAt)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingReview(userReview)}
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteReview(userReview.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : editingReview ? (
        <div className="bg-gray-50 border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Edit Your Review</h3>
          <ReviewForm
            productId={productId}
            existingReview={editingReview}
            onSubmit={handleAddReview}
            onUpdate={handleUpdateReview}
            onCancel={() => setEditingReview(null)}
          />
        </div>
      ) : !userReview && !showForm ? (
        <Button onClick={() => setShowForm(true)}>Write a Review</Button>
      ) : (
        showForm && (
          <div className="bg-gray-50 border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <ReviewForm
              productId={productId}
              onSubmit={handleAddReview}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Reviews</h3>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">
                    {review.userName || "Anonymous"}
                  </p>
                  <RatingDisplay rating={review.rating} showCount={false} />
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </p>
              </div>
              {review.comment && (
                <p className="text-gray-700 mt-2">{review.comment}</p>
              )}
              {review.sessionId === sessionId && review.id !== userReview?.id && (
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingReview(review)}
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
