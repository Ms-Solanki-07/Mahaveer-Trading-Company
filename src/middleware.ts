import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server' 

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request })
    const url = request.nextUrl

    if (token && (
        url.pathname.startsWith('/sign-up') || 
        url.pathname.startsWith('/sign-in') || 
        url.pathname.startsWith('/verify')
    )){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if(!token && (
        url.pathname.startsWith('/dashboard') ||
        url.pathname.startsWith('/cart') ||
        url.pathname.startsWith('/profile') ||
        url.pathname.startsWith('/admin')
    )){
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    if(token?.role !== 'admin' && url.pathname.startsWith('/admin')){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/dashboard/:path*',
        '/verify/:path*',
        '/cart/:path*',
        '/profile/:path*',
        '/admin/:path*',
    ]
}