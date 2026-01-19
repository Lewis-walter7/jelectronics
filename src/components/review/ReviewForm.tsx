'use client';

import { useState } from 'react';
import StarRating from './StarRating';
import styles from './ReviewForm.module.css';

interface ReviewFormProps {
    productId: string;
    onReviewSubmitted?: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            setMessage({ type: 'error', text: 'Please select a rating' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    userName,
                    userEmail,
                    rating,
                    title,
                    review
                })
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                // Reset form
                setRating(0);
                setUserName('');
                setUserEmail('');
                setTitle('');
                setReview('');

                if (onReviewSubmitted) {
                    onReviewSubmitted();
                }
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to submit review' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.reviewForm}>
            <h3 className={styles.heading}>Write a Review</h3>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Your Rating *</label>
                    <StarRating rating={rating} onRatingChange={setRating} size="large" />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Your Name *</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Your Email *</label>
                        <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Review Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.input}
                        placeholder="Sum up your review in one line"
                        maxLength={100}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Your Review *</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className={styles.textarea}
                        placeholder="Tell us what you think about this product"
                        maxLength={1000}
                        rows={5}
                        required
                    />
                    <span className={styles.charCount}>{review.length}/1000</span>
                </div>

                {message && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
}
