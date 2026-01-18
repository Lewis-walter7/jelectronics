'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Use navigation for App Router
import styles from './Navbar.module.css';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const { totalItems } = useCart();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            // Optional: Close mobile menu if open
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.inner}`}>

                {/* LEFT: Menu & Logo */}
                <div className={styles.leftSection}>
                    <div className={styles.dropdownWrapper}>
                        <button className={styles.menuBtn}>
                            <span className={styles.menuIcon}>☰</span>
                            <span>Menu</span>
                        </button>

                        {/* Dropdown Content */}
                        <div className={styles.dropdownMenu}>
                            <div className={styles.menuItem}>
                                <Link href="/products" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>All Products</Link>
                            </div>

                            <div className={styles.menuItem}>
                                <span>Phones & Tablets</span>
                                <span style={{ fontSize: '0.8rem' }}>›</span>
                                {/* Submenu */}
                                <div className={styles.subMenu}>
                                    <Link href="/products/phones?brand=apple" className={styles.subMenuItem}>Apple</Link>
                                    <Link href="/products/phones?brand=samsung" className={styles.subMenuItem}>Samsung</Link>
                                    <Link href="/products/phones?brand=tecno" className={styles.subMenuItem}>Tecno</Link>
                                    <Link href="/products/phones?brand=xiaomi" className={styles.subMenuItem}>Xiaomi</Link>
                                </div>
                            </div>

                            <div className={styles.menuItem}>
                                <span>Computing</span>
                                <span style={{ fontSize: '0.8rem' }}>›</span>
                                <div className={styles.subMenu}>
                                    <Link href="/products/laptops" className={styles.subMenuItem}>Laptops</Link>
                                    <Link href="/products/desktops" className={styles.subMenuItem}>Desktops</Link>
                                    <Link href="/products/accessories" className={styles.subMenuItem}>Accessories</Link>
                                </div>
                            </div>

                            <div className={styles.menuItem}>
                                <Link href="/products/accessories" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>Accessories</Link>
                            </div>
                        </div>
                    </div>

                    <Link href="/" className={styles.logo}>
                        JElectronics
                    </Link>
                </div>

                {/* CENTER: Search Bar */}
                <div className={styles.searchSection}>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className={styles.searchBtn} title="Search">
                            🔍
                        </button>
                    </form>
                </div>

                {/* RIGHT: Cart */}
                <div className={styles.rightSection}>
                    <Link href="/wishlist" style={{ textDecoration: 'none', marginRight: '1rem' }}>
                        <div className={styles.cartBtn} title="My Wishlist"> {/* Reusing cart btn styles for consistency */}
                            ❤️
                            <span className={styles.cartLabel}>Saved</span>
                        </div>
                    </Link>

                    <Link href="/checkout" style={{ textDecoration: 'none' }}>
                        <div className={styles.cartBtn} title="View Cart">
                            🛒
                            <span className={styles.cartLabel}>Cart</span>
                            {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
                        </div>
                    </Link>
                </div>

            </div>
        </nav>
    );
}
