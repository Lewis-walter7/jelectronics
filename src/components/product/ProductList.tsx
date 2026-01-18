import styles from './FeaturedProducts.module.css';
import ProductCard from './ProductCard';

interface ProductListProps {
    products: any[];
    title?: string;
}

export default function ProductList({ products, title }: ProductListProps) {
    if (products.length === 0) {
        return (
            <section className={styles.section} style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 className={styles.heading} style={{ marginBottom: '0.5rem' }}>No Products Found</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Check back later for new inventory.</p>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div className="container">
                {title && <h2 className={styles.heading}>{title}</h2>}
                <div className={styles.grid}>
                    {products.map((p) => (
                        <ProductCard
                            key={p._id}
                            {...p}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
