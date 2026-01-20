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
    const [activeTab, setActiveTab] = useState<'categories' | 'menu'>('categories');
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
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

    // Data for Categories with Submenus
    const categories = [
        {
            name: 'Smartphones',
            slug: 'phones',
            subItems: [
                { name: 'Apple iPhone', slug: 'phones?brand=apple' },
                { name: 'Samsung Phones', slug: 'phones?brand=samsung' },
                { name: 'Infinix Phones', slug: 'phones?brand=infinix' },
                { name: 'Tecno Phones', slug: 'phones?brand=tecno' },
                { name: 'Xiaomi Phones', slug: 'phones?brand=xiaomi' },
                { name: 'Motorola Phones', slug: 'phones?brand=motorola' },
                { name: 'Nothing Phones', slug: 'phones?brand=nothing' },
                { name: 'OnePlus Phones', slug: 'phones?brand=oneplus' },
                { name: 'Blackview Phones', slug: 'phones?brand=blackview' },
                { name: 'Huawei Phones', slug: 'phones?brand=huawei' },
                { name: 'HMD Phones', slug: 'phones?brand=hmd' },
                { name: 'Honor Phones', slug: 'phones?brand=honor' },
                { name: 'Itel Phones', slug: 'phones?brand=itel' },
                { name: 'Oppo Phones', slug: 'phones?brand=oppo' },
                { name: 'Philips Phones', slug: 'phones?brand=philips' },
                { name: 'Pixel Phones', slug: 'phones?brand=pixel' },
                { name: 'Poco Phones', slug: 'phones?brand=poco' },
            ]
        },
        {
            name: 'Tablets & iPads',
            slug: 'tablets',
            subItems: [
                { name: 'Apple iPad', slug: 'tablets?brand=apple' },
                { name: 'Samsung Tablets', slug: 'tablets?brand=samsung' },
                { name: 'Tecno Tablets', slug: 'tablets?brand=tecno' },
                { name: 'Redmi Tablets', slug: 'tablets?brand=redmi' },
                { name: 'Xiaomi Tablets', slug: 'tablets?brand=xiaomi' },
                { name: 'Kids Tablets', slug: 'tablets?type=kids' },
                { name: 'Huawei Tablets', slug: 'tablets?brand=huawei' },
                { name: 'Idino Tablets', slug: 'tablets?brand=idino' },
                { name: 'Infinix Tablets', slug: 'tablets?brand=infinix' },
                { name: 'Lenovo Tablets', slug: 'tablets?brand=lenovo' },
                { name: 'OnePlus Tablets', slug: 'tablets?brand=oneplus' },
                { name: 'Oppo Tablets', slug: 'tablets?brand=oppo' },
                { name: 'Poco Tablets', slug: 'tablets?brand=poco' },
                { name: 'reMarkable Tablets', slug: 'tablets?brand=remarkable' },
                { name: 'Telzeal Tablets', slug: 'tablets?brand=telzeal' },
                { name: 'Vivo Tablets', slug: 'tablets?brand=vivo' },
            ]
        },
        {
            name: 'Audio',
            slug: 'audio',
            subItems: [
                { name: 'Buds', slug: 'audio?type=buds' },
                { name: 'Earphones', slug: 'audio?type=earphones' },
                { name: 'Headphones', slug: 'audio?type=headphones' },
                { name: 'Soundbar', slug: 'audio?type=soundbar' },
                { name: 'Speakers', slug: 'audio?type=speakers' },
            ]
        },
        {
            name: 'Gaming',
            slug: 'gaming',
            subItems: [
                { name: 'Gaming Consoles', slug: 'gaming?type=console' },
                { name: 'PlayStation Games', slug: 'gaming?type=games' },
                { name: 'Gaming Controller', slug: 'gaming?type=controller' },
                { name: 'Gaming Headsets', slug: 'gaming?type=headset' },
            ]
        },
        {
            name: 'Wearables',
            slug: 'wearables',
            subItems: [
                { name: 'Smartwatch', slug: 'wearables?type=smartwatch' },
                { name: 'Smart Bands', slug: 'wearables?type=smartband' },
                { name: 'Smart Ring', slug: 'wearables?type=ring' },
            ]
        },
        {
            name: 'Mobile Accessories',
            slug: 'accessories',
            subItems: [
                { name: 'Chargers', slug: 'accessories?type=chargers' },
                { name: 'Flash Drives', slug: 'accessories?type=flashdrives' },
                { name: 'Handheld Gimbals', slug: 'accessories?type=gimbals' },
                { name: 'Hard Disks', slug: 'accessories?type=harddisks' },
                { name: 'Memory Cards', slug: 'accessories?type=memorycards' },
                { name: 'Modems', slug: 'accessories?type=modems' },
                { name: 'Mouse', slug: 'accessories?type=mouse' },
                { name: 'Phone Covers', slug: 'accessories?type=covers' },
            ]
        }
    ];

    const toggleCategory = (slug: string) => {
        setExpandedCategory(expandedCategory === slug ? null : slug);
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

                        {/* Desktop "Menu" Button */}
                        <div className={styles.desktopMenuWrapper}>
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

                                    {categories.map((cat) => (
                                        <div key={cat.slug} className={styles.menuItem}>
                                            <Link href={`/products/${cat.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>{cat.name}</Link>
                                            <span style={{ fontSize: '0.8rem', marginLeft: 'auto', paddingLeft: '10px' }}>›</span>

                                            <div className={styles.subMenu}>
                                                {cat.subItems.map((sub, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={`/products/${sub.slug}`}
                                                        className={styles.subMenuItem}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <div className={styles.menuItem}>
                                        <Link href="/faq" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>FAQ</Link>
                                    </div>
                                    <div className={styles.menuItem}>
                                        <Link href="/about" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>About Us</Link>
                                    </div>
                                    <div className={styles.menuItem}>
                                        <Link href="/contact" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>Contact Us</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="/" className={styles.logo}>
                        MobiTower
                    </Link>

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
            <div
                className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div className={`${styles.mobileMenuDrawer} ${isMobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.drawerHeader} style={{ padding: 0, flexDirection: 'column', alignItems: 'stretch' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                        <button className={styles.closeBtn} onClick={() => setIsMobileMenuOpen(false)}>✕</button>
                    </div>

                    <div className={styles.tabContainer}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'categories' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('categories')}
                        >
                            CATEGORIES
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'menu' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('menu')}
                        >
                            MENU
                        </button>
                    </div>
                </div>

                <div className={styles.drawerContent} style={{ padding: 0 }}>
                    {activeTab === 'categories' ? (
                        <div className={styles.mobileList}>
                            {categories.map((cat) => (
                                <div key={cat.slug} className={styles.mobileListItem}>
                                    {/* Row: Name Link + Toggle Button */}
                                    <div className={styles.accordionRow}>
                                        <Link
                                            href={`/products/${cat.slug}`}
                                            className={styles.categoryLink}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {cat.name}
                                        </Link>
                                        <button
                                            className={`${styles.accordionToggle} ${expandedCategory === cat.slug ? styles.expanded : ''}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleCategory(cat.slug);
                                            }}
                                        >
                                            {expandedCategory === cat.slug ? '∨' : '›'}
                                        </button>
                                    </div>

                                    {/* Submenu List */}
                                    {expandedCategory === cat.slug && (
                                        <div className={styles.submenu}>
                                            {cat.subItems.map((sub, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={`/products/${sub.slug}`}
                                                    className={styles.submenuItem}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.mobileList}>
                            <div className={styles.mobileListItem} style={{ padding: 0 }}>
                                <div className={styles.accordionRow}>
                                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={styles.categoryLink}>
                                        Home
                                    </Link>
                                    <span style={{ padding: '0 20px', color: '#ccc' }}>›</span>
                                </div>
                            </div>
                            <div className={styles.mobileListItem} style={{ padding: 0 }}>
                                <div className={styles.accordionRow}>
                                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className={styles.categoryLink}>
                                        About Us
                                    </Link>
                                    <span style={{ padding: '0 20px', color: '#ccc' }}>›</span>
                                </div>
                            </div>
                            <div className={styles.mobileListItem} style={{ padding: 0 }}>
                                <div className={styles.accordionRow}>
                                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className={styles.categoryLink}>
                                        Contact Us
                                    </Link>
                                    <span style={{ padding: '0 20px', color: '#ccc' }}>›</span>
                                </div>
                            </div>
                            <div className={styles.mobileListItem} style={{ padding: 0 }}>
                                <div className={styles.accordionRow}>
                                    <Link href="/checkout" onClick={() => setIsMobileMenuOpen(false)} className={styles.categoryLink}>
                                        Shopping Cart
                                    </Link>
                                    <span style={{ padding: '0 20px', color: '#ccc' }}>›</span>
                                </div>
                            </div>
                            <div className={styles.mobileListItem} style={{ padding: 0 }}>
                                <div className={styles.accordionRow}>
                                    <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className={styles.categoryLink}>
                                        Wishlist
                                    </Link>
                                    <span style={{ padding: '0 20px', color: '#ccc' }}>›</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
