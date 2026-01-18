'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './ProductViewer.module.css';

interface Variant {
    name: string;
    price: number;
    salePrice?: number;
    stock?: number;
}

interface ProductViewerProps {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
        salePrice?: number;
        isOnSale?: boolean;
        variants?: Variant[];
        stock?: number;
        colors?: string[];
    };
}

export default function ProductViewer({ product }: ProductViewerProps) {
    const { addToCart } = useCart();

    // State
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        product.variants && product.variants.length > 0 ? product.variants[0] : null
    );
    const [selectedColor, setSelectedColor] = useState<string | null>(
        product.colors && product.colors.length > 0 ? product.colors[0] : null
    );
    const [quantity, setQuantity] = useState(1);

    // Derived logic
    const currentPrice = selectedVariant
        ? (selectedVariant.salePrice || selectedVariant.price)
        : (product.salePrice || product.price);

    const originalPrice = selectedVariant
        ? selectedVariant.price
        : product.price;

    const isSale = selectedVariant
        ? !!selectedVariant.salePrice
        : !!product.salePrice;

    const maxStock = selectedVariant?.stock ?? product.stock ?? 0;

    const handleQtyChange = (delta: number) => {
        setQuantity(prev => {
            const next = prev + delta;
            if (next < 1) return 1;
            // Optional: limit by stock
            // if (next > maxStock) return maxStock;
            return next;
        });
    };

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: currentPrice,
            imageUrl: product.image,
            quantity: quantity,
            variant: selectedVariant ? selectedVariant.name : undefined,
            color: selectedColor || undefined
        });
        alert(`Added ${quantity} item(s) to cart!`);
    };

    return (
        <div className={styles.wrapper}>
            {/* Price section */}
            <div className={styles.priceSection}>
                {isSale ? (
                    <div className={styles.price}>
                        <span className={styles.oldPrice}>KES {originalPrice.toLocaleString()}</span>
                        KES {currentPrice.toLocaleString()}
                        <span className={styles.saleTag}>Sale!</span>
                    </div>
                ) : (
                    <div className={styles.price}>
                        KES {currentPrice.toLocaleString()}
                    </div>
                )}
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
                <div className={styles.optionSection}>
                    <label className={styles.optionLabel}>Choose Option</label>
                    <div className={styles.optionGroup}>
                        {product.variants.map((v) => (
                            <button
                                key={v.name}
                                className={`${styles.variantBtn} ${selectedVariant?.name === v.name ? styles.active : ''}`}
                                onClick={() => setSelectedVariant(v)}
                            >
                                {v.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
                <div className={styles.optionSection}>
                    <label className={styles.optionLabel}>Choose Color</label>
                    <div className={styles.optionGroup}>
                        {product.colors.map((color) => (
                            <button
                                key={color}
                                className={`${styles.variantBtn} ${selectedColor === color ? styles.active : ''}`}
                                onClick={() => setSelectedColor(color)}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quantity Selector */}
            <div className={styles.qtySection}>
                <label className={styles.optionLabel}>Quantity</label>
                <div className={styles.qtyControl}>
                    <button className={styles.qtyBtn} onClick={() => handleQtyChange(-1)}>−</button>
                    <span className={styles.qtyValue}>{quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => handleQtyChange(1)}>+</button>
                </div>
            </div>

            {/* Action */}
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                Add to Cart
            </button>

        </div>
    );
}
