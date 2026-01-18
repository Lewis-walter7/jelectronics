'use client';
import { useCart } from '@/context/CartContext';
import styles from './CheckoutSteps.module.css';
import Link from 'next/link';

interface CartStepProps {
    onNext: () => void;
}

export default function CartStep({ onNext }: CartStepProps) {
    const { items, removeFromCart, addToCart, totalItems } = useCart();

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleQtyChange = (item: any, delta: number) => {
        const newQty = item.quantity + delta;

        if (newQty < 1) {
            // Confirm remove? Or just remove? consistent with ProductViewer logic?
            // Usually < 1 means remove or explicitly stop at 1. Let's stop at 1 for (-) button and use trash for remove.
            return;
        }

        // We use addToCart directly because our Context is basic. 
        // Ideally we'd have an updateQuantity function, but our addToCart handles merging.
        // HOWEVER, addToCart ADDS to existing quantity if item exists. 
        // We need 'updateQuantity' logic usually.
        // Looking at CartContext: 
        // "i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i" 
        // Wait, looking at Context code... it ADDS `qtyToAdd` to existing.
        // So passing `quantity: 1` adds 1. Passing `quantity: -1` might work if we supported negative?
        // But our Context types might be Omit<CartItem, 'quantity'> & { quantity?: number }.

        // Actually, for simplicity in this session without refactoring Context heavily:
        // Let's rely on standard "Remove" and "Add". 
        // If we want to decrement, we might need to refactor context or just expose a `updateItemQuantity` method.
        // **Current Context Logic:** `quantity += qtyToAdd`. 
        // So `addToCart({ ...item, quantity: 1 })` adds 1.
        // `addToCart({ ...item, quantity: -1 })` adds -1.
        // Let's try that.

        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            variant: item.variant,
            color: item.color,
            quantity: delta
        });
    };

    if (items.length === 0) {
        return (
            <div className={styles.emptyCart}>
                <span className={styles.emptyIcon}>🛒</span>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <Link href="/products" className={styles.backLink}>Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className={styles.stepContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Shopping Cart</h2>
                <p className={styles.subtitle}>Review your items before checkout ({totalItems} items)</p>
            </div>

            <div className={styles.cartList}>
                {items.map((item) => (
                    <div key={`${item.id}-${item.variant}-${item.color}`} className={styles.cartItem}>
                        <div className={styles.itemInfo}>
                            <span className={styles.itemName}>{item.name}</span>
                            <span className={styles.itemMeta}>
                                {item.variant && <span style={{ marginRight: '10px' }}>{item.variant}</span>}
                                {item.color && <span>{item.color}</span>}
                            </span>
                        </div>

                        <div className={styles.itemControls}>
                            <div className={styles.quantity}>
                                <button className={styles.qtyBtn} onClick={() => handleQtyChange(item, -1)} disabled={item.quantity <= 1}>−</button>
                                <span className={styles.qtyValue}>{item.quantity}</span>
                                <button className={styles.qtyBtn} onClick={() => handleQtyChange(item, 1)}>+</button>
                            </div>

                            <span className={styles.itemPrice}>KES {(item.price * item.quantity).toLocaleString()}</span>

                            <button
                                className={styles.removeBtn}
                                onClick={() => removeFromCart(item.id, item.variant, item.color)}
                                title="Remove item"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.cartSummary}>
                <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>KES {subtotal.toLocaleString()}</span>
                </div>
                {/* Shipping usually calculated next step */}
                <div className={styles.summaryRow} style={{ fontSize: '0.9rem', color: '#888' }}>
                    <span>Shipping</span>
                    <span>Calculated at next step</span>
                </div>

                <div className={styles.totalRow}>
                    <span>Total</span>
                    <span>KES {subtotal.toLocaleString()}</span>
                </div>

                <button className={styles.actionBtn} onClick={onNext}>
                    Proceed to Shipping
                </button>
            </div>
        </div>
    );
}
