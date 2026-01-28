'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './products.module.css';
import toast from 'react-hot-toast';

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
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);

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
                setSelectedIds(new Set()); // Reset selection on refresh
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = new Set(filteredProducts.map(p => p._id));
            setSelectedIds(allIds);
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleDelete = async (ids: string[]) => {
        if (!ids.length) return;

        if (!confirm(`Are you sure you want to delete ${ids.length} product(s)?`)) return;

        setIsDeleting(true);
        try {
            // If single ID, use comma separated param is fine as backend handles it, 
            // but let's stick to the new 'ids' param for both single and multiple for consistency if we wanted,
            // however backend supports both. Let's use 'ids' for bulk and 'id' for single for legacy safety or just 'ids' for all.
            // Our backend now checks 'ids' first.

            const res = await fetch(`/api/products?ids=${ids.join(',')}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (res.ok) {
                const updated = products.filter(p => !ids.includes(p._id));
                setProducts(updated);

                // Remove deleted IDs from selection
                const newSelected = new Set(selectedIds);
                ids.forEach(id => newSelected.delete(id));
                setSelectedIds(newSelected);

                toast.success(`Successfully deleted ${data.count || ids.length} product(s)`);
            } else {
                toast.error(data.error || 'Failed to delete product(s)');
            }
        } catch (error) {
            toast.error('Error deleting product(s)');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.leftSection}>
                    <h1 className={styles.title}>Products</h1>

                    {/* Tabs */}
                    <div className={styles.tabs}>
                        <button
                            onClick={() => setActiveTab('published')}
                            className={`${styles.tabBtn} ${activeTab === 'published' ? styles.tabBtnActive : styles.tabBtnInactive}`}
                        >
                            Published
                        </button>
                        <button
                            onClick={() => setActiveTab('draft')}
                            className={`${styles.tabBtn} ${activeTab === 'draft' ? styles.draftActive : styles.tabBtnInactive}`}
                        >
                            Drafts
                        </button>
                    </div>
                </div>
                <div className={styles.actions}>
                    {selectedIds.size > 0 && (
                        <button
                            onClick={() => handleDelete(Array.from(selectedIds))}
                            disabled={isDeleting}
                            style={{
                                background: '#dc2626',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                        >
                            {isDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.size})`}
                        </button>
                    )}

                    <button
                        onClick={fetchProducts}
                        disabled={loading}
                        className={styles.refreshBtn}
                        title="Reload Inventory"
                    >
                        {loading ? '↻' : '↻ Refresh'}
                    </button>
                    <Link href="/admin/products/new">
                        <button className={styles.addBtn}>
                            + Add Product
                        </button>
                    </Link>
                </div>
            </div>

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {loading ? (
                <div>Loading inventory...</div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr className={styles.tr}>
                                <th className={styles.th} style={{ width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={filteredProducts.length > 0 && selectedIds.size === filteredProducts.length}
                                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                    />
                                </th>
                                <th className={styles.th}>Image</th>
                                <th className={styles.th}>Name</th>
                                <th className={styles.th}>Category</th>
                                <th className={styles.th}>Price</th>
                                <th className={styles.th}>Stock</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className={styles.tr} style={{ background: selectedIds.has(product._id) ? 'rgba(255, 107, 0, 0.05)' : 'transparent' }}>
                                    <td className={styles.td}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(product._id)}
                                            onChange={() => handleSelectOne(product._id)}
                                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                        />
                                    </td>
                                    <td className={styles.td}>
                                        <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                                            {/* Use placeholder if image is relative path or missing */}
                                            {product.image && product.image.startsWith('http') ? (
                                                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📱</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className={styles.td} style={{ fontWeight: '500' }}>{product.name}</td>
                                    <td className={styles.td} style={{ color: '#888' }}>{product.category}</td>
                                    <td className={styles.td}>KES {product.price.toLocaleString()}</td>
                                    <td className={styles.td}>
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
                                    <td className={styles.td} style={{ display: 'flex', gap: '10px' }}>
                                        <Link href={`/admin/products/${product._id}`}>
                                            <button
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete([product._id])}
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
