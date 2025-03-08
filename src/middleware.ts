// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
    });

    // Admin route protection
    if (pathname.startsWith('/admin')) {
        if (!token) {
            const signInUrl = new URL('/api/auth/signin', request.url);
            signInUrl.searchParams.set('callbackUrl', request.url);
            return NextResponse.redirect(signInUrl);
        }

        if (token.name !== 'Admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Protected paths
    const protectedPaths = ["/facebook", "/gmail", "/whatsapp", "/imo"];

    if (protectedPaths.some(path => pathname === path || pathname.startsWith(path + "/"))) {
        if (!token) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Ensure numberOfOperations exists before comparison
        if (typeof token.numberOfOperations === 'number' && token.numberOfOperations < -3) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/:path*'],
};
