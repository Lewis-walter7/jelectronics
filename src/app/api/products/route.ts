import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: Request) {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    try {
        if (id) {
            const product = await Product.findById(id);
            if (!product) {
                return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: product });
        }

        const ids = searchParams.get('ids');
        if (ids) {
            const idArray = ids.split(',').filter(Boolean);
            const products = await Product.find({ _id: { $in: idArray } });
            return NextResponse.json({ success: true, data: products });
        }

        const query: any = {};
        // If status is provided, filter by it.
        if (status) {
            if (status === 'published') {
                // Include products with status 'published' OR missing status (legacy)
                query.$or = [
                    { status: 'published' },
                    { status: { $exists: false } },
                    { status: null }
                ];
            } else {
                query.status = status;
            }
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 400 });
    }
}

export async function POST(request: Request) {
    await connectToDatabase();
    try {
        const body = await request.json();
        const product = await Product.create(body);
        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error) {
        console.error('Create Error', error);
        return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 400 });
    }
}

export async function PUT(request: Request) {
    await connectToDatabase();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;

        // Ensure specifications are explicitly included if present
        if (body.specifications) {
            updateData.specifications = body.specifications;
        }

        if (!_id) {
            return NextResponse.json({ success: false, error: 'Product ID required for update' }, { status: 400 });
        }

        // Use strict: false to allow saving 'specifications' even if the Model cache is arguably stale in Dev mode
        const product = await Product.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true, strict: false });

        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        console.error('Update Error', error);
        return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 400 });
    }
}
