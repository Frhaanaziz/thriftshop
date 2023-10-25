import { addUserProfileAction, getUserAction } from '@app/_actions/user';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const fullName = searchParams.get('fullName');
    if (code) {
        await supabase.auth.exchangeCodeForSession(code);
    }

    const {
        data: { user },
    } = await getUserAction({ supabase });
    if (!user.email) throw new Error('User email not found');
    if (!fullName) throw new Error('User full name not found');

    const {} = await addUserProfileAction({
        supabase,
        user_id: user.id,
        input: { email: user.email, fullName },
    });

    return NextResponse.redirect(new URL('/', req.url));
}
