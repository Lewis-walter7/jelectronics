import Pagination from '@/components/ui/Pagination';
import ProductList from '@/components/product/ProductList';
import ProductFilters from '@/components/product/ProductFilters';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';

interface SearchParams {
    search?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    color?: string;
    storage?: string;
    page?: string;
}

async function getProducts(params: SearchParams) {
    await connectToDatabase();
    const { search, brand, minPrice, maxPrice, color, storage, page } = params;
    const pageNumber = parseInt(page || '1', 10);
    const limit = 25; // 5 rows * 5 columns
    const skip = (pageNumber - 1) * limit;

    const baseQuery = {
        $or: [
            { status: 'published' },
            { status: { $exists: false } },
            { status: null }
        ]
    };

    const andConditions: any[] = [baseQuery];

    // Search
    if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        andConditions.push({
            $or: [
                { name: searchRegex },
                { description: searchRegex },
                { category: searchRegex },
                { subcategory: searchRegex },
                { brand: searchRegex }
            ]
        });
    }

    // Brand Filter
    if (brand) {
        andConditions.push({ brand: { $regex: new RegExp(`^${brand}$`, 'i') } });
    }

    // Price Filter
    if (minPrice || maxPrice) {
        const priceQuery: any = {};
        if (minPrice) priceQuery.$gte = Number(minPrice);
        if (maxPrice) priceQuery.$lte = Number(maxPrice);
        andConditions.push({ price: priceQuery });
    }

    // Color Filter
    if (color) {
        const colors = color.split(',');
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
    if (storage) {
        const storages = storage.split(',');
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
        features: doc.features || {},
        minPrice: doc.minPrice,
        maxPrice: doc.maxPrice,
        images: doc.images || []
    }));

    return { products, totalPages, currentPage: pageNumber };
}

import styles from './products.module.css';

export default async function ProductsValidPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const resolvedParams = await searchParams;
    const { products, totalPages, currentPage } = await getProducts(resolvedParams);

    return (
        <div className={`container ${styles.pageContainer}`}>
            <h1 className={styles.header}>
                {resolvedParams.search ? `Results for "${resolvedParams.search}"` : 'All Products'}
            </h1>

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
                            <a href="/products" className={styles.clearFilters}>Clear all filters</a>
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
