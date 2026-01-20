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

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const res = await fetch('/api/mpesa/stkpush', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: formData,
                    items: items.map(item => ({
                        productId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        variant: item.variant,
                        color: item.color
                    })),
                    totalAmount: total,
                    shippingCost
                })
            });

            const data = await res.json();

            if (data.success) {
                setOrderSuccess(`Order Placed! Please check your phone (${formData.phone}) to complete the M-Pesa payment.`);
                // Ideally propagate successful order ID to next step
                // onNext(); // Or stay here to show success message
            } else {
                alert(`Payment Failed: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Checkout Error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className={styles.stepContainer} style={{ textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ color: '#4ade80', marginBottom: '1rem' }}>🎉 Success!</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{orderSuccess}</p>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', maxWidth: '400px', margin: '0 auto' }}>
                    <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>Next Steps:</p>
                    <ul style={{ textAlign: 'left', listStyle: 'disc', paddingLeft: '1.5rem', color: '#ddd' }}>
                        <li>Enter your M-Pesa PIN on your phone.</li>
                        <li>Wait for the confirmation SMS.</li>
                        <li>You will receive an email receipt shortly.</li>
                    </ul>
                </div>
                <button
                    onClick={() => window.location.href = '/products'}
                    className={styles.actionBtn}
                    style={{ marginTop: '2rem' }}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className={styles.stepContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Shipping & Checkout</h2>
                <p className={styles.subtitle}>Enter your delivery details</p>
            </div>

            <div className={styles.shippingLayout}>
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>Phone Number (e.g. 07xx)</label>
                            <input
                                required
                                type="tel"
                                placeholder="07xxxxxxxx"
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
                                <span style={{ fontSize: '0.9rem', color: '#aaa' }}>Payment will be requested on your phone number provided above.</span>
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
                        disabled={isProcessing}
                        style={{ opacity: isProcessing ? 0.7 : 1, cursor: isProcessing ? 'wait' : 'pointer' }}
                    >
                        {isProcessing ? 'Processing...' : 'Complete Order'}
                    </button>

                    <button
                        onClick={onBack}
                        style={{ width: '100%', background: 'none', border: 'none', color: '#aaa', marginTop: '1rem', cursor: 'pointer' }}
                        disabled={isProcessing}
                    >
                        &larr; Back to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
