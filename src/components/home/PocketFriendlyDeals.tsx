import styles from '../product/FeaturedProducts.module.css';
import ProductCard from '../product/ProductCard';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';

const getPocketFriendlyProducts = unstable_cache(
    async () => {
        await connectToDatabase();

        const productsDocs = await Product.find({
            price: { $lte: 20000 }, // Products 20,000 KES or less
            $or: [
                { status: 'published' },
                { status: { $exists: false } },
                { status: null }
            ]
        }).limit(10).sort({ price: 1 }).lean(); // Sort by price ascending (cheapest first)

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
    ['pocket-friendly-deals'],
    { revalidate: 60, tags: ['products'] }
);

export default async function PocketFriendlyDeals() {
    const products = await getPocketFriendlyProducts();

    if (products.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                    <h2 className={styles.heading}>Pocket Friendly Deals</h2>
                    <Link
                        href="/products?maxPrice=20000"
                        style={{
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            fontWeight: 600
                        }}
                    >
                        View All Budget Products →
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
