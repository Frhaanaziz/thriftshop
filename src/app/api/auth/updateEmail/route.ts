import { updateUserProfileAction } from '@app/_actions/user';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const newEmail = searchParams.get('newEmail');
    const userId = searchParams.get('userId');

    if (!newEmail || !userId) notFound();

    const result = await updateUserProfileAction({ user_id: userId, input: { email: newEmail } });
    if (result.error) throw new Error('Failed to update user profile');

    return NextResponse.redirect(new URL('/', req.url));
}
