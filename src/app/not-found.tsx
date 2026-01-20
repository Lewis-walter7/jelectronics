import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Page Not Found - MobiTower Accessories',
    description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            background: '#050505',
            color: 'white'
        }}>
            <h1 style={{ fontSize: '6rem', fontWeight: 'bold', margin: 0, color: '#ff6b00' }}>404</h1>
            <h2 style={{ fontSize: '2rem', margin: '1rem 0' }}>Page Not Found</h2>
            <p style={{ color: '#888', maxWidth: '400px', marginBottom: '2rem', lineHeight: '1.6' }}>
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                href="/"
                style={{
                    padding: '12px 24px',
                    background: '#ff6b00',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'opacity 0.2s'
                }}
            >
                Return Home
            </Link>
        </div>
    );
}
