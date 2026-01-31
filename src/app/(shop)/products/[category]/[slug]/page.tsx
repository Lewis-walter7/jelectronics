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
import Breadcrumbs from '@/components/ui/Breadcrumbs';

import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Review from '@/models/Review';

async function getReviewStats(productId: string) {
    try {
        await connectToDatabase();
        // Only count approved reviews
        const stats = await Review.aggregate([
            { $match: { productId: productId as any, status: 'approved' } }, // Cast if needed for ObjectId match
            // Note: If productId is string in Review model, remove match cast. 
            // Based on model Review.ts: productId is ObjectId ref. We need to cast string to ObjectId?
            // Mongoose aggregate often needs ObjectId casting if stored as ObjectId. 
            // Ideally we import mongoose.Types.ObjectId.
            // Let's rely on mongoose automatic casting or simple string match if user stores strings (User said productId is Ref ObjectId)
            // SAFEST: Let's assume standard behavior. If this fails, we might need new mongoose.Types.ObjectId(productId)
        ]);

        // aggregate is complex with types in edge cases, let's use simple find for now to be safe and avoid Import issues with ObjectId
        const reviews = await Review.find({ productId: productId, status: 'approved' }).select('rating').lean();

        if (reviews.length === 0) return null;

        const totalRating = reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0);
        const avgRating = totalRating / reviews.length;

        return {
            ratingValue: parseFloat(avgRating.toFixed(1)),
            reviewCount: reviews.length
        };
    } catch (error) {
        console.error('Error fetching review stats:', error);
        return null;
    }
}

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
            youtubeUrl: product.youtubeUrl || null,
            image: primaryImage || '',
            images: finalImages,
            variants: (product.variants || []).map((v: any) => ({
                ...v,
                _id: v._id ? v._id.toString() : undefined
            })),
            storageVariants: (product.storageVariants || []).map((v: any) => ({
                ...v,
                _id: v._id ? v._id.toString() : undefined
            })),
            warrantyVariants: (product.warrantyVariants || []).map((v: any) => ({
                ...v,
                _id: v._id ? v._id.toString() : undefined
            })),
            simVariants: (product.simVariants || []).map((v: any) => ({
                ...v,
                _id: v._id ? v._id.toString() : undefined
            })),
            frequentlyBoughtTogether: (product.frequentlyBoughtTogether || []).map((id: any) => id.toString()),
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string, category: string }> }): Promise<Metadata> {
    const { slug, category } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    const title = `${product.name} | MobiTower Accessories`;
    const description = product.description.substring(0, 160);
    const url = `https://mobitoweraccesories.com/products/${category}/${slug}`;

    // Enhanced keywords generation
    const baseKeywords = [
        product.name,
        product.brand,
        product.category,
        product.subcategory,
        `${product.name} Price in Kenya`,
        `${product.name} Specs`,
        `${product.name} Review`,
        `Buy ${product.name} Online`,
        `${product.brand} ${product.category}`,
        'electronics',
        'Kenya',
        'MobiTower'
    ];
    const keywords = baseKeywords.filter(Boolean).join(', ');

    return {
        title: title,
        description: description,
        keywords: keywords,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: title,
            description: description,
            url: url,
            siteName: 'MobiTower Accessories',
            images: [
                {
                    url: product.imageUrl || product.image,
                    width: 800,
                    height: 600,
                    alt: product.name,
                }
            ],
            type: 'website',
            locale: 'en_KE',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [product.imageUrl || product.image],
        }
    };
}

export default async function SEOProductPage({ params }: { params: Promise<{ slug: string, category: string }> }) {
    const { slug, category } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <h1>Product Not Found</h1>
                <p>We couldn't find the requested product.</p>
            </div>
        );
    }

    const reviewStats = await getReviewStats(product.id);

    const displayProduct = product;
    const displayFeatures = displayProduct.features ? Object.entries(displayProduct.features) : [];
    const pageUrl = `https://mobitoweraccesories.com/products/${category}/${slug}`;

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
                availability: displayProduct.stock > 0 ? 'InStock' : 'OutOfStock',
                url: pageUrl,
                aggregateRating: reviewStats || undefined
            }} />

            <div className="container">
                <Breadcrumbs crumbs={[
                    { label: category.charAt(0).toUpperCase() + category.slice(1), href: `/products/${category}` },
                    { label: displayProduct.name, href: pageUrl }
                ]} />
            </div>

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

            {/* YouTube Video Section */}
            {displayProduct.youtubeUrl && (
                <section className={`container ${styles.videoSection}`} style={{ marginTop: '3rem' }}>
                    <h2 className={styles.specsTitle}>Video Review</h2>
                    <div className={styles.videoContainer}>
                        <iframe
                            src={`https://www.youtube.com/embed/${displayProduct.youtubeUrl.split('v=')[1]?.split('&')[0] || displayProduct.youtubeUrl.split('/').pop()}`}
                            title="Product Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </section>
            )}


            {/* Reviews Section */}
            <div id="reviews" className={`container ${styles.reviewsSection}`} style={{ marginTop: '4rem', marginBottom: '4rem', scrollMarginTop: '100px' }}>
                <div className={styles.reviewsLeft}>
                    <ReviewsList productId={displayProduct.id} />
                </div>
                <div className={styles.reviewsRight}>
                    <ReviewForm productId={displayProduct.id} />
                </div>
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
