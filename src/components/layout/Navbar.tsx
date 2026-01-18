'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Use navigation for App Router
import styles from './Navbar.module.css';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const { totalItems } = useCart();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsMobileMenuOpen(false);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <nav className={styles.navbar}>
                <div className={`container ${styles.inner}`}>

                    {/* LEFT: Menu (Mobile) & Logo */}
                    <div className={styles.leftSection}>
                        {/* Hamburger for Mobile */}
                        <button className={styles.hamburgerBtn} onClick={toggleMobileMenu}>
                            <span className={styles.hamburgerIcon}>{isMobileMenuOpen ? '✕' : '☰'}</span>
                        </button>

                        {/* Desktop "Menu" Button (kept if desired, or hidden on mobile) */}
                        <div className={styles.desktopMenuWrapper}>
                            <div className={styles.dropdownWrapper}>
                                <button className={styles.menuBtn}>
                                    <span className={styles.menuIcon}>☰</span>
                                    <span>Menu</span>
                                </button>
                                {/* Dropdown Content - same as before */}
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.menuItem}>
                                        <Link href="/products" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>All Products</Link>
                                    </div>
                                    <div className={styles.menuItem}>
                                        <span>Phones & Tablets</span>
                                        <span style={{ fontSize: '0.8rem' }}>›</span>
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
                        </div>

                        <Link href="/" className={styles.logo}>
                            JElectronics
                        </Link>
                    </div>

                    {/* CENTER: Search Bar (Hidden on mobile initially, or moved to drawer) */}
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

                    {/* RIGHT: Cart & Saved */}
                    <div className={styles.rightSection}>
                        <Link href="/wishlist" className={styles.iconLink}>
                            <div className={styles.cartBtn} title="My Wishlist">
                                ❤️
                                <span className={styles.cartLabel}>Saved</span>
                            </div>
                        </Link>

                        <Link href="/checkout" className={styles.iconLink}>
                            <div className={styles.cartBtn} title="View Cart">
                                🛒
                                <span className={styles.cartLabel}>Cart</span>
                                {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
                            </div>
                        </Link>
                    </div>

                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className={`${styles.mobileMenuDrawer} ${isMobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.drawerHeader}>
                    <span className={styles.drawerTitle}>Menu</span>
                    <button className={styles.closeBtn} onClick={() => setIsMobileMenuOpen(false)}>✕</button>
                </div>

                <div className={styles.drawerContent}>


                    <nav className={styles.mobileNav}>
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavLink}>Home</Link>
                        <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavLink}>All Products</Link>

                        <div className={styles.mobileNavGroup}>
                            <span className={styles.mobileNavLabel}>Phones & Tablets</span>
                            <div className={styles.mobileNavSub}>
                                <Link href="/products/phones?brand=apple" onClick={() => setIsMobileMenuOpen(false)}>Apple</Link>
                                <Link href="/products/phones?brand=samsung" onClick={() => setIsMobileMenuOpen(false)}>Samsung</Link>
                                <Link href="/products/phones?brand=tecno" onClick={() => setIsMobileMenuOpen(false)}>Tecno</Link>
                                <Link href="/products/phones?brand=xiaomi" onClick={() => setIsMobileMenuOpen(false)}>Xiaomi</Link>
                            </div>
                        </div>

                        <div className={styles.mobileNavGroup}>
                            <span className={styles.mobileNavLabel}>Computing</span>
                            <div className={styles.mobileNavSub}>
                                <Link href="/products/laptops" onClick={() => setIsMobileMenuOpen(false)}>Laptops</Link>
                                <Link href="/products/desktops" onClick={() => setIsMobileMenuOpen(false)}>Desktops</Link>
                                <Link href="/products/accessories" onClick={() => setIsMobileMenuOpen(false)}>Accessories</Link>
                            </div>
                        </div>

                        <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavLink}>Wishlist</Link>
                        <Link href="/checkout" onClick={() => setIsMobileMenuOpen(false)} className={styles.mobileNavLink}>Cart</Link>
                    </nav>
                </div>
            </div>
        </>
    );
}
