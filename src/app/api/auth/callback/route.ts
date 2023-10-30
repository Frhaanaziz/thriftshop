import { addUserProfileAction, getUserAction } from '@app/_actions/user';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiResponse } from 'next';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { searchParams } = new URL(req.url);
    const fullName = searchParams.get('fullName');
    const code = searchParams.get('code');

    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });
    if (!fullName) return NextResponse.json({ error: 'Full name required' }, { status: 400 });

    await supabase.auth.exchangeCodeForSession(code);

    const user = await getUserAction();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (!user.email) return NextResponse.json({ error: 'User email not found' }, { status: 404 });

    await addUserProfileAction({
        user_id: user.id,
        input: { email: user.email, fullName },
    });

    return NextResponse.redirect(new URL('/', req.url));
}
