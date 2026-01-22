'use client';

import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import styles from './RecentlyViewed.module.css';
import ProductCard from './ProductCard';

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
                        <ProductCard
                            key={product._id}
                            _id={product._id}
                            name={product.name}
                            price={product.price}
                            salePrice={product.salePrice}
                            imageUrl={product.imageUrl}
                            category={product.category}
                            slug={product.slug}
                            description="" // Context doesn't store description, passing empty
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
