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
                    // Sort to match order of compareList for consistency
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
                                'Main Camera Features': 'Main Camera',
                                'Camera Features': 'Main Camera',
                                'Rear Camera': 'Main Camera',
                                'Front Camera': 'Selfie Camera',
                                'Processor Type': 'Processor',
                                'RAM Information': 'RAM',
                                'Storage Support': 'Storage',
                                'Available Colors': 'Colors',
                                'Body Weight': 'Weight',
                            };

                            Object.entries(product.specifications).forEach(([key, val]) => {
                                const cleanKey = key.trim();
                                const targetKey = ALIASES[cleanKey] || cleanKey;
                                // If multiple source keys map to same target, join them
                                if (normalizedSpecs[targetKey]) {
                                    normalizedSpecs[targetKey] += ` / ${val}`;
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

    // Collect all unique keys from all products
    const allKeys = new Set<string>();
    detailedProducts.forEach(p => {
        if (p.specifications) {
            Object.keys(p.specifications).forEach(key => allKeys.add(key));
        }
    });
    // Convert to Array
    const keysArray = Array.from(allKeys);

    // Prioritize specific keys
    const priorityKeys = ['Display', 'Processor', 'RAM', 'Storage', 'Camera', 'Battery', 'OS'];
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
            <h1 style={{ color: 'white', marginBottom: '30px', textAlign: 'center' }}>Product Comparison</h1>

            {loading ? (
                <div style={{ color: '#888', textAlign: 'center' }}>Loading specs...</div>
            ) : (
                <div style={{ overflowX: 'auto', background: '#111', borderRadius: '16px', padding: '20px', border: '1px solid #222' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '15px', borderBottom: '1px solid #333', minWidth: '150px' }}></th>
                                {detailedProducts.map(product => (
                                    <th key={product._id} style={{ padding: '15px', borderBottom: '1px solid #333', minWidth: '250px', position: 'relative' }}>
                                        <button
                                            onClick={() => removeFromCompare(product._id)}
                                            style={{ position: 'absolute', top: '5px', right: '5px', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1.2rem' }}
                                        >
                                            &times;
                                        </button>
                                        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 10px' }}>
                                            <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'contain' }} />
                                        </div>
                                        <Link href={`/product/${product._id}`} style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', display: 'block', marginBottom: '5px' }}>
                                            {product.name}
                                        </Link>
                                        <div style={{ color: '#0ea5e9', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                            KES {product.price.toLocaleString()}
                                        </div>
                                        <button
                                            onClick={() => addToCart({ ...product, id: product._id, quantity: 1 })}
                                            style={{ marginTop: '10px', background: '#222', color: 'white', border: '1px solid #444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                                        >
                                            Add to Cart
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* General Category */}
                            <tr>
                                <td style={{ padding: '15px', borderBottom: '1px solid #222', fontWeight: 'bold', color: '#888' }}>Category</td>
                                {detailedProducts.map(product => (
                                    <td key={product._id} style={{ padding: '15px', borderBottom: '1px solid #222', textAlign: 'center' }}>
                                        {product.category}
                                    </td>
                                ))}
                            </tr>

                            {/* Dynamic Specs */}
                            {sortedKeys.map(key => (
                                <tr key={key}>
                                    <td style={{ padding: '15px', borderBottom: '1px solid #222', fontWeight: 'bold', color: '#888' }}>{key}</td>
                                    {detailedProducts.map(product => {
                                        const value = product.specifications?.[key];
                                        return (
                                            <td key={product._id} style={{ padding: '15px', borderBottom: '1px solid #222', textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                                                {value || '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
