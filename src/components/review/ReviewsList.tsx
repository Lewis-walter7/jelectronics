'use client';

import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import styles from './ReviewsList.module.css';

interface Review {
    _id: string;
    userName: string;
    rating: number;
    title: string;
    review: string;
    verifiedPurchase: boolean;
    createdAt: string;
}

interface ReviewsListProps {
    productId: string;
}

export default function ReviewsList({ productId }: ReviewsListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?productId=${productId}`);
            const data = await res.json();

            if (data.success) {
                setReviews(data.reviews);
                setAverageRating(data.averageRating);
                setReviewCount(data.reviewCount);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className={styles.loading}>Loading reviews...</div>;
    }

    return (
        <div className={styles.reviewsSection}>
            <div className={styles.header}>
                <h3 className={styles.heading}>Customer Reviews</h3>
                {reviewCount > 0 && (
                    <div className={styles.overallRating}>
                        <div className={styles.ratingNumber}>{averageRating.toFixed(1)}</div>
                        <div>
                            <StarRating rating={averageRating} readonly size="medium" />
                            <div className={styles.reviewCount}>Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}</div>
                        </div>
                    </div>
                )}
            </div>

            {reviews.length === 0 ? (
                <div className={styles.noReviews}>
                    <p>No reviews yet. Be the first to review this product!</p>
                </div>
            ) : (
                <div className={styles.reviewsList}>
                    {reviews.map((review) => (
                        <div key={review._id} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <div>
                                    <div className={styles.reviewerName}>
                                        {review.userName}
                                        {review.verifiedPurchase && (
                                            <span className={styles.verified}>✓ Verified Purchase</span>
                                        )}
                                    </div>
                                    <StarRating rating={review.rating} readonly size="small" />
                                </div>
                                <div className={styles.reviewDate}>{formatDate(review.createdAt)}</div>
                            </div>
                            <h4 className={styles.reviewTitle}>{review.title}</h4>
                            <p className={styles.reviewText}>{review.review}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
