'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './BundleDeals.module.css';

interface Product {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    category?: string;
    slug?: string;
}

interface BundleDealsProps {
    mainProduct: Product;
    bundledProducts: Product[];
    discountPercentage: number;
}

export default function BundleDeals({ mainProduct, bundledProducts, discountPercentage }: BundleDealsProps) {
    const { addToCart } = useCart();

    // Initialize with all selected (main + bundles)
    const [selectedIds, setSelectedIds] = useState<string[]>(
        [mainProduct._id, ...bundledProducts.map(p => p._id)]
    );

    const allProducts = [mainProduct, ...bundledProducts];
    const selectedProducts = allProducts.filter(p => selectedIds.includes(p._id));

    const toggleProduct = (id: string) => {
        if (id === mainProduct._id) return; // Cannot unselect main product
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const totalPrice = selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
    // Apply discount only if bundle items are selected (pure logic choice, usually bundle needs >1 item)
    // If only main product is selected, typically no discount.
    const isBundleActive = selectedProducts.length > 1;
    const finalPrice = isBundleActive
        ? totalPrice * ((100 - discountPercentage) / 100)
        : totalPrice;

    const savedAmount = totalPrice - finalPrice;

    const handleAddBundle = () => {
        selectedProducts.forEach(product => {
            // Apply discount to each item individually so cart reflects generic 'deal' price
            // Or only apply to bundle items? 
            // Simple approach: Apply flat discount rate to all items in the bundle
            const price = isBundleActive
                ? product.price * ((100 - discountPercentage) / 100)
                : product.price;

            addToCart({
                id: product._id,
                name: product.name,
                price: price, // Store discounted price
                imageUrl: product.imageUrl,
                quantity: 1
            });
        });
        alert('Bundle added to cart!');
    };

    if (bundledProducts.length === 0) return null;

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Frequently Bought Together</h2>

            <div className={styles.bundleWrapper}>
                {/* Visual Representation (Images + + signs) */}
                <div className={styles.visuals}>
                    {allProducts.map((product, index) => (
                        <div key={product._id} className={styles.imageItem}>
                            <div className={styles.imageBox}>
                                <Image
                                    src={product.imageUrl || '/images/placeholder.jpg'}
                                    alt={product.name || 'Product'}
                                    width={100}
                                    height={100}
                                    className={styles.image}
                                />
                            </div>
                            {index < allProducts.length - 1 && (
                                <span className={styles.plus}>+</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Selection List */}
                <div className={styles.selectionList}>
                    {allProducts.map((product) => (
                        <div key={product._id} className={styles.checkRow}>
                            <label className={styles.label}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(product._id)}
                                    onChange={() => toggleProduct(product._id)}
                                    disabled={product._id === mainProduct._id}
                                    className={styles.checkbox}
                                />
                                <span className={styles.productName}>{product.name || 'Unknown Product'}</span>
                            </label>
                            <span className={styles.price}>
                                KES {(product.price || 0).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Summary & Action */}
                <div className={styles.summary}>
                    <div className={styles.priceBlock}>
                        <div className={styles.totalLabel}>
                            Total Price:
                        </div>
                        <div className={styles.priceValues}>
                            {isBundleActive && (
                                <span className={styles.originalTotal}>
                                    KES {totalPrice.toLocaleString()}
                                </span>
                            )}
                            <span className={styles.finalTotal}>
                                KES {finalPrice.toLocaleString()}
                            </span>
                        </div>
                        {isBundleActive && (
                            <div className={styles.saved}>
                                (Save KES {savedAmount.toLocaleString()})
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAddBundle}
                        className={styles.addBundleBtn}
                        disabled={selectedProducts.length === 0}
                    >
                        Add Selected to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
