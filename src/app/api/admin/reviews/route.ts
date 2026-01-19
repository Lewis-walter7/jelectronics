import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Review from '@/models/Review';

// GET - Fetch ALL reviews (for admin dashboard)
export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const query: any = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        // Fetch reviews with product details (if we populated, but schema has productId as ref)
        // We'll populate 'productId' to get product name
        const reviews = await Review.find(query)
            .populate('productId', 'name imageUrl')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            reviews: reviews.map(r => ({
                _id: r._id.toString(),
                productName: (r.productId as any)?.name || 'Unknown Product',
                productImage: (r.productId as any)?.imageUrl || '',
                userName: r.userName,
                userEmail: r.userEmail,
                rating: r.rating,
                title: r.title,
                review: r.review,
                status: r.status,
                createdAt: r.createdAt
            }))
        });
    } catch (error) {
        console.error('Error fetching admin reviews:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
