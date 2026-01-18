'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

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
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                background: '#111',
                borderRight: '1px solid #222',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                position: 'fixed',
                height: '100vh',
                left: 0,
                top: 0
            }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                    JElectronics <span style={{ color: '#ff6b00', fontSize: '0.8rem' }}>Admin</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/admin/dashboard" style={linkStyle}>📊 Dashboard</Link>
                    <Link href="/admin/products" style={linkStyle}>📦 Products</Link>
                    <button disabled style={{ ...linkStyle, background: 'transparent', cursor: 'not-allowed', opacity: 0.5, textAlign: 'left', border: 'none' }}>🚚 Orders (Soon)</button>

                    <div style={{ marginTop: 'auto', borderTop: '1px solid #333', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link href="/" style={{ ...linkStyle, fontSize: '0.85rem', color: '#888' }}>
                            ↪ Back to Shop
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                ...linkStyle,
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

            {/* Main Content Area - Pushed right to accommodate fixed sidebar */}
            <main style={{ flex: 1, marginLeft: '250px', width: 'calc(100% - 250px)' }}>
                {children}
            </main>
        </div>
    );
}

const linkStyle = {
    color: '#ccc',
    textDecoration: 'none',
    padding: '10px 12px',
    borderRadius: '6px',
    transition: 'background 0.2s',
    display: 'block',
    fontSize: '0.95rem'
};
