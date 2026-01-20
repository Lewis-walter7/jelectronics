import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.grid}`}>

                {/* Column 1: Products */}
                <div className={styles.col}>
                    <h4>Products</h4>
                    <ul>
                        <li><Link href="/products" className={styles.link}>All Products</Link></li>
                        <li><Link href="/products/phones" className={styles.link}>Smartphones</Link></li>
                        <li><Link href="/products/tablets" className={styles.link}>Tablets & iPads</Link></li>
                        <li><Link href="/products/audio" className={styles.link}>Audio</Link></li>
                        <li><Link href="/products/gaming" className={styles.link}>Gaming</Link></li>
                        <li><Link href="/products/wearables" className={styles.link}>Wearables</Link></li>
                        <li><Link href="/products/accessories" className={styles.link}>Accessories</Link></li>
                    </ul>
                </div>

                {/* Column 2: Support */}
                <div className={styles.col}>
                    <h4>Top-Notch Support</h4>
                    <div className={styles.infoItem}>
                        <span className={styles.icon}>📞</span>
                        <div>
                            <strong style={{ display: 'block', color: 'white' }}>Call Us:</strong>
                            <span>+254 700 123 456</span>
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.icon}>💬</span>
                        <div>
                            <strong style={{ display: 'block', color: 'white' }}>WhatsApp:</strong>
                            <span>+254 700 123 456</span>
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.icon}>✉️</span>
                        <div>
                            <strong style={{ display: 'block', color: 'white' }}>Email:</strong>
                            <span>sales@mobitoweraccesories.com</span>
                        </div>
                    </div>
                </div>

                {/* Column 3: Payments */}
                <div className={styles.col}>
                    <h4>Secure Payments</h4>
                    <div className={styles.infoItem}>
                        <span className={styles.icon}>🔒</span>
                        <span>Pay securely on delivery within Nairobi.</span>
                    </div>
                    <div className={styles.paymentMethods}>
                        <span className={styles.payTag}>M-Pesa</span>
                        <span className={styles.payTag}>Cash</span>
                    </div>
                </div>

                {/* Column 4: Location */}
                <div className={styles.col}>
                    <h4>Our Shop</h4>
                    <div className={styles.infoItem}>
                        <span className={styles.icon}>📍</span>
                        <div style={{ lineHeight: '1.6' }}>
                            <strong>MobiTower HQ</strong><br />
                            Bihi Towers, Basement 1<br />
                            Shop B10, Moi Avenue<br />
                            Nairobi CBD
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className={`container ${styles.bottomBar}`}>
                <div className={styles.copyright}>
                    © {new Date().getFullYear()} MobiTower Accessories. All rights reserved.
                </div>
                <div className={styles.bottomLinks}>
                    <Link href="/about" className={styles.link}>About Us</Link>
                    <Link href="/faq" className={styles.link}>FAQ</Link>
                    <Link href="/delivery" className={styles.link}>Delivery Terms</Link>
                    <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
}
