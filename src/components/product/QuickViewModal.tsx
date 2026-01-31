'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import styles from './QuickViewModal.module.css';
import AddToCartButton from './AddToCartButton';

interface QuickViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        _id: string;
        name: string;
        description: string;
        price: number;
        salePrice?: number;
        imageUrl: string;
        category: string;
        slug: string;
        brand?: string;
        stock?: number;
    };
}

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const discount = product.salePrice && product.salePrice < product.price
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : 0;

    const currentPrice = product.salePrice || product.price;

    // Use a formatter if utils not available, for now hardcode or use Intl
    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const modalContent = (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                    ✕
                </button>

                <div className={styles.imageSection}>
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'contain', padding: '1rem' }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

                <div className={styles.detailsSection}>
                    {product.brand && <div className={styles.brand}>{product.brand}</div>}
                    <h2 className={styles.title}>{product.name}</h2>

                    <div className={styles.priceContainer}>
                        <span className={styles.price}>{formatPrice(currentPrice)}</span>
                        {product.salePrice && product.salePrice < product.price && (
                            <span className={styles.oldPrice}>{formatPrice(product.price)}</span>
                        )}
                    </div>

                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>Availability:</span>
                            <span className={styles.value} style={{ color: (product.stock || 0) > 0 ? '#10b981' : '#ef4444' }}>
                                {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>Category:</span>
                            <span className={styles.value}>{product.category}</span>
                        </div>
                    </div>

                    <p className={styles.description}>{product.description}</p>

                    <div className={styles.actions}>
                        <AddToCartButton product={product} />
                        <Link href={`/products/${product.category}/${product.slug}`} className={styles.viewDetailsBtn}>
                            View Full Details →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
