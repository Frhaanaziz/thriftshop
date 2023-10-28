'use server';

import { Database } from '@db/database.types';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { Profiles } from '@types';
import { revalidatePath } from 'next/cache';

import { cookies } from 'next/headers';

export async function getUserAction() {
    const supabase = createServerActionClient<Database>({ cookies });
    const result = await supabase.auth.getUser();
    if (result.error) throw result.error;

    return result;
}

export async function getProfileAction({ user_id }: GetProfileProps) {
    const supabase = createServerActionClient<Database>({ cookies });
    const result = await supabase.from('profiles').select().eq('user_id', user_id).maybeSingle();
    if (result.error) throw result.error;

    return result;
}

export async function updateProfileAction({ profile, filePath }: UpdateProfileProps) {
    const supabase = createServerActionClient<Database>({ cookies });
    const result = await supabase.from('profiles').upsert({
        ...profile,
        avatar_url: filePath
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${filePath}`
            : profile.avatar_url,
    });
    if (result.error) throw result.error;

    revalidatePath('/dashboard/account');
    return result;
}

export async function deleteAvatarAction({ profile }: DeleteAvatarProps) {
    const supabase = createServerActionClient<Database>({ cookies });
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

export async function signUpUserAction({ input, fullName }: SignUpUserProps) {
    const supabase = createServerActionClient<Database>({ cookies });
    const result = await supabase.auth.signUp({
        ...input,
        options: {
            emailRedirectTo: `${location.origin}/api/auth/callback?fullName=${fullName}`,
        },
    });
    if (result.error) throw result.error.message;

    return result;
}

export async function signInUserAction({ input }: SignInUserProps) {
    const supabase = createServerActionClient<Database>({ cookies });
    const result = await supabase.auth.signInWithPassword({
        ...input,
    });
    if (result.error) throw result.error;

    revalidatePath('/');
    return result;
}

export async function updateUserProfileAction({ input, user_id }: UpdateUserProfileProps) {
    const supabase = createServerActionClient<Database>({ cookies });
    const result = await supabase
        .from('profiles')
        .update({
            ...input,
        })
        .eq('user_id', user_id);
    if (result.error) throw result.error;

    return result;
}

export async function addUserProfileAction({ input, user_id }: AddUserProfileType) {
    const supabase = createServerActionClient<Database>({ cookies });
    const result = await supabase
        .from('profiles')
        .insert({
            ...input,
        })
        .eq('user_id', user_id);
    if (result.error) throw result.error;

    return result;
}

type AddUserProfileType = {
    input: Profiles['Insert'];
    user_id: string;
};

type UpdateUserProfileProps = {
    input: Profiles['Update'];
    user_id: string;
};

type SignInUserProps = {
    input: {
        email: string;
        password: string;
    };
};

type SignUpUserProps = {
    input: {
        email: string;
        password: string;
    };
    fullName: string;
};

type DeleteAvatarProps = {
    profile: Profiles['Insert'];
};

type GetProfileProps = {
    user_id: string;
};

interface UpdateProfileProps {
    profile: Profiles['Row'];
    filePath?: string;
}

type UploadAvatarProps = {
    file: File;
    userId: string;
};
