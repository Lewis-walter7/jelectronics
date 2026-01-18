'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './admin-layout.module.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh(); // Clear client cache
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div className={styles.container}>
            {/* Mobile Sidebar Overlay */}
            <div
                className={`${styles.overlay} ${isSidebarOpen ? styles.visible : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    JElectronics <span style={{ color: '#ff6b00', fontSize: '0.8rem' }}>Admin</span>
                </div>

                <nav className={styles.nav}>
                    <Link href="/admin/dashboard" className={styles.link} onClick={() => setIsSidebarOpen(false)}>📊 Dashboard</Link>
                    <Link href="/admin/products" className={styles.link} onClick={() => setIsSidebarOpen(false)}>📦 Products</Link>
                    <button disabled className={styles.link} style={{ opacity: 0.5, cursor: 'not-allowed', textAlign: 'left', border: 'none', background: 'transparent' }}>🚚 Orders (Soon)</button>

                    <div className={styles.footer}>
                        <Link href="/" className={styles.link} style={{ fontSize: '0.85rem', color: '#888' }}>
                            ↪ Back to Shop
                        </Link>
                        <button
                            onClick={handleLogout}
                            className={styles.link}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#f44336',
                                cursor: 'pointer',
                                textAlign: 'left',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.95rem'
                            }}
                        >
                            🚪 Sign Out
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                {/* Mobile Header */}
                <header className={styles.mobileHeader}>
                    <button
                        className={styles.hamburgerBtn}
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        ☰
                    </button>
                    <span className={styles.logo}>JElectronics Admin</span>
                    <div style={{ width: '32px' }}></div> {/* Spacer for alignment */}
                </header>

                {children}
            </main>
        </div>
    );
}
