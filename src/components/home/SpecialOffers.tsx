import Image from 'next/image';
import Link from 'next/link';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import styles from './SpecialOffers.module.css';

export default async function SpecialOffers() {
    await connectToDatabase();

    // Fetch products marked as special offers
    const productsDocs = await Product.find({
        isOnSpecialOffer: true,
        salePrice: { $exists: true, $ne: null, $gt: 0 },
        $or: [
            { status: 'published' },
            { status: { $exists: false } },
            { status: null }
        ]
    }).limit(12).sort({ createdAt: -1 }).lean();

    // Map to simple object
    const products = productsDocs.map((doc: any) => {
        const safeName = doc.name || 'Product';
        const safeSlug = doc.slug || `${safeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${doc._id.toString()}`;
        return {
            _id: doc._id.toString(),
            name: doc.name,
            price: doc.price,
            salePrice: doc.salePrice,
            imageUrl: doc.imageUrl || doc.image || '',
            category: doc.category,
            slug: safeSlug,
            discount: doc.discountPercentage || 0
        };
    });

    if (products.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className="container">
                <h2 className={styles.heading}>Special Offers</h2>
                <div className={styles.grid}>
                    {products.map((product) => (
                        <Link
                            key={product._id}
                            href={`/products/${product.category.toLowerCase()}/${product.slug}`}
                            className={styles.card}
                        >
                            <div className={styles.imageWrapper}>
                                {product.discount > 0 && (
                                    <span className={styles.badge}>-{product.discount}%</span>
                                )}
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.title}>{product.name}</h3>
                                <div className={styles.priceRow}>
                                    <span className={styles.salePrice}>KES {product.salePrice.toLocaleString()}</span>
                                    <span className={styles.originalPrice}>KES {product.price.toLocaleString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link
                        href="/special-offers"
                        className={styles.viewMoreBtn}
                    >
                        View More Special Offers →
                    </Link>
                </div>
            </div>
        </section>
    );
}
