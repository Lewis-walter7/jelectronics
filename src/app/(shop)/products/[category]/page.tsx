import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import ProductList from '@/components/product/ProductList';

async function getProductsByCategory(category: string) {
    await connectToDatabase();

    // Normalize category for display, but query strictly or case-intensitively? 
    // Admin saves 'Phones', 'Laptops'. URL might be 'phones'.
    // Use regex for case-insensitive match
    const categoryRegex = new RegExp(`^${category}$`, 'i');

    const productsDocs = await Product.find({
        category: { $regex: categoryRegex },
        $or: [
            { status: 'published' },
            { status: { $exists: false } },
            { status: null }
        ]
    }).sort({ createdAt: -1 }).lean();

    const products = productsDocs.map((doc: any) => ({
        id: doc._id.toString(),
        title: doc.name,
        price: doc.price,
        category: doc.category,
        image: doc.imageUrl || doc.image || ''
    }));

    // Capitalize for header
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

    return { products, categoryName };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const { products, categoryName } = await getProductsByCategory(category);

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 'bold' }}>{categoryName}</h1>
            <ProductList products={products} />
        </div>
    );
}
