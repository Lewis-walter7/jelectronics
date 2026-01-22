'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';
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
    const { addToCart } = useCart();
    const { compareList, addToCompare, removeFromCompare } = useCompare();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const router = useRouter();

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
        <Link href={productLink} className={styles.card}>
            <div className={styles.imageWrapper}>
                <Image
                    src={imageUrl || images[0]}
                    alt={name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {salePrice && <span className={styles.badge}>SALE</span>}

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
                        background: isInWishlist(_id) ? '#ff4444' : 'rgba(0,0,0,0.6)',
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
                    title={isInWishlist(_id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist(_id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        </Link>
    );
}
