'use client';

import styles from './TrustBadges.module.css';

export default function TrustBadges() {
    const badges = [
        {
            icon: '🚚',
            title: 'Free Delivery',
            description: 'Free delivery within Nairobi CBD'
        },
        {
            icon: '💳',
            title: 'Secure Payment',
            description: 'M-Pesa, Bank Transfer & More'
        },
        {
            icon: '✅',
            title: '100% Genuine',
            description: 'All products are authentic'
        },
        {
            icon: '🔄',
            title: '7-Day Returns',
            description: 'Easy return policy'
        },
        {
            icon: '⚡',
            title: 'Same Day Dispatch',
            description: 'Order before 2 PM'
        },
        {
            icon: '🏆',
            title: '10,000+ Customers',
            description: 'Trusted nationwide'
        }
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.heading}>Why Choose JElectronics</h2>
                <div className={styles.grid}>
                    {badges.map((badge, index) => (
                        <div key={index} className={styles.badge}>
                            <div className={styles.icon}>{badge.icon}</div>
                            <div className={styles.content}>
                                <h3 className={styles.title}>{badge.title}</h3>
                                <p className={styles.description}>{badge.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
