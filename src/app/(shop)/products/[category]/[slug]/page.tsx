import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import styles from './page.module.css';
import ProductViewer from '@/components/product/ProductViewer';
import RelatedProducts from '@/components/product/RelatedProducts';
import ReviewsList from '@/components/review/ReviewsList';
import ReviewForm from '@/components/review/ReviewForm';
import BundleDeals from '@/components/product/BundleDeals';
import ProductStructuredData from '@/components/product/ProductStructuredData';
import ImageGallery from '@/components/product/ImageGallery';

import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

async function getProductBySlug(slug: string) {
    try {
        await connectToDatabase();
        // Extract ID from slug (last part after dash)
        // Format: "product-name-id"
        const parts = slug.split('-');
        const id = parts[parts.length - 1];

        if (!id || id.length !== 24) return null;

        const product = await Product.findById(id).lean();
        if (!product) return null;

        // Robust image fallback logic
        const rawImages = (product.images || []).filter((url: string) => url && url.trim() !== '');
        const primaryImage = product.imageUrl || product.image;
        const finalImages = rawImages.length > 0 ? rawImages : (primaryImage ? [primaryImage] : []);

        let bundledItems: any[] = [];
        if (product.bundledProducts && product.bundledProducts.length > 0) {
            bundledItems = await Product.find({
                _id: { $in: product.bundledProducts }
            }).lean();
        }

        return {
            ...product,
            _id: product._id.toString(),
            id: product._id.toString(),
            image: primaryImage || '',
            images: finalImages,
            bundledProducts: bundledItems.map((bp: any) => ({
                _id: bp._id.toString(),
                name: bp.name,
                price: bp.price,
                imageUrl: bp.imageUrl || bp.image,
                category: bp.category,
                slug: bp.slug
            })),
            bundleDiscount: product.bundleDiscount || 0
        };
    } catch (e) {
        console.error('Error fetching product:', e);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: product.name,
        description: product.description.substring(0, 160), // SEO friendly truncation
        openGraph: {
            title: product.name,
            description: product.description.substring(0, 160),
            images: [product.imageUrl || product.image],
            type: 'website',
        },
    };
}

export default async function SEOProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <h1>Product Not Found</h1>
                <p>We couldn't find the requested product.</p>
            </div>
        );
    }

    const displayProduct = product;
    const displayFeatures = displayProduct.features ? Object.entries(displayProduct.features) : [];

    return (
        <>
            <ProductStructuredData product={{
                name: displayProduct.name,
                description: displayProduct.description,
                imageUrl: displayProduct.image,
                price: displayProduct.price,
                currency: 'KES',
                sku: displayProduct.id,
                brand: displayProduct.brand,
                availability: displayProduct.stock > 0 ? 'InStock' : 'OutOfStock'
            }} />

            <div className={`container ${styles.wrapper}`}>
                <div className={styles.imageSection}>
                    <ImageGallery
                        images={displayProduct.images}
                        name={displayProduct.name}
                    />
                </div>

                <div className={styles.detailsSection}>
                    <span className={styles.category}>{displayProduct.category}</span>
                    <h1 className={styles.title}>{displayProduct.name}</h1>

                    <p className={styles.description}>
                        {displayProduct.description}
                    </p>

                    {displayFeatures.length > 0 && (
                        <div className={styles.featuresList}>
                            {displayFeatures.map(([key, value]) => (
                                <div key={key} className={styles.featureRow}>
                                    <span className={styles.featureLabel}>{key}:</span>
                                    <span className={styles.featureValue}>{value as string}</span>
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
                <section className={`container ${styles.specsSection}`}>
                    <h2 className={styles.specsTitle}>
                        Technical Specifications
                    </h2>
                    <div className={styles.specsContainer}>
                        {Object.entries(displayProduct.specifications).map(([key, value]) => (
                            <div key={key} className={styles.specRow}>
                                <div className={styles.specLabel}>{key}</div>
                                <div className={styles.specValue}>{value as string}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}


            {/* Reviews Section */}
            <div id="reviews" className={`container`} style={{ marginTop: '4rem', marginBottom: '4rem', scrollMarginTop: '100px' }}>
                <ReviewsList productId={displayProduct.id} />
                <ReviewForm productId={displayProduct.id} />
            </div>

            {/* Bundle Deals Section */}
            <div className="container" style={{ marginBottom: '4rem' }}>
                <BundleDeals
                    mainProduct={displayProduct}
                    bundledProducts={displayProduct.bundledProducts || []}
                    discountPercentage={displayProduct.bundleDiscount || 0}
                />
            </div>

            <RelatedProducts
                currentCategory={displayProduct.category}
                currentId={displayProduct.id}
                currentTitle={displayProduct.name}
            />
        </>
    );
}
