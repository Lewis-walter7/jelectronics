import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-key-change-this-prod'
);

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 1. Protection Logic for /admin paths
    if (path.startsWith('/admin')) {
        // Allow access to login page
        if (path === '/admin/login') {
            return NextResponse.next();
        }

        // Check for admin_token cookie
        const adminToken = request.cookies.get('admin_token')?.value;

        // If no token, redirect to login
        if (!adminToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            // Verify JWT
            await jwtVerify(adminToken, JWT_SECRET);
            return NextResponse.next();
        } catch (error) {
            // Invalid token
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
