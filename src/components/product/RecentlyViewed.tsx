'use client';

import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './RecentlyViewed.module.css';

export default function RecentlyViewed() {
    const { recentlyViewed } = useRecentlyViewed();

    if (recentlyViewed.length === 0) {
        return null;
    }

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.heading}>Recently Viewed</h2>
                <div className={styles.grid}>
                    {recentlyViewed.slice(0, 6).map((product) => (
                        <Link
                            key={product._id}
                            href={`/products/${product.category.toLowerCase()}/${product.slug}`}
                            className={styles.card}
                        >
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 768px) 50vw, 20vw"
                                />
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.title}>{product.name}</h3>
                                <div className={styles.priceRow}>
                                    {product.salePrice ? (
                                        <>
                                            <span className={styles.salePrice}>KES {product.salePrice.toLocaleString()}</span>
                                            <span className={styles.originalPrice}>KES {product.price.toLocaleString()}</span>
                                        </>
                                    ) : (
                                        <span className={styles.price}>KES {product.price.toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
