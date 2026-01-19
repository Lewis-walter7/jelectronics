'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './special-offers.module.css';

interface Product {
    _id: string;
    name: string;
    price: number;
    salePrice: number;
    imageUrl: string;
    category: string;
    slug: string;
    discount: number;
}

export default function SpecialOffersPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/special-offers');
                const data = await res.json();
                if (data.success) {
                    setProducts(data.products);
                }
            } catch (error) {
                console.error('Error fetching special offers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter and sort products
    const filteredAndSortedProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.salePrice - b.salePrice;
                case 'price-high':
                    return b.salePrice - a.salePrice;
                case 'discount':
                    return b.discount - a.discount;
                case 'newest':
                default:
                    return 0; // Already sorted by createdAt from API
            }
        });

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem 1rem', textAlign: 'center', color: '#888' }}>
                Loading special offers...
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', color: 'white' }}>
                Special Offers
            </h1>

            {/* Filters Section */}
            <div className={styles.filtersSection}>
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filtersRow}>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={styles.filterSelect}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="discount">Highest Discount</option>
                    </select>
                </div>

                <div className={styles.resultsCount}>
                    {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''} found
                </div>
            </div>

            {filteredAndSortedProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
                    <p style={{ fontSize: '1.2rem' }}>
                        {products.length === 0
                            ? 'No special offers available at the moment.'
                            : 'No products match your search.'}
                    </p>
                    <Link href="/products" style={{ color: 'var(--color-primary)', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>
                        Browse all products →
                    </Link>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredAndSortedProducts.map((product) => (
                        <Link
                            key={product._id}
                            href={`/products/${product.category.toLowerCase()}/${product.slug}`}
                            className={styles.card}
                        >
                            <div className={styles.imageWrapper}>
                                {product.discount > 0 && (
                                    <span className={styles.badge}>-{product.discount}%</span>
                                )}
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.title}>{product.name}</h3>
                                <div className={styles.priceRow}>
                                    <span className={styles.salePrice}>KES {product.salePrice.toLocaleString()}</span>
                                    <span className={styles.originalPrice}>KES {product.price.toLocaleString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
