'use server';

import { supabaseServerActionClient } from '@database/supabase';
import { absoluteUrl, getErrorMessage } from '@lib/utils';
import { User } from '@supabase/supabase-js';
import { Auth, Profiles } from '@types';
import { revalidatePath } from 'next/cache';

export async function getUserAction() {
    const supabase = supabaseServerActionClient();
    const result = await supabase.auth.getSession();
    if (result.error) throw result.error;

    return result.data.session?.user;
}

export async function getProfileAction({ user_id }: { user_id: User['id'] }) {
    const supabase = supabaseServerActionClient();
    const result = await supabase.from('profiles').select('*').eq('user_id', user_id).maybeSingle();
    if (result.error) throw result.error;

    return result;
}

export async function updateProfileAction({
    profile,
    filePath,
}: {
    profile: Profiles['Row'];
    filePath?: string;
}) {
    const supabase = supabaseServerActionClient();

    const result = await supabase.from('profiles').upsert({
        ...profile,
        avatar_url: filePath
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${filePath}`
            : profile.avatar_url,
    });
    if (result.error) result.error.message = 'Failed to update your profile, please try again.';

    revalidatePath('/dashboard/account');
    return result;
}

export async function deleteAvatarAction({ profile }: { profile: Profiles['Insert'] }) {
    const supabase = supabaseServerActionClient();
    const fileName = profile.avatar_url?.split('/avatars/')[1];
    if (!fileName) throw new Error('You dont have any avatar yet');

    const profileResult = await supabase
        .from('profiles')
        .update({ avatar_url: '' })
        .eq('user_id', profile.user_id!);
    if (profileResult.error) throw profileResult.error;

    const avatarResult = await supabase.storage.from('avatars').remove([fileName]);
    if (avatarResult.error) throw avatarResult.error;

    revalidatePath('/dashboard/account');
    return { profileResult, avatarResult };
}

export async function signUpUserAction({ input, fullName }: { input: Auth; fullName: string }) {
    const supabase = supabaseServerActionClient();

    try {
        const result = await supabase.auth.signUp({
            ...input,
            options: {
                emailRedirectTo: absoluteUrl(`/api/auth/callback?fullName=${fullName}`),
            },
        });
        if (result.error) throw result.error;
        return { result };
    } catch (error) {
        return { errorMessage: getErrorMessage(error) };
    }
}

export async function signInUserAction({ input }: { input: Auth }) {
    const supabase = supabaseServerActionClient();

    try {
        const result = await supabase.auth.signInWithPassword({
            ...input,
        });
        if (result.error) throw result.error;

        revalidatePath('/');
    } catch (error) {
        return { errorMessage: getErrorMessage(error) };
    }
}

export async function updateUserProfileAction({
    input,
    user_id,
}: {
    input: Profiles['Update'];
    user_id: User['id'];
}) {
    const supabase = supabaseServerActionClient();
    const result = await supabase
        .from('profiles')
        .update({
            ...input,
        })
        .eq('user_id', user_id);
    if (result.error) throw result.error;

    return result;
}

export async function addUserProfileAction({
    input,
    user_id,
}: {
    input: Profiles['Insert'];
    user_id: User['id'];
}) {
    const supabase = supabaseServerActionClient();
    const result = await supabase
        .from('profiles')
        .insert({
            ...input,
        })
        .eq('user_id', user_id);
    if (result.error) throw result.error;

    return result;
}
