import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import ProductList from '@/components/product/ProductList';
import ProductFilters from '@/components/product/ProductFilters';
import styles from '../products.module.css';

interface FilterParams {
    brand?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    color?: string;
    storage?: string;
}

async function getProductsByCategory(category: string, filters: FilterParams) {
    await connectToDatabase();

    // Normalize category for display
    const categoryRegex = new RegExp(`^${category}$`, 'i');

    const andConditions: any[] = [
        { category: { $regex: categoryRegex } },
        {
            $or: [
                { status: 'published' },
                { status: { $exists: false } },
                { status: null }
            ]
        }
    ];

    // Brand filter
    if (filters.brand) {
        const brandRegex = new RegExp(filters.brand, 'i');
        andConditions.push({
            $or: [
                { name: { $regex: brandRegex } },
                { "features.Brand": { $regex: brandRegex } },
                { "features.brand": { $regex: brandRegex } }
            ]
        });
    }

    // Type filter
    if (filters.type) {
        const typeRegex = new RegExp(filters.type, 'i');
        andConditions.push({
            $or: [
                { name: { $regex: typeRegex } },
                { "features.Type": { $regex: typeRegex } },
                { "features.type": { $regex: typeRegex } }
            ]
        });
    }

    // Price Filter
    if (filters.minPrice || filters.maxPrice) {
        const priceQuery: any = {};
        if (filters.minPrice) priceQuery.$gte = Number(filters.minPrice);
        if (filters.maxPrice) priceQuery.$lte = Number(filters.maxPrice);
        andConditions.push({ price: priceQuery });
    }

    // Color Filter
    if (filters.color) {
        const colors = filters.color.split(',');
        const colorRegexes = colors.map(c => new RegExp(c, 'i'));
        andConditions.push({ colors: { $in: colorRegexes } });
    }

    // Storage Filter
    if (filters.storage) {
        const storages = filters.storage.split(',');
        const storageRegexes = storages.map(s => new RegExp(s, 'i'));
        andConditions.push({
            'variants.name': { $in: storageRegexes }
        });
    }

    const productsDocs = await Product.find({ $and: andConditions }).sort({ createdAt: -1 }).lean();

    const products = productsDocs.map((doc: any) => ({
        _id: doc._id.toString(),
        name: doc.name,
        description: doc.description,
        price: doc.price,
        salePrice: doc.salePrice,
        category: doc.category,
        imageUrl: doc.imageUrl || doc.image || '',
        slug: doc.slug,
        features: doc.features || {}
    }));

    // Capitalize for header
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

    // Append filter to title if present
    const filterTitle = filters.brand ? ` - ${filters.brand.charAt(0).toUpperCase() + filters.brand.slice(1)}` :
        filters.type ? ` - ${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}` : '';

    return { products, categoryName: `${categoryName}${filterTitle}` };
}

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { category } = await params;
    const resolvedSearchParams = await searchParams;

    const brand = typeof resolvedSearchParams.brand === 'string' ? resolvedSearchParams.brand : undefined;
    const type = typeof resolvedSearchParams.type === 'string' ? resolvedSearchParams.type : undefined;
    const minPrice = typeof resolvedSearchParams.minPrice === 'string' ? resolvedSearchParams.minPrice : undefined;
    const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? resolvedSearchParams.maxPrice : undefined;
    const color = typeof resolvedSearchParams.color === 'string' ? resolvedSearchParams.color : undefined;
    const storage = typeof resolvedSearchParams.storage === 'string' ? resolvedSearchParams.storage : undefined;

    const { products, categoryName } = await getProductsByCategory(category, {
        brand,
        type,
        minPrice,
        maxPrice,
        color,
        storage
    });

    return (
        <div className={`container ${styles.pageContainer}`}>
            <h1 className={styles.header}>{categoryName}</h1>

            <div className={styles.layoutGrid}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <ProductFilters />
                </aside>

                {/* Main Content */}
                <main className={styles.mainContent}>
                    {products.length === 0 ? (
                        <div className={styles.noResults}>
                            <p className={styles.noResultsText}>No products match your filters.</p>
                            <a href={`/products/${category}`} className={styles.clearFilters}>Clear all filters</a>
                        </div>
                    ) : (
                        <div className="products-grid-wrapper">
                            <ProductList products={products} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
