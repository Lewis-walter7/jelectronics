'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initial state from URL
    const initialMin = searchParams.get('minPrice') || '';
    const initialMax = searchParams.get('maxPrice') || '';
    const initialColors = searchParams.get('color')?.split(',') || [];
    const initialStorage = searchParams.get('storage')?.split(',') || [];

    const [minPrice, setMinPrice] = useState(initialMin);
    const [maxPrice, setMaxPrice] = useState(initialMax);
    const [selectedColors, setSelectedColors] = useState<string[]>(initialColors);
    const [selectedStorage, setSelectedStorage] = useState<string[]>(initialStorage);

    // Common options (could be fetched dynamically, but hardcoded for now)
    const colorOptions = ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Green', 'Purple', 'Grey', 'Titanium'];
    const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];

    // Debounce price update
    useEffect(() => {
        const handler = setTimeout(() => {
            applyFilters();
        }, 500);
        return () => clearTimeout(handler);
    }, [minPrice, maxPrice]);

    // Apply filters immediately for checkboxes
    useEffect(() => {
        applyFilters();
    }, [selectedColors, selectedStorage]);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (minPrice) params.set('minPrice', minPrice);
        else params.delete('minPrice');

        if (maxPrice) params.set('maxPrice', maxPrice);
        else params.delete('maxPrice');

        if (selectedColors.length > 0) params.set('color', selectedColors.join(','));
        else params.delete('color');

        if (selectedStorage.length > 0) params.set('storage', selectedStorage.join(','));
        else params.delete('storage');

        // Reset page to 1 if we had pagination (optional future proofing)
        // params.delete('page'); 

        router.push(`/products?${params.toString()}`);
    };

    const toggleColor = (color: string) => {
        if (selectedColors.includes(color)) {
            setSelectedColors(selectedColors.filter(c => c !== color));
        } else {
            setSelectedColors([...selectedColors, color]);
        }
    };

    const toggleStorage = (storage: string) => {
        if (selectedStorage.includes(storage)) {
            setSelectedStorage(selectedStorage.filter(s => s !== storage));
        } else {
            setSelectedStorage([...selectedStorage, storage]);
        }
    };

    return (
        <div style={{ background: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'white' }}>Filters</h3>

            {/* Price Filter */}
            <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem', textTransform: 'uppercase' }}>Price Range (KES)</h4>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        style={{
                            background: '#0a0a0a', border: '1px solid #333', color: 'white',
                            padding: '8px', borderRadius: '6px', width: '100%', fontSize: '0.9rem'
                        }}
                    />
                    <span style={{ color: '#555' }}>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        style={{
                            background: '#0a0a0a', border: '1px solid #333', color: 'white',
                            padding: '8px', borderRadius: '6px', width: '100%', fontSize: '0.9rem'
                        }}
                    />
                </div>
            </div>

            {/* Color Filter */}
            <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem', textTransform: 'uppercase' }}>Color</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {colorOptions.map(color => (
                        <label key={color} style={{
                            display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                            fontSize: '0.85rem', color: selectedColors.includes(color) ? 'white' : '#aaa',
                            background: selectedColors.includes(color) ? '#333' : 'transparent',
                            padding: '4px 8px', borderRadius: '4px', border: '1px solid #333'
                        }}>
                            <input
                                type="checkbox"
                                checked={selectedColors.includes(color)}
                                onChange={() => toggleColor(color)}
                                style={{ display: 'none' }}
                            />
                            {color}
                        </label>
                    ))}
                </div>
            </div>

            {/* Storage Filter */}
            <div>
                <h4 style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem', textTransform: 'uppercase' }}>Storage</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {storageOptions.map(storage => (
                        <label key={storage} style={{
                            display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                            fontSize: '0.85rem', color: selectedStorage.includes(storage) ? 'white' : '#aaa',
                            background: selectedStorage.includes(storage) ? '#333' : 'transparent',
                            padding: '4px 8px', borderRadius: '4px', border: '1px solid #333'
                        }}>
                            <input
                                type="checkbox"
                                checked={selectedStorage.includes(storage)}
                                onChange={() => toggleStorage(storage)}
                                style={{ display: 'none' }}
                            />
                            {storage}
                        </label>
                    ))}
                </div>
            </div>

            <button
                onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    setSelectedColors([]);
                    setSelectedStorage([]);
                    router.push('/products');
                }}
                style={{
                    marginTop: '2rem', width: '100%', padding: '10px',
                    background: 'transparent', border: '1px dashed #444',
                    color: '#888', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem'
                }}
            >
                Reset Filters
            </button>
        </div>
    );
}
