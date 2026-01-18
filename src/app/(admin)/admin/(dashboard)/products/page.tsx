'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    image: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'published' | 'draft'>('published');

    useEffect(() => {
        fetchProducts();
    }, [activeTab]);

    useEffect(() => {
        // Filter logic
        if (!searchQuery) {
            setFilteredProducts(products);
        } else {
            const lowerQ = searchQuery.toLowerCase();
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(lowerQ) ||
                p.category.toLowerCase().includes(lowerQ)
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, products]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/products?status=${activeTab}`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
                setFilteredProducts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/products?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                const updated = products.filter(p => p._id !== id);
                setProducts(updated); // Effect will update filtered list
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            alert('Error deleting product');
        }
    };

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Products</h1>

                    {/* Tabs */}
                    <div style={{ display: 'flex', background: '#111', padding: '4px', borderRadius: '8px', border: '1px solid #333' }}>
                        <button
                            onClick={() => setActiveTab('published')}
                            style={{
                                padding: '6px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                background: activeTab === 'published' ? '#333' : 'transparent',
                                color: activeTab === 'published' ? 'white' : '#888',
                                fontWeight: activeTab === 'published' ? 'bold' : 'normal',
                                fontSize: '0.9rem'
                            }}
                        >
                            Published
                        </button>
                        <button
                            onClick={() => setActiveTab('draft')}
                            style={{
                                padding: '6px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                background: activeTab === 'draft' ? '#333' : 'transparent',
                                color: activeTab === 'draft' ? '#ff6b00' : '#888',
                                fontWeight: activeTab === 'draft' ? 'bold' : 'normal',
                                fontSize: '0.9rem'
                            }}
                        >
                            Drafts
                        </button>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={fetchProducts}
                        disabled={loading}
                        style={{
                            background: '#333',
                            color: 'white',
                            border: '1px solid #444',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                        }}
                        title="Reload Inventory"
                    >
                        {loading ? '↻' : '↻ Refresh'}
                    </button>
                    <Link href="/admin/products/new">
                        <button style={{
                            background: '#ff6b00',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}>
                            + Add Product
                        </button>
                    </Link>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Search by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '10px 16px',
                        width: '100%',
                        maxWidth: '400px',
                        background: '#111',
                        border: '1px solid #333',
                        borderRadius: '6px',
                        color: 'white'
                    }}
                />
            </div>

            {loading ? (
                <div>Loading inventory...</div>
            ) : (
                <div style={{ background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#222', color: '#ccc' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>Image</th>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Category</th>
                                <th style={{ padding: '1rem' }}>Price</th>
                                <th style={{ padding: '1rem' }}>Stock</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product._id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                                            {/* Use placeholder if image is relative path or missing */}
                                            {product.image && product.image.startsWith('http') ? (
                                                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📱</div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{product.name}</td>
                                    <td style={{ padding: '1rem', color: '#888' }}>{product.category}</td>
                                    <td style={{ padding: '1rem' }}>KES {product.price.toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            background: product.stock > 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                                            color: product.stock > 0 ? '#4caf50' : '#f44336',
                                            fontSize: '0.85rem'
                                        }}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '10px' }}>
                                        <Link href={`/admin/products/${product._id}`}>
                                            <button
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                            {searchQuery ? 'No matching products.' : 'No products found. Add your first one!'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
