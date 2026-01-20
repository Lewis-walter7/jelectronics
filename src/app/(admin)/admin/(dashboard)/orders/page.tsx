'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IOrder } from '@/models/Order'; // We might need to make sure IOrder is available to client or redefine proper type

// Helper type if import fails on client (though models usually fine in Next.js 13+ client components if just types)
interface OrderSummary {
    _id: string;
    customer: {
        name: string;
        email: string;
    };
    totalAmount: number;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/admin/orders');
                const data = await res.json();
                if (data.success) {
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return '#4ade80';
            case 'Pending': return '#fbbf24';
            case 'Failed': return '#ef4444';
            case 'Shipped': return '#60a5fa';
            default: return '#ccc';
        }
    };

    if (loading) return <div style={{ padding: '2rem', color: '#fff' }}>Loading orders...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>Orders</h1>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#aaa' }}>Order ID</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#aaa' }}>Customer</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#aaa' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#aaa' }}>Total</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#aaa' }}>Payment</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#aaa' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.9rem', color: '#aaa' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#888' }}>#{order._id.slice(-6).toUpperCase()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '500' }}>{order.customer.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{order.customer.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#bbb' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>KES {order.totalAmount.toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            background: order.paymentMethod === 'M-Pesa' ? 'rgba(37, 211, 102, 0.1)' : 'rgba(255,255,255,0.1)',
                                            color: order.paymentMethod === 'M-Pesa' ? '#25d366' : 'white'
                                        }}>
                                            {order.paymentMethod}
                                        </span>
                                        <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: getStatusColor(order.paymentStatus) }}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            border: `1px solid ${getStatusColor(order.status)}`,
                                            color: getStatusColor(order.status)
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <Link href={`/admin/orders/${order._id}`} style={{
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            background: 'white',
                                            color: 'black',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            fontWeight: '500'
                                        }}>
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
