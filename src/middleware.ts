import { Database } from '@database/database.types';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

// const publicRoutes = [
//     '/',
//     '/auth/login',
//     '/auth/signup',
//     '/categories/:path*',
//     '/product/:path',
//     '/products',
//     '/api/auth/:path',
//     '/_next/static/:path*',
//     '/_next/image/:path*',
//     '/ favicon.ico',
// ];

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createMiddlewareClient<Database>({ req, res });
    const user = (await supabase.auth.getSession()).data.session?.user;

    if (
        !user &&
        (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/cart'))
    ) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return res;
}
