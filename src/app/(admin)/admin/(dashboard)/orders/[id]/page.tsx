'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderDetail {
    _id: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
    };
    items: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        variant?: string;
        color?: string;
    }>;
    totalAmount: number;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    mpesaDetails?: {
        checkoutRequestId?: string;
        merchantRequestId?: string;
        receiptNumber?: string;
        phoneNumber?: string;
        transactionDate?: string;
    };
    createdAt: string;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params using use() in Next.js 15+ if it's a promise, but for compatibility let's assume it might still need awaiting or is resolved.
    // Ideally in client component receiving props from layout/page structure, checking Next.js version specifics. 
    // For now standard React `use` hook pattern for promises in components or just standard effect if it was passed async. 
    // Actually `params` is a Promise in the latest Next.js app dir for pages.

    // We can use a small trick if we are unsure about the `use` hook availability or stability in this env.
    // Let's rely on unwrapping it in an effect or using React.use(). 
    // Since I cannot be 100% sure of the React version (v19 is experimental usually), I will assume standard handling.
    // Wait, `package.json` said "react": "19.2.3"! So `use` hook IS available.

    const { id } = use(ordersIdParams(params)); // Helper wrapper or just use(params)

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/admin/orders/${id}`);
                const data = await res.json();
                if (data.success) {
                    setOrder(data.order);
                }
            } catch (error) {
                console.error("Failed to fetch order");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        if (!confirm(`Change status to ${newStatus}?`)) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setOrder({ ...order!, status: newStatus });
            } else {
                alert('Failed to update status');
            }
        } catch (e) {
            console.error(e);
            alert('Error updating status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', color: '#fff' }}>Loading order details...</div>;
    if (!order) return <div style={{ padding: '2rem', color: '#fff' }}>Order not found</div>;

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/orders" style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>
                    &larr; Back to Orders
                </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Order #{order._id.slice(-6).toUpperCase()}</h1>
                    <p style={{ color: '#aaa' }}>Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Current Status</div>
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={updating}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '4px',
                            background: '#333',
                            color: 'white',
                            border: '1px solid #555',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Items */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Items</h3>
                        {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: idx < order.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                <div>
                                    <div style={{ fontWeight: '500' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#aaa' }}>
                                        {item.variant && <span>{item.variant} </span>}
                                        {item.color && <span>({item.color})</span>}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Qty: {item.quantity} × KES {item.price.toLocaleString()}</div>
                                </div>
                                <div style={{ fontWeight: 'bold' }}>
                                    KES {(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>KES {order.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* M-Pesa Details if applicable */}
                    {order.paymentMethod === 'M-Pesa' && order.mpesaDetails && (
                        <div style={{ background: 'rgba(37, 211, 102, 0.1)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(37, 211, 102, 0.2)' }}>
                            <h3 style={{ marginBottom: '1rem', color: '#25d366' }}>M-Pesa Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                                <div>
                                    <span style={{ color: '#aaa', display: 'block' }}>Receipt Number</span>
                                    <span style={{ fontWeight: '500' }}>{order.mpesaDetails.receiptNumber || 'Pending'}</span>
                                </div>
                                <div>
                                    <span style={{ color: '#aaa', display: 'block' }}>Phone Number</span>
                                    <span style={{ fontWeight: '500' }}>{order.mpesaDetails.phoneNumber || order.customer.phone}</span>
                                </div>
                                <div>
                                    <span style={{ color: '#aaa', display: 'block' }}>Date</span>
                                    <span style={{ fontWeight: '500' }}>{order.mpesaDetails.transactionDate ? new Date(order.mpesaDetails.transactionDate).toLocaleString() : '-'}</span>
                                </div>
                                <div>
                                    <span style={{ color: '#aaa', display: 'block' }}>Status</span>
                                    <span style={{
                                        color: order.paymentStatus === 'Completed' ? '#4ade80' :
                                            order.paymentStatus === 'Failed' ? '#ef4444' : '#fbbf24',
                                        fontWeight: 'bold'
                                    }}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Customer Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Customer Details</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ display: 'block', color: '#aaa', fontSize: '0.9rem' }}>Name</span>
                            <div>{order.customer.name}</div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ display: 'block', color: '#aaa', fontSize: '0.9rem' }}>Email</span>
                            <div>{order.customer.email}</div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ display: 'block', color: '#aaa', fontSize: '0.9rem' }}>Phone</span>
                            <div>{order.customer.phone}</div>
                        </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Shipping Address</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ display: 'block', color: '#aaa', fontSize: '0.9rem' }}>Address</span>
                            <div>{order.customer.address}</div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ display: 'block', color: '#aaa', fontSize: '0.9rem' }}>City</span>
                            <div>{order.customer.city}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper to handle the promise param just in case
async function ordersIdParams(params: Promise<{ id: string }>) {
    return params;
}
