import styles from '../product/FeaturedProducts.module.css';
import ProductCard from '../product/ProductCard';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';

const getGamingProducts = unstable_cache(
    async () => {
        await connectToDatabase();

        const productsDocs = await Product.find({
            category: new RegExp('^gaming$', 'i'),
            $or: [
                { status: 'published' },
                { status: { $exists: false } },
                { status: null }
            ]
        }).limit(10).sort({ createdAt: -1 }).lean();

        return productsDocs.map((doc: any) => ({
            _id: doc._id.toString(),
            name: doc.name,
            description: doc.description,
            price: doc.price,
            salePrice: doc.salePrice,
            category: doc.category,
            imageUrl: doc.imageUrl || doc.image || '',
            slug: doc.slug,
            averageRating: doc.averageRating,
            reviewCount: doc.reviewCount,
            minPrice: doc.minPrice,
            maxPrice: doc.maxPrice,
            images: doc.images || []
        }));
    },
    ['gaming-deals'],
    { revalidate: 60, tags: ['products'] }
);

export default async function GamingDeals() {
    const products = await getGamingProducts();

    if (products.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                    <h2 className={styles.heading}>Gaming Deals</h2>
                    <Link
                        href="/products/gaming"
                        style={{
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            fontWeight: 600
                        }}
                    >
                        View All Gaming →
                    </Link>
                </div>
                <div className={styles.grid}>
                    {products.map((p) => (
                        <ProductCard key={p._id} {...p} />
                    ))}
                </div>
            </div>
        </section>
    );
}
