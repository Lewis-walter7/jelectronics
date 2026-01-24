'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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

    const categories = [
        {
            name: 'Smartphones',
            slug: 'phones',
            image: '/phones.png',
            subCategories: [
                { name: 'Samsung Phones', slug: 'phones?brand=samsung' },
                { name: 'iPhone', slug: 'phones?brand=apple' },
                { name: 'Nothing Phones', slug: 'phones?brand=nothing' },
                { name: 'Google Pixel Phones', slug: 'phones?brand=pixel' },
            ]
        },
        {
            name: 'Gaming',
            slug: 'gaming',
            image: '/gaming.png',
            subCategories: [
                { name: 'Accessories', slug: 'gaming?type=accessories' },
                { name: 'Gaming Console', slug: 'gaming?type=console' },
                { name: 'Gaming Controllers', slug: 'gaming?type=controller' },
                { name: 'Gaming Headsets', slug: 'gaming?type=headset' },
            ]
        },
        {
            name: 'Audio',
            slug: 'audio',
            image: '/audio.png',
            subCategories: [
                { name: 'Buds', slug: 'audio?type=buds' },
                { name: 'Headphones', slug: 'audio?type=headphones' },
                { name: 'Speakers', slug: 'audio?type=speakers' },
                { name: 'Soundbar', slug: 'audio?type=soundbar' },
            ]
        },
        {
            name: 'Smartwatch',
            slug: 'wearables',
            image: '/wearables.png',
            subCategories: [
                { name: 'Smartwatches', slug: 'wearables?type=smartwatch' },
                { name: 'Apple Watch', slug: 'wearables?brand=apple' },
                { name: 'Galaxy Watch', slug: 'wearables?brand=samsung' },
                { name: 'Smart Bands', slug: 'wearables?type=smartband' },
            ]
        },
        {
            name: 'Accessories',
            slug: 'accessories',
            image: '/accessories.png',
            subCategories: [
                { name: 'Apple Accessories', slug: 'accessories?brand=apple' },
                { name: 'Samsung Accessories', slug: 'accessories?brand=samsung' },
                { name: 'Chargers', slug: 'accessories?type=chargers' },
                { name: 'Powerbank', slug: 'accessories?type=powerbank' },
            ]
        },
        {
            name: 'Storage',
            slug: 'accessories',
            image: '/drive.webp',
            subCategories: [
                { name: 'Flash Drives', slug: 'accessories?type=flashdrives' },
                { name: 'Hard Drives', slug: 'accessories?type=harddisks' },
                { name: 'Memory Cards', slug: 'accessories?type=memorycards' },
                { name: 'USB Hubs', slug: 'accessories?type=usbhubs' },
            ]
        },
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

                <h2 className={styles.categoriesTitle}>Shop by Category</h2>

                <div className={styles.categoriesGrid}>
                    {categories.map((category) => (
                        <div key={category.slug} className={styles.categoryCard}>
                            <div className={styles.categoryImageWrapper}>
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    width={120}
                                    height={120}
                                    className={styles.categoryImage}
                                />
                            </div>
                            <div className={styles.categoryContent}>
                                <h3 className={styles.categoryName}>{category.name}</h3>
                                <ul className={styles.subCategoryList}>
                                    {category.subCategories.map((sub, idx) => (
                                        <li key={idx}>
                                            <Link href={`/products/${sub.slug}`} className={styles.subCategoryLink}>
                                                {sub.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={`/products/${category.slug}`} className={styles.shopMoreLink}>
                                    Shop More &gt;&gt;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
