'use client'

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import QuickViewModal from './QuickViewModal';
import StarRating from '../review/StarRating';
import { useCart } from '@/context/CartContext';
import { useCompare } from '@/context/CompareContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ProductCardProps {
    _id: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    imageUrl: string;
    category: string;
    slug?: string;
    averageRating?: number;
    reviewCount?: number;
    minPrice?: number;
    maxPrice?: number;
    images?: string[];
}

export default function ProductCard({ _id, name, description, price, salePrice, imageUrl, category, slug, averageRating = 0, reviewCount = 0, minPrice = 0, maxPrice = 0, images = [] }: ProductCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    // Combine imageUrl and images array, filter out duplicates and empty strings
    const allImages = Array.from(new Set([imageUrl, ...images])).filter(img => img && typeof img === 'string');
    const hasMultipleImages = allImages.length > 1;

    const { addToCart } = useCart();
    const { compareList, addToCompare, removeFromCompare } = useCompare();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const router = useRouter();

    const nextImage = useCallback((e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, [allImages.length]);

    const prevImage = useCallback((e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }, [allImages.length]);

    useEffect(() => {
        if (!hasMultipleImages) return;

        const interval = setInterval(() => {
            // Only slide if not being hovered by the user to maintain better UX
            if (!isHovered) {
                nextImage();
            }
        }, 3000); // 3 seconds interval

        return () => clearInterval(interval);
    }, [hasMultipleImages, isHovered, nextImage]);

    // Fallback slug generation if not provided
    const safeName = name || 'Product';
    const safeSlug = slug || `${safeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${_id}`;
    const productLink = `/products/${category.toLowerCase()}/${safeSlug}`;
    const isComparing = compareList.some(item => item._id === _id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({ id: _id, name, price: salePrice || price, imageUrl, quantity: 1 });

        toast.custom((t) => (
            <div
                style={{
                    opacity: t.visible ? 1 : 0,
                    transition: 'opacity 0.2s',
                    background: 'rgba(20, 20, 20, 0.95)',
                    color: '#fff',
                    padding: '12px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minWidth: '300px',
                    border: '1px solid #333'
                }}
            >
                <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                    <Image src={imageUrl} alt={name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>Added to Cart</p>
                    <p style={{ fontSize: '0.8rem', color: '#aaa', margin: 0 }}>{name}</p>
                </div>
                <Link href="/checkout" style={{ color: '#ff6b00', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                    View
                </Link>
            </div>
        ), { duration: 3000 });
    };

    const handleToggleCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isComparing) {
            removeFromCompare(_id);
        } else {
            addToCompare({
                _id,
                name,
                price: salePrice || price,
                images: [imageUrl], // Context expects array
                category,
                slug: slug || _id
            });
        }
    };

    return (
        <Link
            href={productLink}
            className={styles.card}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={styles.imageWrapper}>
                <div
                    className={styles.imageTrack}
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                    {allImages.map((img, index) => (
                        <div key={index} className={styles.imageSlide}>
                            <Image
                                src={img}
                                alt={`${name} - Image ${index + 1}`}
                                fill
                                className={styles.image}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={index === 0}
                            />
                        </div>
                    ))}
                </div>

                {salePrice && <span className={styles.badge}>SALE</span>}

                {hasMultipleImages && (
                    <>
                        <button
                            className={`${styles.navBtn} ${styles.prevBtn}`}
                            onClick={prevImage}
                            aria-label="Previous image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <button
                            className={`${styles.navBtn} ${styles.nextBtn}`}
                            onClick={nextImage}
                            aria-label="Next image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                        <div className={styles.indicators}>
                            {allImages.map((_, index) => (
                                <span
                                    key={index}
                                    className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentImageIndex(index);
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}

                <button
                    onClick={handleToggleCompare}
                    className={styles.compareBtn}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: isComparing ? '#0ea5e9' : 'rgba(0,0,0,0.6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: 'background 0.2s'
                    }}
                    title={isComparing ? "Remove from Compare" : "Add to Compare"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" />
                    </svg>
                </button>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        isInWishlist(_id) ? removeFromWishlist(_id) : addToWishlist({ _id, name, price: salePrice || price, imageUrl, category, slug: slug || _id });
                    }}
                    className={styles.compareBtn}
                    style={{
                        position: 'absolute',
                        top: '50px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: 'all 0.2s'
                    }}
                    title={isInWishlist(_id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>
            </div>
            <div className={styles.content}>
                <span className={styles.category}>{category}</span>
                {averageRating > 0 && (
                    <div style={{ marginBottom: '4px' }}>
                        <StarRating rating={averageRating} readonly size="small" />
                    </div>
                )}
                <h3 className={styles.title}>{name}</h3>
                <div className={styles.priceRow}>
                    <div className={styles.prices}>
                        {(minPrice > 0 && maxPrice > 0) ? (
                            <span className={styles.price}>
                                KES {minPrice.toLocaleString()} - KES {maxPrice.toLocaleString()}
                            </span>
                        ) : (
                            <>
                                <span className={styles.price}>
                                    KES {(salePrice || price).toLocaleString()}
                                </span>
                                {(salePrice && salePrice < price) && (
                                    <span className={styles.originalPrice}>
                                        KES {price.toLocaleString()}
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                    Add to Cart
                </button>
            </div>

            {/* Quick View Button - Desktop Only (controlled by CSS) */}
            <button
                className={styles.quickViewBtn}
                onClick={(e) => {
                    e.preventDefault(); // Prevent navigation
                    setIsQuickViewOpen(true);
                }}
            >
                Quick View
            </button>

            {/* Quick View Modal */}
            {isQuickViewOpen && (
                <QuickViewModal
                    isOpen={isQuickViewOpen}
                    onClose={() => setIsQuickViewOpen(false)}
                    product={{
                        _id, name, description, price, salePrice, imageUrl, category,
                        slug: slug || _id,
                        stock: 5 // Default or prop
                    }}
                />
            )}
        </Link>
    );
}
