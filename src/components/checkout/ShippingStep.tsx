'use client';
import { useState } from 'react';
import styles from './CheckoutSteps.module.css';
import { useCart } from '@/context/CartContext';

interface ShippingStepProps {
    onBack: () => void;
    onNext: () => void;
}

export default function ShippingStep({ onBack, onNext }: ShippingStepProps) {
    const { items, removeFromCart } = useCart(); // Access cart to calculate total again or pass it down

    // We are not really submitting data to server yet, just local state for the demo
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: 'Nairobi',
    });

    const [shippingCost, setShippingCost] = useState(300); // Default Nairobi

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal + shippingCost;

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = e.target.value;
        setFormData({ ...formData, city });
        if (city === 'Nairobi') {
            setShippingCost(300);
        } else {
            setShippingCost(400); // Outside Nairobi cost
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would validate and submit order
        onNext();
    };

    return (
        <div className={styles.stepContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Shipping & Checkout</h2>
                <p className={styles.subtitle}>Enter your delivery details</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem' }}>
                {/* Left Column: Form */}
                <form id="checkoutForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Full Name</label>
                            <input
                                required
                                type="text"
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white' }}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Phone Number</label>
                            <input
                                required
                                type="tel"
                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white' }}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Email Address</label>
                        <input
                            required
                            type="email"
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white' }}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Delivery Address / Location</label>
                        <textarea
                            required
                            rows={3}
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white' }}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>City / Region</label>
                        <select
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white' }}
                            value={formData.city}
                            onChange={handleCityChange}
                        >
                            <option value="Nairobi">Nairobi County (KES 300)</option>
                            <option value="Outside">Outside Nairobi (KES 400)</option>
                        </select>
                    </div>

                    {/* Payment Placeholder */}
                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Payment Method</h3>
                        <div style={{ padding: '15px', border: '1px solid var(--color-primary)', borderRadius: '4px', background: 'rgba(37, 211, 102, 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>📱</span>
                            <div>
                                <strong style={{ display: 'block' }}>M-Pesa</strong>
                                <span style={{ fontSize: '0.9rem', color: '#aaa' }}>Payment will be requested on your phone number provided.</span>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Right Column: Order Summary */}
                <div className={styles.cartSummary} style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Order Summary</h3>

                    <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Shipping</span>
                        <span>KES {shippingCost}</span>
                    </div>

                    <div className={styles.totalRow}>
                        <span>Total</span>
                        <span>KES {total.toLocaleString()}</span>
                    </div>

                    <button
                        className={styles.actionBtn}
                        type="submit"
                        form="checkoutForm"
                    >
                        Complete Order
                    </button>

                    <button
                        onClick={onBack}
                        style={{ width: '100%', background: 'none', border: 'none', color: '#aaa', marginTop: '1rem', cursor: 'pointer' }}
                    >
                        &larr; Back to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
