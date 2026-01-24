'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname, useParams } from 'next/navigation';

export default function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const params = useParams();
    const categoryParam = params.category as string | undefined;

    // Determine current category from URL or params
    // If we are on /products/phones, category is phones
    const category = categoryParam ? categoryParam.toLowerCase() : '';

    // Initial state from URL
    const initialMin = searchParams.get('minPrice') || '';
    const initialMax = searchParams.get('maxPrice') || '';
    const initialColors = searchParams.get('color')?.split(',') || [];
    const initialStorage = searchParams.get('storage')?.split(',') || [];
    const initialBrand = searchParams.get('brand') || '';

    const [minPrice, setMinPrice] = useState(initialMin);
    const [maxPrice, setMaxPrice] = useState(initialMax);
    const [selectedColors, setSelectedColors] = useState<string[]>(initialColors);
    const [selectedBrand, setSelectedBrand] = useState(initialBrand);

    // Common options
    const colorOptions = ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Green', 'Purple', 'Grey', 'Titanium'];
    const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];
    const brandOptions = ['Apple', 'Samsung', 'Infinix', 'Tecno', 'Oppo', 'Vivo', 'Xiaomi', 'Sony', 'Dell', 'HP'];

    // Category Specific configurations
    const categoryConfig: Record<string, { label: string; key: string; options: string[]; singleSelect?: boolean }[]> = {
        'phones': [
            { label: 'Storage', key: 'storage', options: storageOptions },
            { label: 'RAM', key: 'ram', options: ['4GB', '6GB', '8GB', '12GB', '16GB'] }
        ],
        'tablets': [
            { label: 'Storage', key: 'storage', options: storageOptions },
            { label: 'RAM', key: 'ram', options: ['4GB', '6GB', '8GB', '12GB', '16GB'] },
            { label: 'Screen Size', key: 'screenSize', options: ['8-10"', '10-12"', '12"+'] }
        ],
        'audio': [
            { label: 'Subcategory', key: 'type', options: ['Microphones', 'Buds', 'Earphones', 'Headphones', 'Soundbar', 'Speakers'], singleSelect: true },
            { label: 'Connectivity', key: 'connectivity', options: ['Wired', 'Wireless', 'Bluetooth'] }
        ],
        'gaming': [
            { label: 'Platform', key: 'platform', options: ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'PC'] },
            { label: 'Type', key: 'gameType', options: ['Console', 'Accessory', 'Game'] }
        ],
        'wearables': [
            { label: 'Type', key: 'wearableType', options: ['Smartwatch', 'Fitness Tracker', 'Band'] },
            { label: 'Strap Material', key: 'strap', options: ['Silicone', 'Leather', 'Metal', 'Nylon'] }
        ],
        'storage': [
            { label: 'Type', key: 'type', options: ['Hard Disks', 'SSD', 'Flash Drives', 'Memory Cards'], singleSelect: true },
            { label: 'Capacity', key: 'storage', options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB', '2TB', '4TB'] }
        ],
        'accessories': [
            { label: 'Subcategory', key: 'type', options: ['Chargers', 'Powerbanks', 'Cables', 'Screen Protectors', 'Phone Covers', 'Streamers', 'Flash Drives', 'Gimbals', 'Hard Disks', 'Memory Cards', 'Modems', 'Mouse'] }
        ]
    };

    // Get active filters for current category
    // We map generic terms (like phones, tablets) to the config keys if needed, 
    // but here we can just valid against keys
    const activeCategoryConfig = categoryConfig[category] || [];

    // State for dynamic filters
    const [dynamicFilters, setDynamicFilters] = useState<Record<string, string[]>>({});

    // Initialize dynamic filters from URL
    useEffect(() => {
        const newFilters: Record<string, string[]> = {};
        activeCategoryConfig.forEach(config => {
            const val = searchParams.get(config.key);
            if (val) {
                newFilters[config.key] = val.split(',');
            }
        });

        // Deep compare to avoid infinite loop
        if (JSON.stringify(newFilters) !== JSON.stringify(dynamicFilters)) {
            setDynamicFilters(newFilters);
        }
    }, [searchParams, category]);

    const toggleDynamicFilter = (key: string, value: string, isSingleSelect?: boolean) => {
        setDynamicFilters(prev => {
            const current = prev[key] || [];

            if (isSingleSelect) {
                // If clicking the already selected one, allow toggle off
                if (current.includes(value)) {
                    return { ...prev, [key]: [] };
                }
                // Otherwise replace with new value
                return { ...prev, [key]: [value] };
            }

            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];

            return { ...prev, [key]: updated };
        });
    };

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
    }, [selectedColors, selectedBrand, dynamicFilters]);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (minPrice) params.set('minPrice', minPrice);
        else params.delete('minPrice');

        if (maxPrice) params.set('maxPrice', maxPrice);
        else params.delete('maxPrice');

        if (selectedColors.length > 0) params.set('color', selectedColors.join(','));
        else params.delete('color');

        if (selectedBrand) params.set('brand', selectedBrand);
        else params.delete('brand');

        // Apply dynamic filters
        Object.entries(dynamicFilters).forEach(([key, values]) => {
            if (values && values.length > 0) {
                params.set(key, values.join(','));
            } else {
                params.delete(key);
            }
        });

        // Reset page to 1 if we had pagination (optional future proofing)
        // params.delete('page'); 

        // Use current pathname instead of hardcoded /products
        router.push(`${pathname}?${params.toString()}`);
    };

    const toggleColor = (color: string) => {
        if (selectedColors.includes(color)) {
            setSelectedColors(selectedColors.filter(c => c !== color));
        } else {
            setSelectedColors([...selectedColors, color]);
        }
    };

    const [isOpen, setIsOpen] = useState(false);

    // Close filters automatically on larger screens or when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [searchParams]);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="filter-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'none', // Hidden on desktop (overridden by media query below)
                    width: '100%',
                    padding: '12px',
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-main)',
                    border: '1px solid var(--color-surface-hover)',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600
                }}
            >
                <span>{isOpen ? '✕ Close Filters' : '⑆ Show Filters'}</span>
            </button>

            {/* Filter Container */}
            <div
                className={`filter-sidebar ${isOpen ? 'open' : ''}`}
                style={{
                    background: 'var(--color-surface)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid var(--color-surface-hover)',
                    height: 'fit-content'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', margin: 0 }}>Filters</h3>
                    {/* Mobile Close Icon inside drawer */}
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer', display: 'none' }} // Hidden by default
                        className="mobile-close-icon"
                    >
                        ✕
                    </button>
                </div>

                {/* Brand Filter */}
                <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Brand</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {brandOptions.map(brand => (
                            <label key={brand} style={{
                                display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                                fontSize: '0.85rem', color: selectedBrand === brand ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                background: selectedBrand === brand ? 'var(--color-surface-hover)' : 'transparent',
                                padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-surface-hover)'
                            }}>
                                <input
                                    type="radio"
                                    name="brand"
                                    checked={selectedBrand === brand}
                                    onChange={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                                    style={{ display: 'none' }}
                                />
                                {brand}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Filter */}
                <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Price Range (KES)</h4>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            style={{
                                background: 'var(--color-background)', border: '1px solid var(--color-surface-hover)', color: 'var(--color-text-main)',
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
                                background: 'var(--color-background)', border: '1px solid var(--color-surface-hover)', color: 'var(--color-text-main)',
                                padding: '8px', borderRadius: '6px', width: '100%', fontSize: '0.9rem'
                            }}
                        />
                    </div>
                </div>

                {/* Color Filter - Hidden for Storage */}
                {category !== 'storage' && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Color</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {colorOptions.map(color => (
                                <label key={color} style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                                    fontSize: '0.85rem', color: selectedColors.includes(color) ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                    background: selectedColors.includes(color) ? 'var(--color-surface-hover)' : 'transparent',
                                    padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-surface-hover)'
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
                )}

                {/* Storage Filter Removed from Global - moved to Category Config for phones/tablets */}

                {/* Dynamic Category Filters */}
                {activeCategoryConfig.map((config) => (
                    <div key={config.key} style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>
                            {config.label}
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {config.options.map((option) => {
                                const isSelected = (dynamicFilters[config.key] || []).includes(option);
                                return (
                                    <label key={option} style={{
                                        display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        color: isSelected ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                        background: isSelected ? 'var(--color-surface-hover)' : 'transparent',
                                        padding: '4px 8px', borderRadius: '4px',
                                        border: '1px solid var(--color-surface-hover)'
                                    }}>
                                        <input
                                            type={config.singleSelect ? "radio" : "checkbox"}
                                            checked={isSelected}
                                            onChange={() => toggleDynamicFilter(config.key, option, config.singleSelect)}
                                            style={{ display: 'none' }}
                                        />
                                        {option}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        onClick={() => {
                            setIsOpen(false); // Close on Apply on mobile
                        }}
                        className="mobile-apply-btn"
                        style={{
                            flex: 1, padding: '10px',
                            background: 'var(--color-primary)', border: 'none',
                            color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem',
                            fontWeight: 600, display: 'none'
                        }}
                    >
                        Done
                    </button>
                    <button
                        onClick={() => {
                            setMinPrice('');
                            setMaxPrice('');
                            setSelectedColors([]);
                            setSelectedBrand('');
                            setDynamicFilters({});
                            router.push(pathname);
                            setIsOpen(false);
                        }}
                        style={{
                            flex: 1, padding: '10px',
                            background: 'transparent', border: '1px dashed var(--color-surface-hover)',
                            color: 'var(--color-text-muted)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem'
                        }}
                    >
                        Reset
                    </button>
                </div>
            </div>

            <style jsx global>{`
                @media (max-width: 768px) {
                    .filter-toggle-btn {
                        display: flex !important;
                    }

                    .filter-sidebar {
                        display: none; /* Hidden by default */
                        background: var(--color-surface);
                        padding: 1.5rem;
                        border-radius: 12px;
                        border: 1px solid var(--color-surface-hover);
                        margin-bottom: 2rem;
                    }

                    .filter-sidebar.open {
                        display: block !important;
                        animation: slideDown 0.3s ease-out;
                    }
                    
                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    .mobile-close-icon {
                        display: none !important; /* No close btn needed for accordion */
                    }
                    
                    .mobile-apply-btn {
                        display: none !important; /* No apply btn needed for accordion, changes apply live */
                    }
                }
            `}</style>
        </>
    );
}
