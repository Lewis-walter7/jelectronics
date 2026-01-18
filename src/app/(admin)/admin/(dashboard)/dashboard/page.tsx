import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Link from 'next/link';

async function getStats() {
    await connectToDatabase();

    const totalProducts = await Product.countDocuments();
    const publishedProducts = await Product.countDocuments({ status: 'published' });
    const draftProducts = await Product.countDocuments({ status: 'draft' });
    const lowStockProducts = await Product.countDocuments({ stock: { $gt: 0, $lt: 5 } });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    // Calculate total inventory value (approx)
    const allProducts = await Product.find({ stock: { $gt: 0 } }).select('price stock');
    const totalValue = allProducts.reduce((acc, p) => acc + (p.price * p.stock), 0);

    return {
        totalProducts,
        publishedProducts,
        draftProducts,
        lowStockProducts,
        outOfStockProducts,
        totalValue
    };
}

export default async function DashboardPage() {
    const stats = await getStats();

    const cardStyle = {
        background: '#111',
        border: '1px solid #222',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.5rem'
    };

    const labelStyle = { color: '#888', fontSize: '0.9rem' };
    const valueStyle = { color: 'white', fontSize: '2rem', fontWeight: 'bold' };

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Dashboard Overview</h1>
                    <p style={{ color: '#666', marginTop: '0.5rem' }}>Welcome back, Master Admin.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    style={{
                        background: '#ff6b00',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    + Add Product
                </Link>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <div style={cardStyle}>
                    <span style={labelStyle}>Total Revenue (Est. Stock)</span>
                    <span style={{ ...valueStyle, color: '#22c55e' }}>
                        KES {stats.totalValue.toLocaleString()}
                    </span>
                </div>

                <div style={cardStyle}>
                    <span style={labelStyle}>Total Products</span>
                    <span style={valueStyle}>{stats.totalProducts}</span>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#666' }}>
                        <span style={{ color: '#22c55e' }}>● {stats.publishedProducts} Published</span>
                        <span style={{ color: '#eab308' }}>● {stats.draftProducts} Drafts</span>
                    </div>
                </div>

                <div style={cardStyle}>
                    <span style={labelStyle}>Low Stock Alert</span>
                    <span style={{ ...valueStyle, color: stats.lowStockProducts > 0 ? '#eab308' : 'white' }}>
                        {stats.lowStockProducts}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Less than 5 items</span>
                </div>

                <div style={cardStyle}>
                    <span style={labelStyle}>Out of Stock</span>
                    <span style={{ ...valueStyle, color: stats.outOfStockProducts > 0 ? '#ef4444' : 'white' }}>
                        {stats.outOfStockProducts}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Restock needed</span>
                </div>
            </div>

            {/* Quick Actions / Recent (Placeholder for now) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link href="/admin/products" style={{ padding: '0.75rem 1.5rem', background: '#1a1a1a', color: '#ccc', textDecoration: 'none', borderRadius: '8px', border: '1px solid #333' }}>
                            Manage Inventory
                        </Link>
                        <Link href="/" target="_blank" style={{ padding: '0.75rem 1.5rem', background: '#1a1a1a', color: '#ccc', textDecoration: 'none', borderRadius: '8px', border: '1px solid #333' }}>
                            View Live Store ↗
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
