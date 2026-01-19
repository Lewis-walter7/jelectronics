import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        // 1. Security Check: verify request comes from an authenticated admin
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (!adminToken) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized: Admin access required' },
                { status: 401 }
            );
        }

        // 2. Parse Request Body
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        // 3. Check if Admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json(
                { success: false, error: 'Admin with this email already exists' },
                { status: 409 }
            );
        }

        // 4. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create new Admin
        await Admin.create({
            email,
            password: hashedPassword
        });

        // 6. Return Success (NO keys/cookies set for the new admin)
        return NextResponse.json({
            success: true,
            message: 'New admin registered successfully'
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error during registration' },
            { status: 500 }
        );
    }
}
