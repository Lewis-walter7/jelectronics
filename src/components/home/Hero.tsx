'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const carouselRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = 300;
            const newScrollLeft = carouselRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
            carouselRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const categories = [
        {
            name: 'Smartphones',
            slug: 'phones',
            image: '/phones.png'
        },
        {
            name: 'Tablets & iPads',
            slug: 'tablets',
            image: '/featuredphones.png'
        },
        {
            name: 'Audio',
            slug: 'audio',
            image: '/audio.png'
        },
        {
            name: 'Gaming',
            slug: 'gaming',
            image: '/gaming.png'
        },
        {
            name: 'Wearables',
            slug: 'wearables',
            image: '/wearables.png'
        },
        {
            name: 'Accessories',
            slug: 'accessories',
            image: '/accessories.png'
        }
    ];

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

                <h2 className={styles.categoriesTitle}>Shop by Category</h2>

                <div className={styles.carouselWrapper}>
                    <button
                        className={`${styles.carouselBtn} ${styles.carouselBtnLeft}`}
                        onClick={() => scrollCarousel('left')}
                        aria-label="Scroll left"
                    >
                        ‹
                    </button>

                    <div className={styles.categoriesGrid} ref={carouselRef}>
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/products/${category.slug}`}
                                className={styles.categoryCard}
                            >
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className={styles.categoryImage}
                                    sizes="(max-width: 768px) 50vw, 20vw"
                                />
                                <div className={styles.categoryOverlay}>
                                    <span className={styles.categoryName}>{category.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <button
                        className={`${styles.carouselBtn} ${styles.carouselBtnRight}`}
                        onClick={() => scrollCarousel('right')}
                        aria-label="Scroll right"
                    >
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}
