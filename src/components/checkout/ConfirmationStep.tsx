'use client';
import Link from 'next/link';
import styles from './CheckoutSteps.module.css';

export default function ConfirmationStep() {
    return (
        <div className={styles.stepContainer} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
            <h2 className={styles.title}>Order Confirmed!</h2>
            <p className={styles.subtitle} style={{ maxWidth: '400px', margin: '0 auto 2rem auto' }}>
                Thank you for your purchase. We have received your order and will contact you shortly to arrange delivery.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '8px', display: 'inline-block', marginBottom: '2rem' }}>
                <span style={{ display: 'block', fontSize: '0.9rem', color: '#aaa' }}>Order Reference</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '2px' }}>#JE-{Math.floor(Math.random() * 10000)}</span>
            </div>

            <div>
                <Link href="/products">
                    <button className={styles.actionBtn} style={{ maxWidth: '300px' }}>
                        Continue Shopping
                    </button>
                </Link>
            </div>
        </div>
    );
}
