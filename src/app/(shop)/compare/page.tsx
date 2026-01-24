'use client';

import { useCompare } from '@/context/CompareContext';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DetailedProduct {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    slug: string;
    specifications: Record<string, string>;
}

export default function ComparePage() {
    const { compareList, removeFromCompare } = useCompare();
    const { addToCart } = useCart();
    const [detailedProducts, setDetailedProducts] = useState<DetailedProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDiffOnly, setShowDiffOnly] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (compareList.length === 0) {
                setDetailedProducts([]);
                return;
            }

            setLoading(true);
            try {
                const ids = compareList.map(item => item._id).join(',');
                const res = await fetch(`/api/products?ids=${ids}`);
                const data = await res.json();
                if (data.success) {
                    const keyNormalizationMap = new Map<string, string>();
                    // Sort to match order of compareList for consistency
                    const sorted = compareList.map(item => {
                        const product = data.data.find((p: any) => p._id === item._id);
                        if (!product) return null;

                        // Normalize specifications
                        const normalizedSpecs: Record<string, string> = {};
                        if (product.specifications) {
                            const ALIASES: Record<string, string> = {
                                'Display Type': 'Display',
                                'Screen': 'Display',
                                'Display Size': 'Display',
                                'Main Camera Features': 'Main Camera',
                                'Camera Features': 'Main Camera',
                                'Rear Camera': 'Main Camera',
                                'Front Camera': 'Selfie Camera',
                                'Processor Type': 'Processor',
                                'RAM Information': 'RAM',
                                'Storage Support': 'Storage',
                                'Internal Storage': 'Storage',
                                'Storage Specs': 'Storage',
                                'Card Slot': 'Memory Card',
                                'Model Name': 'Model',
                                'Sensor': 'Sensors',
                                'Available Colors': 'Colors',
                                'Body Weight': 'Weight',
                                'Sim': 'Sim Card',
                                'SIM': 'Sim Card',
                                'SimCard': 'Sim Card',
                                'Simcard': 'Sim Card',
                                'Fast Charging': 'Charging',
                                'Fastcharging': 'Charging',
                                'Body Size': 'Dimensions',
                                'Size': 'Dimensions',
                                'Body Dimensions': 'Dimensions',
                                'Dimensions': 'Dimensions',
                                'Operating System': 'OS',
                                'Network': 'Network Technology',
                                'Technology': 'Network Technology',
                                'Battery': 'Battery',
                                'Battery Type': 'Battery',
                                'Battery Capacity': 'Battery',
                            };

                            Object.entries(product.specifications).forEach(([key, val]) => {
                                const cleanKey = key.trim();
                                if (!cleanKey) return;

                                // 1. Case-insensitive lookup in ALIASES
                                const lowerKey = cleanKey.toLowerCase();
                                const foundAliasKey = Object.keys(ALIASES).find(k => k.toLowerCase() === lowerKey);
                                let targetKey = foundAliasKey ? ALIASES[foundAliasKey] : cleanKey;

                                // 2. Cross-product normalization (ensure "Network technology" and "Network Technology" merge)
                                const lowerTarget = targetKey.toLowerCase();
                                if (keyNormalizationMap.has(lowerTarget)) {
                                    targetKey = keyNormalizationMap.get(lowerTarget)!;
                                } else {
                                    keyNormalizationMap.set(lowerTarget, targetKey);
                                }

                                if (normalizedSpecs[targetKey]) {
                                    // Avoid duplicating exact same value
                                    if (!normalizedSpecs[targetKey].includes(val as string)) {
                                        normalizedSpecs[targetKey] += ` / ${val}`;
                                    }
                                } else {
                                    normalizedSpecs[targetKey] = val as string;
                                }
                            });
                        }

                        return { ...product, specifications: normalizedSpecs };
                    }).filter(Boolean);
                    setDetailedProducts(sorted);
                }
            } catch (error) {
                console.error('Failed to fetch comparison details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [compareList]);

    if (compareList.length === 0) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <h1>No products to compare</h1>
                <p style={{ color: '#888', marginBottom: '1rem' }}>Select products using the compare button on product cards.</p>
                <Link href="/products" style={{ background: '#0ea5e9', padding: '10px 20px', borderRadius: '8px', color: 'white', textDecoration: 'none' }}>
                    Browse Products
                </Link>
            </div>
        );
    }

    // --- Smart Logic Helpers ---

    const parseNumber = (val: string): number => {
        if (!val) return 0;
        // Extract first number found. Handle "8GB", "5000mAh", "KES 100,000"
        const clean = val.replace(/,/g, '');
        const match = clean.match(/(\d+(\.\d+)?)/);
        return match ? parseFloat(match[0]) : 0;
    };

    const getWinnerIndex = (key: string, values: string[]): number | null => {
        // Heuristics for numeric comparison
        const numericKeys = ['RAM', 'Storage', 'Battery', 'Camera', 'MP', 'Hz', 'Refresh Rate'];
        const isNumeric = numericKeys.some(k => key.includes(k));

        // Price: Lower is better
        const isPrice = key === 'Price';

        if (isPrice) {
            const numbers = values.map(parseNumber);
            const validNumbers = numbers.filter(n => n > 0);
            if (validNumbers.length < 2) return null; // Need comparison
            const min = Math.min(...validNumbers);
            // Return index of ALL matches (could be tie) - simplifies to first winner for now
            // Better: highlighting handled in rendering if checking value match
            return numbers.findIndex(n => n === min);
        }

        if (isNumeric) {
            const numbers = values.map(parseNumber);
            const validNumbers = numbers.filter(n => n > 0);
            if (validNumbers.length < 2) return null;
            const max = Math.max(...validNumbers);
            return numbers.findIndex(n => n === max);
        }

        return null; // Qualitative keys (Display type, OS) - no automatic winner
    };

    const isRowDifferent = (values: (string | undefined)[]): boolean => {
        const first = values[0];
        return values.some(v => v !== first);
    };

    // Collect keys
    const allKeys = new Set<string>();
    detailedProducts.forEach(p => {
        if (p.specifications) Object.keys(p.specifications).forEach(key => allKeys.add(key));
    });
    const keysArray = Array.from(allKeys);
    const priorityKeys = ['Model', 'Network Technology', 'SIM Card', 'Display', 'Processor', 'RAM', 'Storage', 'Memory Card', 'Main Camera', 'Selfie Camera', 'Battery', 'Charging', 'Sensors', 'Dimensions', 'Weight', 'Colors', 'OS'];
    const sortedKeys = keysArray.sort((a, b) => {
        const indexA = priorityKeys.findIndex(k => a.includes(k));
        const indexB = priorityKeys.findIndex(k => b.includes(k));
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: 'white', margin: 0 }}>Product Comparison</h1>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc', cursor: 'pointer', background: '#222', padding: '8px 16px', borderRadius: '8px' }}>
                    <input
                        type="checkbox"
                        checked={showDiffOnly}
                        onChange={(e) => setShowDiffOnly(e.target.checked)}
                        style={{ accentColor: '#0ea5e9' }}
                    />
                    Show Differences Only
                </label>
            </div>

            {loading ? (
                <div style={{ color: '#888', textAlign: 'center', padding: '50px' }}>Loading specs...</div>
            ) : (
                <div style={{ overflowX: 'auto', background: '#111', borderRadius: '16px', border: '1px solid #222', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc' }}>
                        <thead>
                            <tr>
                                <th style={{
                                    textAlign: 'left', padding: '20px', borderBottom: '1px solid #333', minWidth: '150px',
                                    background: '#111', position: 'sticky', left: 0, zIndex: 10
                                }}></th>
                                {detailedProducts.map(product => (
                                    <th key={product._id} style={{
                                        padding: '20px', borderBottom: '1px solid #333', minWidth: '280px', position: 'relative', background: '#111', verticalAlign: 'top'
                                    }}>
                                        <button
                                            onClick={() => removeFromCompare(product._id)}
                                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            &times;
                                        </button>
                                        <div style={{ position: 'relative', width: '100%', height: '180px', marginBottom: '15px' }}>
                                            <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'contain' }} />
                                        </div>
                                        <Link href={`/products/${product.category}/${product.slug}`} style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem', display: 'block', marginBottom: '8px', lineHeight: '1.4' }}>
                                            {product.name}
                                        </Link>
                                        <div style={{ color: '#0ea5e9', fontWeight: '800', fontSize: '1.3rem' }}>
                                            KES {product.price.toLocaleString()}
                                        </div>
                                        <button
                                            onClick={() => addToCart({ ...product, id: product._id, quantity: 1 })}
                                            style={{ marginTop: '15px', width: '100%', background: '#0ea5e9', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                                        >
                                            Add to Cart
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '15px 20px', borderBottom: '1px solid #222', fontWeight: 'bold', color: '#888', background: '#161616', position: 'sticky', left: 0 }}>Category</td>
                                {detailedProducts.map(product => (
                                    <td key={product._id} style={{ padding: '15px 20px', borderBottom: '1px solid #222', textAlign: 'center' }}>
                                        {product.category}
                                    </td>
                                ))}
                            </tr>

                            {sortedKeys.map(key => {
                                const values = detailedProducts.map(p => p.specifications?.[key] || '');
                                const isDiff = isRowDifferent(values);

                                if (showDiffOnly && !isDiff) return null;

                                const winnerIndex = getWinnerIndex(key, values);

                                return (
                                    <tr key={key} style={{ background: isDiff ? 'rgba(14, 165, 233, 0.03)' : 'transparent' }}>
                                        <td style={{
                                            padding: '15px 20px', borderBottom: '1px solid #222', fontWeight: '600', color: '#aaa',
                                            background: '#161616', position: 'sticky', left: 0, textTransform: 'capitalize'
                                        }}>
                                            {key}
                                        </td>
                                        {detailedProducts.map((product, idx) => {
                                            const value = product.specifications?.[key];
                                            const isWinner = winnerIndex === idx && isDiff;

                                            return (
                                                <td key={product._id} style={{
                                                    padding: '15px 20px', borderBottom: '1px solid #222', textAlign: 'center', whiteSpace: 'pre-wrap', lineHeight: '1.6',
                                                    color: isWinner ? '#4ade80' : '#ccc', fontWeight: isWinner ? '700' : '400',
                                                    background: isWinner ? 'rgba(74, 222, 128, 0.05)' : 'transparent'
                                                }}>
                                                    {value || '-'}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
