import styles from './FeaturedProducts.module.css';
import ProductCard from './ProductCard';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

export default async function FeaturedProducts() {
    await connectToDatabase();

    // Fetch featured, published products
    // We lean on the 'status' field being explicit 'published' or checking legacy items
    const productsDocs = await Product.find({
        isFeatured: true,
        $or: [
            { status: 'published' },
            { status: { $exists: false } },
            { status: null }
        ]
    }).limit(8).sort({ createdAt: -1 }).lean();

    // Map to simple object to avoid serialization warnings with Mongoose documents
    const products = productsDocs.map((doc: any) => ({
        _id: doc._id.toString(),
        name: doc.name,
        description: doc.description,
        price: doc.price,
        salePrice: doc.salePrice, // Ensure salePrice is passed if exists
        category: doc.category,
        imageUrl: doc.imageUrl || doc.image || '',
        slug: doc.slug
    }));

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
