// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

// Add paths that don't need authentication
const publicPaths = ['/', '/api/auth/telegram'];  // Added root path to public paths

// Add paths that require authentication
const protectedPaths = ['/home', '/dashboard', '/profile'];  // Add your protected routes here

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Allow public paths without authentication
    if (publicPaths.includes(path) || path.startsWith('/api/auth/telegram')) {
        return NextResponse.next();
    }

    // Check if path requires authentication
    const requiresAuth = protectedPaths.some(protectedPath =>
        path.startsWith(protectedPath)
    );

    if (!requiresAuth) {
        return NextResponse.next();
    }

    // Check for authentication token
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
        // Redirect to home page instead of login
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
        // Clear invalid token and redirect to home
        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.delete('auth_token');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - api routes that don't need auth
         */
        '/((?!_next/static|_next/image|favicon.ico|public/|api/auth/telegram).*)',
    ],
};