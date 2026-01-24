import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.grid}`}>

                {/* Column 1: Brand & About */}
                <div className={styles.col}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--color-text-main)', marginBottom: '1rem' }}>
                            MobiTower
                        </h3>
                    </Link>
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                        Your premium destination for the latest gadgets, accessories, and tech essentials in Nairobi. Quality guaranteed.
                    </p>
                    {/* <div className={styles.socials}>
                        <a href="#" className={styles.socialIcon}>IG</a>
                        <a href="#" className={styles.socialIcon}>FB</a>
                        <a href="#" className={styles.socialIcon}>TW</a>
                    </div> */}
                </div>

                {/* Column 2: Shop */}
                <div className={styles.col}>
                    <h4>Shop</h4>
                    <ul>
                        <li><Link href="/products/phones" className={styles.link}>Smartphones</Link></li>
                        <li><Link href="/products/tablets" className={styles.link}>Tablets & iPads</Link></li>
                        <li><Link href="/products/audio" className={styles.link}>Audio</Link></li>
                        <li><Link href="/products/gaming" className={styles.link}>Gaming</Link></li>
                        <li><Link href="/products/storage" className={styles.link}>Storage</Link></li>
                        <li><Link href="/products/accessories" className={styles.link}>Accessories</Link></li>
                    </ul>
                </div>

                {/* Column 3: Support & Policies */}
                <div className={styles.col}>
                    <h4>Support</h4>
                    <ul>
                        <li><Link href="/shipping-policy" className={styles.link}>Shipping Policy</Link></li>
                        <li><Link href="/returns" className={styles.link}>Returns & Exchanges</Link></li>
                        <li><Link href="/faq" className={styles.link}>FAQs</Link></li>
                        <li><Link href="/contact" className={styles.link}>Contact Us</Link></li>
                        <li><Link href="/privacy" className={styles.link}>Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Column 4: Contact Us */}
                <div className={styles.col}>
                    <h4>Contact Us</h4>
                    <div className={styles.infoItem}>
                        <span className={styles.icon}>📍</span>
                        <span>Bihi Towers, Basement 1, Shop B10<br />Moi Avenue, Nairobi CBD</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.icon}>📞</span>
                        <a href="tel:+254728882910" className={styles.link} style={{ display: 'inline' }}>+254 728 882 910</a>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.icon}>✉️</span>
                        <a href="mailto:sales@mobitoweraccesories.com" className={styles.link} style={{ display: 'inline' }}>sales@mobitoweraccesories.com</a>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className={`container ${styles.bottomBar}`}>
                <div className={styles.copyright}>
                    © {new Date().getFullYear()} MobiTower Accessories. All rights reserved.
                    <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span>
                    Designed & Developed by <a href="https://lewisindusa.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Lewis Indusa</a>
                </div>
                <div className={styles.bottomLinks}>
                    <Link href="/terms" className={styles.link}>Terms of Service</Link>
                </div>
            </div>
        </footer >
    );
}
