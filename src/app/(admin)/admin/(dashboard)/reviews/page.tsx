'use client';

import { useState, useEffect } from 'react';
import StarRating from '@/components/review/StarRating';

interface Review {
    _id: string;
    productName: string;
    productImage: string;
    userName: string;
    userEmail: string;
    rating: number;
    title: string;
    review: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    useEffect(() => {
        fetchReviews();
    }, [filter]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const statusParam = filter === 'all' ? '' : `?status=${filter}`;
            const res = await fetch(`/api/admin/reviews${statusParam}`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (reviewId: string, newStatus: 'approved' | 'rejected') => {
        try {
            const res = await fetch('/api/reviews', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewId, status: newStatus })
            });

            if (res.ok) {
                // Refresh list or update local state
                setReviews(prev => prev.filter(r => r._id !== reviewId)); // Remove from current view if filtering by pending
                if (filter === 'all' || filter === newStatus) {
                    fetchReviews(); // Re-fetch if showing all or the target status
                }
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>Review Management</h1>

            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            background: filter === status ? '#ff6b00' : '#333',
                            color: 'white',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            transition: 'background 0.2s'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ color: '#888' }}>Loading reviews...</div>
            ) : reviews.length === 0 ? (
                <div style={{ padding: '3rem', background: '#111', borderRadius: '12px', textAlign: 'center', color: '#888', border: '1px solid #222' }}>
                    No reviews found with status "{filter}"
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {reviews.map((review) => (
                        <div key={review._id} style={{
                            background: '#111',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            border: '1px solid #222'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.25rem' }}>
                                        Product: <strong style={{ color: '#ccc' }}>{review.productName}</strong>
                                    </div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                                        {review.title}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background:
                                        review.status === 'approved' ? 'rgba(16, 185, 129, 0.2)' :
                                            review.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                    color:
                                        review.status === 'approved' ? '#34d399' :
                                            review.status === 'rejected' ? '#f87171' : '#facc15'
                                }}>
                                    {review.status.toUpperCase()}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <StarRating rating={review.rating} readonly size="small" />
                            </div>

                            <p style={{ color: '#ccc', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
                                {review.review}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #222', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ fontSize: '0.9rem', color: '#888' }}>
                                    By: <span style={{ color: 'white', fontWeight: 500 }}>{review.userName}</span> ({review.userEmail})
                                </div>

                                {review.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleUpdateStatus(review._id, 'approved')}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: '#10b981',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(review._id, 'rejected')}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                border: '1px solid #ef4444',
                                                background: 'transparent',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            }}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
