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

export default async function ProductsValidPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const resolvedParams = await searchParams;
    const products = await getProducts(resolvedParams);

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 'bold' }}>
                {resolvedParams.search ? `Results for "${resolvedParams.search}"` : 'All Products'}
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Sidebar */}
                <aside style={{ position: 'sticky', top: '2rem' }}>
                    <ProductFilters />
                </aside>

                {/* Main Content */}
                <main>
                    {products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
                            <p style={{ fontSize: '1.2rem' }}>No products match your filters.</p>
                            <a href="/products" style={{ display: 'inline-block', marginTop: '1rem', color: '#ff6b00', textDecoration: 'underline' }}>Clear all filters</a>
                        </div>
                    ) : (
                        <div className="products-grid-wrapper">
                            <ProductList products={products} />
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile responsiveness note: CSS Grid will need media query in global css or inline override for mobile to stack */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 768px) {
                    div[style*="gridTemplateColumns: 250px 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                    aside {
                        position: static !important;
                        margin-bottom: 2rem;
                    }
                }
            `}} />
        </div>
    );
}
