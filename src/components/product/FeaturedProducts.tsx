import styles from './FeaturedProducts.module.css';
import ProductCard from './ProductCard';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

import { unstable_cache } from 'next/cache';

const getFeaturedProducts = unstable_cache(
    async () => {
        await connectToDatabase();

        // Fetch featured, published products
        const productsDocs = await Product.find({
            isFeatured: true,
            $or: [
                { status: 'published' },
                { status: { $exists: false } },
                { status: null }
            ]
        }).limit(8).sort({ createdAt: -1 }).lean();

        return productsDocs.map((doc: any) => ({
            _id: doc._id.toString(),
            name: doc.name,
            description: doc.description,
            price: doc.price,
            salePrice: doc.salePrice,
            category: doc.category,
            imageUrl: doc.imageUrl || doc.image || '',
            slug: doc.slug
        }));
    },
    ['featured-products'], // Cache key
    { revalidate: 60, tags: ['products'] } // Revalidate every minute
);

export default async function FeaturedProducts() {
    const products = await getFeaturedProducts();

    if (products.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.heading}>Featured Products</h2>
                <div className={styles.grid}>
                    {products.map((p) => (
                        <ProductCard key={p._id} {...p} />
                    ))}
                </div>
            </div>
        </section>
    );
}
