'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './wishlist.module.css';

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlistItems.length === 0) {
        return (
            <div className={styles.emptyState}>
                <h1>Your Wishlist is Empty</h1>
                <p>Start saving your favorite items!</p>
                <Link href="/products" className={styles.browseBtn}>
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>My Wishlist</h1>
            <div className={styles.grid}>
                {wishlistItems.map((item) => (
                    <div key={item._id} className={styles.card}>
                        <Link href={`/product/${item._id}`} className={styles.imageWrapper}>
                            <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                className={styles.image}
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </Link>
                        <div className={styles.content}>
                            <Link href={`/product/${item._id}`} className={styles.title}>
                                {item.name}
                            </Link>
                            <p className={styles.price}>KES {item.price.toLocaleString()}</p>

                            <div className={styles.actions}>
                                <button
                                    onClick={() => addToCart({ ...item, id: item._id, quantity: 1 })}
                                    className={styles.cartBtn}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => removeFromWishlist(item._id)}
                                    className={styles.removeBtn}
                                    title="Remove from Wishlist"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
