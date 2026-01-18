import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/product/AddToCartButton';
// We are reusing the styles from the generic product page for consistency, 
// or we can import them from a shared location. 
// For now let's just use inline or copy styles if needed.
// Better yet, let's reuse the layout structure.

// Ideally we move the ProductDetail UI to a component.
import styles from './page.module.css';
import ProductViewer from '@/components/product/ProductViewer';
import RelatedProducts from '@/components/product/RelatedProducts';

import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

async function getProductById(id: string) {
    try {
        await connectToDatabase();
        if (!id || id.length !== 24) return null; // Basic ID validation

        const product = await Product.findById(id).lean();
        if (!product) return null;

        // Transform _id to id and ensure features are good
        return {
            ...product,
            _id: product._id.toString(),
            id: product._id.toString(),
            // Handle image/imageUrl discrepancy if any
            image: product.imageUrl || product.image || '',
            // Ensure properties match expected types if needed (e.g. Map to Object)
            // .lean() with Map type usually returns basic object
        };
    } catch (e) {
        console.error('Error fetching product:', e);
        return null;
    }
}

export default async function SEOProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Extract ID from slug (last part after dash)
    // Format: "product-name-id"
    const parts = slug.split('-');
    const id = parts[parts.length - 1];

    const product = await getProductById(id);

    if (!product) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <h1>Product Not Found</h1>
                <p>We couldn't find a product with ID: {id}</p>
            </div>
        );
    }

    // Reuse logic from the other page
    const displayProduct = product;

    return (
        <>
            <div className={`container ${styles.wrapper}`}>
                <div className={styles.imageSection}>
                    {displayProduct.image ? (
                        <div className={styles.imageWrapper}>
                            <img src={displayProduct.image} alt={displayProduct.name} className={styles.productImage} style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
                        </div>
                    ) : (
                        <div className={styles.imagePlaceholder}>
                            📷
                        </div>
                    )}
                </div>

                <div className={styles.detailsSection}>
                    <span className={styles.category}>{displayProduct.category}</span>
                    <h1 className={styles.title}>{displayProduct.name}</h1>


                    <p className={styles.description}>
                        {displayProduct.description}
                    </p>

                    {displayProduct.features && (
                        <div className={styles.featuresList}>
                            <h4 style={{ marginBottom: '0.5rem', color: 'white' }}>Key Features:</h4>
                            {Object.entries(displayProduct.features).map(([key, value]) => (
                                <div key={key} className={styles.featureRow}>
                                    <span className={styles.featureLabel}>{key}:</span>
                                    <span className={styles.featureValue} style={{ whiteSpace: 'pre-wrap' }}>{value as string}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <ProductViewer product={displayProduct} />

                    <p className={styles.disclaimer}>
                        The Price and Availability Are Subject to change without Notice.
                    </p>

                    <div className={styles.meta}>
                        <span>Stock: {displayProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                    </div>

                </div>
            </div>

            {displayProduct.specifications && Object.keys(displayProduct.specifications).length > 0 && (
                <section className="container" style={{ marginTop: '4rem', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'left', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                        Technical Specifications
                    </h2>
                    <div style={{ background: '#111', borderRadius: '12px', padding: '2rem', border: '1px solid #222' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', maxWidth: '1000px' }}>
                            <tbody>
                                {Object.entries(displayProduct.specifications).map(([key, value], index) => (
                                    <tr key={key} style={{ borderBottom: '1px solid #222' }}>
                                        <td style={{ padding: '16px 0', color: '#888', width: '30%', minWidth: '200px', verticalAlign: 'top', fontWeight: '500' }}>{key}</td>
                                        <td style={{ padding: '16px 0', color: '#e0e0e0', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{value as string}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}


            <RelatedProducts
                currentCategory={displayProduct.category}
                currentId={displayProduct.id}
                currentTitle={displayProduct.name}
            />
        </>
    );
}
