import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        // Basic fetching, can add pagination later
        const orders = await Order.find({})
            .sort({ createdAt: -1 }) // Newest first
            .lean();

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
