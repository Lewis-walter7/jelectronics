'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global Error caught:', error);
    }, [error]);

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
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#f44336' }}>
                Something went wrong
            </h1>
            <p style={{ color: '#888', maxWidth: '500px', marginBottom: '2rem', lineHeight: '1.6' }}>
                We apologize for the inconvenience. An unexpected error has occurred.
                Our team has been notified.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    style={{
                        padding: '12px 24px',
                        background: 'transparent',
                        border: '1px solid #444',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    Try again
                </button>
                <a
                    href="/"
                    style={{
                        padding: '12px 24px',
                        background: '#ff6b00',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    Return Home
                </a>
            </div>
            {process.env.NODE_ENV === 'development' && (
                <div style={{ marginTop: '2rem', padding: '1rem', background: '#111', borderRadius: '8px', textAlign: 'left', maxWidth: '800px', overflow: 'auto' }}>
                    <p style={{ color: '#f44336', fontWeight: 'bold' }}>Error Details (Dev Only):</p>
                    <pre style={{ fontSize: '0.85rem', color: '#ccc' }}>{error.message}</pre>
                </div>
            )}
        </div>
    );
}
