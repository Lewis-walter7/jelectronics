import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import ProductList from '@/components/product/ProductList';
import ProductFilters from '@/components/product/ProductFilters';
import Pagination from '@/components/ui/Pagination'; // Import Pagination
import styles from '../products.module.css';

interface FilterParams {
    brand?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    color?: string;
    storage?: string;
    page?: string;
    [key: string]: string | undefined; // Allow dynamic filters
}

async function getProductsByCategory(category: string, filters: FilterParams) {
    await connectToDatabase();

    const pageNumber = parseInt(filters.page || '1', 10);
    const limit = 25; // 5 rows * 5 columns
    const skip = (pageNumber - 1) * limit;

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

    // Helper to add feature filter
    const addFeatureFilter = (urlKey: string, dbKeys: string[]) => {
        if (filters[urlKey]) {
            const values = filters[urlKey]!.split(',');
            const valueRegexes = values.map(v => new RegExp(v.trim(), 'i'));

            const orConditions = dbKeys.map(key => ({
                [`features.${key}`]: { $in: valueRegexes }
            }));

            andConditions.push({ $or: orConditions });
        }
    };

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
                { subcategory: { $regex: typeRegex } },
                { "features.Type": { $regex: typeRegex } },
                { "features.type": { $regex: typeRegex } }
            ]
        });
    }

    // Dynamic Filters Mappings
    addFeatureFilter('ram', ['RAM', 'Ram', 'Memory']);
    addFeatureFilter('screenSize', ['Screen Size', 'Display Size', 'Screen']);
    addFeatureFilter('audioType', ['Type', 'Audio Type', 'Headphone Type']);
    addFeatureFilter('connectivity', ['Connectivity', 'Connection']);
    addFeatureFilter('platform', ['Platform', 'Console']);
    addFeatureFilter('gameType', ['Type', 'Genre']);
    addFeatureFilter('wearableType', ['Type']);
    addFeatureFilter('strap', ['Strap Material', 'Strap']);

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
        const colorRegexes = colors.map(c => new RegExp(c.trim(), 'i'));

        andConditions.push({
            $or: [
                { colors: { $in: colorRegexes } },
                { 'features.Colors': { $in: colorRegexes } },
                { 'features.Color': { $in: colorRegexes } },
                { 'features.Colorways': { $in: colorRegexes } }
            ]
        });
    }

    // Storage Filter
    if (filters.storage) {
        const storages = filters.storage.split(',');
        const storageRegexes = storages.map(s => new RegExp(s.trim(), 'i'));
        andConditions.push({
            $or: [
                { 'variants.name': { $in: storageRegexes } },
                { 'features.Storage': { $in: storageRegexes } },
                { 'features.Internal Storage': { $in: storageRegexes } },
                { 'features.Memory': { $in: storageRegexes } }
            ]
        });
    }

    const finalQuery = { $and: andConditions };

    const totalProducts = await Product.countDocuments(finalQuery);
    const totalPages = Math.ceil(totalProducts / limit);

    const productsDocs = await Product.find(finalQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

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

    return {
        products,
        categoryName: `${categoryName}${filterTitle}`,
        totalPages,
        currentPage: pageNumber
    };
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
    const page = typeof resolvedSearchParams.page === 'string' ? resolvedSearchParams.page : undefined;

    const { products, categoryName, totalPages, currentPage } = await getProductsByCategory(category, {
        ...resolvedSearchParams,
        brand,
        type,
        minPrice,
        maxPrice,
        color,
        storage,
        page
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
                            <Pagination currentPage={currentPage} totalPages={totalPages} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
