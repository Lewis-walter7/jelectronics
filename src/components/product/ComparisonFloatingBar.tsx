'use client';

import { useCompare } from '@/context/CompareContext';
import Link from 'next/link';
import Image from 'next/image';

export default function ComparisonFloatingBar() {
    const { compareList, clearCompare, removeFromCompare } = useCompare();

    if (compareList.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #333',
            borderRadius: '16px',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            zIndex: 1000,
            animation: 'slideUp 0.3s ease-out'
        }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: '#888', fontSize: '0.9rem', marginRight: '8px' }}>
                    Compare ({compareList.length}/3)
                </span>

                {compareList.map(item => (
                    <div key={item._id} style={{ position: 'relative', width: '40px', height: '40px' }}>
                        <Image
                            src={item.images[0]}
                            alt={item.name}
                            width={40}
                            height={40}
                            style={{ borderRadius: '6px', objectFit: 'cover', border: '1px solid #444' }}
                        />
                        <button
                            onClick={() => removeFromCompare(item._id)}
                            style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-8px',
                                background: '#ef4444',
                                color: 'white',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                fontSize: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ height: '24px', width: '1px', background: '#333' }}></div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    onClick={clearCompare}
                    style={{
                        background: 'transparent',
                        color: '#888',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Clear
                </button>
                <Link
                    href="/compare"
                    style={{
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                    }}
                >
                    Compare Now
                </Link>
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from { bottom: -100px; opacity: 0; }
                    to { bottom: 20px; opacity: 1; }
                }
            `}</style>
        </div>
    );
}
