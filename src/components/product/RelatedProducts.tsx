import styles from './FeaturedProducts.module.css'; // Reusing grid styles
import ProductCard from './ProductCard';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
// Force dynamic rendering if we weren't already? Actually this is used in a server component so it's fine.

interface RelatedProductsProps {
    currentCategory: string;
    currentId: string;
    currentTitle: string; // Used for brand matching heuristic logic but optional for basic query
}

async function getRelatedProducts(category: string, excludeId: string) {
    await connectToDatabase();

    // Find products in same category, exclude current, sort by newest
    // Limit to 4 for now
    const products = await Product.find({
        category: category,
        _id: { $ne: excludeId },
        status: 'published' // Only show published items
    })
        .sort({ createdAt: -1 })
        .limit(4)
        .lean();

    return products.map((p: any) => ({
        _id: p._id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice,
        category: p.category,
        imageUrl: p.imageUrl || p.image || '',
        slug: p.slug,
        features: p.features
    }));
}

export default async function RelatedProducts({ currentCategory, currentId, currentTitle }: RelatedProductsProps) {
    const relatedProducts = await getRelatedProducts(currentCategory, currentId);

    // TODO: If less than 4, maybe fetch "Popular" items from other categories? 
    // For now, if empty, we might just hide the section or show a message.

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className={styles.section} style={{ background: 'var(--color-surface)', paddingTop: '4rem' }}>
            <div className="container">
                <h2 className={styles.heading} style={{ textAlign: 'left', fontSize: '1.8rem', marginBottom: '2rem', color: 'var(--color-text-main)' }}>
                    You May Also Like
                </h2>
                <div className={styles.grid}>
                    {relatedProducts.map((p: any) => (
                        <ProductCard key={p._id} {...p} />
                    ))}
                </div>
            </div>
        </section>
    );
}
