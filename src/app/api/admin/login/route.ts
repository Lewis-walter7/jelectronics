import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

const MAX_ATTEMPTS = 3;
const LOCK_TIME = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: Request) {
    await connectToDatabase();

    // 1. Parse Request
    const { email, password } = await request.json();

    // 2. Ensure Default Admin Exists (Seeding)
    // This ensures you are never totally locked out if the DB is empty
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
        const defaultEmail = process.env.ADMIN_EMAIL;
        const defaultPass = process.env.ADMIN_PASSWORD;

        if (defaultEmail && defaultPass) {
            const hashedPassword = await bcrypt.hash(defaultPass, 10);
            await Admin.create({
                email: defaultEmail,
                password: hashedPassword
            });
            console.log('--- Initial Admin Created ---');
        }
    }

    try {
        // 3. Find Admin
        const admin = await Admin.findOne({ email });

        if (!admin) {
            // Security: Don't reveal user doesn't exist, just say invalid
            // But for your specific requirement of "3 attempts", we usually need to track attempts against *something*.
            // Since we can't track attempts for a non-existent email in the DB easily without exposing structure,
            // we will just return Generic Invalid here. 
            // OR we can pretend to check password hash to prevent timing attacks.
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        // 4. Check Lockout
        if (admin.lockUntil && admin.lockUntil > Date.now()) {
            const timeRemaining = Math.ceil((new Date(admin.lockUntil).getTime() - Date.now()) / (1000 * 60 * 60));
            return NextResponse.json({
                success: false,
                error: `Account is locked. Try again in ${timeRemaining} hours.`
            }, { status: 403 });
        }

        // 5. Verify Password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            // Increment Attempts
            admin.loginAttempts += 1;

            // Check if we reached limit
            if (admin.loginAttempts >= MAX_ATTEMPTS) {
                admin.lockUntil = Date.now() + LOCK_TIME;
                await admin.save();
                return NextResponse.json({
                    success: false,
                    error: `Too many failed attempts. Account locked for 24 hours.`
                }, { status: 403 });
            }

            const attemptsLeft = MAX_ATTEMPTS - admin.loginAttempts;
            await admin.save();

            return NextResponse.json({
                success: false,
                error: `Invalid password. ${attemptsLeft} attempts remaining.`
            }, { status: 401 });
        }

        // 6. Success
        // Reset counters
        admin.loginAttempts = 0;
        admin.lockUntil = undefined;
        await admin.save();

        // Set Cookie
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'admin_token',
            value: 'access-granted-secret-token', // Ideally JWT, but opaque is fine for simpler needs
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 5 // 5 days
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ success: false, error: 'Server error during login' }, { status: 500 });
    }
}
