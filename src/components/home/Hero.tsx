import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.glow} />

            <div className={`container ${styles.content}`}>
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
