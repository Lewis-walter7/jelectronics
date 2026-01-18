import ProductList from '@/components/product/ProductList';
import ProductFilters from '@/components/product/ProductFilters';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';

interface SearchParams {
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    color?: string;
    storage?: string;
}

async function getProducts(params: SearchParams) {
    await connectToDatabase();
    const { search, minPrice, maxPrice, color, storage } = params;

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
                { category: searchRegex }
            ]
        });
    }

    // Price Filter
    if (minPrice || maxPrice) {
        const priceQuery: any = {};
        if (minPrice) priceQuery.$gte = Number(minPrice);
        if (maxPrice) priceQuery.$lte = Number(maxPrice);
        andConditions.push({ price: priceQuery });
    }

    // Color Filter (Matches if product.colors contains ANY of the selected colors)
    if (color) {
        const colors = color.split(',');
        // Case insensitive regex match for flexibility
        const colorRegexes = colors.map(c => new RegExp(c, 'i'));
        andConditions.push({ colors: { $in: colorRegexes } });
    }

    // Storage Filter (Matches if any variant name contains the storage string)
    if (storage) {
        const storages = storage.split(',');
        const storageRegexes = storages.map(s => new RegExp(s, 'i'));
        andConditions.push({
            'variants.name': { $in: storageRegexes }
        });
    }

    const finalQuery = { $and: andConditions };

    const productsDocs = await Product.find(finalQuery).sort({ createdAt: -1 }).lean();

    return productsDocs.map((doc: any) => ({
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
}

import styles from './products.module.css';

export default async function ProductsValidPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const resolvedParams = await searchParams;
    const products = await getProducts(resolvedParams);

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
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
