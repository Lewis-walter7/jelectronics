import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import ProductList from '@/components/product/ProductList';

async function getProductsByCategory(category: string, filters: { brand?: string; type?: string }) {
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

    const productsDocs = await Product.find({ $and: andConditions }).sort({ createdAt: -1 }).lean();

    const products = productsDocs.map((doc: any) => ({
        _id: doc._id.toString(),
        name: doc.name,
        description: doc.description,
        price: doc.price,
        salePrice: doc.salePrice,
        category: doc.category,
        imageUrl: doc.imageUrl || doc.image || '',
        slug: doc.slug
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

    const { products, categoryName } = await getProductsByCategory(category, { brand, type });

    return (
        <div className="container" style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>
            <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 'bold' }}>{categoryName}</h1>
            <ProductList products={products} />
        </div>
    );
}
