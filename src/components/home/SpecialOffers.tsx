import styles from './SpecialOffers.module.css';
import ProductCard from '../product/ProductCard';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';

const getSpecialOffers = unstable_cache(
    async () => {
        await connectToDatabase();

        const productsDocs = await Product.find({
            isOnSpecialOffer: true,
            salePrice: { $exists: true, $ne: null, $gt: 0 },
            $or: [
                { status: 'published' },
                { status: { $exists: false } },
                { status: null }
            ]
        }).limit(10).sort({ createdAt: -1 }).lean();

        return productsDocs.map((doc: any) => ({
            _id: doc._id.toString(),
            name: doc.name,
            description: doc.description || '',
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
    ['special-offers-deals'],
    { revalidate: 60, tags: ['products'] }
);

export default async function SpecialOffers() {
    const products = await getSpecialOffers();

    if (products.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.heading}>Special Offers</h2>
                <div className={styles.grid}>
                    {products.map((product) => (
                        <ProductCard key={product._id} {...product} />
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link href="/special-offers" className={styles.viewMoreBtn}>
                        View More Special Offers →
                    </Link>
                </div>
            </div>
        </section>
    );
}
