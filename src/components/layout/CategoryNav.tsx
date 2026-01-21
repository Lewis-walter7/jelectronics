'use client';
import Link from 'next/link';
import styles from './CategoryNav.module.css';

export default function CategoryNav() {
    const categories = [
        { name: 'Samsung', href: '/products/phones?brand=samsung' },
        { name: 'Apple', href: '/products/phones?brand=apple' },
        { name: 'Smartphones', href: '/products/phones' },
        { name: 'Mobile Accessories', href: '/products/accessories' },
        { name: 'Audio', href: '/products/audio' },
        { name: 'Gaming', href: '/products/gaming' },
        { name: 'Storage', href: '/products/accessories?type=harddisks' },
        { name: 'Tablets', href: '/products/tablets' },
        { name: 'Content Creator Kit', href: '/products/accessories?type=gimbals' },
    ];

    return (
        <nav className={styles.categoryNav}>
            <div className={`container ${styles.inner}`}>
                <ul className={styles.categoryList}>
                    {categories.map((category, index) => (
                        <li key={index} className={styles.categoryItem}>
                            <Link href={category.href} className={styles.categoryLink}>
                                {category.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
