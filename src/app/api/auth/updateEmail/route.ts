import { updateUserProfileAction } from '@app/_actions/user';
import { Database } from '@db/database.types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound, useRouter } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { searchParams } = new URL(req.url);
    const newEmail = searchParams.get('newEmail');
    const userId = searchParams.get('userId');

    if (!newEmail || !userId) notFound();

    try {
        await updateUserProfileAction({ supabase, user_id: userId, input: { email: newEmail } });
    } catch (error) {
        console.error(error);
    }

    return NextResponse.redirect(new URL('/', req.url));
}
