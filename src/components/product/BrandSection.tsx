import styles from './FeaturedProducts.module.css';
import ProductCard from './ProductCard';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';

interface BrandSectionProps {
    brand: string;
    title: string;
    limit?: number;
    minPrice?: number;
}

async function getBrandProducts(brand: string, limit: number, minPrice?: number) {
    await connectToDatabase();

    const query: any = {
        $or: [
            { brand: new RegExp(`^${brand}$`, 'i') },
            { name: new RegExp(brand, 'i') }
        ],
        $and: [
            {
                $or: [
                    { status: 'published' },
                    { status: { $exists: false } },
                    { status: null }
                ]
            }
        ]
    };

    if (minPrice) {
        query.$and.push({ price: { $gte: minPrice } });
    }

    const productsDocs = await Product.find(query).limit(limit).sort({ createdAt: -1 }).lean();

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
}

export default async function BrandSection({ brand, title, limit = 10, minPrice }: BrandSectionProps) {
    const getCachedBrandProducts = unstable_cache(
        async () => getBrandProducts(brand, limit, minPrice),
        [`brand-${brand.toLowerCase()}-products-${minPrice || 0}`],
        { revalidate: 60, tags: ['products'] }
    );

    const products = await getCachedBrandProducts();

    if (products.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                    <h2 className={styles.heading}>{title}</h2>
                    <Link
                        href={`/products?brand=${brand.toLowerCase()}`}
                        style={{
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            fontWeight: 600
                        }}
                    >
                        View All →
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
