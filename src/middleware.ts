import { Database } from '@types/database.types';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createMiddlewareClient<Database>({ req, res });
    await supabase.auth.getSession();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user && req.nextUrl.pathname.startsWith('/account')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return res;
}
