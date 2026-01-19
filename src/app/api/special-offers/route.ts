import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
    try {
        await connectToDatabase();

        const productsDocs = await Product.find({
            isOnSpecialOffer: true,
            salePrice: { $exists: true, $ne: null, $gt: 0 },
            $or: [
                { status: 'published' },
                { status: { $exists: false } },
                { status: null }
            ]
        }).sort({ createdAt: -1 }).lean();

        const products = productsDocs.map((doc: any) => {
            const safeName = doc.name || 'Product';
            const safeSlug = doc.slug || `${safeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${doc._id.toString()}`;
            return {
                _id: doc._id.toString(),
                name: doc.name,
                price: doc.price,
                salePrice: doc.salePrice,
                imageUrl: doc.imageUrl || doc.image || '',
                category: doc.category,
                slug: safeSlug,
                discount: doc.discountPercentage || 0
            };
        });

        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error('Error fetching special offers:', error);
        return NextResponse.json({ success: false, products: [] }, { status: 500 });
    }
}
