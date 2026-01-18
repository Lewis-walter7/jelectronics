'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <section className={styles.hero}>
            <div className={styles.glow} />

            <div className={`container ${styles.content}`}>
                {/* Mobile Search Bar (Only visible on mobile via CSS) */}
                <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className={styles.mobileSearchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className={styles.mobileSearchBtn}>🔍</button>
                </form>

                <span className={styles.badge}>New Stock Arrived</span>

                <h1 className={styles.title}>
                    Experience Technology <br /> Like Never Before
                </h1>

                <p className={styles.subtitle}>
                    Discover the latest phones, laptops, and premium accessories.
                    Elevate your lifestyle with Kenya's most trusted tech store.
                </p>

                <div className={styles.ctaGroup}>
                    <Link href="/products" className="btn btn-primary">
                        Shop Now
                    </Link>
                    <Link href="/products/laptops" className={`btn ${styles.secondaryBtn}`}>
                        View Laptops
                    </Link>
                </div>
            </div>
        </section>
    );
}
